import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { getduereceiptnumber } from '@core/types/billdetails/getDueReceiptNumber.Interface';
import { CookieService } from '@shared/services/cookie.service';
import { HttpService } from '@shared/services/http.service';
import { ReportService } from '@shared/services/report.service';
import { QuestionControlService } from '@shared/ui/dynamic-forms/service/question-control.service';
import { Subject, takeUntil } from 'rxjs';
import { billDetailService } from '../billDetails.service';
import { BillDetailsApiConstants } from '../BillDetailsApiConstants';
@Component({
  selector: 'out-patients-printduereceipt',
  templateUrl: './printduereceipt.component.html',
  styleUrls: ['./printduereceipt.component.scss']
})
export class PrintduereceiptComponent implements OnInit {

  printdueFormData = {
    title: "",
    type: "object",
    properties: {
      receiptNumber: {
        type: "autocomplete",
        title: "Receipt Number",
        placeholder: "---Select---",
        required: true,
        options: []
      }
    },
  };
  printdueform!: FormGroup;
  questions: any;
  private readonly _destroying$ = new Subject<void>();
  receiptnumberList: getduereceiptnumber [] = [];
  constructor(
    private formService: QuestionControlService,
    private http: HttpService,
    private reportService: ReportService,
    private cookie: CookieService,
    private dialogref: MatDialogRef<PrintduereceiptComponent>,
    private billDetailService: billDetailService
  ) { 
    let formResult: any = this.formService.createForm(
      this.printdueFormData.properties,
      {}
    );
    this.printdueform = formResult.form;
    this.questions = formResult.questions;
    this.getreceiptnumber();
  }

  ngOnInit(): void {
    
  }
  ngAfterViewInit(): void{
    this.printdueform.controls['receiptNumber'].markAsDirty();
  }
  getreceiptnumber()
  {
    var billno = this.billDetailService.patientbilldetaillist.billDetialsForRefund_DepositRefundAmountDetail[0].billno;
    this.http.get(BillDetailsApiConstants.getduereceiptnumber(billno))
    .pipe(takeUntil(this._destroying$))
    .subscribe((res) => {
      console.log(res);
      this.receiptnumberList = res;
      this.questions[0].options = this.receiptnumberList.map((l) => {
        return { title: l.recNumber, value: l.recNumber}
      })
      this.questions[0] = {...this.questions[0]};
    })
  }
  printbtn()
  {
    this.dialogref.close();
    this.openReportModal('DueReceiptReport');
  }
  openReportModal(btnname: string) {
    this.reportService.openWindow('Due Receipt Report - '+this.printdueform.controls['receiptNumber'].value.value, btnname, {
      receiptnumber: this.printdueform.controls['receiptNumber'].value.value,
      locationID: this.cookie.get('HSPLocationId'),
    });
  }
  clearbtn()
  {
    this.printdueform.reset();
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

}
