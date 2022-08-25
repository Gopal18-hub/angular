import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { DynamicFormQuestionComponent } from "@shared/ui/dynamic-forms/dynamic-form-question.component";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";

@Component({
  selector: "out-patients-configure-ris",
  templateUrl: "./configure-ris.component.html",
  styleUrls: ["./configure-ris.component.scss"],
})
export class ConfigureRisComponent implements OnInit {
  questions: any;
  risconfigureform!: FormGroup;
  config: any = {
    actionItems: false,
    /// dateformat: "dd/MM/yyyy",
    clickedRows: false,
    selectBox: true,
    // selectCheckBoxPosition: 10,
    clickSelection: "single",
    displayedColumns: [
      "testname",
      "ssn",
      "orderdate",
      "ordertime",
      "messagestatus",
    ],
    columnsInfo: {
      testname: {
        title: "Test Name",
        type: "string",
        style: {
          width: "7rem",
        },
        tooltipColumn: "testname",
      },
      ssn: {
        title: "SSN",
        type: "string",
        style: {
          width: "6rem",
        },
        tooltipColumn: "ssn",
      },
      orderdate: {
        title: "Order Date",
        type: "string",
        style: {
          width: "5.5rem",
        },
        tooltipColumn: "orderdate",
      },
      ordertime: {
        title: "Order Time",
        type: "string",
        style: {
          width: "5rem",
        },
        tooltipColumn: "ordertime",
      },
      messagestatus: {
        title: "Message Status",
        type: "string",
        style: {
          width: "5rem",
        },
        tooltipColumn: "messagestatus",
      },
    },
  };
  constructor(private formService: QuestionControlService) {}
  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.risconfigureformData.properties,
      {}
    );
    this.risconfigureform = formResult.form;
    this.questions = formResult.questions;
  }
  risconfigureformData = {
    title: "",
    type: "object",
    properties: {
      billno: {
        type: "string",
      },
    },
  };
}
