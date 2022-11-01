import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { QuestionControlService } from '@shared/ui/dynamic-forms/service/question-control.service';
import { HttpService } from '@shared/services/http.service';
import { BillingApiConstants } from '../../BillingApiConstant';
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
    private formService: QuestionControlService,
    public dialogRef: MatDialogRef<SendMailDialogComponent>,
    public matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpService
  ) 
  { 
    console.log(data);
  }

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.sendMailData.properties,
      {}
    );
    this.sendMailForm = formResult.form;
    this.question = formResult.questions;
    this.sendMailForm.controls['mailid'].setValue(this.data.mail);
    this.sendMailForm.controls['mobileno'].setValue(this.data.mobile);
  }
  savebtn()
  {
    this.http.post(BillingApiConstants.sendemailalerttoservice(
      Number(this.data.billid),
      this.sendMailForm.controls['mailid'].value,
      this.sendMailForm.controls['remarks'].value
    ),'')
    .subscribe(res => {
      console.log(res);
      if(res.success == true)
      {
        this.dialogRef.close('close');
      }
    })
  }
  cancelbtn()
  {
    this.dialogRef.close('close');
  }
}
