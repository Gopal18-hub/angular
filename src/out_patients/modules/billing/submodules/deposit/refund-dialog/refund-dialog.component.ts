import { Component, Inject, OnInit,AfterViewInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog,  MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { QuestionControlService } from "../../../../../../shared/ui/dynamic-forms/service/question-control.service";
import { FormSixtyComponent } from '@core/UI/billing/submodules/form60/form-sixty.component';
import { MakedepositDialogComponent } from '../makedeposit-dialog/makedeposit-dialog.component';
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { PaymentMethodsComponent } from '@core/UI/billing/submodules/payment-methods/payment-methods.component';
import { MessageDialogService } from "@shared/ui/message-dialog/message-dialog.service";
import { savepatientRefunddetailModel } from "@core/models/savepatientRefundDetailModel.Model";
import { CookieService } from "@shared/services/cookie.service";
import { HttpService } from "@shared/services/http.service";
import { ApiConstants } from "@core/constants/ApiConstants";
import { DatePipe } from "@angular/common";
import { sendotpforpatientrefund } from "@core/models/patientsaveotprefunddetailModel.Model";
import { PatientDepositCashLimitLocationDetail } from "@core/types/depositcashlimitlocation.Interface";
import { DepositService } from '@core/services/deposit.service';
import { DepositSuccessComponent } from '../deposit-success/deposit-success.component';

@Component({
  selector: 'out-patients-refund-dialog',
  templateUrl: './refund-dialog.component.html',
  styleUrls: ['./refund-dialog.component.scss']
})
export class RefundDialogComponent implements OnInit {

  refundFormData = {
    title: "",
    type: "object",
    properties: {         
       payable_name: {
         type: "string",
       },
       remarks: {
         type: "textarea",
       },
       avalaibleamount: {
         type: "number"
       },       
       cardvalidate: {
        type: "radio",
        required: false,
        options: [
          { title: "Yes", value: "yes" },
          { title: "No", value: "no" }
        ],
        defaultValue: "yes"
      },     
      otp: {
        type: "number"
      },
      mobielno: {
        type: "number",
        readonly: "true"
      }, 
      text:{
        type: "string",
      }
    },
  };
  refundform!: FormGroup;
  questions: any;
  onRefundReceiptpage:boolean=true;
  otpsenttomobile:boolean = false;
  otpresenttomobile:boolean = false;
  servicedeposittype:any=[];
  today: any;
  patientIdentityInfo:any=[];
  avalaiblemaount:any=0;
  PaymentType:number = 1; //default cash
  PaymentTypedepositamount:number = 0;
  mobileno:number|undefined;

  hsplocationId:any =  Number(this.cookie.get("HSPLocationId"));
  stationId:any =  Number(this.cookie.get("StationId"));
  operatorID:any = Number(this.cookie.get("UserId"));

  SendOTP:string="Send OTP";
  ResendOTP: string="Send OTP to Manager";
  flagto_set_btnname:number = 0;
  Refundavalaiblemaount:any = [];
  totalrefundamount:number = 0;
  
  depositcashlimitationdetails: any=[];
  
  private readonly _destroying$ = new Subject<void>();

  @ViewChild(PaymentMethodsComponent) paymentdepositcashMode! : PaymentMethodsComponent;

  config = {
    paymentmethod: {
      cash: true,
      cheque: true
    },
    combopayment: false
  }
  constructor(public matDialog: MatDialog, private formService: QuestionControlService, @Inject(MAT_DIALOG_DATA) private data: any, 
   private messageDialogService: MessageDialogService,
  private cookie: CookieService,  private dialogRef: MatDialogRef<RefundDialogComponent>,
    private http: HttpService,
    private datepipe: DatePipe,
    private depositservice: DepositService) {
   }

  ngOnInit(): void {
    this.getdepositcashlimit();
    let formResult: any = this.formService.createForm(
      this.refundFormData.properties,
      {}
    );
    this.refundform = formResult.form;
    this.questions = formResult.questions;
    console.log(this.data);
    this.today = new Date();
    this.patientIdentityInfo = { type: "Refund", patientinfo: this.data.patientinfo };
    this.servicedeposittype = {
      type: "Refund",
      selectedservicedeposittype : this.data.clickedrowdepositdetails,
      refundreceiptpage : this.onRefundReceiptpage
    }
    this.avalaiblemaount = this.data.clickedrowdepositdetails.balance;
    this.Refundavalaiblemaount = {
      type: "Refund",
      avalaiblemaount: this.data.clickedrowdepositdetails.balance
    }
    this.mobileno = this.data.patientinfo.mobileno;
   
    console.log('inside refund page');
  }
  ngAfterViewInit(): void{   
   
  }
  
  clear()
  {
    this._destroying$.next(undefined);
    this._destroying$.complete();
    this.depositservice.clearsibllingcomponent();
    this.refundform.reset();
    this.refundform.controls["mobielno"].setValue(this.data.Mobile);
  }

  validationexists: boolean = true;
  async saverefunddialog(){
    const RefundDepositDialogref = this.messageDialogService.confirm(
      "",
      `Do you want to make Refund?`
    );
    const availDepositResult = await RefundDepositDialogref
      .afterClosed()
      .toPromise();
    if (availDepositResult) {
      if (availDepositResult.type == "yes") {
        this.refundformvalidation();
        this.submitrefundamount();      
       } 
    }
  }

  RefundcashMode:any=[];
  refundformvalidation(){
    this.RefundcashMode = this.paymentdepositcashMode.refundform.value;
      //Refund - payment method
     if(this.RefundcashMode)
     {
      this.validationexists = false;
      this.PaymentTypedepositamount = 0;
      if(this.RefundcashMode.cashamount > 0 ){
        this.PaymentTypedepositamount =  Number(this.RefundcashMode.cashamount);
       }
       else if(this.RefundcashMode.chequeamount > 0)
       {
          this.PaymentType = 2;
          this.PaymentTypedepositamount = Number( this.RefundcashMode.chequeamount);
          if(this.RefundcashMode.chequeno == "" || this.RefundcashMode.chequeno == null
          || this.RefundcashMode.chequebankname == ""  || this.RefundcashMode.chequebankname == null
          || this.RefundcashMode.chequebranchname == "" || this.RefundcashMode.chequebranchname == null
          || this.RefundcashMode.chequeissuedate == ""  || this.RefundcashMode.chequeissuedate == null
          || this.RefundcashMode.chequeauth == "" || this.RefundcashMode.chequeauth == null){
            this.messageDialogService.info("Please Fill All Cheque Mandatory Fields ");
            this.validationexists = true;
          }         
       }
      if(this.PaymentTypedepositamount == 0){
        this.messageDialogService.info("Refund Amount must not be Zero or Negative number");
        this.validationexists = true;
      }
      else if(Number(this.PaymentTypedepositamount) > Number(this.avalaiblemaount)){
        this.messageDialogService.info("Refund Amount must be less then available amount");
        this.validationexists = true;
      }
      else if((Number(this.PaymentTypedepositamount) > Number(this.depositcashlimitationdetails[0].cashLimit)) && this.PaymentType == 1){
        this.messageDialogService.info("Refund through Cash Cannot be more then Rs 10000");
        this.validationexists = true;
      }
      if((this.refundform.value.otp == "" || this.refundform.value.otp == null) && !this.validationexists){ 
        this.questions[4].elementRef.focus();       
        this.messageDialogService.info("Enter OTP");
       
        this.validationexists = true;
      }
    }
     else{
      this.validationexists = false;
     }
    
  }

  
  MoreRefunddialog()
  { 
    const successInfo = this.messageDialogService.info(
      `Refund has been done Successfully!`
    );     
    successInfo
                  .afterClosed()
                  .pipe(takeUntil(this._destroying$))
                  .subscribe((result) => {
                
                      const availDepositsPopup = this.messageDialogService.confirm(
                        "",
                        `Do you want to Make More Refund?`
                      );
                      availDepositsPopup
                        .afterClosed()
                        .pipe(takeUntil(this._destroying$))
                        .subscribe((result) => {
                          if ("type" in result) {
                          if (result.type == "yes") {
                            this.clear();          
                            this.SendOTP="Send OTP";
                            this.ResendOTP="Send OTP to Manager";  
                          }else{
                            this.matDialog.closeAll(); 
                            this.dialogRef.close("Success");
                          }                  
                        }
                    });
                   
                  });
  }

  submitrefundamount(){   
    this.totalrefundamount =  Number(this.PaymentTypedepositamount);
    if(!this.validationexists){
      this.http
        .post(ApiConstants.savepatientrefunddetails, this.getPatientRefundSubmitRequestBody())
        .pipe(takeUntil(this._destroying$))
        .subscribe(
          (resultData) => {       
            let amount = Number(this.avalaiblemaount) - Number(this.totalrefundamount); 
            this.avalaiblemaount =  amount.toFixed(2);
            if(amount <= 0){
              this.clear();
              this.dialogRef.close();
              this.matDialog.closeAll();
              this.messageDialogService.info(
                `Refund has been done Successfully!`
              );  
            }else{
              this.MoreRefunddialog();   
            }
                       
           
          },
          (error) => {
            console.log(error);
            this.messageDialogService.error(error.error);
          }
        );
    }
  }

  patientSaveRefundDetails: savepatientRefunddetailModel | undefined;
  patientsaveotprefundDetails: sendotpforpatientrefund | undefined;
  
  getPatientRefundSubmitRequestBody(): savepatientRefunddetailModel {  
    return (this.patientSaveRefundDetails = new savepatientRefunddetailModel(
      this.data.clickedrowdepositdetails.uhid.split(".")[0], 
      this.refundform.value.payable_name == null ? "" :  this.refundform.value.payable_name,
      this.refundform.value.remarks == null ? "" :  this.refundform.value.remarks,
      this.data.clickedrowdepositdetails.receiptno,
      Number(this.data.clickedrowdepositdetails.uhid.split(".")[1]),
      Number(this.PaymentTypedepositamount),
      this.stationId,
      this.hsplocationId,
      this.operatorID,    
      this.PaymentType,    
      this.RefundcashMode.chequeno,    
      this.RefundcashMode.banknamecheque,
      this.RefundcashMode.branchnamecheque,
      this.datepipe.transform(Date.now(), "yyyy-MM-ddThh:mm:ss") || "{}",     
      0,           
      this.refundform.value.otp
    ));
  }

  getPatientrefundotpdetailsRequestBody(): sendotpforpatientrefund{
    return (this.patientsaveotprefundDetails = new sendotpforpatientrefund(
    0,
    this.data.clickedrowdepositdetails.receiptno,
    this.stationId,
    this.hsplocationId,
    this.operatorID, 
    0,    
    this.datepipe.transform(Date.now(), "yyyy-MM-ddThh:mm:ss") || "{}",    
    this.data.clickedrowdepositdetails.uhid,
    "OP",
      0,
    this.flagto_set_btnname
    ));
  }

  sendotpclick(){
    this.RefundcashMode=[];
    this.validationexists = false;
    this.RefundcashMode = this.paymentdepositcashMode.refundform.value;    
    if(this.RefundcashMode.cashamount <= 0  && this.RefundcashMode.chequeamount <= 0)
    {
       this.messageDialogService.info("Refund Amount must not be Zero or Negative number");
       this.validationexists = true;
    }
    else if(Number(this.RefundcashMode.cashamount) > Number(this.avalaiblemaount)){
      this.messageDialogService.info("Refund Amount must be less then available amount");
      this.validationexists = true;
    }
    
    if(!this.validationexists){
      this.SendOTP = "Resend OTP";
      this.otpsenttomobile = true;
      this.http
      .post(ApiConstants.sendotpoprefund, this.getPatientrefundotpdetailsRequestBody())
      .pipe(takeUntil(this._destroying$))
      .subscribe((resultData) => {
        if(resultData == 1){
          const otpsuccessInfo = this.messageDialogService.info(
            `OTP Sent Successfully`
          ); 
          setTimeout(()=>{                           
            this.otpsenttomobile = false;
            this.otpresenttomobile = true;
        }, 60000);
        }
       console.log(resultData);
      },
      (error) => {
        console.log(error.error);
      });
    }
  }

  resendotpclick(){
    this.refundform.controls["otp"].setValue("");
    this.flagto_set_btnname = 1;
    this.RefundcashMode=[];
    this.RefundcashMode = this.paymentdepositcashMode.refundform.value;
    this.validationexists = false;
    if(this.RefundcashMode.cashamount <= 0  && this.RefundcashMode.chequeamount <= 0)
    {
       this.messageDialogService.info("Refund Amount must not be Zero or Negative number");
       this.validationexists = true;
    }
    else if(Number(this.RefundcashMode.cashamount) > Number(this.avalaiblemaount)){
      this.messageDialogService.info("Refund Amount must be less then available amount");
      this.validationexists = true;
    }

    if(!this.validationexists){
      this.ResendOTP = "Resend OTP To Manager";
      this.otpresenttomobile = false;
      this.otpsenttomobile = true;
      this.http
      .post(ApiConstants.sendotpoprefund, this.getPatientrefundotpdetailsRequestBody())
      .pipe(takeUntil(this._destroying$))
      .subscribe((resultData) => {
        if(resultData == 1){
          this.messageDialogService.success("OTP Sent Successfully");
          setTimeout(()=>{                           
            this.otpsenttomobile = false;
            this.otpresenttomobile = true;
        }, 60000);
        }
       console.log(resultData);
      },
      (error) => {
        console.log(error.error);
      });
    }   
  }
  getdepositcashlimit(){
    this.http
    .get(ApiConstants.getcashlimitwithlocationsmsdetailsoflocation(this.hsplocationId))
    .pipe(takeUntil(this._destroying$))
    .subscribe((resultData: PatientDepositCashLimitLocationDetail) => {
      this.depositcashlimitationdetails = resultData.cashLimitOfLocation;
     this.depositservice.setcashlimitation(this.depositcashlimitationdetails);
    });
  }
  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}



