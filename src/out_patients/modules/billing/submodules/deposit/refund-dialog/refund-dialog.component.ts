import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { QuestionControlService } from "../../../../../../shared/ui/dynamic-forms/service/question-control.service";


@Component({
  selector: 'out-patients-refund-dialog',
  templateUrl: './refund-dialog.component.html',
  styleUrls: ['./refund-dialog.component.scss']
})
export class RefundDialogComponent implements OnInit {

  refundFormData = {
    title: "",
    type: "object",
    properties: {
      dropdown: {
        type: "autocomplete",
      },
      text: {
        type: "string"
      },
      checkbox: {
        type: "checkbox",
        options: [{
          title: ''
        }]
      },
       payable_name: {
         type: "string",
         title: "Payable Name"
       },
       remarks: {
         type: "textarea",
         title: "Remarks"
       },
       amount: {
         type: "string"
       },
       cardvalidate: {
        type: "radio",
        required: false,
        options: [
          { title: "Yes", value: "yes" },
          { title: "No", value: "no" }
        ]
      },
    },
  };
  refundform!: FormGroup;
  questions: any;
  constructor( private formService: QuestionControlService) { }

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.refundFormData.properties,
      {}
    );
    this.refundform = formResult.form;
    this.questions = formResult.questions;
  }

}
