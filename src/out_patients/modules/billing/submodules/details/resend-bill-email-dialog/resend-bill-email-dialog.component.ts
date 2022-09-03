import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { QuestionControlService } from '@shared/ui/dynamic-forms/service/question-control.service';

@Component({
  selector: 'out-patients-resend-bill-email-dialog',
  templateUrl: './resend-bill-email-dialog.component.html',
  styleUrls: ['./resend-bill-email-dialog.component.scss']
})
export class ResendBillEmailDialogComponent implements OnInit {
  
  resendBillFormData = {
    title: "",
    type: "object",
    properties: {
      onlinepayment: {
        type: "dropdown",
        placeholder: "---Select---"
      },
      email: {
        type: "string"
      },
      mobileno: {
        type: "string"
      }
    },
  };
  resendbillform!: FormGroup;
  questions: any;
  constructor(
    private formService: QuestionControlService
  ) { }

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.resendBillFormData.properties,
      {}
    );
    this.resendbillform = formResult.form;
    this.questions = formResult.questions;
  }

}
