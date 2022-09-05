import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiConstants } from '@core/constants/ApiConstants';
import { sendotpforpatientrefund } from '@core/models/patientsaveotprefunddetailModel.Model';
import { CookieService } from '@shared/services/cookie.service';
import { HttpService } from '@shared/services/http.service';
import { QuestionControlService } from '@shared/ui/dynamic-forms/service/question-control.service';
import { MessageDialogService } from '@shared/ui/message-dialog/message-dialog.service';
import { Subject, takeUntil } from 'rxjs';
import { PaymentMethodsComponent } from '../../../../../core/UI/billing/submodules/payment-methods/payment-methods.component';
import { billDetailService } from '../billDetails.service';
@Component({
  selector: 'out-patients-refund-dialog',
  templateUrl: './refund-dialog.component.html',
  styleUrls: ['./refund-dialog.component.scss']
})
export class BillDetailsRefundDialogComponent implements OnInit {

  dueFormData = {
    title: "",
    type: "object",
    properties: {         
      otp: {
        type: "string"
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
      onlinepayment: true,
      mobilepayment: true,
      upi: true
    },
    combopayment: false
  }
  duelabel: any;
  billamount: any = 0;
  prepaidamount: any = 0;
  depositamount: any = 0;
  discountamount: any = 0;
  due: any = 0;
  totaldue: any = 0;
  finalamount: number = 0;

  SendOTP: any = 'Send OTP'
  otpsenttomobile:boolean = false;
  mobileno: any;
  otpresenttomobile: boolean = false;
  ResendOTP: any = 'Send OTP to Manager';
  patientsaveotprefundDetails: sendotpforpatientrefund | undefined;
  flagto_set_btnname:number = 0;
  patientIdentityInfo:any=[];
  constructor(
    public matDialog: MatDialog, 
    private formService: QuestionControlService, 
    @Inject(MAT_DIALOG_DATA) private data: any, 
    private messageDialogService: MessageDialogService,
    private cookie: CookieService,  
    private dialogRef: MatDialogRef<BillDetailsRefundDialogComponent>,
    private http: HttpService,
    private datepipe: DatePipe,
    private billDetailService: billDetailService
  ) 
  { 
    console.log(data);
  }

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.dueFormData.properties,
      {}
    );
    this.dueform = formResult.form;
    this.questions = formResult.questions;
    this.billamount = this.billDetailService.patientbilldetaillist.billDetialsForRefund_DepositRefundAmountDetail[0].billamount.toFixed(2);
    this.prepaidamount = this.billDetailService.patientbilldetaillist.billDetialsForRefund_DepositRefundAmountDetail[0].collectedamount.toFixed(2);
    this.depositamount = this.billDetailService.patientbilldetaillist.billDetialsForRefund_DepositRefundAmountDetail[0].depositamount.toFixed(2);
    this.discountamount = this.billDetailService.patientbilldetaillist.billDetialsForRefund_DepositRefundAmountDetail[0].discountamount.toFixed(2);
    // this.due = this.due.toFixed(2);
    this.totaldue = this.due.toFixed(2);
    this.patientIdentityInfo = { type: "Refund", patientinfo: this.data.patientinfo };
  }
  ngAfterViewInit(): void{
    console.log(this.paymentmethod.refundform);
    this.paymentmethod.refundform.controls['cashamount'].setValue(this.data.refundamount);
    this.mobileno = this.data.mobile;
    console.log(this.mobileno);
    this.paymentmethod.questions[0].elementRef.addEventListener(
      'blur',
      this.paymentvalidation.bind(this)
      )
  }
  paymentvalidation(){
    console.log(this.paymentmethod.refundform.value.cashamount);
    if(this.paymentmethod.refundform.value.cashamount > this.data.refundamount)
    {
      this.paymentmethod.refundform.controls['cashamount'].setValue(this.data.refundamount);
    }
  }
  sendotpclick(){    
      this.SendOTP = "Resend OTP";
      this.otpsenttomobile = true;
      this.http
      .post(ApiConstants.sendotpoprefund, this.getPatientrefundotpdetailsRequestBody())
      .pipe(takeUntil(this._destroying$))
      .subscribe((resultData) => {
        if(resultData == 1){
          this.messageDialogService.success("OTP Sent Successfully");
          setTimeout(()=>{                           
            this.otpsenttomobile = false;
            this.otpresenttomobile = true;
        }, 60000);
        }
       console.log(resultData);
      },
      (error) => {
        console.log(error.error);
      });
  }

  resendotpclick(){
      this.ResendOTP = "Resend OTP To Manager";
      this.otpresenttomobile = false;
      this.otpsenttomobile = true;
      this.http
      .post(ApiConstants.sendotpoprefund, this.getPatientrefundotpdetailsRequestBody())
      .pipe(takeUntil(this._destroying$))
      .subscribe((resultData) => {
        if(resultData == 1){
          this.messageDialogService.success("OTP Sent Successfully");
          setTimeout(()=>{                           
            this.otpsenttomobile = false;
            this.otpresenttomobile = true;
        }, 60000);
        }
       console.log(resultData);
      },
      (error) => {
        console.log(error.error);
      });  
  }
  
  getPatientrefundotpdetailsRequestBody(): sendotpforpatientrefund{
    return (this.patientsaveotprefundDetails = new sendotpforpatientrefund(
    0,
    this.data.billno,
    this.stationId,
    this.hsplocationId,
    this.operatorID, 
    0,    
    this.datepipe.transform(Date.now(), "yyyy-MM-ddThh:mm:ss") || "{}",    
    this.data.maxid,
    "OP",
      0,
    this.flagto_set_btnname
    ));
  }
  clear()
  {
    this._destroying$.next(undefined);
    this._destroying$.complete();
    this.dueform.reset();
  }

}
