import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";

@Component({
  selector: "out-patients-configure-lims",
  templateUrl: "./configure-lims.component.html",
  styleUrls: ["./configure-lims.component.scss"],
})
export class ConfigureLimsComponent implements OnInit {
  questions: any;
  limsconfigureform!: FormGroup;
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
          width: "5rem",
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
          width: "9rem",
        },
        tooltipColumn: "ordertime",
      },
      messagestatus: {
        title: "Message Status",
        type: "string",
        style: {
          width: "9.5rem",
        },
        tooltipColumn: "messagestatus",
      },
    },
  };
  constructor(private formService: QuestionControlService) {}
  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.limsconfigureformData.properties,
      {}
    );
    this.limsconfigureform = formResult.form;
    this.questions = formResult.questions;
  }
  limsconfigureformData = {
    title: "",
    type: "object",
    properties: {
      billno: {
        type: "string",
      },
    },
  };
}
