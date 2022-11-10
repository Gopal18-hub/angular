import { Component, Inject, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
@Component({
  selector: "out-patients-gst-tax",
  templateUrl: "./gst-tax.component.html",
  styleUrls: ["./gst-tax.component.scss"],
})
export class GstTaxComponent implements OnInit {
  config: any = {
    actionItems: false,
    //dateformat: 'dd/MM/yyyy',
    selectBox: false,
    displayedColumns: ["service", "percentage", "value"],
    clickedRows: true,
    clickSelection: "single",
    columnsInfo: {
      service: {
        title: "Service",
        type: "string",
      },
      percentage: {
        title: "Percentage",
        type: "string",
      },
      value: {
        title: "Value",
        type: "string",
      },
    },
  };
  gstTaxFormData = {
    title: "",
    type: "object",
    properties: {
      saccode: {
        type: "string",
        readonly: true,
      },
    },
  };
  gstTaxForm!: FormGroup;
  question: any;
  constructor(
    private formService: QuestionControlService,
    public dialogRef: MatDialogRef<GstTaxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.gstTaxFormData.properties,
      {}
    );
    this.gstTaxForm = formResult.form;
    this.question = formResult.questions;
    this.gstTaxForm.controls["saccode"].setValue(this.data.saccode);
  }
}
