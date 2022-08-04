import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { BillingForm } from '@core/constants/BillingForm';
import { Subject, Observable } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { QuestionControlService } from '../../../../../../shared/ui/dynamic-forms/service/question-control.service';
import { DepositService } from "@core/services/deposit.service";

@Component({
  selector: 'payment-methods',
  templateUrl: './payment-methods.component.html',
  styleUrls: ['./payment-methods.component.scss']
})
export class PaymentMethodsComponent implements OnInit {
  @Input() config: any;
  @Input() clearsibilingcomponent : boolean = false;

  refundFormData =  BillingForm.refundFormData;
  refundform!: FormGroup;
  questions: any;
  today: any;
  constructor( private formService: QuestionControlService, private depositservice: DepositService) { }

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
    if(this.clearsibilingcomponent){
        this.refundform.reset();
    }
  }

  PaymentMethodcashdeposit:any=[];
  tabChanged(event:MatTabChangeEvent){
    console.log(event);
    this.refundform.controls["chequeissuedate"].setValue(this.today);
    this.refundform.controls["demandissuedate"].setValue(this.today); 
    this.depositservice.setFormList(this.refundform.value);
  }

  ngAfterViewInit(): void {
    this.Disablecreditfields();
    this.questions[0].elementRef.addEventListener(
      "blur",
      this.tabChanged.bind(this)
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

}
