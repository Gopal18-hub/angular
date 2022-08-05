import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";

@Component({
  selector: "out-patients-health-checkups",
  templateUrl: "./health-checkups.component.html",
  styleUrls: ["./health-checkups.component.scss"],
})
export class HealthCheckupsComponent implements OnInit {
  formData = {
    title: "",
    type: "object",
    properties: {
      healthCheckup: {
        type: "dropdown",
      },
    },
  };
  formGroup!: FormGroup;
  questions: any;

  @ViewChild("table") tableRows: any;
  data: any = [];
  config: any = {
    clickedRows: false,
    actionItems: false,
    dateformat: "dd/MM/yyyy",
    selectBox: false,
    displayedColumns: ["sno", "healthCheckups", "price"],
    columnsInfo: {
      sno: {
        title: "S.No",
        type: "number",
      },
      healthCheckups: {
        title: "Health Checkups",
        type: "string",
      },
      price: {
        title: "Price",
        type: "number",
      },
    },
  };

  constructor(private formService: QuestionControlService) {}

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.formData.properties,
      {}
    );
    this.formGroup = formResult.form;
    this.questions = formResult.questions;
  }
}
