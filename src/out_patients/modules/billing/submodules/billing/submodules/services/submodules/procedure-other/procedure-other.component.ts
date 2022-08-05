import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";

@Component({
  selector: "out-patients-procedure-other",
  templateUrl: "./procedure-other.component.html",
  styleUrls: ["./procedure-other.component.scss"],
})
export class ProcedureOtherComponent implements OnInit {
  formData = {
    title: "",
    type: "object",
    properties: {
      otherService: {
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
    displayedColumns: [
      "sno",
      "procedures",
      "qty",
      "specialisation",
      "doctorName",
      "price",
    ],
    columnsInfo: {
      sno: {
        title: "S.No",
        type: "number",
      },
      procedures: {
        title: "Procedures",
        type: "string",
      },
      qty: {
        title: "Qty",
        type: "number",
      },
      specialisation: {
        title: "Specialisation",
        type: "string",
      },
      doctorName: {
        title: "Doctor Name",
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
