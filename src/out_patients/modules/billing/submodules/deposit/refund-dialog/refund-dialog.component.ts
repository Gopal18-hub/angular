import { Component, Inject, OnInit,AfterViewInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog,  MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { QuestionControlService } from "../../../../../../shared/ui/dynamic-forms/service/question-control.service";
import { FormSixtyComponent } from '@core/UI/billing/submodules/form60/form-sixty.component';
import { MakedepositDialogComponent } from '../makedeposit-dialog/makedeposit-dialog.component';
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { PaymentMethodsComponent } from '@core/UI/billing/submodules/payment-methods/payment-methods.component';
import { MessageDialogService } from "@shared/ui/message-dialog/message-dialog.service";
import { savepatientRefunddetailModel } from "@core/models/savepatientRefundDetailModel.Model";
import { CookieService } from "@shared/services/cookie.service";
import { HttpService } from "@shared/services/http.service";
import { ApiConstants } from "@core/constants/ApiConstants";
import { DatePipe } from "@angular/common";
import { sendotpforpatientrefund } from "@core/models/patientsaveotprefunddetailModel.Model";

@Component({
  selector: 'out-patients-refund-dialog',
  templateUrl: './refund-dialog.component.html',
  styleUrls: ['./refund-dialog.component.scss']
})
export class RefundDialogComponent implements OnInit {

  refundFormData = {
    title: "",
    type: "object",
    properties: {         
       payable_name: {
         type: "string",
       },
       remarks: {
         type: "textarea",
       },
       avalaibleamount: {
         type: "number"
       },       
       cardvalidate: {
        type: "radio",
        required: false,
        options: [
          { title: "Yes", value: "yes" },
          { title: "No", value: "no" }
        ],
        defaultValue: "yes"
      },     
      otp: {
        type: "number"
      },
      mobielno: {
        type: "number",
        readonly: "true"
      }, 
      text:{
        type: "string",
      }
    },
  };
  refundform!: FormGroup;
  questions: any;
  onRefundReceiptpage:boolean=true;
  otpsenttomobile:boolean = false;
  otpresenttomobile:boolean = false;
  servicedeposittype:any=[];
  paymentform!: FormGroup;
  today: any;
  patientIdentityInfo:any=[];
  avalaiblemaount:number=0;
  PaymentType:number = 1; //default cash
  PaymentTypedepositamount:number = 0;
  mobileno:number|undefined;
  hsplocationId:any = Number(this.cookie.get("HSPLocationId"));
  stationId:any =  Number(this.cookie.get("stationId"));
  operatorID:any =  Number(this.cookie.get("UserId"));
  SendOTP:string="Send OTP";
  ResendOTP: string="Send OTP to Manager";
  flagto_set_btnname:number = 0;
  
  private readonly _destroying$ = new Subject<void>();

  @ViewChild(PaymentMethodsComponent) paymentdepositcashMode! : PaymentMethodsComponent;

  config = {
    paymentmethod: {
      cash: true,
      cheque: true
    },
    combopayment: false
  }
  constructor(public matDialog: MatDialog, private formService: QuestionControlService, @Inject(MAT_DIALOG_DATA) private data: any, 
   private messageDialogService: MessageDialogService,
  private cookie: CookieService,  private dialogRef: MatDialogRef<RefundDialogComponent>,
    private http: HttpService,
    private datepipe: DatePipe,) {
   }

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.refundFormData.properties,
      {}
    );
    this.refundform = formResult.form;
    this.questions = formResult.questions;
    console.log(this.data);
    this.today = new Date();
    this.patientIdentityInfo = this.data.patientinfo;
    this.servicedeposittype = {
      type: "Refund",
      selectedservicedeposittype : this.data.clickedrowdepositdetails,
      refundreceiptpage : this.onRefundReceiptpage
    }
    this.avalaiblemaount = this.data.clickedrowdepositdetails.balance;
    this.mobileno = this.data.patientinfo.mobileno;
    console.log('inside refund page');
  }
  ngAfterViewInit(): void{   
    this.paymentform.controls["amount"].valueChanges.subscribe(
      (res:any)=>{
      if(res > 200000)
      {
        console.log("200000");
        this.refundform.controls["panno"].enable();
        this.refundform.controls["mainradio"].enable();
      }
      else{
        this.refundform.controls["panno"].disable();
        this.refundform.controls["mainradio"].disable();
        this.refundform.controls["mainradio"].reset();
      }
    });
  }
  paymentformevent(event:any){
    console.log(event);
    this.paymentform = event;
  }
  clear()
  {
    this.paymentform.reset();
    this.paymentform.controls["chequeissuedate"].setValue(this.today);
    this.paymentform.controls["demandissuedate"].setValue(this.today);
    this.refundform.controls["mobielno"].setValue(this.data.Mobile);
    this.refundform.controls["mail"].setValue(this.data.Mail);
  }
  validationexists: boolean = true;
  saverefunddialog(){
    const RefundDepositDialogref = this.matDialog.open(MakedepositDialogComponent,{
      width: '33vw', height: '40vh', data: {    
        message: "Do you want to make Refund?",
      },
    });

    RefundDepositDialogref.afterClosed()
      .pipe(takeUntil(this._destroying$))
      .subscribe((result) => {
        if (result == "Success")  
         {
         this.refundformvalidation();
         this.submitrefundamount();
        }
      });  
  }

  RefundcashMode:any=[];
  refundformvalidation(){
    this.RefundcashMode = this.paymentdepositcashMode.refundform.value;
      //Refund - payment method
     if(this.RefundcashMode)
     {
      this.validationexists = false;
      if(this.RefundcashMode.cashamount > 0 ){
        this.PaymentTypedepositamount =  this.RefundcashMode.cashamount;
       }
       else if(this.RefundcashMode.chequeamount > 0)
       {
          this.PaymentType = 2;
          this.PaymentTypedepositamount =  this.RefundcashMode.chequeamount;
          if(this.RefundcashMode.chequeno == "" || this.RefundcashMode.chequebankname == "" || this.RefundcashMode.chequebranchname == ""){
            this.messageDialogService.error("Please Fill All Cheque Mandatory Fields ");
            this.validationexists = true;
          }
         
       }
       else if(this.PaymentTypedepositamount == 0){
        this.messageDialogService.error("Refund Amount must not be Zero");
        this.validationexists = true;
      }
       if(Number(this.PaymentTypedepositamount) > Number(this.avalaiblemaount)){
        this.messageDialogService.error("Refund Amount must be less then available amount");
        this.validationexists = true;
      }
      if(this.refundform.value.otp == ""){ 
        this.questions[4].elementRef.focus();       
        this.messageDialogService.error("Enter OTP");
       
        this.validationexists = true;
      }
    }
     else{
      this.validationexists = false;
     }
    
  }

  submitrefundamount(){
    if(!this.validationexists){
      console.log("deposit request body" + this.getPatientRefundSubmitRequestBody());
      this.http
        .post(ApiConstants.savepatientrefunddetails, this.getPatientRefundSubmitRequestBody())
        .pipe(takeUntil(this._destroying$))
        .subscribe(
          (resultData) => {
            this.matDialog.closeAll();
            this.dialogRef.close("Success");
            this.messageDialogService.success("Refund has been done Successfully");
          
          },
          (error) => {
            console.log(error);
            this.messageDialogService.error(error.error);
          }
        );
    }
  }

  patientSaveRefundDetails: savepatientRefunddetailModel | undefined;
  patientsaveotprefundDetails: sendotpforpatientrefund | undefined;
  
  getPatientRefundSubmitRequestBody(): savepatientRefunddetailModel {  
    return (this.patientSaveRefundDetails = new savepatientRefunddetailModel(
      this.data.clickedrowdepositdetails.uhid.split(".")[0], 
      this.refundform.value.payable_name,
      this.refundform.value.remarks,
      this.data.clickedrowdepositdetails.receiptno,
      Number(this.data.clickedrowdepositdetails.uhid.split(".")[1]),
      this.PaymentTypedepositamount,
      this.stationId,
      this.hsplocationId,
      this.operatorID,    
      this.PaymentType,    
      this.RefundcashMode.chequeno,    
      this.RefundcashMode.banknamecheque,
      this.RefundcashMode.branchnamecheque,
      this.datepipe.transform(Date.now(), "yyyy-MM-ddThh:mm:ss") || "{}",     
      0,           
      this.refundform.value.otp
    ));
  }

  getPatientrefundotpdetailsRequestBody(): sendotpforpatientrefund{
    return (this.patientsaveotprefundDetails = new sendotpforpatientrefund(
    0,
    this.data.clickedrowdepositdetails.receiptno,
    this.stationId,
    this.hsplocationId,
    this.operatorID, 
    0,    
    this.datepipe.transform(Date.now(), "yyyy-MM-ddThh:mm:ss") || "{}",    
    this.data.clickedrowdepositdetails.uhid,
    "OP",
      0,
    this.flagto_set_btnname
    ));
  }
  sendotpclick(){
    this.RefundcashMode=[];
    this.SendOTP = "Resend OTP";
    this.otpsenttomobile = true;
    this.RefundcashMode = this.paymentdepositcashMode.refundform.value;    
    if(this.RefundcashMode.cashamount <= 0  && this.RefundcashMode.chequeamount <= 0)
    {
       this.messageDialogService.error("Refund Amount must be less then available amount");
    }
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
    this.refundform.controls["otp"].setValue("");
    this.flagto_set_btnname = 1;
    this.RefundcashMode=[];
    this.RefundcashMode = this.paymentdepositcashMode.refundform.value;
    this.ResendOTP = "Resend OTP To Manager";
    this.otpresenttomobile = false;
    this.otpsenttomobile = true;
    if(this.RefundcashMode.cashamount <= 0  && this.RefundcashMode.chequeamount <= 0)
    {
       this.messageDialogService.error("Refund Amount must be less then available amount");
    }
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
}



