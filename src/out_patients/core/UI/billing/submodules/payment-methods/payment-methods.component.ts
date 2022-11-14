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

  tabChanged(event: MatTabChangeEvent) {
    this.activeTab = event.tab.textLabel;
    this.clearpaymentmethod();
  }

  async PaymentMethodvalidation() {
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
    if (Number(this.depositamount < 0)) {
      const depositamt =  this.messageDialogService.error(
          "Amount Zero or Negative number is not Allowed"
        );
        await depositamt.afterClosed().toPromise();
        if(this.PaymentType == 1){
          this.refundform.controls["cashamount"].setValue("0.00");
          this.questions[0].elementRef.focus();
        } 
        else if(this.PaymentType == 2)
        {
          this.refundform.controls["chequeamount"].setValue("0.00");
          this.questions[5].elementRef.focus();
        }
        else if(this.PaymentType == 4)
        {
          this.refundform.controls["creditamount"].setValue("0.00");
          this.questions[11].elementRef.focus();
        }
        else if(this.PaymentType == 3)
        {
          this.refundform.controls["demandamount"].setValue("0.00");
          this.questions[19].elementRef.focus();
        }
        else if(this.PaymentType == 8)
        {
          this.refundform.controls["upiamount"].setValue("0.00");
          this.questions[44].elementRef.focus();
        }
        else if(this.PaymentType == 9)
        {
          this.refundform.controls["internetamount"].setValue("0.00");
          this.questions[51].elementRef.focus();
        }
  
      } else if (this.Refundavalaiblemaount) {
      let cashlimit = this.depositservice.refundcashlimit;
      if (
        Number(this.depositamount) >
          Number(this.Refundavalaiblemaount.avalaiblemaount) &&
        this.Refundavalaiblemaount.type == "Refund"
      ) {
        this.messageDialogService.error(
          "Refund Amount must be less then available amount"
        );
      } else if (
        Number(this.depositamount) > Number(cashlimit[0].cashLimit) &&
        this.PaymentType == 1
      ) {
        this.messageDialogService.error(
          "Refund through Cash Cannot be more then Rs 10000"
        );
      } else if (Number(this.depositamount <= 0)) {
        this.messageDialogService.error(
          "Refund Amount must not be Zero or Negative number"
        );
      }
    }else if(Number(this.depositamount >= 200000) && this.PaymentType == 1){
      this.messageDialogService.error("Cash amount cannot exceed Rs.199999");
      this.questions[0].elementRef.focus();     
    } 
    else {
      this.depositservice.setFormList(this.refundform.value);
    }
  }

  ngAfterViewInit(): void {
    this.Disablecreditfields();
    this.questions[0].elementRef.addEventListener(
      "blur",
      this.PaymentMethodvalidation.bind(this)
    );

    this.questions[5].elementRef.addEventListener(
      "blur",
      this.PaymentMethodvalidation.bind(this)
    );
    this.questions[11].elementRef.addEventListener(
      "blur",
      this.PaymentMethodvalidation.bind(this)
    );
    this.questions[19].elementRef.addEventListener(
      "blur",
      this.PaymentMethodvalidation.bind(this)
    ); 
     this.questions[44].elementRef.addEventListener(
      "blur",
      this.PaymentMethodvalidation.bind(this)
    );
    this.questions[51].elementRef.addEventListener(
      "blur",
      this.PaymentMethodvalidation.bind(this)
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

  Enablecreditfields() {
    this.refundform.controls["creditcardno"].enable();
    this.refundform.controls["creditholdername"].enable();
    this.refundform.controls["creditbankname"].enable();
    this.refundform.controls["creditbatchno"].enable();
    this.refundform.controls["creditapproval"].enable();
    this.refundform.controls["creditacquiring"].enable();
    this.refundform.controls["creditterminal"].enable();
  }

  Disablecreditfields() {
    this.refundform.controls["creditcardno"].disable();
    this.refundform.controls["creditholdername"].disable();
    this.refundform.controls["creditbankname"].disable();
    this.refundform.controls["creditbatchno"].disable();
    this.refundform.controls["creditapproval"].disable();
    this.refundform.controls["creditacquiring"].disable();
    this.refundform.controls["creditterminal"].disable();
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
    this.refundform.controls["internetmobile"].setValue(this.paymentpatientinfo.patientinfo.mobileno);
    this.refundform.controls["internetemail"].setValue(this.paymentpatientinfo.patientinfo.emailId);
  }

  resetcreditcard() {
    this.refundform.controls["creditcardno"].setValue("");
    this.refundform.controls["creditholdername"].setValue("");
    this.refundform.controls["creditbankname"].setValue("");
    this.refundform.controls["creditbatchno"].setValue("");
    this.refundform.controls["creditapproval"].setValue("");
    this.refundform.controls["creditacquiring"].setValue("");
    this.refundform.controls["creditterminal"].setValue("");
    this.refundform.controls["creditamount"].setValue("");
  }
  savecheque(){

  }

  resetchequedetails(){
    
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
}
