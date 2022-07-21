import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { BillingForm } from '@core/constants/BillingForm';
import { Subject, Observable } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { QuestionControlService } from '../../../../../../shared/ui/dynamic-forms/service/question-control.service';

@Component({
  selector: 'payment-methods',
  templateUrl: './payment-methods.component.html',
  styleUrls: ['./payment-methods.component.scss']
})
export class PaymentMethodsComponent implements OnInit {
  @Input() config: any;
  @Output() paymentform:EventEmitter<FormGroup> = new EventEmitter<FormGroup>();

  refundFormData =  BillingForm.refundFormData;
  refundform!: FormGroup;
  questions: any;
  today: any;
  constructor( private formService: QuestionControlService) { }

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
  }

  tabChanged(event:MatTabChangeEvent){
    console.log(event);
    this.refundform.controls["chequeissuedate"].setValue(this.today);
    this.refundform.controls["demandissuedate"].setValue(this.today);
    
    this.paymentform.emit(this.refundform);
    
  }

  ngAfterViewInit(): void {
    this.formEvents();
  }

  formEvents(){
    this.questions[0].elementRef.addEventListener(
      "blur",
      this.tabChanged.bind(this)
    );
  }
}
