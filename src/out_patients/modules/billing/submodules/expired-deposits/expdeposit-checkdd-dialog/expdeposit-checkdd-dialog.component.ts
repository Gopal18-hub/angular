import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";
@Component({
  selector: "out-patients-expdeposit-checkdd-dialog",
  templateUrl: "./expdeposit-checkdd-dialog.component.html",
  styleUrls: ["./expdeposit-checkdd-dialog.component.scss"],
})
export class ExpdepositCheckddDialogComponent implements OnInit {
  CheckDDFormData = {
    type: "object",
    title: "",
    properties: {
      checkdd: {
        title: "",
        type: "string",
        placeholder: "Cheque Number",
      },
    },
  };
  CheckDDForm!: FormGroup;
  questions: any;
  constructor(private formService: QuestionControlService) {}

  ngOnInit(): void {
    let formResult = this.formService.createForm(
      this.CheckDDFormData.properties,
      {}
    );
    this.CheckDDForm = formResult.form;
    this.questions = formResult.questions;
  }
}
