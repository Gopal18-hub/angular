import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiConstants } from '@core/constants/ApiConstants';
import { sendotpforpatientrefund } from '@core/models/patientsaveotprefunddetailModel.Model';
import { savepatientRefunddetailModel } from '@core/models/savepatientRefundDetailModel.Model';
import { PatientDepositCashLimitLocationDetail } from '@core/types/depositcashlimitlocation.Interface';
import { PaymentMethodsComponent } from '@core/UI/billing/submodules/payment-methods/payment-methods.component';
import { CookieService } from '@shared/services/cookie.service';
import { HttpService } from '@shared/services/http.service';
import { QuestionControlService } from '@shared/ui/dynamic-forms/service/question-control.service';
import { MessageDialogService } from '@shared/ui/message-dialog/message-dialog.service';
import { Subject, takeUntil } from 'rxjs';
import { MakedepositDialogComponent } from '../../deposit/makedeposit-dialog/makedeposit-dialog.component';
import { billDetailService } from '../billDetails.service';
@Component({
  selector: 'out-patients-payment-dialog',
  templateUrl: './payment-dialog.component.html',
  styleUrls: ['./payment-dialog.component.scss']
})
export class PaymentDialogComponent implements OnInit {

  dueFormData = {
    title: "",
    type: "object",
    properties: {         
      onlinepaymentreq: {
        type: "checkbox",
        options: [{ title: "Online Payment Request" }],
      }, 
      paymenttype: {
        type: "dropdown",
        placeholder: "Online Payment Type"
      }
    },
  };
  dueform!: FormGroup;
  questions: any;

  hsplocationId:any =  Number(this.cookie.get("HSPLocationId"));
  stationId:any = Number(this.cookie.get("StationId"));
  operatorID:any =  Number(this.cookie.get("UserId"));
  depositcashlimitationdetails: any;
  private readonly _destroying$ = new Subject<void>();

  @ViewChild(PaymentMethodsComponent) paymentmethod! : PaymentMethodsComponent;

  config = {
    paymentmethod: {
      cash: true,
      cheque: true,
      credit: true,
      demand: true,
      onlinepayment: true,
    },
    combopayment: true
  }
  duelabel: any;
  billamount: any = 0;
  prepaidamount: any = 0;
  depositamount: any = 0;
  discountamount: any = 0;
  due: any = 0;
  totaldue: any = 0;
  finalamount: number = 0;
  constructor(
    public matDialog: MatDialog, 
    private formService: QuestionControlService, 
    @Inject(MAT_DIALOG_DATA) private data: any, 
    private messageDialogService: MessageDialogService,
    private cookie: CookieService,  
    private dialogRef: MatDialogRef<PaymentDialogComponent>,
    private http: HttpService,
    private datepipe: DatePipe,
    private billDetailService: billDetailService
  ) { }

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.dueFormData.properties,
      {}
    );
    console.log(this.data);
    if(this.data.flag == 'companyDue')
    {
      this.duelabel = 'Company Due';
      this.due = this.billDetailService.patientbilldetaillist.billDetialsForRefund_DepositRefundAmountDetail[0].companyPaidAmt;
    }
    else if(this.data.flag == 'patientDue')
    {
      this.duelabel = 'Patient Due';
      this.due = this.billDetailService.patientbilldetaillist.billDetialsForRefund_DepositRefundAmountDetail[0].companyPaidAmt;
    }
    this.dueform = formResult.form;
    this.questions = formResult.questions;
    this.getdepositcashlimit();
    // this.patientIdentityInfo = { type: "Refund", patientinfo: this.data.patientinfo };
    this.billamount = this.billDetailService.patientbilldetaillist.billDetialsForRefund_DepositRefundAmountDetail[0].billamount;
    this.prepaidamount = this.billDetailService.patientbilldetaillist.billDetialsForRefund_DepositRefundAmountDetail[0].collectedamount;
    this.depositamount = this.billDetailService.patientbilldetaillist.billDetialsForRefund_DepositRefundAmountDetail[0].depositamount;
    this.discountamount = this.billDetailService.patientbilldetaillist.billDetialsForRefund_DepositRefundAmountDetail[0].discountamount;
    this.totaldue = this.due;
  }
  ngAfterViewInit(): void{   
    console.log(this.paymentmethod.refundform);
    this.paymentmethod.refundform.controls['cashamount'].valueChanges.subscribe(res => {
      console.log(res);
      this.adddueamount(res);
    })
    
  }
  adddueamount(amount: number)
  {
    this.finalamount += amount;
    console.log(this.finalamount);
  }
  clear()
  {
    this._destroying$.next(undefined);
    this._destroying$.complete();
    this.dueform.reset();
  }
  
  getdepositcashlimit(){
    this.http
    .get(ApiConstants.getcashlimitwithlocationsmsdetailsoflocation(this.hsplocationId))
    .pipe(takeUntil(this._destroying$))
    .subscribe((resultData: PatientDepositCashLimitLocationDetail) => {
      this.depositcashlimitationdetails = resultData.cashLimitOfLocation;
      console.log(resultData);
    });
  }

}
