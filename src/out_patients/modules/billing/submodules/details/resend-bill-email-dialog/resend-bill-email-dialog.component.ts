import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { QuestionControlService } from '@shared/ui/dynamic-forms/service/question-control.service';
import { Subject, takeUntil } from 'rxjs';
import { HttpService } from '@shared/services/http.service';
import { BillDetailsApiConstants } from '../BillDetailsApiConstants';
import { CookieService } from '@shared/services/cookie.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MessageDialogService } from '@shared/ui/message-dialog/message-dialog.service';
import { billDetailService } from '../billDetails.service';
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
        type: "string",
        required: true,
      },
      mobileno: {
        type: "tel",
        required: true,
      },
      Onlinecheckbox: {
        type: "checkbox",
        required: true,
        options: [{ title: "Online Payment Receipt" }],
        defaultValue: 0,
      },
    },
  };
  resendbillform!: FormGroup;
  questions: any;
  private readonly _destroying$ = new Subject<void>();
  PDFwillSend: any;
  constructor(
    private formService: QuestionControlService,
    private http: HttpService,
    private cookie: CookieService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private msgdialog: MessageDialogService,
    private dialogref: MatDialogRef<ResendBillEmailDialogComponent>,
    public service: billDetailService
  ) { }

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.resendBillFormData.properties,
      {}
    );
    this.resendbillform = formResult.form;
    this.questions = formResult.questions;
    if(this.service.patientbilldetaillist.billDetialsForRefund_IdName.length > 0)
    {
      console.log(this.service.patientbilldetaillist.billDetialsForRefund_IdName)
      this.questions[0].options = this.service.patientbilldetaillist.billDetialsForRefund_IdName.map((l: any) => {
        return { title: l.name, value: l.id}
      })
      this.questions[0] = {...this.questions[0]};
    }
    if(this.service.patientbilldetaillist.billDetialsForRefund_EmailMobile.length > 0)
    {
      this.resendbillform.controls['email'].setValue(this.service.patientbilldetaillist.billDetialsForRefund_EmailMobile[0].emailId);
      this.resendbillform.controls['mobileno'].setValue(this.service.patientbilldetaillist.billDetialsForRefund_EmailMobile[0].mobileNo);
      this.PDFwillSend = this.service.patientbilldetaillist.billDetialsForRefund_EmailMobile[0].id;
      this.resendbillform.markAsDirty();
    }
    else
    {
      this.PDFwillSend = 0;
    }
  }
  printbtn()
  {
    if(this.resendbillform.controls['Onlinecheckbox'].value == false)
    {
      this.msgdialog.info('Please select Online Payment Request option');
    }
    else{
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
  }
  req: any;
  reqbody()
  {
    this.req = {
      emailSendId: this.PDFwillSend,
      billno: this.data.billno,
      emailID: this.resendbillform.controls['email'].value,
      mobileNo: this.resendbillform.controls['mobileno'].value,
      onlineServiceId: Number(this.resendbillform.controls['onlinepayment'].value),
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
