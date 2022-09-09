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
import { Router } from '@angular/router';
import { getpaymentmode } from './../../../../../core/types/billdetails/getPaymentmode.Interface';
import { BillDetailsApiConstants } from '../BillDetailsApiConstants';
import { objdt, objtab_cancelbill, saveRefundforParticularBill } from '../../../../../core/models/saveRefundforParticularBill.Model';
import { billRefundforSingleItem, objDsSave } from '../../../../../core/models/billRefundforSingleItem.Model';
@Component({
  selector: 'out-patients-refund-dialog',
  templateUrl: './refund-dialog.component.html',
  styleUrls: ['./refund-dialog.component.scss'],
})
export class BillDetailsRefundDialogComponent implements OnInit {

  dueFormData = {
    title: "",
    type: "object",
    properties: {         
    otp: {
      type: "number",
    },
    //cash
    cashamount: {
      type: "number",
      defaultValue: "0.00",
    },
    //cheque
    chequemount: {
      type: "number",
      defaultValue: "0.00",
    },
    chequeno: {
      type: "number"
    },
    chequeissuedate: {
      type: "date",
      maximum: new Date(),
    },
    chequevalidity: {
      type: "string"
    },
    chequebankname: {
      type: "string"
    },
    chequebranchname: {
      type: "string"
    },
     //credit
    creditamount: {
      type: "number",
      defaultValue: "0.00"
    },
    creditcardtype:{
      type: "string"
    }, 
    creditcardno: {
      type: "number"
    },
    creditbatchno:{
       type: "string"
    }, 
     //online
    onlineamount: {
      type: "number",
      defaultValue: "0.00"
    },
    onlinetransacid: {
      type: "string"
    },
    onlinebookingid: {
      type: "string"
    }, 
    //mobile
    mobileamount:{
      type: "number",
      defaultValue: "0.00"
    },
    mobiletransactionid: {
      type: "string"
    },
    mobilemerchantid: {
      type: "string"
    },
     
    //upi
    upiamount : {
      type: "number",
      defaultValue: "0.00"
    }, 
    upino: {
      type: "number"
    },
    upibatchno: {
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
    if(data.mop == 'Cash')
    {
      
    }
  }

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.dueFormData.properties,
      {}
    );
    if(this.router.url == '/out-patient-billing/details/services')
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
    console.log(this.simpleRefund, this.AckRefund);
    console.log(this.router.url);
    this.dueform = formResult.form;
    this.questions = formResult.questions;
    this.billamount = this.billDetailService.patientbilldetaillist.billDetialsForRefund_DepositRefundAmountDetail[0].billamount.toFixed(2);
    this.prepaidamount = this.billDetailService.patientbilldetaillist.billDetialsForRefund_DepositRefundAmountDetail[0].collectedamount.toFixed(2);
    this.depositamount = this.billDetailService.patientbilldetaillist.billDetialsForRefund_DepositRefundAmountDetail[0].depositamount.toFixed(2);
    this.discountamount = this.billDetailService.patientbilldetaillist.billDetialsForRefund_DepositRefundAmountDetail[0].discountamount.toFixed(2);
    // this.due = this.due.toFixed(2);
    this.totaldue = this.due.toFixed(2);
    this.patientIdentityInfo = { type: "Refund", patientinfo: this.data.patientinfo };
    this.getpaymentmode();
  }
  ngAfterViewInit(): void{
    
    // this.paymentmethod.refundform.controls['cashamount'].disable();
    this.mobileno = this.data.mobile;
    this.questions[0].elementRef.addEventListener(
      'blur',
      this.otpcheck.bind(this)
    )
    this.mopcheck();
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
    }
    else if(this.data.mop == 'Cheque')
    {
      this.questions[2].elementRef.readOnly = true;
      this.dueform.controls['chequemount'].setValue(this.data.refundamount);
      setTimeout(() => {
        this.selected = 1
      }, 300);
      this.forcheque = true;
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
    if(this.dueform.controls['otp'].value.toString().length == 0){
      this.messageDialogService.info('Enter OTP');
    } 
    else if(this.dueform.controls['otp'].value.toString().length < 4 || this.dueform.controls['otp'].value.toString().length > 4){
      this.messageDialogService.info('Invalid OTP');
    }
    if(this.simpleRefund == 1)
    {
      console.log('Before Ack');
      if(this.particularbillflag == 1)
      {
        console.log('Full Bill');
        this.http.post(BillDetailsApiConstants.saverefunddetailsforparticularbill, this.fullbillrequestbody())
        .pipe(takeUntil(this._destroying$))
        .subscribe(res => {
          console.log(res);
          if(res.length > 0)
          {
            this.messageDialogService.success(res[0].returnMessage);
          }
        })
      }
      else if(this.singleitemflag == 1)
      {
        console.log('Single Bill Item');
        this.http.post(BillDetailsApiConstants.billrefundforsingleitem, this.singlebillrequestbody())
        .pipe(takeUntil(this._destroying$))
        .subscribe(res => {
          console.log(res);
          if(res.length > 0)
          {
            this.messageDialogService.success(res[0].returnMessage);
          }
        })
      }
    }
    else if(this.AckRefund == 1)
    {
      console.log('After Ack');
      if(this.particularbillflag == 1)
      {
        console.log('Full Bill');
      }
      else if(this.singleitemflag == 1)
      {
        console.log('Single Bill Item');
      }
    }
  }
  getpaymentmode()
  {
    this.http.get(BillDetailsApiConstants.getpaymentmode(this.data.billno, this.cookie.get('StationId')))
    .pipe(takeUntil(this._destroying$))
    .subscribe(res => {
      console.log(res);
      
    })
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
        reason: this.data.reason,
        chequeno: this.dueform.controls['chequeno'].value,
        chequedate: this.dueform.controls['chequeissuedate'].value,
        bankid: Number(this.dueform.controls['chequebankname'].value),
        branchname: this.dueform.controls['chequebranchname'].value,
        validity: this.dueform.controls['chequevalidity'].value,
        cardtype: Number(this.dueform.controls['creditcardtype'].value),
        approvalno: '',
        stationid: Number(this.cookie.get('StationId')),
        itemid: item.itemid,
        orderid: item.itemOrderId,
        serviceid: item.serviceId,
        qtslno: dtlist[0].qTslno,
        itemName: item.itemName,
        iaCode: this.data.maxid.split('.')[0],
        transMode: 0,
        priority: 0,
      })
      console.log(dtlist);
      this.saveforparticularbilllist.objdt.push({
        serviceid: item.serviceId,
        itemid: item.itemid,
        servicename: item.servicename,
        itemname: item.itemName,
        amount: Number(dtlist[0].amount),
        discountamount: Number(dtlist[0].discountamount),
        cancelled: dtlist[0].cancelled,
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
      this.billrefundforsingleitem.amount = Number(dtlist[0].amount);
      this.billrefundforsingleitem.decDiscountAmount = Number(dtlist[0].discountamount);
      this.billrefundforsingleitem.objDsSave.objtab_cancelbill.push({
        billno: this.data.billno,
        operatorid: Number(this.cookie.get('UserId')),
        hsplocationid: Number(this.cookie.get('HSPLocationId')),
        registrationno: this.data.maxid.split('.')[1],
        mop: this.mop,
        authorisedby: this.data.authby,
        reason: this.data.reason,
        chequeno: this.dueform.controls['chequeno'].value,
        chequedate: this.dueform.controls['chequeissuedate'].value,
        bankid: Number(this.dueform.controls['chequebankname'].value),
        branchname: this.dueform.controls['chequebranchname'].value,
        validity: this.dueform.controls['chequevalidity'].value,
        cardtype: Number(this.dueform.controls['creditcardtype'].value),
        approvalno: '',
        stationid: Number(this.cookie.get('StationId')),
        itemid: item.itemid,
        orderid: item.itemOrderId,
        serviceid: item.serviceId,
        qtslno: dtlist[0].qTslno,
        itemName: item.itemName,
        iaCode: this.data.maxid.split('.')[0],
        transMode: 0,
        priority: 0,
      })
      console.log(dtlist);
      this.billrefundforsingleitem.objDsSave.objdt.push({
        serviceid: item.serviceId,
        itemid: item.itemid,
        servicename: item.servicename,
        itemname: item.itemName,
        amount: Number(dtlist[0].amount),
        discountamount: Number(dtlist[0].discountamount),
        cancelled: dtlist[0].cancelled,
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
  clear()
  {
    this._destroying$.next(undefined);
    this._destroying$.complete();
    this.dueform.reset();
  }

}
