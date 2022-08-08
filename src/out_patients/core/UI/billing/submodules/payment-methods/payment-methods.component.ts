import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { BillingForm } from '@core/constants/BillingForm';
import { Subject, Observable } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { QuestionControlService } from '../../../../../../shared/ui/dynamic-forms/service/question-control.service';
import { DepositService } from "@core/services/deposit.service";
import { MessageDialogService } from "@shared/ui/message-dialog/message-dialog.service";

@Component({
  selector: 'payment-methods',
  templateUrl: './payment-methods.component.html',
  styleUrls: ['./payment-methods.component.scss']
})
export class PaymentMethodsComponent implements OnInit, OnChanges {
  @Input() config: any;
  @Input() paymenthodclearsibilingcomponent : boolean = false;
  @Input() Refundavalaiblemaount:any;

  refundFormData =  BillingForm.refundFormData;
  refundform!: FormGroup;
  questions: any;
  today: any;
  constructor( private formService: QuestionControlService, private depositservice: DepositService ,private messageDialogService: MessageDialogService,) { }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['paymenthodclearsibilingcomponent'].currentValue)
    {
      this.clearpaymentmethod();
    }
  }

  private readonly _destroying$ = new Subject<void>();

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.refundFormData.properties,
      {}
    );
    this.refundform = formResult.form;
   
    this.questions = formResult.questions;
    this.today = new Date();
    this.refundform.controls["chequeissuedate"].setValue(this.today);
    this.refundform.controls["demandissuedate"].setValue(this.today);
     console.log(this.Refundavalaiblemaount);
  }

  PaymentMethodcashdeposit:any=[];
  

   defaultamount:boolean = false;
   depositamount:number = 0;
   paymentmode: string = "Cash";
  
  tabChanged(event:MatTabChangeEvent){
    this.PaymentMethodcashdeposit = this.refundform.value;
   
    if(event.tab != undefined){
      this.paymentmode = event.tab.textLabel;
    }

    if(Number(this.PaymentMethodcashdeposit.cashamount) > 0 && this.paymentmode == "Cash" ){ 
      this.defaultamount = false;
     }
     else if(this.PaymentMethodcashdeposit.chequeamount > 0 && this.paymentmode == "Cheque"){  
      this.defaultamount = false;
     }
     else if(this.PaymentMethodcashdeposit.creditamount > 0 && this.paymentmode == "Credit Card"){
      this.defaultamount = false;
    }
    else if(this.PaymentMethodcashdeposit.demandamount > 0 && this.paymentmode == "Demand Draft"){
      this.defaultamount = false;
    }
     else if(this.PaymentMethodcashdeposit.upiamount > 0 && this.paymentmode != "UPI"){
      this.defaultamount = false;
    }
    else  if(this.PaymentMethodcashdeposit.internetamount > 0 && this.paymentmode != "Internet Payment"){
      this.defaultamount = false;
    }
    else{
      this.defaultamount = true;
    }

     if(this.defaultamount){
      this.clearpaymentmethod();
    }
    
    this.depositservice.setFormList(this.refundform.value);
  }
  PaymentMethodvalidation(){
    if(Number(this.PaymentMethodcashdeposit.cashamount) > 0){   
      this.depositamount =  this.PaymentMethodcashdeposit.cashamount;     
     }
     else if(Number(this.PaymentMethodcashdeposit.chequeamount) > 0){             
      this.depositamount =  this.PaymentMethodcashdeposit.chequeamount;      
     }
     else if(Number(this.PaymentMethodcashdeposit.creditamount) > 0){
      this.depositamount =  this.PaymentMethodcashdeposit.creditamount;    
    }
    else if(Number(this.PaymentMethodcashdeposit.demandamount) > 0){
      this.depositamount =  this.PaymentMethodcashdeposit.demandamount;     
    }
     else if(Number(this.PaymentMethodcashdeposit.upiamount) > 0){
      this.depositamount =  this.PaymentMethodcashdeposit.upiamount;     
    }
    else  if(Number(this.PaymentMethodcashdeposit.internetamount) > 0){
      this.depositamount =  this.PaymentMethodcashdeposit.internetamount;     
    }
    if((Number(this.depositamount) > Number(this.Refundavalaiblemaount.avalaiblemaount)) && this.Refundavalaiblemaount.type == "Refund"){  
      this.messageDialogService.error("Refund Amount must be less then available amount");     
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

  }

  Enablecreditfields(){
    this.refundform.controls["creditcardno"].enable();
    this.refundform.controls["creditholdername"].enable();
    this.refundform.controls["creditbankno"].enable();
    this.refundform.controls["creditbatchno"].enable();
    this.refundform.controls["creditapproval"].enable();
    this.refundform.controls["creditacquiring"].enable();
    this.refundform.controls["creditterminal"].enable();
  }

  Disablecreditfields(){
    this.refundform.controls["creditcardno"].disable();
    this.refundform.controls["creditholdername"].disable();
    this.refundform.controls["creditbankno"].disable();
    this.refundform.controls["creditbatchno"].disable();
    this.refundform.controls["creditapproval"].disable();
    this.refundform.controls["creditacquiring"].disable();
    this.refundform.controls["creditterminal"].disable();
  }

  clearpaymentmethod(){
    this.refundform.reset();
    this.today = new Date();
    this.refundform.controls["chequeissuedate"].setValue(this.today);
    this.refundform.controls["demandissuedate"].setValue(this.today);
    this.refundform.controls["cashamount"].setValue("0.00");
    this.refundform.controls["chequeamount"].setValue("0.00");
    this.refundform.controls["creditamount"].setValue("0.00");
    this.refundform.controls["demandamount"].setValue("0.00");
    this.refundform.controls["paytmamount"].setValue("0.00");
    this.refundform.controls["upiamount"].setValue(this.today);

  }

  resetcreditcard(){
    this.refundform.controls["creditcardno"].setValue('');
    this.refundform.controls["creditholdername"].setValue('');
    this.refundform.controls["creditbankno"].setValue('');
    this.refundform.controls["creditbatchno"].setValue('');
    this.refundform.controls["creditapproval"].setValue('');
    this.refundform.controls["creditacquiring"].setValue('');
    this.refundform.controls["creditterminal"].setValue('');
    this.refundform.controls["creditamount"].setValue('');
  }


}
