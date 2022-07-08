import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatTabChangeEvent } from "@angular/material/tabs";
import { BillingForm } from "@core/constants/BillingForm";
import { QuestionControlService } from "../../../../../../shared/ui/dynamic-forms/service/question-control.service";
@Component({
  selector: "payment-methods",
  templateUrl: "./payment-methods.component.html",
  styleUrls: ["./payment-methods.component.scss"],
})
export class PaymentMethodsComponent implements OnInit {
  @Input() config: any;
  @Output() paymentform: EventEmitter<FormGroup> = new EventEmitter();

  refundFormData = BillingForm.refundFormData;
  refundform!: FormGroup;
  questions: any;
  today: any;
  constructor(private formService: QuestionControlService) {}

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
  }

  tabChanged(event: MatTabChangeEvent) {
    console.log(event);
    this.refundform.reset();
    this.refundform.controls["chequeissuedate"].setValue(this.today);
    this.refundform.controls["demandissuedate"].setValue(this.today);
  }
}
