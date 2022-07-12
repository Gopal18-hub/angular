import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { QuestionControlService } from "../../../../../../shared/ui/dynamic-forms/service/question-control.service";
import { BillingForm } from "@core/constants/BillingForm";

@Component({
  selector: "max-service-deposit",
  templateUrl: "./service-deposit.component.html",
  styleUrls: ["./service-deposit.component.scss"],
})
export class ServiceDepositComponent implements OnInit {
  @Input() refundPage!: boolean;
  @Output() eventemitter: EventEmitter<FormGroup> =
    new EventEmitter<FormGroup>();
  servicedepositformData = BillingForm.servicedepositFormData;
  servicedepositForm!: FormGroup;
  questions: any;
  onRefundpage: boolean = false;
  servicetype: string = "Service Type";
  deposithead: string = "Deposit Head";

  constructor(private formService: QuestionControlService) {}

  ngOnInit(): void {
    let formResult = this.formService.createForm(
      this.servicedepositformData.properties,
      {}
    );
    this.servicedepositForm = formResult.form;
    this.questions = formResult.questions;

    this.onRefundpage = this.refundPage;
    this.eventemitter.emit(this.servicedepositForm);
  }
}
