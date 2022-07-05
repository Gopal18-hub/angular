import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BillingForm } from '@core/constants/BillingForm';
import { DatePipe } from '@angular/common';
import { QuestionControlService } from '../../../../../../shared/ui/dynamic-forms/service/question-control.service';
@Component({
  selector: 'payment-methods',
  templateUrl: './payment-methods.component.html',
  styleUrls: ['./payment-methods.component.scss']
})
export class PaymentMethodsComponent implements OnInit {
  @Input() fromrefund !: boolean;
  @Input() fromdeposit!:boolean;
  @Output() paymentform:EventEmitter<FormGroup> = new EventEmitter();
  refundFormData =  BillingForm.refundFormData;
  refundform!: FormGroup;
  questions: any;
  today: any;
  forrefundpage:boolean = true;
  fordepositpage:boolean = true;
  constructor( private formService: QuestionControlService, private datepipe: DatePipe) { }

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.refundFormData.properties,
      {}
    );
    this.forrefundpage = this.fromrefund;
    console.log(this.forrefundpage);
    this.fordepositpage=this.fromrefund;
    this.refundform = formResult.form;
    this.paymentform.emit(this.refundform);
    this.questions = formResult.questions;
    this.today = new Date();
    console.log(this.paymentform);
    this.refundform.controls["chequeissuedate"].setValue(this.today);
    this.refundform.controls["demandissuedate"].setValue(this.today);
    console.log(this.forrefundpage);
  }

}
