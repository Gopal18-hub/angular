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
        required: true
      },
      remarks: {
        // title: "Remarks",
        type: "textarea",
        required: true
      },
      mobileno: {
        title: "Mobile Number",
        type: "tel",
        required: true
      },
      sendtowhatsapp:{
        type: "checkbox",
        options: [{ title: "Send bill to WhatsApp" }],
        disabled: true
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
    if(this.data.mail = 'info@maxhealthcare.com')
    {
      this.sendMailForm.controls['mailid'].setValue('');
    }
    else{
      this.sendMailForm.controls['mailid'].setValue(this.data.mail);
    }
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
  remarksclick()
  {
    this.sendMailForm.controls['remarks'].setValue('As per patient’s request');
  }
}
