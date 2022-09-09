import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";

import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";

@Component({
  selector: "out-patients-monthly-op-consultation-report",
  templateUrl: "./monthly-op-consultation-report.component.html",
  styleUrls: ["./monthly-op-consultation-report.component.scss"],
})
export class MonthlyOpConsultationReportComponent implements OnInit {
  OpConsultformData = {
    title: "",
    type: "object",
    properties: {
      fromdate: {
        title: "",
        type: "date",
        maximum: new Date(),
        defaultValue: new Date(),
      },
      todate: {
        title: "",
        type: "date",
        maximum: new Date(),
        defaultValue: new Date(),
      },
      Location: {
        title: "",
        type: "dropdown",
        required: true,
        placeholder: "--Select--",
      },
    },
  };
  OpConsultform!: FormGroup;
  questions: any;
  constructor(private formService: QuestionControlService) {}

  ngOnInit(): void {
    let formResult = this.formService.createForm(
      this.OpConsultformData.properties,
      {}
    );
    this.OpConsultform = formResult.form;
    this.questions = formResult.questions;
  }
}
