import { Component, Input, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { QuestionControlService } from "../../../../../../shared/ui/dynamic-forms/service/question-control.service";

@Component({
  selector: "max-service-deposit",
  templateUrl: "./service-deposit.component.html",
  styleUrls: ["./service-deposit.component.scss"],
})
export class ServiceDepositComponent implements OnInit {
  @Input() refundPage!: boolean;
  servicedepositformData = {
    type: "object",
    title: "",
    properties: {
      servicetype: {
        type: "autocomplete",
      },
      deposithead: {
        type: "autocomplete",
      },
    },
  };

  servicedepositForm!: FormGroup;
  questions: any;
  onRefundpage: boolean = false;

  constructor(private formService: QuestionControlService) {}

  ngOnInit(): void {
    let formResult = this.formService.createForm(
      this.servicedepositformData.properties,
      {}
    );
    this.servicedepositForm = formResult.form;
    this.questions = formResult.questions;

    this.onRefundpage = this.refundPage;
  }
}
