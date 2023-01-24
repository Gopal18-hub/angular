import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatTabChangeEvent } from "@angular/material/tabs";
import { BillingForm } from "@core/constants/BillingForm";
import { Subject, Observable } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { QuestionControlService } from "../../../../../../shared/ui/dynamic-forms/service/question-control.service";
import { DepositService } from "@core/services/deposit.service";
import { MessageDialogService } from "@shared/ui/message-dialog/message-dialog.service";
import { BillDetailsApiConstants } from "@modules/billing/submodules/details/BillDetailsApiConstants";
import { getBankName } from '../../../../../core/types/billdetails/getBankName.Interface';
import { getcreditcard } from '../../../../../core/types/billdetails/getcreditcard.Interface';
import { CookieService } from '@shared/services/cookie.service';
import { HttpService } from '@shared/services/http.service';
import { PaymentService } from "@core/services/payment.service";
import { ApiConstants } from "@shared/constants/ApiConstants";

@Component({
  selector: "payment-methods",
  templateUrl: "./payment-methods.component.html",
  styleUrls: ["./payment-methods.component.scss"],
})
export class PaymentMethodsComponent implements OnInit {
  @Input() config: any;
  @Input() Refundavalaiblemaount: any;
  @Input() paymentpatientinfo: any;

  bankname: getBankName[] = [];
  creditcard: getcreditcard[] = [];
  POSIMEIList: any = [];
  POSMachineDetal: any = {};

  refundFormData = BillingForm.refundFormData;
  refundform!: FormGroup;
  questions: any;
  today: any;
  constructor(
    private formService: QuestionControlService,
    private depositservice: DepositService,
    private messageDialogService: MessageDialogService,
    private cookie: CookieService,  
    private http: HttpService,
    private paymentService: PaymentService,
  ) {}

  private readonly _destroying$ = new Subject<void>();

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.refundFormData.properties,
      {}
    );
    this.refundform = formResult.form;

    this.questions = formResult.questions;
    this.today = new Date();
    if (this.config.totalAmount) {
      this.refundform.controls["cashamount"].setValue(this.config.totalAmount);
    }
    this.refundform.controls["chequeissuedate"].setValue(this.today);
    this.refundform.controls["demandissuedate"].setValue(this.today);
    this.refundform.controls["chequevaliditydate"].setValue(this.today);
    this.refundform.controls["demandvaliditydate"].setValue(this.today);
    this.getbankname();
    this.getcreditcard();
    this.depositservice.clearAllItems.subscribe((clearItems) => {
      if (clearItems) {
        this.clearpaymentmethod();
      }
    });
  }
 
  activeTab: any = "Cash";
  PaymentMethodcashdeposit: any = [];

  defaultamount: boolean = true;
  depositamount: number = 0;
  PaymentType: number = 1; //default cash
  payloadData: any =[];

  tabChanged(event: MatTabChangeEvent) {
    this.activeTab = event.tab.textLabel;
    this.clearpaymentmethod();
    if(this.activeTab == "Credit / Debit Card" || this.activeTab == "UPI"){
      let locationId = Number(this.cookie.get("HSPLocationId"));
      let stationId = Number(this.cookie.get("StationId"));
      this.http
      .get(ApiConstants.getPOSMachineMaster(locationId, stationId))
      .subscribe((res: any) => {
        if (res && res.length > 0) {
          this.POSIMEIList = res;
          if (this.activeTab == "Credit / Debit Card") {
            this.questions[60].options = this.POSIMEIList.map(
              (l: any) => {
                return {
                  title: l.merchantStorePosCode + "-" + l.name,
                  value: l.name,
                };
              }
            );
          } else if (this.activeTab == "UPI") {
            this.questions[67].options = this.POSIMEIList.map(
              (l: any) => {
                return {
                  title: l.merchantStorePosCode + "-" + l.name,
                  value: l.name,
                };
              }
            );
          }

          if (this.activeTab == "Credit / Debit Card") {
            this.refundform.controls["posimei"].valueChanges
            .pipe(takeUntil(this._destroying$))
            .subscribe((value:any) => {
              if(value){
                   this.POSMachineDetal = this.POSIMEIList.filter(
                  (s: any) => s.name === value
                )[0];
                this.setPOSMachinevaluesinCookie(this.POSMachineDetal);
              }
            });
          } else if (this.activeTab == "UPI") {
            this.refundform.controls["upiposimei"].valueChanges
            .pipe(takeUntil(this._destroying$))
            .subscribe((value:any) => {
              if(value){
                   this.POSMachineDetal = this.POSIMEIList.filter(
                  (s: any) => s.name === value
                )[0];
                this.setPOSMachinevaluesinCookie(this.POSMachineDetal);
              }
            });
          }
             
          if (this.POSIMEIList.length == 1) {
            if (this.activeTab == "Credit / Debit Card") {
              this.refundform.controls["posimei"].setValue(this.POSIMEIList[0].name);
            } else if (this.activeTab == "UPI") {
              this.refundform.controls["upiposimei"].setValue(this.POSIMEIList[0].name);
            }        
          }
        }
      });
    }
  }

  setPOSMachinevaluesinCookie(POSMachineDetail:any){
    if(POSMachineDetail){
      this.cookie.delete("POSIMEI", "/");
      this.cookie.set(
       "POSIMEI",
       POSMachineDetail.hardwareID,
       {
         path: "/",
       }
     );
     this.cookie.delete("MachineName", "/");
     this.cookie.set(
       "MachineName",
       POSMachineDetail.edcMachineName,
       {
         path: "/",
       }
     );
     this.cookie.delete("MAXMachineName", "/");
     this.cookie.set(
       "MAXMachineName",
       POSMachineDetail.name,
       {
         path: "/",
       }
     );
     this.cookie.delete("MAXMachineId", "/");
     this.cookie.set(
       "MAXMachineId",
       POSMachineDetail.id,
       {
         path: "/",
       }
     );
     this.cookie.delete("MerchantId", "/");
     this.cookie.set(
       "MerchantId",
       POSMachineDetail.merchantID,
       {
         path: "/",
       }
     );
     this.cookie.delete("MerchantPOSCode", "/");
     this.cookie.set(
       "MerchantPOSCode",
       POSMachineDetail.merchantStorePosCode,
       {
         path: "/",
       }
     );
     this.cookie.delete("SecurityToken", "/");
     this.cookie.set(
       "SecurityToken",
       POSMachineDetail.securityToken,
       {
         path: "/",
       }
     );
     this.cookie.delete("PineLabApiUrl", "/");
     this.cookie.set(
       "PineLabApiUrl",
       POSMachineDetail.apiUrlPineLab,
       {
         path: "/",
       }
     );
     this.cookie.delete("UPIAllowedPaymentMode", "/");
     this.cookie.set(
       "UPIAllowedPaymentMode",
       POSMachineDetail.upI_AllowedPaymentMode,
       {
         path: "/",
       }
     );
}  
  }

  negativePriceValidation()
  {
    let control= ['cashamount', 'chequeamount', 'creditamount', 'demandamount', 'internetamount', 'upiamount','onlineamount','mobilesendermobile','paytmamount'];
    control.forEach(i => {
      if(Number(this.refundform.controls[i].value) < 0)
      {
        this.refundform.controls[i].setValue("");
        this.messageDialogService.warning('Amount Cannot be Negative');
        return;
      }else if(Number(this.refundform.controls[i].value) > 0) {
        this.PaymentMethodvalidation();
      }
    });
  }

  PaymentMethodvalidation() {
    this.PaymentMethodcashdeposit = this.refundform.value;
    this.depositamount = 0;
    if (Number(this.PaymentMethodcashdeposit.cashamount)) {
      this.depositamount = Number(this.PaymentMethodcashdeposit.cashamount);
    } else if (Number(this.PaymentMethodcashdeposit.chequeamount)) {
      this.depositamount = Number(this.PaymentMethodcashdeposit.chequeamount);
      this.PaymentType = 2;
    } else if (Number(this.PaymentMethodcashdeposit.creditamount)) {
      this.depositamount = Number(this.PaymentMethodcashdeposit.creditamount);
      this.PaymentType = 4;
    } else if (Number(this.PaymentMethodcashdeposit.demandamount)) {
      this.depositamount = Number(this.PaymentMethodcashdeposit.demandamount);
      this.PaymentType = 3;
    } else if (Number(this.PaymentMethodcashdeposit.upiamount)) {
      this.depositamount = Number(this.PaymentMethodcashdeposit.upiamount);
      this.PaymentType = 8;
    } else if (Number(this.PaymentMethodcashdeposit.internetamount)) {
      this.depositamount = Number(this.PaymentMethodcashdeposit.internetamount);
      this.PaymentType = 9;
    }else if (Number(this.PaymentMethodcashdeposit.upiamount)) {
      this.depositamount = Number(this.PaymentMethodcashdeposit.internetamount);
      this.PaymentType = 6;
    }
  if (this.Refundavalaiblemaount) {
      let cashlimit = this.depositservice.refundcashlimit;
      if (
        Number(this.depositamount) >
          Number(this.Refundavalaiblemaount.avalaiblemaount) &&
        this.Refundavalaiblemaount.type == "Refund"
      ) {
        this.messageDialogService.info(
          "Refund Amount must be less than available amount"
        );
        if(this.PaymentType == 1){
             this.refundform.controls["cashamount"].setValue("");
        }else if(this.PaymentType == 2){
          this.refundform.controls["chequeamount"].setValue("");
        }
      } else if (
        Number(this.depositamount) > Number(cashlimit[0].cashLimit) &&
        this.PaymentType == 1
      ) {
        this.messageDialogService.info(
          "Refund through Cash Cannot be more than Rs 10000"
        );
        this.refundform.controls["cashamount"].setValue(""); 
      } else if (Number(this.depositamount <= 0)) {
        this.messageDialogService.info(
          "Refund Amount must not be Zero or Negative number"
        );
      }
    }
    else if(Number(this.depositamount >= 200000) && this.PaymentType == 1){
      this.messageDialogService.info("Cash amount cannot exceed Rs.199999");   
      this.refundform.controls["cashamount"].setErrors({ incorrect: true });     
    } 
    else {
      this.depositservice.setFormList(this.refundform.value);      
    }
  }

  ngAfterViewInit(): void {
   //for GAV-1375
   this.refundform.valueChanges.subscribe(() => {
     this.negativePriceValidation();
   }); 
 
   this.refundform.controls["posimei"].valueChanges          
          .subscribe((value: any) => {
            if (value) {
              this.POSMachineDetal = this.POSIMEIList.filter(
                (s: any) => s.name === value
              )[0];
              this.setPOSMachinevaluesinCookie(this.POSMachineDetal);              
            }
    });  

  this.refundform.controls["upiposimei"].valueChanges         
          .subscribe((value: any) => {
            if (value) {
              this.POSMachineDetal = this.POSIMEIList.filter(
                (s: any) => s.name === value
              )[0];
              this.setPOSMachinevaluesinCookie(this.POSMachineDetal);              
            }
   });
   
   //gav -1498
   this.questions[0].elementRef.addEventListener(
    "keypress",
    (event: any) => {
      if (event.keyCode == 46) {
        event.preventDefault();
      }
    }
  );

  this.questions[5].elementRef.addEventListener(
    "keypress",
    (event: any) => {
      if (event.keyCode == 46) {
        event.preventDefault();
      }
    }
  );
  this.questions[11].elementRef.addEventListener(
    "keypress",
    (event: any) => {
      if (event.keyCode == 46) {
        event.preventDefault();
      }
    }
  );
  this.questions[19].elementRef.addEventListener(
    "keypress",
    (event: any) => {
      if (event.keyCode == 46) {
        event.preventDefault();
      }
    }
  ); 
   this.questions[44].elementRef.addEventListener(
    "keypress",
    (event: any) => {
      if (event.keyCode == 46) {
        event.preventDefault();
      }
    }
  );
  this.questions[51].elementRef.addEventListener(
    "keypress",
    (event: any) => {
      if (event.keyCode == 46) {
        event.preventDefault();
      }
    }
  );
  this.questions[49].elementRef.addEventListener("keypress", (event: any) => {
    if (event.key === "Enter") {
      if(this.refundform.value.internetmobile.length != 10)
      {          
          this.messageDialogService.error("Invalid Mobile No.");             
      }
    }
});

  }

  clearpaymentmethod() {
    this.refundform.reset();
    this.today = new Date();
    this.refundform.controls["chequeissuedate"].setValue(this.today);
    this.refundform.controls["demandissuedate"].setValue(this.today);    
    this.refundform.controls["chequevaliditydate"].setValue(this.today);
    this.refundform.controls["demandvaliditydate"].setValue(this.today);
    this.refundform.controls["cashamount"].setValue("0.00");
    this.refundform.controls["chequeamount"].setValue("0.00");
    this.refundform.controls["creditamount"].setValue("0.00");
    this.refundform.controls["demandamount"].setValue("0.00");
    this.refundform.controls["upiamount"].setValue("0.00");
    this.refundform.controls["internetamount"].setValue("0.00");
    this.refundform.controls["internetmobile"].setValue(this.paymentpatientinfo == undefined  ? "" : this.paymentpatientinfo.patientinfo.mobileno);
    this.refundform.controls["internetemail"].setValue(this.paymentpatientinfo == undefined  ? "" : this.paymentpatientinfo.patientinfo.emailId);
  }

  async paymentupiapproval(button:string){
    let price = Number(this.refundform.controls["creditamount"].value) > 0 ? this.refundform.controls["creditamount"].value : this.refundform.controls["upiamount"].value;
    let transactionid = Number(this.refundform.controls["creditamount"].value) > 0 ? this.refundform.controls["creditcardtransactionid"].value : this.refundform.controls["upitransactionid"].value;
    if ( Number(price) > 0) {
       let module = "OPD_Deposit";
       this.payloadData = {
               price : Number(price),
               transactionid : transactionid
           };
        let res = this.paymentService.uploadBillTransaction(
          this.payloadData,
          module,
          this.paymentpatientinfo.patientinfo.iacode+ "." + this.paymentpatientinfo.patientinfo.registrationno
        );
        await this.processPaymentApiResponse(button, res);
      } else {
        const errorDialogRef = this.messageDialogService.warning(
          "Please Give Proper Amount."
        );
        await errorDialogRef.afterClosed().toPromise();
        return;
      }
  }

  async paymentretryokbtnfunc(button:string){
    let price = Number(this.refundform.controls["creditamount"].value) > 0 ? this.refundform.controls["creditamount"].value : this.refundform.controls["upiamount"].value;
    let transactionid = Number(this.refundform.controls["creditamount"].value) > 0 ? this.refundform.controls["creditcardtransactionid"].value : this.refundform.controls["upitransactionid"].value;
  
    if (Number(price) > 0) { 
    let module = "OPD_Deposit";
    this.payloadData = {
            price : Number(price),
            transactionid : transactionid
        };
      let res = await this.paymentService.getBillTransactionStatus(
        this.payloadData,
        module,
        this.paymentpatientinfo.patientinfo.iacode+ "." + this.paymentpatientinfo.patientinfo.registrationno
      );
      await this.processPaymentApiResponse(button, res);
    } else {
      const errorDialogRef = this.messageDialogService.warning(
        "Please Give Proper Amount."
      );
      await errorDialogRef.afterClosed().toPromise();
      return;
    }
  }
  
  async processPaymentApiResponse(button: any, res: any) {
    if (res && res.success) {
      if (res.responseMessage && res.responseMessage != "") {
        if (res.responseMessage == "APPROVED") {
          if (button == "credit") {
            if (res.transactionRefId) {
              this.refundform.controls["creditcardtransactionid"].patchValue(
                res.transactionRefId
              );
            }
          } else if (button == "upi") {
            if (res.transactionRefId) {
              this.refundform.controls["upitransactionid"].patchValue(
                res.transactionRefId
              );
            }
          }
          const infoDialogRef = this.messageDialogService.info(
            "Kindly Pay Using Machine"
          );
          await infoDialogRef.afterClosed().toPromise();
          return;
        } else if (res.responseMessage == "TXN APPROVED") {
          if (res.pineLabReturnResponse) {
            let bankId = 0;
            let bank = this.bankname.filter(
              (r: any) => r.title == res.pineLabReturnResponse.ccResAcquirerName
            );
            if (bank && bank.length > 0) {
              bankId = bank[0].id;
            }
            if (button == "credit") {
              this.refundform.controls["creditcardno"].patchValue(
                res.pineLabReturnResponse.ccResCardNo
              );
              this.refundform.controls["creditholdername"].patchValue(
                res.cardHolderName
              );
              this.refundform.controls["creditbankname"].patchValue(bankId);
              this.refundform.controls["creditbatchno"].patchValue(
                res.pineLabReturnResponse.ccResBatchNumber
              );
              this.refundform.controls["creditapproval"].patchValue(
                res.pineLabReturnResponse.ccResApprovalCode
              );
              this.refundform.controls["creditterminal"].patchValue(res.terminalId);
              this.refundform.controls["creditacquiring"].patchValue(
                res.pineLabReturnResponse.ccResAcquirerName
              );
              this.refundform.controls["creditbanktid"].patchValue(
                res.pineLabReturnResponse.ccResBankTID
              );
            } else if (button == "upi") {
              this.refundform.controls["upicardno"].patchValue(
                res.pineLabReturnResponse.ccResCardNo
              );
              this.refundform.controls["upicardholdername"].patchValue(
                res.cardHolderName
              );
              this.refundform.controls["upibankname"].patchValue(bankId);
              this.refundform.controls["upibatchno"].patchValue(
                res.pineLabReturnResponse.ccResBatchNumber
              );
              this.refundform.controls["upiapproval"].patchValue(
                res.pineLabReturnResponse.ccResApprovalCode
              );
              this.refundform.controls["upiterminal"].patchValue(res.terminalId);
              this.refundform.controls["upiacquiring"].patchValue(
                res.pineLabReturnResponse.ccResAcquirerName
              );
              this.refundform.controls["creditbanktid"].patchValue(
                res.pineLabReturnResponse.ccResBankTID
              );
            }
          }
        } else {
          const infoDialogRef = this.messageDialogService.info(
            res.responseMessage
          );
          await infoDialogRef.afterClosed().toPromise();
          return;
        }
      }
    } else if (res && !res.success) {
      if (res.errorMessage && res.errorMessage != "") {
        const errorDialogRef = this.messageDialogService.error(
          res.errorMessage
        );
        await errorDialogRef.afterClosed().toPromise();
        return;
      } else if (res.responseMessage && res.responseMessage != "") {
        const errorDialogRef = this.messageDialogService.error(
          res.responseMessage
        );
        await errorDialogRef.afterClosed().toPromise();
        return;
      }
    }
  }
  getbankname()
  {
    this.http.get(BillDetailsApiConstants.getbankname)
    .pipe(takeUntil(this._destroying$))
    .subscribe( res => {
      console.log(res);
      this.bankname = res;
      this.questions[3].options = this.bankname.map(l => {
        return { title: l.name, value: l.name}
      })
      this.questions[3] = {...this.questions[3]};
      this.questions[17].options = this.bankname.map(l => {
        return { title: l.name, value: l.name}
      })
      this.questions[17] = {...this.questions[17]};
    })
  }
  getcreditcard()
  {
    this.http.get(BillDetailsApiConstants.getcreditcard)
    .pipe(takeUntil(this._destroying$))
    .subscribe( res => {
      console.log(res);
      this.creditcard = res;
      this.questions[9].options = this.creditcard.map(l => {
        return { title: l.name, value: l.id}
      })
      this.questions[9] = {...this.questions[9]};
    })
    
  }
  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

  //add only required fields
  chequemandatoryfields(){
    if(this.refundform.value.chequeno == "" || this.refundform.value.chequeno == null
    || this.refundform.value.chequebankname == "" || this.refundform.value.chequebankname == null
    || this.refundform.value.chequebranchname == ""  || this.refundform.value.chequebranchname == null 
    || this.refundform.value.chequeissuedate == "" || this.refundform.value.chequeissuedate == null
    || this.refundform.value.chequeauth == "" || this.refundform.value.chequeauth == null
   || Number(this.refundform.value.chequeamount) <= 0){
    return false;
   } else{
     return true;
   }
  }

//add only required fields
  creditcardmandatoryfields(){
    if(this.refundform.value.creditcardno == "" || this.refundform.value.creditcardno == null
    || this.refundform.value.creditholdername == "" || this.refundform.value.creditholdername == null
    || this.refundform.value.creditbankname == "" || this.refundform.value.creditbankname == null
    || this.refundform.value.creditbatchno == "" || this.refundform.value.creditbatchno == null
    || this.refundform.value.creditapproval == "" || this.refundform.value.creditapproval == null
    || this.refundform.value.creditterminal == "" || this.refundform.value.creditterminal == null
    || this.refundform.value.creditacquiring == "" || this.refundform.value.creditacquiring == null
    || this.refundform.value.creditvaliditydate == "" || this.refundform.value.creditvaliditydate == null
    || this.refundform.value.creditbanktid == "" || this.refundform.value.creditbanktid == null
    || Number(this.refundform.value.creditamount) <= 0){
      return false;
     } else{
       return true;
     }
  }

  //add only required fields
  demanddraftmandatoryfields(){
    if(this.refundform.value.demandddno == "" || this.refundform.value.demandddno == null
    || this.refundform.value.demandissuedate == "" || this.refundform.value.demandissuedate == null
    || this.refundform.value.demandbankname == "" || this.refundform.value.demandbankname == null
    || this.refundform.value.demandbranchname == "" || this.refundform.value.demandbranchname == null
    || this.refundform.value.demandauth == "" || this.refundform.value.demandauth == null || Number(this.refundform.value.demandamount) <= 0){
      return false;
     } else{
       return true;
     }
  }
    //add only required fields
  internetmandatoryfields(){
      if( Number(this.refundform.value.internetamount) <= 0
      || this.refundform.value.internetemail == "" || this.refundform.value.internetemail == null
      || this.refundform.value.internetmobile == "" || this.refundform.value.internetmobile == null
      || this.refundform.value.internetremarks == "" || this.refundform.value.internetremarks == null
    ){
        return false;
       } else{
         if(!this.refundform.controls["internetmobile"].valid){
          return false;
        }
         return true;
       }
  }
  //add only required fields
  upimandatoryfields(){
    if( Number(this.refundform.value.upiamount) <= 0
    || this.refundform.value.upiacquiring == "" || this.refundform.value.upiacquiring == null
    || this.refundform.value.upiapproval == "" || this.refundform.value.upiapproval == null
    || this.refundform.value.upibankname == "" || this.refundform.value.upibankname == null
    || this.refundform.value.upibatchno == "" || this.refundform.value.upibatchno == null
    || this.refundform.value.upicardholdername == "" || this.refundform.value.upicardholdername == null
    || this.refundform.value.upicardno == "" || this.refundform.value.upicardno == null
    || this.refundform.value.upivalidity == "" || this.refundform.value.upivalidity == null
    || this.refundform.value.upiterminal == "" || this.refundform.value.upiterminal == null
    || this.refundform.value.upitransactionid == "" || this.refundform.value.upitransactionid == null
  ){
      return false;
     } else{
       return true;
     }
  }

  clearamountvalue(paymentmode: any){    
    if(this.refundform.controls[paymentmode].value== "0.00"){
       this.refundform.controls[paymentmode].setValue("");
    }
  }
}
