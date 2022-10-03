import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { QuestionControlService } from '@shared/ui/dynamic-forms/service/question-control.service';

@Component({
  selector: 'out-patients-send-mail-dialog',
  templateUrl: './send-mail-dialog.component.html',
  styleUrls: ['./send-mail-dialog.component.scss']
})
export class SendMailDialogComponent implements OnInit {

  sendMailData = {
    title: "",
    type: "object",
    properties: {
      mailid: {
        title: "Enter Email id of the Patient",
        type: "string",
      },
      remarks: {
        title: "Remarks",
        type: "textarea",
      },
      mobileno: {
        title: "Mobile Number",
        type: "string",
      },
      sendtowhatsapp:{
        type: "checkbox",
        options: [{ title: "Send bill to WhatsApp" }],
      }

    },
  };
  sendMailForm!: FormGroup;
  question: any;
  constructor(
    private formService: QuestionControlService
  ) { }

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.sendMailData.properties,
      {}
    );
    this.sendMailForm = formResult.form;
    this.question = formResult.questions;
  }

}
