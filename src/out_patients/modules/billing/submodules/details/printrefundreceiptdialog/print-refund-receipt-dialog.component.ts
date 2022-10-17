import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { QuestionControlService } from '@shared/ui/dynamic-forms/service/question-control.service';
import { getrefundbillnumber } from './../../../../../core/types/billdetails/getRefundBillNumber.Interface';
import { billDetailService } from '../billDetails.service';
import { BillDetailsApiConstants } from '../BillDetailsApiConstants';
import { HttpService } from '@shared/services/http.service';
import { Subject, takeUntil } from 'rxjs';
import { ReportService } from '@shared/services/report.service';
import { CookieService } from '@shared/services/cookie.service';
import { MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'out-patients-print-refund-receipt-dialog',
  templateUrl: './print-refund-receipt-dialog.component.html',
  styleUrls: ['./print-refund-receipt-dialog.component.scss']
})
export class PrintRefundReceiptDialogComponent implements OnInit {
  getrefundbillnumber: getrefundbillnumber[] = [];
  printrefundFormData = {
    title: "",
    type: "object",
    properties: {
      receiptNumber: {
        title:'Receipt Number',
        type: "dropdown",
        required: true,
        placeholder: "---Select---",
        options: this.getrefundbillnumber
      }
    },
  };
  printrefundform!: FormGroup;
  questions: any;
  private readonly _destroying$ = new Subject<void>();
  constructor(
    private formService: QuestionControlService,
    private billDetailService: billDetailService,
    private http: HttpService,
    private reportService: ReportService,
    private cookie: CookieService,
    private dialogref: MatDialogRef<PrintRefundReceiptDialogComponent>
  ) { }

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.printrefundFormData.properties,
      {}
    );
    this.printrefundform = formResult.form;
    this.questions = formResult.questions;
    this.getrefundbillno();
  }
  getrefundbillno()
  {
    var billid = this.billDetailService.patientbilldetaillist.billDetialsForRefund_Table1[0].opBillID;
    this.http.get(BillDetailsApiConstants.getrefundbillnumber(billid))
    .pipe(takeUntil(this._destroying$))
    .subscribe((res) => {
      console.log(res);
      if(res.length > 0)
      {
        this.getrefundbillnumber = res;
        this.questions[0].options = this.getrefundbillnumber.map((l) => {
          return { title: l.rfbillno, value: l.rfbillno }
        })
        this.questions[0] = {...this.questions[0]};
      }
    })
  }
  printbtn()
  {
    this.dialogref.close();
    this.openReportModal('refundReport');
  }
  openReportModal(btnname: string) {
    this.reportService.openWindow('Refund Report - '+this.printrefundform.controls['receiptNumber'].value, btnname, {
      refundBill: this.printrefundform.controls['receiptNumber'].value,
      locationID: this.cookie.get('HSPLocationId')
    });
  }
  clearbtn()
  {
    this.printrefundform.reset();
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

}
