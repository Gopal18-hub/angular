import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { QuestionControlService } from '@shared/ui/dynamic-forms/service/question-control.service';
@Component({
  selector: 'out-patients-print-refund-receipt-dialog',
  templateUrl: './print-refund-receipt-dialog.component.html',
  styleUrls: ['./print-refund-receipt-dialog.component.scss']
})
export class PrintRefundReceiptDialogComponent implements OnInit {
  printrefundFormData = {
    title: "",
    type: "object",
    properties: {
      receiptNumber: {
        type: "dropdown",
        placeholder: "---Select---"
      }
    },
  };
  printrefundform!: FormGroup;
  questions: any;
  constructor(
    private formService: QuestionControlService
  ) { }

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.printrefundFormData.properties,
      {}
    );
    this.printrefundform = formResult.form;
    this.questions = formResult.questions;
  }

}
