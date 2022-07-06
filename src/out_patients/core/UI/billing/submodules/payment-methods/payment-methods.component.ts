import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BillingForm } from '@core/constants/BillingForm';
import { QuestionControlService } from '../../../../../../shared/ui/dynamic-forms/service/question-control.service';
@Component({
  selector: 'payment-methods',
  templateUrl: './payment-methods.component.html',
  styleUrls: ['./payment-methods.component.scss']
})
export class PaymentMethodsComponent implements OnInit {
  @Input() config: any;
  @Output() paymentform:EventEmitter<FormGroup> = new EventEmitter();

  refundFormData =  BillingForm.refundFormData;
  refundform!: FormGroup;
  questions: any;
  today: any;

  cash:boolean = false;
  cheque:boolean = false;
  credit:boolean = false;
  demand:boolean = false;
  mobilepayment:boolean = false;
  onlinepayment:boolean = false;
  paytm:boolean = false;
  upi:boolean = false;
  internetpayment: boolean = false;

  constructor( private formService: QuestionControlService) { }

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.refundFormData.properties,
      {}
    );
    this.refundform = formResult.form;
    this.paymentform.emit(this.refundform);
    this.questions = formResult.questions;
    this.today = new Date();
    this.refundform.controls["chequeissuedate"].setValue(this.today);
    this.refundform.controls["demandissuedate"].setValue(this.today);
    this.cash = this.config.cash;
    this.cheque = this.config.cheque;
    this.credit = this.config.credit;
    this.demand = this.config.demand;
    this.mobilepayment = this.config.mobilepayment;
    this.onlinepayment = this.config.onlinepayment;
    this.paytm = this.config.paytm;
    this.upi = this.config.upi;
    this.internetpayment = this.config.internetpayment;
  }
}
