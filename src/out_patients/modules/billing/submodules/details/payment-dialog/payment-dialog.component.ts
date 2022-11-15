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
import { BillDetailsApiConstants } from '../BillDetailsApiConstants';
import { getBankName } from '../../../../../core/types/billdetails/getBankName.Interface';
import { getcreditcard } from '../../../../../core/types/billdetails/getcreditcard.Interface';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ds_paymode, insertDueAmountModel, tab_cheque, tab_credit, tab_dd, tab_debit, tab_Mobile, tab_Online, tab_paymentList, tab_rec, tab_UPI } from '../../../../../core/models/insertDueAmountModel.Model'
import { BillingApiConstants } from '../../billing/BillingApiConstant';
@Component({
  selector: 'out-patients-payment-dialog',
  templateUrl: './payment-dialog.component.html',
  styleUrls: ['./payment-dialog.component.scss']
})
export class PaymentDialogComponent implements OnInit {

  bankname: getBankName[] = [];
  creditcard: getcreditcard[] = [];
  insertdueamt: insertDueAmountModel = new insertDueAmountModel();
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
      },
      cashamount: {
        title:'Amount',
        type: "number",
        defaultValue: "0.00",
        required: true,
      },
      //cheque
      chequeamount: {
        title:'Amount',
        type: "number",
        defaultValue: "0.00",
        required: true,
      },
      chequeno: {
        title:'Cheque/NEFT No.',
        type: "number",
        required: true,
      },
      chequeissuedate: {
        title:'Issue Date',
        type: "date",
        maximum: new Date(),
        defaultValue: new Date(),
        required: true,
      },
      chequevalidity: {
        title:'Validity',
        type: "date",
        defaultValue: new Date(),
        minimum: new Date(),
        required: true,
      },
      chequebankname: {
        title:'Bank Name',
        type: "autocomplete",
        options: this.bankname,
        required: true,
      },
      chequebranchname: {
        title:'Branch Name',
        type: "string",
        required: true,
      },
       //credit
      creditamount: {
        title:'Amount',
        type: "number",
        defaultValue: "0.00",
        required: true,
      },
      creditcardno: {
        title:'Card No.',
        type: "number",
        required: true,
      },
      creditcardholdername:{
        title:'Card Holder Name',
        type: "string",
        required: true,
      },
      creditbankname: {
        title:'Bank Name',
        type: 'autocomplete',
        options: this.creditcard,
        required: true,
      },
      creditbatchno:{
        title:'Batch no.',
        type: "string",
        required: true,
      },
      creditapprovalno: {
        title:'Approval Code',
        type: 'string',
        required: true,
      },
      creditterminalid: {
        title:'Terminal ID',
        type: "string",
        required: true,
      },
      creditacquiringbank: {
        title:'Acquiring Bank',
        type: "string",
        required: true,
      },
      //demand
      demandamount: {
        title:'Amount',
        type: 'number',
        defaultValue: "0.00",
        required: true,
      },
      demandddno: {
        title:'DD No.',
        type: 'string',
        required: true,
      },
      demandissuedate: {
        title:'Issue Date',
        type: "date",
        maximum: new Date(),
        defaultValue: new Date(),
        required: true,
      },
      demandvalidity: {
        title:'Validity',
        type: "date",
        defaultValue: new Date(),
        minimum: new Date(),
        required: true,
      },
      demandbankname: {
        title:'Bank Name',
        type: "autocomplete",
        options: this.bankname,
        required: true,
      },
      demandbranchname: {
        title:'Branch Name',
        type: "string",
        required: true,
      },
       //online
      onlineamount: {
        title:'Amount',
        type: "number",
        defaultValue: "0.00",
        required: true,
      },
      onlinetransacid: {
        title:'Transaction ID',
        type: "string",
        required: true,
      },
      onlinebookingid: {
        title:'Booking ID',
        type: "string",
        required: true,
      }, 
      onlinecardvalidate: {
        title:'Card Validation',
        type: "radio",
        required: true,
        defaultValue: 'yes',
        options: [
          { title: "Yes", value: "yes" },
          { title: "No", value: "no" }
        ]
      },
      onlinecontact: {
        title:'Contact No.',
        type: 'string',
        required: true,
      },
      onlinepaidamount: {
        title:'Amount',
        type: 'string',
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
  @ViewChild("billpatientIdentityInfo") billingpatientidentity:any;

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
  patientIdentityInfo:any=[];
  billpatientIdentityInfo:any = [];
  duelabel: any;
  billamount: any = 0;
  prepaidamount: any = 0;
  depositamount: any = 0;
  discountamount: any = 0;
  due: any = 0;
  totaldue: any = 0;

  cashamt: any = 0.00;
  chequeamt: any = 0.00;
  creditamt: any = 0.00;
  demandamt: any = 0.00;
  onlineamt: any = 0.00;
  finalamount: number = 0;
  reduceamount: number = 0;
  selected: any = 0 ;

  manualbtn: boolean = true;
  retrybtn: boolean = true;
  approvalbtn: boolean = true;
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
      this.due = this.billDetailService.patientbilldetaillist.billDetialsForRefund_DepositRefundAmountDetail[0].balance.toFixed(2);
    }
    else if(this.data.flag == 'patientDue')
    {
      this.duelabel = 'Patient Due';
      this.due = this.billDetailService.patientbilldetaillist.billDetialsForRefund_DepositRefundAmountDetail[0].balance.toFixed(2);
    }
    this.dueform = formResult.form;
    this.questions = formResult.questions;
    this.getdepositcashlimit();
    this.patientIdentityInfo = { type: "Refund", patientinfo: this.data.patientinfo };
    this.billamount = this.billDetailService.patientbilldetaillist.billDetialsForRefund_DepositRefundAmountDetail[0].billamount.toFixed(2);
    this.prepaidamount = this.billDetailService.patientbilldetaillist.billDetialsForRefund_DepositRefundAmountDetail[0].collectedamount.toFixed(2);
    this.depositamount = this.billDetailService.patientbilldetaillist.billDetialsForRefund_DepositRefundAmountDetail[0].depositamount.toFixed(2);
    this.discountamount = this.billDetailService.patientbilldetaillist.billDetialsForRefund_DepositRefundAmountDetail[0].discountamount.toFixed(2);
    this.totaldue = this.billDetailService.patientbilldetaillist.billDetialsForRefund_DepositRefundAmountDetail[0].balance.toFixed(2);
    this.dueform.controls['cashamount'].setValue(this.totaldue);
    this.finalamount += Number(this.dueform.controls['cashamount'].value);
    this.amountcheck();
    this.getbankname();
    this.getcreditcard();
  }
  ngAfterViewInit(): void{   
    // console.log(this.paymentmethod.refundform);
    // this.paymentmethod.refundform.controls['cashamount'].valueChanges.subscribe(res => {
    //   console.log(res);
    //   this.adddueamount(res);
    // })
    this.questions[2].elementRef.addEventListener('blur', this.amountcheck.bind(this));
    this.questions[3].elementRef.addEventListener('blur', this.amountcheck.bind(this));
    this.questions[9].elementRef.addEventListener('blur', this.amountcheck.bind(this));
    this.questions[17].elementRef.addEventListener('blur', this.amountcheck.bind(this));
    this.questions[23].elementRef.addEventListener('blur', this.amountcheck.bind(this));
    this.disablecc();
  }
  disablecc()
  {
    this.dueform.controls['creditcardno'].disable();
    this.dueform.controls['creditcardholdername'].disable();
    this.dueform.controls['creditbankname'].disable();
    this.dueform.controls['creditbatchno'].disable();
    this.dueform.controls['creditapprovalno'].disable();
    this.dueform.controls['creditterminalid'].disable();
    this.dueform.controls['creditacquiringbank'].disable();
  }
  enablecc()
  {
    this.dueform.controls['creditcardno'].enable();
    this.dueform.controls['creditcardholdername'].enable();
    this.dueform.controls['creditbankname'].enable();
    this.dueform.controls['creditbatchno'].enable();
    this.dueform.controls['creditapprovalno'].enable();
    this.dueform.controls['creditterminalid'].enable();
    this.dueform.controls['creditacquiringbank'].enable();
  }
  getmanual()
  {
    if(Number(this.dueform.controls['creditamount'].value) == 0)
    {
      this.messageDialogService.info('Please Give Proper Amount.');
    }
    else
    {
      this.enablecc();
      this.manualbtn = false;
      this.retrybtn = false;
      this.approvalbtn = false;
    } 
  }
  retry()
  {
    this.disablecc();
    this.manualbtn = true;
    this.retrybtn = true;
    this.approvalbtn = true;
    this.dueform.controls['creditcardno'].reset();
    this.dueform.controls['creditcardholdername'].reset();
    this.dueform.controls['creditbankname'].reset();
    this.dueform.controls['creditbatchno'].reset();
    this.dueform.controls['creditapprovalno'].reset();
    this.dueform.controls['creditterminalid'].reset();
    this.dueform.controls['creditacquiringbank'].reset();
  }
  tabchange(event: MatTabChangeEvent)
  {
    console.log(event);
    console.log(this.selected);
    if(event.index == 0)
    {
      if(Number(this.dueform.controls['cashamount'].value) == 0.00)
      {
        this.dueform.controls['cashamount'].setValue(this.reduceamount.toFixed(2));
      }
    }
    else if(event.index == 1)
    {
      if(Number(this.dueform.controls['chequeamount'].value) == 0.00)
      {
        this.dueform.controls['chequeamount'].setValue(this.reduceamount.toFixed(2));
      }
    }
    else if(event.index == 2)
    {
      if(Number(this.dueform.controls['creditamount'].value) == 0.00)
      {
        this.dueform.controls['creditamount'].setValue(this.reduceamount.toFixed(2));
      }
    }
    else if(event.index == 3)
    {
      if(Number(this.dueform.controls['demandamount'].value) == 0.00)
      {
        this.dueform.controls['demandamount'].setValue(this.reduceamount.toFixed(2));
      }
    }
    else if(event.index == 4)
    {
      if(Number(this.dueform.controls['onlineamount'].value) == 0.00)
      {
        this.dueform.controls['onlineamount'].setValue(this.reduceamount.toFixed(2));
      }
    }
    this.amountcheck();
  }
  amountcheck()
  {
    this.finalamount = 0;
    if(Number(this.dueform.controls['cashamount'].value) < 0)
    {
      let dialogref = this.messageDialogService.info("Amount can't be Negative");
      dialogref.afterClosed().subscribe(() => {
        this.dueform.controls['cashamount'].setValue(0.00);
        this.amountcheck();
        this.dueform.controls['cashamount'].setValue(this.reduceamount.toFixed(2));
        this.amountcheck();
      })
    }
    else if(Number(this.dueform.controls['chequeamount'].value) < 0)
    {
      let dialogref = this.messageDialogService.info("Amount can't be Negative");
      dialogref.afterClosed().subscribe(() => {
        this.dueform.controls['chequeamount'].setValue(0.00);
        this.amountcheck();
        this.dueform.controls['chequeamount'].setValue(this.reduceamount.toFixed(2));
        this.amountcheck();
      })
    }
    else if(Number(this.dueform.controls['creditamount'].value) < 0)
    {
      let dialogref = this.messageDialogService.info("Amount can't be Negative");
      dialogref.afterClosed().subscribe(() => {
        this.dueform.controls['creditamount'].setValue(0.00);
        this.amountcheck();
        this.dueform.controls['creditamount'].setValue(this.reduceamount.toFixed(2));
        this.amountcheck();
      })
    }
    else if(Number(this.dueform.controls['demandamount'].value) < 0)
    {
      let dialogref = this.messageDialogService.info("Amount can't be Negative");
      dialogref.afterClosed().subscribe(() => {
        this.dueform.controls['demandamount'].setValue(0.00);
        this.amountcheck();
        this.dueform.controls['demandamount'].setValue(this.reduceamount.toFixed(2));
        this.amountcheck();
      })
    }
    else if(Number(this.dueform.controls['onlineamount'].value) < 0)
    {
      let dialogref = this.messageDialogService.info("Amount can't be Negative");
      dialogref.afterClosed().subscribe(() => {
        this.dueform.controls['onlineamount'].setValue(0.00);
        this.amountcheck();
        this.dueform.controls['onlineamount'].setValue(this.reduceamount.toFixed(2));
        this.amountcheck();
      })
    }
    this.finalamount += Number(this.dueform.controls['cashamount'].value)
                        +Number(this.dueform.controls['chequeamount'].value)
                        +Number(this.dueform.controls['creditamount'].value)
                        +Number(this.dueform.controls['demandamount'].value)
                        +Number(this.dueform.controls['onlineamount'].value);
    this.reduceamount = Number(this.totaldue) - Number(this.finalamount);
    
    if(this.selected == 0 && Number(this.finalamount) > Number(this.totaldue))
    {
      let dialogref = this.messageDialogService.info("Entered Amount can't be Greater than Due Amount");
      dialogref.afterClosed().subscribe(() => {
        this.dueform.controls['cashamount'].setValue(0.00);
        this.amountcheck();
        this.dueform.controls['cashamount'].setValue(this.reduceamount.toFixed(2));
        this.amountcheck();
      })
    }
    else if(this.selected == 1 && Number(this.finalamount) > Number(this.totaldue))
    {
      let dialogref = this.messageDialogService.info("Entered Amount can't be Greater than Due Amount");
      dialogref.afterClosed().subscribe(() => {
        this.dueform.controls['chequeamount'].setValue(0.00);
        this.amountcheck();
        this.dueform.controls['chequeamount'].setValue(this.reduceamount.toFixed(2));
        this.amountcheck();
      });
    }
    else if(this.selected == 2 && Number(this.finalamount) > Number(this.totaldue))
    {
      let dialogref = this.messageDialogService.info("Entered Amount can't be Greater than Due Amount");
      dialogref.afterClosed().subscribe(() => {
        this.dueform.controls['creditamount'].setValue(0.00);
        this.amountcheck();
        this.dueform.controls['creditamount'].setValue(this.reduceamount.toFixed(2));
        this.amountcheck();
      });
    }
    else if(this.selected == 3 && Number(this.finalamount) > Number(this.totaldue))
    {
      let dialogref = this.messageDialogService.info("Entered Amount can't be Greater than Due Amount");
      dialogref.afterClosed().subscribe(() => {
        this.dueform.controls['demandamount'].setValue(0.00);
        this.amountcheck();
        this.dueform.controls['demandamount'].setValue(this.reduceamount.toFixed(2));
        this.amountcheck();
      });
    }
    else if(this.selected == 4 && Number(this.finalamount) > Number(this.totaldue))
    {
      let dialogref = this.messageDialogService.info("Entered Amount can't be Greater than Due Amount");
      dialogref.afterClosed().subscribe(() => {
        this.dueform.controls['onlineamount'].setValue(0.00);
        this.amountcheck();
        this.dueform.controls['onlineamount'].setValue(this.reduceamount.toFixed(2));
        this.amountcheck();
      });
    }

    this.cashamt = Number(this.dueform.controls['cashamount'].value).toFixed(2);
    this.chequeamt = Number(this.dueform.controls['chequeamount'].value).toFixed(2);
    this.creditamt = Number(this.dueform.controls['creditamount'].value).toFixed(2);
    this.demandamt = Number(this.dueform.controls['demandamount'].value).toFixed(2);
    this.onlineamt = Number(this.dueform.controls['onlineamount'].value).toFixed(2);
    this.finalamount = Number(this.finalamount.toFixed(2));
    console.log(this.finalamount);
    console.log(this.reduceamount);

  }
  modeOfPayment: any =[];
  cashflag: any = 0;
  chequeflag: any = 0;
  creditflag: any = 0;
  ddflag: any = 0;
  onlineflag: any = 0;
  submitbtn()
  {    
    var callflag: any = 0;
    this.modeOfPayment = [];
    if(Number(this.cashamt) > 0)
    {
      callflag++;
      this.cashflag = 1;
      this.modeOfPayment.push({
        mop: 'Cash',
        flag: 1,
        amount: this.cashamt
      });
    }
    if(Number(this.chequeamt) > 0)
    {
      callflag++;
      if(this.dueform.controls['chequeno'].value == '')
      {
        this.messageDialogService.info('Cheque No is Mandatory');
        this.selected = 1;
        return;
      }
      else if(this.dueform.controls['chequevalidity'].value <= new Date())
      {
        this.messageDialogService.info("Cheque validity can not be lesser then todays's date");
        this.selected = 1;
        return;
      }
      else if(this.dueform.controls['chequebankname'].value == '')
      {
        this.messageDialogService.info('Bank Name is Mandatory');
        this.selected = 1;
        return;
      }
      else if(this.dueform.controls['chequebranchname'].value == '')
      {
        this.messageDialogService.info('Branch Name is Mandatory');
        this.selected = 1;
        return;
      }
      else{
        this.chequeflag = 2;
        this.modeOfPayment.push({
          mop: 'Cheque',
          flag: 2,
          amount: this.chequeamt
        });
      }
    }
    if(Number(this.creditamt) > 0)
    {
      callflag++;
      if(this.dueform.controls['creditcardno'].value == '')
      {
        this.messageDialogService.info('Credit Card No is Mandatory');
        this.selected = 2;
        return;
      }
      else if(this.dueform.controls['creditapprovalno'].value == '')
      {
        this.messageDialogService.info("Please Fill All Mandatory Fields");
        this.selected = 2;
        return;
      }
      else if(this.dueform.controls['creditbankname'].value == '')
      {
        this.messageDialogService.info('Bank Name is Mandatory');
        this.selected = 2;
        return;
      }
      else
      {
        this.creditflag = 3;
        this.modeOfPayment.push({
          mop: 'Credit Card',
          flag: 3,
          amount: this.creditamt
        });
      }  
    }
    if(Number(this.demandamt) > 0)
    {
      callflag++;
      if(this.dueform.controls['demandddno'].value == '')
      {
        this.messageDialogService.info('Demand Draft No is Mandatory');
        this.selected = 3;
        return;
      }
      else if(this.dueform.controls['demandvalidity'].value <= new Date())
      {
        this.messageDialogService.info("Demand Draft validity can not be lesser then todays's date");
        this.selected = 3;
        return;
      }
      else if(this.dueform.controls['demandbankname'].value == '')
      {
        this.messageDialogService.info('Bank Name is Mandatory');
        this.selected = 3;
        return;
      }
      else if(this.dueform.controls['demandbranchname'].value == '')
      {
        this.messageDialogService.info('Branch Name is Mandatory');
        this.selected = 3;
        return;
      }
      else
      {
        this.ddflag = 4;
        this.modeOfPayment.push({
          mop : 'Demand Darft',
          flag: 4,
          amount: this.demandamt
        });
      }
    }
    if(Number(this.onlineamt) > 0)
    {
      callflag++;
      if(this.dueform.controls['onlinetransacid'].value == '')
      {
        this.messageDialogService.info('Transaction ID is Mandatory');
        this.selected = 4;
      }
      else if(this.dueform.controls['onlinebookingid'].value == '')
      {
        this.messageDialogService.info("Booking ID is Mandatory");
        this.selected = 4;
      }
      else if(this.dueform.controls['onlinecontact'].value == '')
      {
        this.messageDialogService.info('Conatct No is Mandatory');
        this.selected = 4;
      }
      else if((this.dueform.controls['onlinecontact'].value).toString().length < 10)
      {
        this.messageDialogService.info('Invalid Conatct No');
        this.selected = 4;
      }
      else{
        this.onlineflag = 5;
        this.modeOfPayment.push({
          mop: 'Online Payment',
          flag: 5,
          amount: this.onlineamt
        });
      }
      
    }
    if(Number(this.finalamount) == 0)
    {
      this.messageDialogService.info('Amount could not be zero');
    }

     //pan card and form 60
    
    this.billpatientIdentityInfo = this.billingpatientidentity.patientidentityform.value;
    if(Number(this.finalamount >= 200000) &&  (this.billpatientIdentityInfo.length == 0 || 
      this.billpatientIdentityInfo.mainradio == "pancardno" && (this.billpatientIdentityInfo.panno == undefined || this.billpatientIdentityInfo.panno == ""))){
      this.messageDialogService.info('Please Enter a valid PAN Number');
    }

     else if(this.billpatientIdentityInfo.mainradio == "form60" && this.formsixtysubmit == false){
      this.messageDialogService.error("Please fill the form60 ");   
     } 


    console.log(callflag, this.modeOfPayment);
    if(callflag == this.modeOfPayment.length)
    {
      console.log(this.modeOfPayment);
      this.duerequestbody();
      this.http.post(BillDetailsApiConstants.insertdueamount, this.duerequestbody())
      .subscribe(res => {
        console.log(res);
        var data: any = {
          res: res,
          mop: this.modeOfPayment
        }
        let dialogref = this.messageDialogService.success(res[0].returnMessage);
        dialogref.afterClosed().subscribe(() => {
          this.dialogRef.close(data);
        })
      })
    }
    
  }

  duerequestbody()
  {
    this.insertdueamt = new insertDueAmountModel();
    this.insertdueamt.tab_rec = new tab_rec();
    this.insertdueamt.ds_paymode = new ds_paymode();
    this.insertdueamt.ds_paymode.tab_paymentList = [] as Array<tab_paymentList>;
    this.insertdueamt.ds_paymode.tab_cheque = [] as Array<tab_cheque>;
    this.insertdueamt.ds_paymode.tab_credit = [] as Array<tab_credit>;
    this.insertdueamt.ds_paymode.tab_dd = [] as Array<tab_dd>;
    this.insertdueamt.ds_paymode.tab_Online = [] as Array<tab_Online>;
    this.insertdueamt.ds_paymode.tab_Mobile = [] as Array<tab_Mobile>;
    this.insertdueamt.ds_paymode.tab_UPI = [] as Array<tab_UPI>;
    this.insertdueamt.ds_paymode.tab_debit = [] as Array<tab_debit>;
    
    this.insertdueamt.tab_rec.billid = this.billDetailService.patientbilldetaillist.billDetialsForRefund_Table1[0].opBillID;
    this.insertdueamt.tab_rec.billno = this.billDetailService.patientbilldetaillist.billDetialsForRefund_DepositRefundAmountDetail[0].billno;
    this.insertdueamt.tab_rec.collectedamt = Number(this.finalamount);
    this.insertdueamt.tab_rec.dueType = this.billDetailService.patientbilldetaillist.billDetialsForRefund_DepositRefundAmountDetail[0].billtype;
    this.insertdueamt.tab_rec.hsplocationid = Number(this.cookie.get('HSPLocationId'));
    this.insertdueamt.tab_rec.operatorid = Number(this.cookie.get('UserId'));
    this.insertdueamt.tab_rec.recnumber = '';
    this.insertdueamt.tab_rec.stationid = Number(this.cookie.get('StationId'));
    this.insertdueamt.hsplocationid = Number(this.cookie.get('HSPLocationId'));
    this.insertdueamt.operatorid = Number(this.cookie.get('UserId'));
    this.insertdueamt.stationid = Number(this.cookie.get('StationId'));
    this.modeOfPayment.forEach((item: any) => {
      var i = 1;
      this.insertdueamt.ds_paymode.tab_paymentList.push({
        slNo: i,
        modeOfPayment: item.mop,
        amount: item.amount,
        flag: item.flag,
      })
    })

    //Cheque
    if(this.chequeflag == 0)
    {
      this.insertdueamt.ds_paymode.tab_cheque = [] as Array<tab_cheque>;
    }
    else if(this.chequeflag == 2)
    {
      this.insertdueamt.ds_paymode.tab_cheque.push({
        chequeNo: this.dueform.controls['chequeno'].value,
        chequeDate: this.dueform.controls['chequeissuedate'].value,
        bankName: this.dueform.controls['chequebankname'].value.value,
        branchName: this.dueform.controls['chequebranchname'].value,
        city: '',
        flag: this.chequeflag
      });
    }

    //Credit Card
    var credbank = this.creditcard.filter(i => {
      return i.id == this.dueform.controls['creditbankname'].value.value;
    });
    console.log(credbank);
    if(credbank.length == 0)
    {
      credbank.push({
        id : 0,
        name : ''
      })
    }
    if(this.creditflag == 0)
    {
      this.insertdueamt.ds_paymode.tab_credit = [] as Array<tab_credit>;
    }
    else if(this.creditflag == 3)
    {
      this.insertdueamt.ds_paymode.tab_credit.push({
        ccNumber: this.dueform.controls['creditcardno'].value,
        cCvalidity: new Date(),
        cardType: this.dueform.controls['creditbankname'].value.value,
        approvalno: this.dueform.controls['creditapprovalno'].value,
        cType: 1,
        flag: this.creditflag,
        approvalcode: '',
        terminalID: this.dueform.controls['creditterminalid'].value,
        acquirer: this.dueform.controls['creditacquiringbank'].value,
        flagman: '1',
        cardholdername: this.dueform.controls['creditcardholdername'].value,
        bankname: credbank[0].name
      })
    }
    
    //Demand Draft
    if(this.ddflag == 0)
    {
      this.insertdueamt.ds_paymode.tab_dd = [] as Array<tab_dd>;
    }
    else if(this.ddflag == 4)
    {
      this.insertdueamt.ds_paymode.tab_dd.push({
        ddNumber: this.dueform.controls['demandddno'].value,
        ddDate: this.dueform.controls['demandissuedate'].value,
        bankName: this.dueform.controls['demandbankname'].value.value,
        branchName: this.dueform.controls['demandbranchname'].value,
        flag: this.ddflag
      })
    }
    
    //Online Payment
    if(this.onlineflag == 0)
    {
      this.insertdueamt.ds_paymode.tab_Online = [] as Array<tab_Online>;
    }
    else if(this.onlineflag == 5)
    {
      this.insertdueamt.ds_paymode.tab_Online.push({
        transactionId: this.dueform.controls['onlinetransacid'].value,
        bookingId: this.dueform.controls['onlinebookingid'].value,
        cardValidation: this.dueform.controls['onlinecardvalidate'].value,
        flag: this.onlineflag,
        onlineContact: this.dueform.controls['onlinecontact'].value
      })
    }
    
    console.log(this.insertdueamt)
    return this.insertdueamt;
    
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

  getbankname()
  {
    this.http.get(BillDetailsApiConstants.getbankname)
    .pipe(takeUntil(this._destroying$))
    .subscribe( res => {
      console.log(res);
      this.bankname = res;
      this.questions[7].options = this.bankname.map(l => {
        return { title: l.name, value: l.name}
      })
      this.questions[7] = {...this.questions[7]};
      this.questions[21].options = this.bankname.map(l => {
        return { title: l.name, value: l.name}
      })
      this.questions[21] = {...this.questions[21]};
    })
  }
  getcreditcard()
  {
    this.http.get(BillDetailsApiConstants.getcreditcard)
    .pipe(takeUntil(this._destroying$))
    .subscribe( res => {
      console.log(res);
      this.creditcard = res;
      this.questions[12].options = this.creditcard.map(l => {
        return { title: l.name, value: l.id}
      })
      this.questions[12] = {...this.questions[12]};
    })
    
  }
  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

  formsixtysubmit:boolean = false;
  billingformsixtysuccess(event:any){
    console.log(event);
    this.formsixtysubmit = event;
  }

}
