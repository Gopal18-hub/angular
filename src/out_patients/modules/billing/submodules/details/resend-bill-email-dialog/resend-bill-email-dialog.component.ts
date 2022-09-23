import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { QuestionControlService } from '@shared/ui/dynamic-forms/service/question-control.service';
import { Subject, takeUntil } from 'rxjs';
import { HttpService } from '@shared/services/http.service';
import { BillDetailsApiConstants } from '../BillDetailsApiConstants';
import { CookieService } from '@shared/services/cookie.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MessageDialogService } from '@shared/ui/message-dialog/message-dialog.service';
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
      },
      Onlinecheckbox: {
        type: "checkbox",
        required: false,
        options: [{ title: "Online Payment Receipt" }],
        defaultValue: 0,
      },
    },
  };
  resendbillform!: FormGroup;
  questions: any;
  private readonly _destroying$ = new Subject<void>();
  constructor(
    private formService: QuestionControlService,
    private http: HttpService,
    private cookie: CookieService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private msgdialog: MessageDialogService,
    private dialogref: MatDialogRef<ResendBillEmailDialogComponent>
  ) { }

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.resendBillFormData.properties,
      {}
    );
    this.resendbillform = formResult.form;
    this.questions = formResult.questions;
  }
  printbtn()
  {
    this.http.post(BillDetailsApiConstants.savepdfforemail, this.reqbody())
    .pipe(takeUntil(this._destroying$))
    .subscribe(res => {
      console.log(res);
      if(res == 1)
      {
        this.dialogref.close();
        this.msgdialog.success('Mail Sent Successfully');
      }
    })
  }
  req: any;
  reqbody()
  {
    this.req = {
      emailSendId: 1,
      billno: this.data.billno,
      emailID: this.resendbillform.controls['email'].value,
      mobileNo: this.resendbillform.controls['email'].value,
      onlineServiceId: 1,
      operatorId: this.cookie.get('UserId'),
      hsplocationId: this.cookie.get('HSPLocationId')
    };
    return this.req;
  }
  clearbtn()
  {
    this.resendbillform.reset();
  }
  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

}
