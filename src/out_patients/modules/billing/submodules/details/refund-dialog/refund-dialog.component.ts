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
import { Subject, takeUntil, throwIfEmpty } from 'rxjs';
import { PaymentMethodsComponent } from '../../../../../core/UI/billing/submodules/payment-methods/payment-methods.component';
import { billDetailService } from '../billDetails.service';
import { Router } from '@angular/router';
import { getpaymentmode } from './../../../../../core/types/billdetails/getPaymentmode.Interface';
import { BillDetailsApiConstants } from '../BillDetailsApiConstants';
import { objdt, objtab_cancelbill, saveRefundforParticularBill } from '../../../../../core/models/saveRefundforParticularBill.Model';
import { billRefundforSingleItem, objDsSave } from '../../../../../core/models/billRefundforSingleItem.Model';
import { cancelVisitNumberinRefund, objVisitDataTable } from '../../../../../core/models/cancelVisitNumberinRefund.Model';
import { refundbillafteracknowledgementforfull } from '../../../../../core/models/refundAfterAckforParticularBill.Model';
import { getBankName } from '../../../../../core/types/billdetails/getBankName.Interface';
import { getcreditcard } from '../../../../../core/types/billdetails/getcreditcard.Interface';
@Component({
  selector: 'out-patients-refund-dialog',
  templateUrl: './refund-dialog.component.html',
  styleUrls: ['./refund-dialog.component.scss'],
})
export class BillDetailsRefundDialogComponent implements OnInit {

  bankname: getBankName[] = [];
  creditcard: getcreditcard[] = [];

  dueFormData = {
    title: "",
    type: "object",
    properties: {         
    otp: {
      type: "number",
    },
    //cash
    cashamount: {
      title:"Amount",
      type: "number",
      defaultValue: "0.00",
      required: true,
    },
    //cheque
    chequemount: {
      title:"Amount",
      type: "number",
      defaultValue: "0.00",
      required: true,
    },
    chequeno: {
      title:"Cheque/NEFT No.",
      type: "number",
      required: true,
    },
    chequeissuedate: {
      title:"Issue Date",
      type: "date",
      maximum: new Date(),
      defaultValue: new Date(),
      required: true,
    },
    chequevalidity: {
      title:"Validity",
      type: "date",
      defaultValue: new Date(),
      required: true,
    },
    chequebankname: {
      title:"Bank Name",
      type: "dropdown",
      options: this.bankname,
      required: true,
    },
    chequebranchname: {
      title:"Branch Name",
      type: "string",
      required: true,
    },
     //credit
    creditamount: {
      title:"Amount",
      type: "number",
      defaultValue: "0.00",
      required: true,
    },
    creditcardtype:{
      title:"Card Type",
      type: "dropdown",
      options: this.creditcard,
      required: true,
    }, 
    creditcardno: {
      title:"Card No.",
      type: "number",
      required: true,
    },
    creditbatchno:{
      title:"Batch No.",
      type: "string",
      required: true,
    }, 
     //online
    onlineamount: {
      title:"Amount",
      type: "number",
      defaultValue: "0.00",
      required: true,
    },
    onlinetransacid: {
      title:"Transaction ID",
      type: "string",
      required: true,
    },
    onlinebookingid: {
      title:"Booking ID",
      type: "string",
      required: true,
    }, 
    //mobile
    mobileamount:{
      title:"Amount",
      type: "number",
      defaultValue: "0.00",
      required: true,
    },
    mobiletransactionid: {
      title:"Transaction ID",
      type: "string",
      required: true,
    },
    mobilemerchantid: {
      title:"Merchant ID",
      type: "string",
      required: true,
    },
     
    //upi
    upiamount : {
      title:"Amount",
      type: "number",
      defaultValue: "0.00",
      required: true,
    }, 
    upino: {
      title:"UPI No.",
      type: "number",
      required: true,
    },
    upibatchno: {
      title:"Batch No.",
      type: "string",
      required: true,
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
  @ViewChild('patientidentity') panform: any;

  selected: any = 0;
  forcash: boolean = false;
  forcheque: boolean = false;
  forcredit: boolean = false;
  fordd: boolean = false;
  formobile: boolean = false;
  foronline: boolean = false;
  forpaytm: boolean = false;
  forinternet: boolean = false;
  forupi: boolean = false;
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
  mop: any;
  SendOTP: any = 'Send OTP'
  otpsenttomobile:boolean = false;
  mobileno: any;
  otpresenttomobile: boolean = false;
  ResendOTP: any = 'Send OTP to Manager';
  patientsaveotprefundDetails: sendotpforpatientrefund | undefined;
  flagto_set_btnname:number = 0;
  patientIdentityInfo:any=[];

  simpleRefund: any = 0;
  AckRefund: any = 0;
  singleitemflag: any = 0;
  particularbillflag: any = 0;
  paymentMode: getpaymentmode[] = [];
  saveforparticularbilllist: saveRefundforParticularBill = new saveRefundforParticularBill();
  billrefundforsingleitem: billRefundforSingleItem = new billRefundforSingleItem();
  cancelVisitNumberinRefundList: cancelVisitNumberinRefund = new cancelVisitNumberinRefund();
  refundafteracklistforfull: refundbillafteracknowledgementforfull = new refundbillafteracknowledgementforfull();


  bankid: any;
  valid_date: any;
  priority: any;
  transMode: any;

  constructor(
    public matDialog: MatDialog, 
    private formService: QuestionControlService, 
    @Inject(MAT_DIALOG_DATA) private data: any, 
    private messageDialogService: MessageDialogService,
    private cookie: CookieService,  
    private dialogRef: MatDialogRef<BillDetailsRefundDialogComponent>,
    private http: HttpService,
    private datepipe: DatePipe,
    private billDetailService: billDetailService,
    private router: Router
  ) 
  { 
    console.log(data);
    console.log(data.mop);
  }

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.dueFormData.properties,
      {}
    );
    if(this.router.url.split('?')[0] == '/out-patient-billing/details/services')
    {
      this.simpleRefund = 1;
      this.AckRefund = 0;
    }
    else
    {
      this.simpleRefund = 0;
      this.AckRefund = 1;
    }
    var notcancelledlist = this.billDetailService.patientbilldetaillist.billDetialsForRefund_ServiceDetail.filter( (item: any) => {
        return item.cancelled == 0;
    })
    console.log(this.billDetailService.patientbilldetaillist.billDetialsForRefund_ServiceDetail.length);
    if(this.billDetailService.patientbilldetaillist.billDetialsForRefund_ServiceDetail.length == this.billDetailService.sendforapproval.length)
    {
      this.particularbillflag = 1;
      this.singleitemflag = 0;
    }
    else
    {
      this.particularbillflag = 0;
      this.singleitemflag = 1;
    }
    console.log(this.billDetailService.sendforapproval)
    console.log(notcancelledlist);
    console.log('Simple Refund:', this.simpleRefund,'Acknowledged Refund:', this.AckRefund);
    console.log('particular bill flag:',this.particularbillflag,'single item flag:', this.singleitemflag);
    console.log(this.router.url);
    this.dueform = formResult.form;
    this.questions = formResult.questions;
    this.billamount = this.billDetailService.patientbilldetaillist.billDetialsForRefund_DepositRefundAmountDetail[0].billamount.toFixed(2);
    this.prepaidamount = this.billDetailService.patientbilldetaillist.billDetialsForRefund_DepositRefundAmountDetail[0].collectedamount.toFixed(2);
    this.depositamount = this.billDetailService.patientbilldetaillist.billDetialsForRefund_DepositRefundAmountDetail[0].depositamount.toFixed(2);
    this.discountamount = this.billDetailService.patientbilldetaillist.billDetialsForRefund_DepositRefundAmountDetail[0].discountamount.toFixed(2);
    // this.due = this.due.toFixed(2);
    this.totaldue = this.data.refundamount;
    this.patientIdentityInfo = { patientinfo: this.data.patientinfo };
    this.getpaymentmode();
    this.getbankname();
    this.getcreditcard();
  }
  ngAfterViewInit(): void{
    
    // this.paymentmethod.refundform.controls['cashamount'].disable();
    this.mobileno = this.data.mobile;
    this.questions[0].elementRef.addEventListener(
      'blur',
      this.otpcheck.bind(this)
    )
    this.mopcheck();

    this.dueform.valueChanges.subscribe(() => {
      debugger;
      this.validationcheck();
    })
    this.panform.patientidentityform.controls['panno'].valueChanges.subscribe(() => {
      if(this.panform.patientidentityform.controls['panno'].status == "VALID")
      {
        this.submitbtnflag = false;
      }
      else{
        this.submitbtnflag = true;
      }
    })
  }
  getbankname()
  {
    this.http.get(BillDetailsApiConstants.getbankname)
    .pipe(takeUntil(this._destroying$))
    .subscribe( res => {
      console.log(res);
      this.bankname = res;
      this.questions[6].options = this.bankname.map(l => {
        return { title: l.name, value: l.id}
      })
    })
    this.questions[6] = {...this.questions[6]};
  }
  getcreditcard()
  {
    this.http.get(BillDetailsApiConstants.getcreditcard)
    .pipe(takeUntil(this._destroying$))
    .subscribe( res => {
      console.log(res);
      this.creditcard = res;
      this.questions[9].options = this.creditcard.map(l => {
        return { title: l.name, value: l.id}
      })
    })
    this.questions[9] = {...this.questions[9]};
  }
  submitbtnflag: boolean = true;
  validationcheck()
  {
    console.log(this.panform);
    //cash
    if(this.selected == 0)
    {
      this.submitbtnflag = false;
    }
    //cheque
    else if(this.selected == 1)
    {
      if(
        (this.dueform.value.chequemount != '' &&  this.dueform.value.chequemount != undefined && this.dueform.value.chequemount != null) &&
        (this.dueform.value.chequeno  != '' &&  this.dueform.value.chequeno  != undefined && this.dueform.value.chequeno != null) &&
        (this.dueform.value.chequeissuedate != '' &&  this.dueform.value.chequeissuedate != undefined && this.dueform.value.chequeissuedate != null) &&
        (this.dueform.value.chequevalidity != '' &&  this.dueform.value.chequevalidity != undefined && this.dueform.value.chequevalidity != null) &&
        (this.dueform.value.chequebankname != '' &&  this.dueform.value.chequebankname != undefined && this.dueform.value.chequebankname != null) &&
        (this.dueform.value.chequebranchname != '' &&  this.dueform.value.chequebranchname != undefined && this.dueform.value.chequebranchname != null)
      )
      {
        this.submitbtnflag = false;
      }
      else
      {
        this.submitbtnflag = true;
      }
     
    }
    //credit
    else if(this.selected == 2)
    {
      if(
        (this.dueform.value.creditamount != '' &&  this.dueform.value.creditamount != undefined && this.dueform.value.creditamount != null) &&
        (this.dueform.value.creditcardtype  != '' &&  this.dueform.value.creditcardtype  != undefined && this.dueform.value.creditcardtype != null) &&
        (this.dueform.value.creditcardno != '' &&  this.dueform.value.creditcardno != undefined && this.dueform.value.creditcardno != null) &&
        (this.dueform.value.creditbatchno != '' &&  this.dueform.value.creditbatchno != undefined && this.dueform.value.creditbatchno != null)
      )
      {
        this.submitbtnflag = false;
      }
      else
      {
        this.submitbtnflag = true;
      }
    }
    //online
    else if(this.selected == 3)
    {
      if(
        (this.dueform.value.onlineamount != '' &&  this.dueform.value.onlineamount != undefined && this.dueform.value.onlineamount != null) &&
        (this.dueform.value.onlinetransacid  != '' &&  this.dueform.value.onlinetransacid  != undefined && this.dueform.value.onlinetransacid != null) &&
        (this.dueform.value.onlinebookingid != '' &&  this.dueform.value.onlinebookingid != undefined && this.dueform.value.onlinebookingid != null)
      )
      {
        this.submitbtnflag = false;
      }
      else
      {
        this.submitbtnflag = true;
      }
    }
    //mobile
    else if(this.selected == 4)
    {
      if(
        (this.dueform.value.mobileamount != '' &&  this.dueform.value.mobileamount != undefined && this.dueform.value.mobileamount != null) &&
        (this.dueform.value.mobiletransactionid  != '' &&  this.dueform.value.mobiletransactionid  != undefined && this.dueform.value.mobiletransactionid != null) &&
        (this.dueform.value.mobilemerchantid != '' &&  this.dueform.value.mobilemerchantid != undefined && this.dueform.value.mobilemerchantid != null)
      )
      {
        this.submitbtnflag = false;
      }
      else
      {
        this.submitbtnflag = true;
      }
    }
    //upi
    else if(this.selected == 5)
    {
      if(
        (this.dueform.value.upiamount != '' &&  this.dueform.value.upiamount != undefined && this.dueform.value.upiamount != null) &&
        (this.dueform.value.upino  != '' &&  this.dueform.value.upino  != undefined && this.dueform.value.upino != null) &&
        (this.dueform.value.upibatchno != '' &&  this.dueform.value.upibatchno != undefined && this.dueform.value.upibatchno != null)
      )
      {
        this.submitbtnflag = false;
      }
      else
      {
        this.submitbtnflag = true;
      }
    }
  }
  mopcheck()
  {
    if(this.data.mop == 'Cash')
    {
      this.questions[1].elementRef.readOnly = true;
      this.dueform.controls['cashamount'].setValue(this.data.refundamount);
      setTimeout(() => {
        this.selected = 0;
      }, 300);
      this.forcheque = true;
      this.forcredit = true;
      this.foronline = true;
      this.formobile = true;
      this.forupi = true;
      this.mop = 1;
      this.submitbtnflag = false;
    }
    else if(this.data.mop == 'Cheque')
    {
      this.questions[2].elementRef.readOnly = true;
      this.dueform.controls['chequemount'].setValue(this.data.refundamount);
      setTimeout(() => {
        this.selected = 1
      }, 300);
      this.forcash = true;
      this.forcredit = true;
      this.foronline = true;
      this.formobile = true;
      this.forupi = true;
      this.mop = 2;
    }
    else if(this.data.mop == 'Credit Card')
    {
      this.questions[8].elementRef.readOnly = true;
      this.dueform.controls['creditamount'].setValue(this.data.refundamount);
      setTimeout(() => {
        this.selected = 2
      }, 300);
      this.forcheque = true;
      this.forcash = true;
      this.foronline = true;
      this.formobile = true;
      this.forupi = true;
      this.mop = 4;
    }
    else if(this.data.mop == 'Online Payment')
    {
      this.questions[12].elementRef.readOnly = true;
      this.dueform.controls['onlineamount'].setValue(this.data.refundamount);
      setTimeout(() => {
        this.selected = 3
      }, 300);
      this.forcheque = true;
      this.forcredit = true;
      this.forcash = true;
      this.formobile = true;
      this.forupi = true;
      this.mop = 7;
    }
    else if(this.data.mop == 'Mobile Payment')
    {
      this.questions[15].elementRef.readOnly = true;
      this.dueform.controls['mobileamount'].setValue(this.data.refundamount);
      setTimeout(() => {
        this.selected = 4
      }, 300);
      this.forcheque = true;
      this.forcredit = true;
      this.foronline = true;
      this.forcash = true;
      this.forupi = true;
      this.mop = 6;
    }
    else if(this.data.mop == 'UPI')
    {
      this.questions[18].elementRef.readOnly = true;
      this.dueform.controls['upiamount'].setValue(this.data.refundamount);
      setTimeout(() => {
        this.selected = 5
      }, 300);
      this.forcheque = true;
      this.forcredit = true;
      this.foronline = true;
      this.formobile = true;
      this.forcash = true;
      this.mop = 8;
    }
  }
  
  otpcheck()
  {
    console.log(this.dueform.controls['otp'].value.toString().length);
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
  submitbtn()
  {
    if(this.mop == 1)
    {
      this.submitbtncall();
    }
    else if(this.mop == 2) //cheque
    {
      if(this.dueform.controls['chequevalidity'].value < new Date())
      {
        this.messageDialogService.info('Validity Date Can not be lesser then todays date');
      }
      else if(this.dueform.controls['chequeno'].value == '')
      {
        this.messageDialogService.info('Please Enter Cheque number.')
      }
      else if(this.dueform.controls['chequebankname'].value == '')
      {
        this.messageDialogService.info('Please Enter Bank name.')
      }
      else{
        this.bankid = this.dueform.controls['chequebankname'].value;
        this.valid_date = this.dueform.controls['chequevalidity'].value;
        this.submitbtncall();
      }
    }
    else if(this.mop == 4) //credit card
    {
      if(this.dueform.controls['creditcardtype'].value == '')
      {
        this.messageDialogService.info('Please Enter Card Type.')
      }
      else if(this.dueform.controls['creditcardno'].value == '')
      {
        this.messageDialogService.info('Please Enter Card Number.')
      }
      // else if(this.dueform.controls[''].value < new Date())
      // {
      //   this.messageDialogService.info('Validity Date Can not be lesser then todays date');
      // }
      else{
        this.bankid = this.dueform.controls['creditcardtype'].value;
        this.valid_date = new Date();
        this.submitbtncall();
      }
    }
    else if(this.mop == 6) //mobile
    {
      if(this.dueform.controls['mobiletransactionid'].value == '')
      {
        this.messageDialogService.info('TransactionID cannot be blank')
      }
      else if(this.dueform.controls['mobilemerchantid'].value == '')
      {
        this.messageDialogService.info('Merchant orderID cannot be blank')
      }
      // else if(this.dueform.controls[''].value < new Date())
      // {
      //   this.messageDialogService.info('Validity Date Can not be lesser then todays date');
      // }
      else{
        this.valid_date = new Date();
        this.submitbtncall();
      }
    }
    else if(this.mop == 8) //upi
    {
      if(this.dueform.controls['upibatchno'].value == '')
      {
        this.messageDialogService.info('batchID cannot be blank')
      }
      else if(this.dueform.controls['upino'].value == '')
      {
        this.messageDialogService.info('UPI cannot be blank')
      }
      else{
        this.valid_date = new Date();
        this.submitbtncall();
      }
    }
    else if(this.mop == 7) //Online Payment
    {
      console.log('Online Paymnet - submit')
      if(this.dueform.controls['onlinetransacid'].value == '')
      {
        this.messageDialogService.info('TransactionID cannot be blank')
      }
      else if(this.dueform.controls['onlinebookingid'].value == '')
      {
        this.messageDialogService.info('BookingID cannot be blank')
      }
      else{
        this.valid_date = new Date();
        this.submitbtncall();
      }
    }
  }
  submitbtncall()
  {
    if(this.dueform.controls['otp'].value.toString().length == 0){
      this.messageDialogService.info('Enter OTP');
    } 
    else if(this.dueform.controls['otp'].value.toString().length < 4 || this.dueform.controls['otp'].value.toString().length > 4){
      this.messageDialogService.info('Invalid OTP');
    }
    if(this.simpleRefund == 1)
    {
      console.log('Before Ack');
      if(this.particularbillflag == 1 && this.singleitemflag == 0)
      {
        this.cancelvisitrequestbody();
        var result = this.getpaymentmode();
        console.log(result);
        if(result.length == 1 && this.mop == 6)
        {
          if(result[0].amount == result[0].payTmAmtCheck)
          {
            this.messageDialogService.info('Payment was made through multiple mop. Bill cannot be refunded through PayTM, Please refund through CASH');
          }
        }
        console.log('Full Bill');
        this.http.post(BillDetailsApiConstants.saverefunddetailsforparticularbill, this.fullbillrequestbody())
        .pipe(takeUntil(this._destroying$))
        .subscribe(res => {
          console.log(res);
          if(res.length > 0)
          {
            if(res[0].successFlag == true)
            {
              var dialog =  this.messageDialogService.success(res[0].returnMessage);
              dialog.afterClosed().subscribe(res => {
              this.dialogRef.close('success');
              })
            }
            else if(res[0].successFlag == false)
            {
              var dialog =  this.messageDialogService.info(res[0].returnMessage);
            }
          }
          if(res[0].successFlag == true)
          {
            if(this.billDetailService.patientbilldetaillist.billDetialsForRefund_VisitDetail.length > 0)
            {
              this.http.post(BillDetailsApiConstants.cancelvisitnumberinrefund, this.cancelvisitrequestbody())
              .pipe(takeUntil(this._destroying$))
              .subscribe(value => {
                console.log(value);
              });
            }
          }
        })
      }
      else if(this.singleitemflag == 1 && this.particularbillflag == 0)
      {
        console.log('Single Bill Item');
        this.http.post(BillDetailsApiConstants.billrefundforsingleitem, this.singlebillrequestbody())
        .pipe(takeUntil(this._destroying$))
        .subscribe(res => {
          console.log(res);
          if(res.length > 0)
          {
            if(res[0].successFlag == true)
            {
              var dialog =  this.messageDialogService.success(res[0].returnMessage);
              dialog.afterClosed().subscribe(res => {
              this.dialogRef.close('success');
              })
            }
            else if(res[0].successFlag == false)
            {
              var dialog =  this.messageDialogService.info(res[0].returnMessage);
            }
          }
          if(res[0].successFlag == true)
          {
            if(this.billDetailService.patientbilldetaillist.billDetialsForRefund_VisitDetail.length > 0)
            {
              this.http.post(BillDetailsApiConstants.cancelvisitnumberinrefund, this.cancelvisitrequestbody())
              .pipe(takeUntil(this._destroying$))
              .subscribe(value => {
                console.log(value);
              });
            }
          }
        })
      }
    }
    else if(this.AckRefund == 1)
    {
      console.log('After Ack');
      if(this.particularbillflag == 1 && this.singleitemflag == 0)
      {
        console.log('Full Bill');
        this.http.post(BillDetailsApiConstants.refundbillafteracknowledgementforfull(
          this.dueform.controls['otp'].value,
          'Gavs',
          Number(this.cookie.get('UserId')),
          Number(this.cookie.get('HSPLocationId')),
          Number(this.cookie.get('StationId'))
        ), this.fullbillafterackreqbody())
        .pipe(takeUntil(this._destroying$))
        .subscribe(res => {
          console.log(res);
          if(res.length > 0)
          {
            if(res[0].successFlag == true)
            {
              var dialog =  this.messageDialogService.success(res[0].returnMessage);
              dialog.afterClosed().subscribe(res => {
              this.dialogRef.close('success');
              })
            }
            else if(res[0].successFlag == false)
            {
              var dialog =  this.messageDialogService.info(res[0].returnMessage);
            }
          }
          if(res[0].successFlag == true)
          {
            if(this.billDetailService.patientbilldetaillist.billDetialsForRefund_VisitDetail.length > 0)
            {
              this.http.post(BillDetailsApiConstants.cancelvisitnumberinrefund, this.cancelvisitrequestbody())
              .pipe(takeUntil(this._destroying$))
              .subscribe(value => {
                console.log(value);
              });
            }
          }
        })
      }
      else if(this.singleitemflag == 1 && this.particularbillflag == 0)
      {
        console.log('Single Bill Item');
        this.http.post(BillDetailsApiConstants.billrefundforsingleitemafteracknowledgement, this.singlebillrequestbody())
        .pipe(takeUntil(this._destroying$))
        .subscribe(res => {
          console.log(res);
          if(res.length > 0)
          {
            if(res[0].successFlag == true)
            {
              var dialog =  this.messageDialogService.success(res[0].returnMessage);
              dialog.afterClosed().subscribe(res => {
              this.dialogRef.close('success');
              })
            }
            else if(res[0].successFlag == false)
            {
              var dialog =  this.messageDialogService.info(res[0].returnMessage);
            }
          }
          if(res[0].successFlag == true)
          {
            if(this.billDetailService.patientbilldetaillist.billDetialsForRefund_VisitDetail.length > 0)
            {
              this.http.post(BillDetailsApiConstants.cancelvisitnumberinrefund, this.cancelvisitrequestbody())
              .pipe(takeUntil(this._destroying$))
              .subscribe(value => {
                console.log(value);
              });
            }
          }
        })
      }
    }
  }
  getpaymentmode()
  {
    this.http.get(BillDetailsApiConstants.getpaymentmode(this.data.billno, this.cookie.get('StationId')))
    // this.http.get(BillDetailsApiConstants.getpaymentmode('HBCS882543', 1))
    .pipe(takeUntil(this._destroying$))
    .subscribe(res => {
      console.log(res);
      this.paymentMode = res;
    })
    return this.paymentMode;
  }
  fullbillrequestbody()
  {
    this.saveforparticularbilllist.objtab_cancelbill = [] as Array<objtab_cancelbill>;
    this.saveforparticularbilllist.objdt = [] as Array<objdt>;
    this.billDetailService.sendforapproval.forEach((item: any) => {
      console.log(item);
      var dtlist = this.billDetailService.serviceList.filter((i: any) => {
        return i.itemid == item.itemid;
      }) 
      this.saveforparticularbilllist.otp = this.dueform.controls['otp'].value;
      this.saveforparticularbilllist.hostName = "Gavs";
      this.saveforparticularbilllist.objtab_cancelbill.push({
        billno: this.data.billno,
        operatorid: Number(this.cookie.get('UserId')),
        hsplocationid: Number(this.cookie.get('HSPLocationId')),
        registrationno: this.data.maxid.split('.')[1],
        mop: this.mop,
        authorisedby: this.data.authby,
        reason: this.data.reasonname,
        chequeno: this.dueform.controls['chequeno'].value,
        chequedate: this.dueform.controls['chequeissuedate'].value,
        bankid: this.bankid,
        branchname: this.dueform.controls['chequebranchname'].value,
        validity: this.valid_date,
        cardtype: Number(this.dueform.controls['creditcardtype'].value),
        approvalno: this.dueform.controls['creditbatchno'].value,
        stationid: Number(this.cookie.get('StationId')),
        itemid: item.itemid,
        orderid: item.itemOrderId,
        serviceid: item.serviceId,
        qtslno: dtlist[0].qTslno,
        itemName: item.itemName,
        iaCode: this.data.maxid.split('.')[0],
        transMode: this.billDetailService.patientbilldetaillist.billDetialsForRefund_ServiceItemItemIDPriorityID.length>0? Number(this.billDetailService.patientbilldetaillist.billDetialsForRefund_ServiceItemItemIDPriorityID[0].transportationMode): 0,
        priority: this.billDetailService.patientbilldetaillist.billDetialsForRefund_ServiceItemItemIDPriorityID.length>0? Number(this.billDetailService.patientbilldetaillist.billDetialsForRefund_ServiceItemItemIDPriorityID[0].priority): 0,
      })
      console.log(dtlist);
      this.saveforparticularbilllist.objdt.push({
        serviceid: item.serviceId,
        itemid: item.itemid,
        servicename: item.serviceName,
        itemname: item.itemName,
        amount: Number(dtlist[0].amount),
        discountamount: Number(dtlist[0].discountamount),
        cancelled: 0,
        orderid: dtlist[0].orderid,
        qTslno: dtlist[0].qTslno,
        planAmount: Number(dtlist[0].planAmount),
        planDesc: dtlist[0].planDesc,
        orderType: dtlist[0].orderType,
        cancelitem: dtlist[0].cancelitem,
        id: dtlist[0].id,
        visitid: dtlist[0].visitid,
        visitNo: dtlist[0].visitNo,
        requestToApproval: dtlist[0].requestToApproval
      })
    })
    console.log(this.saveforparticularbilllist);
    return this.saveforparticularbilllist;
  }
  singlebillrequestbody()
  {
    this.billrefundforsingleitem.objDsSave = new objDsSave();
    this.billrefundforsingleitem.objDsSave.objtab_cancelbill = [] as Array<objtab_cancelbill>;
    this.billrefundforsingleitem.objDsSave.objdt = [] as Array<objdt>;
    this.billDetailService.sendforapproval.forEach((item: any) => {
      console.log(item);
      var dtlist = this.billDetailService.serviceList.filter((i: any) => {
        return i.itemid == item.itemid;
      }) 
      this.billrefundforsingleitem.otp = this.dueform.controls['otp'].value;
      this.billrefundforsingleitem.hostName = "Gavs";
      this.billrefundforsingleitem.locationId = Number(this.cookie.get('HSPLocationId'));
      this.billrefundforsingleitem.operatorId = Number(this.cookie.get('UserId'));
      this.billrefundforsingleitem.stationId = Number(this.cookie.get('StationId'));
      this.billrefundforsingleitem.amount = this.billDetailService.totalrefund;
      this.billrefundforsingleitem.decDiscountAmount = Number(dtlist[0].discountamount);
      this.billrefundforsingleitem.objDsSave.objtab_cancelbill.push({
        billno: this.data.billno,
        operatorid: Number(this.cookie.get('UserId')),
        hsplocationid: Number(this.cookie.get('HSPLocationId')),
        registrationno: this.data.maxid.split('.')[1],
        mop: this.mop,
        authorisedby: this.data.authby,
        reason: this.data.reasonname,
        chequeno: this.dueform.controls['chequeno'].value,
        chequedate: this.dueform.controls['chequeissuedate'].value,
        bankid: this.bankid,
        branchname: this.dueform.controls['chequebranchname'].value,
        validity: this.valid_date,
        cardtype: Number(this.dueform.controls['creditcardtype'].value),
        approvalno: this.dueform.controls['creditbatchno'].value,
        stationid: Number(this.cookie.get('StationId')),
        itemid: item.itemid,
        orderid: item.itemOrderId,
        serviceid: item.serviceId,
        qtslno: dtlist[0].qTslno,
        itemName: item.itemName,
        iaCode: this.data.maxid.split('.')[0],
        transMode: this.billDetailService.patientbilldetaillist.billDetialsForRefund_ServiceItemItemIDPriorityID.length>0? Number(this.billDetailService.patientbilldetaillist.billDetialsForRefund_ServiceItemItemIDPriorityID[0].transportationMode): 0,
        priority: this.billDetailService.patientbilldetaillist.billDetialsForRefund_ServiceItemItemIDPriorityID.length>0? Number(this.billDetailService.patientbilldetaillist.billDetialsForRefund_ServiceItemItemIDPriorityID[0].priority): 0,
      })
      console.log(dtlist);
      this.billrefundforsingleitem.objDsSave.objdt.push({
        serviceid: item.serviceId,
        itemid: item.itemid,
        servicename: item.serviceName,
        itemname: item.itemName,
        amount: Number(dtlist[0].amount),
        discountamount: Number(dtlist[0].discountamount),
        cancelled: 0,
        orderid: dtlist[0].orderid,
        qTslno: dtlist[0].qTslno,
        planAmount: Number(dtlist[0].planAmount),
        planDesc: dtlist[0].planDesc,
        orderType: dtlist[0].orderType,
        cancelitem: dtlist[0].cancelitem,
        id: dtlist[0].id,
        visitid: dtlist[0].visitid,
        visitNo: dtlist[0].visitNo,
        requestToApproval: dtlist[0].requestToApproval
      })
    })
    console.log(this.billrefundforsingleitem);
    return this.billrefundforsingleitem;
  }
  cancelvisitrequestbody()
  {
    var dtlist;
    this.billDetailService.sendforapproval.forEach((item: any) => {
      console.log(item);
      dtlist = this.billDetailService.serviceList.filter((i: any) => {
        return i.itemid == item.itemid;
      }) 
    });
    this.cancelVisitNumberinRefundList.objVisitDataTable = [] as Array<objVisitDataTable>;
    this.billDetailService.patientbilldetaillist.billDetialsForRefund_VisitDetail.forEach((item: any) => {
      this.cancelVisitNumberinRefundList.cancelReasonID = Number(this.data.reasonid);
      this.cancelVisitNumberinRefundList.operatorID = Number(this.cookie.get('UserId'));
      this.cancelVisitNumberinRefundList.locationId = Number(this.cookie.get('HSPLocationId'));
      this.cancelVisitNumberinRefundList.objVisitDataTable.push({
        id: item.id,
        visitId: 0,
        visitno: item.visitNo,
        deleted: 1,
        ssn: this.billDetailService.patientbilldetaillist.billDetialsForRefund_Table0[0].ssn,
        uhid: this.billDetailService.patientbilldetaillist.billDetialsForRefund_Table0[0].uhid,
        registrationno : this.billDetailService.patientbilldetaillist.billDetialsForRefund_Table0[0].uhid.split('.')[1]
      })
    })
    console.log(this.cancelVisitNumberinRefundList);
    return this.cancelVisitNumberinRefundList;
  }
  fullbillafterackreqbody()
  {
    this.refundafteracklistforfull.objtab_cancelbill = [] as Array<objtab_cancelbill>;
    this.billDetailService.sendforapproval.forEach((item: any) => {
      console.log(item);
      var dtlist = this.billDetailService.serviceList.filter((i: any) => {
        return i.itemid == item.itemid;
      }) 
      this.refundafteracklistforfull.objtab_cancelbill.push({
        billno: this.data.billno,
        operatorid: Number(this.cookie.get('UserId')),
        hsplocationid: Number(this.cookie.get('HSPLocationId')),
        registrationno: this.data.maxid.split('.')[1],
        mop: this.mop,
        authorisedby: this.data.authby,
        reason: this.data.reasonname,
        chequeno: this.dueform.controls['chequeno'].value,
        chequedate: this.dueform.controls['chequeissuedate'].value,
        bankid: this.bankid,
        branchname: this.dueform.controls['chequebranchname'].value,
        validity: this.valid_date,
        cardtype: Number(this.dueform.controls['creditcardtype'].value),
        approvalno: this.dueform.controls['creditbatchno'].value,
        stationid: Number(this.cookie.get('StationId')),
        itemid: item.itemid,
        orderid: item.itemOrderId,
        serviceid: item.serviceId,
        qtslno: dtlist[0].qTslno,
        itemName: item.itemName,
        iaCode: this.data.maxid.split('.')[0],
        transMode: this.billDetailService.patientbilldetaillist.billDetialsForRefund_ServiceItemItemIDPriorityID.length>0? Number(this.billDetailService.patientbilldetaillist.billDetialsForRefund_ServiceItemItemIDPriorityID[0].transportationMode): 0,
        priority: this.billDetailService.patientbilldetaillist.billDetialsForRefund_ServiceItemItemIDPriorityID.length>0? Number(this.billDetailService.patientbilldetaillist.billDetialsForRefund_ServiceItemItemIDPriorityID[0].priority): 0,
      })
      console.log(dtlist);
    })
    console.log(this.refundafteracklistforfull);
    return this.refundafteracklistforfull;
  }
  paytmRefund()
  {
    var ds: any = [];
    var merchantKey;
    var merchantGUID;
    var loginname;
    if(this.mop == 6 )
    {
      this.http.get(BillDetailsApiConstants.GetMachineDetails(1, Number(this.cookie.get('HSPLocationId')), Number(this.cookie.get('UserId'))))
      .pipe(takeUntil(this._destroying$))
      .subscribe(res => {
        ds = res;
        console.log(ds);
        merchantKey = String(ds.oMerchantDetail[0].merchantKey);
        merchantGUID = String(ds.oMerchantDetail[0].merchantGUID);
        loginname = String(ds.oLoginNameDetail[0].loginName);
        if(merchantKey == '' && merchantGUID == '')
        {
          this.messageDialogService.info('PayTm is not activated for this Max Hospital Location');
        }
        var result = this.getpaymentmode();
        if(result.length == 1)
        {
          var merchantOrderID = String(result[0].merchantOrderId);
          var walletSystemTxnId = String(result[0].walletSystemTxnId);
          if(merchantOrderID.length > 0)
          {
            var POSTDATA1 = "{'request':{'txnGuid': "+ walletSystemTxnId + ",'amount':" + String(1234) + ",'currencyCode':'INR',' merchantGuid':" + merchantGUID + ", 'merchantOrderId' :" + merchantOrderID + "},'ipAddress':'127.0.0.1','platformName':'PayTM', 'operationType':'REFUND_MONEY','channel':'POS','version':'1.0'}"
          }
        }
      })
    }
  }
  clear()
  {
    this._destroying$.next(undefined);
    this._destroying$.complete();
    this.dueform.reset();
  }
  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

}
