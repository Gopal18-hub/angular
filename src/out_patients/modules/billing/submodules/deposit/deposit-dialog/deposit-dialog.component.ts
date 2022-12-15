import { Component, OnInit,Inject, AfterViewInit, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { DynamicFormsModule } from "../../../../../../shared/ui/dynamic-forms";
import { QuestionControlService } from "../../../../../../shared/ui/dynamic-forms/service/question-control.service";
import { MatTabGroup } from "@angular/material/tabs";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PatientSaveDepositDetailGST } from "@core/models/patientdepositdetailsgstModel.Model";
import { MessageDialogService } from "@shared/ui/message-dialog/message-dialog.service";
import { DatePipe } from "@angular/common";
import { CookieService } from "@shared/services/cookie.service";
import { HttpService } from "@shared/services/http.service";
import { ApiConstants } from "@core/constants/ApiConstants";
import { Subject, Observable } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ServiceDepositComponent } from "@core/UI/billing/submodules/service-deposit/service-deposit.component";
import { PatientIdentityInfoComponent } from "@core/UI/billing/submodules/patient-identity-info/patient-identity-info.component";
import { PaymentMethodsComponent } from "@core/UI/billing/submodules/payment-methods/payment-methods.component";
import { FormSixtyComponent } from "@core/UI/billing/submodules/form60/form-sixty.component";
import { DepositService } from "@core/services/deposit.service";
import { DepositSuccessComponent } from "../deposit-success/deposit-success.component";
import { BillingService } from "../../billing/billing.service";
@Component({
  selector: "out-patients-deposit-dialog",
  templateUrl: "./deposit-dialog.component.html",
  styleUrls: ["./deposit-dialog.component.scss"],
})
export class DepositDialogComponent implements OnInit {

  @ViewChild(ServiceDepositComponent) servicedeposittype! : ServiceDepositComponent;
  @ViewChild(PatientIdentityInfoComponent) depositpatientidentity! : PatientIdentityInfoComponent;
  @ViewChild(PaymentMethodsComponent) paymentdepositcashMode! : PaymentMethodsComponent;
  @ViewChild(FormSixtyComponent) formsixty! : FormSixtyComponent;

  makedepositdialogformData = {
    type: "object",
    title: "",
    properties: {
      remarksText: {
        type: "textarea",
      },      
    },
  };
  isNSSHLocation: boolean = false;
  depositdialogtypeList:any=[];
  patientIdentityInfo:any=[];
  patientsavedepositdetailgst: PatientSaveDepositDetailGST[] = [];

  makedepositdialogForm!: FormGroup;
  questions: any;
  
  hsplocationId:any = Number(this.cookie.get("HSPLocationId"));
  stationId:any =  Number(this.cookie.get("StationId"));
  operatorID:any =  Number(this.cookie.get("UserId"));

  private readonly _destroying$ = new Subject<void>();

  onDepositpage: boolean = true;
  selectedTabvalue!: string ;
  PaymentType:number = 1; //default cash
  PaymentTypedepositamount:number = 0;
  config = {
    paymentmethod: {
      cash: true,
      cheque: true,
      credit: true,
      demand: true,
      upi: true,
      internetpayment: true,
    },
    combopayment: false
  }
  constructor( private formService: QuestionControlService, 
    @Inject(MAT_DIALOG_DATA) public data : {servicetype:any, deposittype:any, patientinfo: any},
    private dialogRef: MatDialogRef<DepositDialogComponent>,
    public matDialog: MatDialog,
    private messageDialogService: MessageDialogService,  private cookie: CookieService,
    private http: HttpService,
    private datepipe: DatePipe,
    private depositservice: DepositService,
    private billingservice: BillingService) { }

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.makedepositdialogformData.properties,
      {}
    );
    this.makedepositdialogForm = formResult.form;
    this.questions = formResult.questions;
    this.depositdialogtypeList = {
      type: "Deposit",
          servicetypeList : this.data.servicetype,
          deposittypeList : this.data.deposittype,

        };
    this.patientIdentityInfo = { type: "Deposit", patientinfo : this.data.patientinfo };
    this.patientsavedepositdetailgst = [];
    this.isNSSHLocation = this.cookie.get("LocationIACode") == "NSSH" ? true : false;
  }

  ngAfterViewInit():void {   
  }
  
  selecteddepositservicetype:any=[];
  DepositcashMode:any=[];
  depositpatientidentityinfo:any=[];

  validationexists: boolean = false;
  async depositformvalidation(){
    this.validationexists = false;
    this.PaymentTypedepositamount = 0;
    this.selecteddepositservicetype = this.servicedeposittype.servicedepositForm.value;
    this.DepositcashMode = this.paymentdepositcashMode.refundform.value;
    this.depositpatientidentityinfo = this.depositpatientidentity.patientidentityform.value;
    
    //Service and Deposit Type
    if(this.selecteddepositservicetype.deposithead == null || (this.selecteddepositservicetype.deposithead == 0 && this.isNSSHLocation)){
      this.messageDialogService.info("Please Select Deposit Head");
      this.validationexists = true;
    }
    else  if(this.selecteddepositservicetype.servicetype == null){
      this.messageDialogService.info("Please Select Service Type");
      this.validationexists = true;
    }
    //deposit - payment method
    else if(this.DepositcashMode){
      
      if(this.DepositcashMode.cashamount > 0 ){
        this.PaymentTypedepositamount =  Number(this.DepositcashMode.cashamount);
       }
       else if(this.DepositcashMode.chequeamount > 0){
          this.PaymentType = 2;
          this.PaymentTypedepositamount =  Number(this.DepositcashMode.chequeamount);

          if(!this.paymentdepositcashMode.chequemandatoryfields()){
            this.messageDialogService.info("Please Fill All Cheque Mandatory Fields ");
            this.validationexists = true;
          }         
       }
       else if(this.DepositcashMode.creditamount > 0){
          this.PaymentType = 4;
          this.PaymentTypedepositamount =  Number(this.DepositcashMode.creditamount);
          if(!this.paymentdepositcashMode.creditcardmandatoryfields()){
            this.messageDialogService.info("Please Fill All Credit Card Mandatory Fields ");
            this.validationexists = true;
          }
      }
      else if(this.DepositcashMode.demandamount > 0){
        this.PaymentType = 3;
        this.PaymentTypedepositamount =  Number(this.DepositcashMode.demandamount);

        if(!this.paymentdepositcashMode.demanddraftmandatoryfields())
        {
         this.messageDialogService.info("Please Fill All Demand Draft Mandatory Fields ");
         this.validationexists = true;
       }  

      }
      else if(this.DepositcashMode.upiamount > 0){
        this.PaymentType = 8;
        this.PaymentTypedepositamount =  Number(this.DepositcashMode.upiamount);
      }
      else if(this.DepositcashMode.internetamount > 0){
        this.PaymentType = 9;
        this.PaymentTypedepositamount =  Number(this.DepositcashMode.internetamount);
        if(this.DepositcashMode.internetemail.trim().toUpperCase() == "INFO@MAXHEALTHCARE.COM"){
          this.messageDialogService.info("Please fill valid Email Id " + this.DepositcashMode.internetemail + " Not allowed to save internet payment request!!");
          this.validationexists = true;
        }
        else if(this.DepositcashMode.internetremarks == "" || this.DepositcashMode.internetremarks == null ){
          this.messageDialogService.info("Please fill Internet Payment Remarks !!");
          this.validationexists = true;
        }
      }
      else if(this.PaymentTypedepositamount <= 0){
        this.messageDialogService.info("Amount Zero or Negative number is not Allowed");
        this.validationexists = true;
      }      
    }

    //pan card and form 60
     if((this.PaymentTypedepositamount >= 200000) && !this.validationexists &&  (this.depositpatientidentityinfo.length == 0 || 
      this.depositpatientidentityinfo.mainradio == "pancardno" && (this.depositpatientidentityinfo.panno == undefined || this.depositpatientidentityinfo.panno == "")))
      {
        
        this.validationexists = true;
        const pannovalidate =  this.messageDialogService.info('Please Enter a valid PAN Number');
        await pannovalidate.afterClosed().toPromise();        
        this.billingservice.setpaymenthodpancardfocus();
         return;  
     }
     else if(this.depositpatientidentityinfo.mainradio == "form60" && this.formsixtysubmit == false && !this.validationexists){
      this.messageDialogService.info("Please fill the form60 ");   
      this.validationexists = true;
     }    
  }

  savedialogpayment()
  {
    this.depositformvalidation();
   if(!this.validationexists){
      console.log(this.patientSaveDepositDetails);
      this.http
        .post(ApiConstants.SavePatientsDepositDetailsGST, this.getPatientDepositSubmitRequestBody())
        .pipe(takeUntil(this._destroying$))
        .subscribe(
          (resultData) => {
            console.log(resultData);
            if(resultData[0].returnFlag == 0){
              this.matDialog.closeAll();
              this.dialogRef.close("Success");
              const successInfo = this.messageDialogService.success(
                `Deposit Has Been Successfully Saved`
              );                  
            }else
           {
             const temp =  resultData[0].returnMessageDeposit.split(/\r\n/);
             let tempString = "";
             let firstline = 0;
             temp.forEach((element:string) => {
               if(firstline == 0){
                tempString += '<p class="font-base">' + element + '</p>'  ;
                firstline = 1;
               }else{
                tempString += '<p class="text-left">' + element + '</p>'  ; 
               }
             });
             this.messageDialogService.error(tempString);
            }                       
          },
          (error) => {
            console.log(error);
            this.messageDialogService.info(error.error);
          }
        );
    }   
  }
  patientSaveDepositDetails: PatientSaveDepositDetailGST | undefined;
  
  getPatientDepositSubmitRequestBody(): PatientSaveDepositDetailGST {  
    return (this.patientSaveDepositDetails = new PatientSaveDepositDetailGST(
      this.data.patientinfo.iacode,
      this.data.patientinfo.registrationno,
      Number(this.PaymentTypedepositamount),
      this.stationId,
      this.hsplocationId,
      String(this.operatorID),
      this.makedepositdialogForm.value.remarksText,
      this.operatorID,
      this.PaymentType,
      this.DepositcashMode.chequeno,      
      this.datepipe.transform(Date.now(), "yyyy-MM-ddThh:mm:ss") || "{}",
      this.DepositcashMode.banknamecheque != undefined ? this.DepositcashMode.banknamecheque.title : this.DepositcashMode.banknamecheque,
      this.DepositcashMode.branchnamecheque,
      this.DepositcashMode.demandddno,
      this.datepipe.transform(Date.now(), "yyyy-MM-ddThh:mm:ss") || "{}",
      this.DepositcashMode.demandbankname != undefined ? this.DepositcashMode.demandbankname.title : this.DepositcashMode.demandbankname,
      "",
      this.DepositcashMode.demandbranchname,
      this.DepositcashMode.creditcardno,
      this.DepositcashMode.creditbatchno,
      this.DepositcashMode.creditbankname != undefined ? this.DepositcashMode.creditbankname.title : this.DepositcashMode.creditbankname,
      this.DepositcashMode.creditapproval,
      this.DepositcashMode.creditterminal,
      this.DepositcashMode.creditacquiring,
      this.DepositcashMode.creditholdername,      
      0,
      this.formsixtysubmit == false ? this.depositpatientidentityinfo.panno : "Form60",
      this.selecteddepositservicetype.servicetype,
      0,
      this.selecteddepositservicetype.deposithead,
      this.depositpatientidentityinfo.mobileno,
      "",     
      ""
    ));
  }

  clearsiblingcomponents:boolean = false;
  cleardepositdialog(){
    this._destroying$.next(undefined);
    this._destroying$.complete(); 
    this.depositservice.clearsibllingcomponent();
    this.makedepositdialogForm.reset();
  }

  formsixtysubmit:boolean = false;
  formsixtysuccess(event:any){
    console.log(event);
    this.formsixtysubmit = event;
  }
  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
  checkmandatoryDeposit() {
    let tabForms = true;
    if(this.paymentdepositcashMode){
     if(this.paymentdepositcashMode.activeTab == "Cash" && this.paymentdepositcashMode.refundform.value.cashamount <= 0){
      tabForms = false;
     }
     else if(this.paymentdepositcashMode.activeTab == "Cheque" && !this.paymentdepositcashMode.chequemandatoryfields()){
      tabForms = false;
     }
     else if(this.paymentdepositcashMode.activeTab == "Credit / Debit Card" && !this.paymentdepositcashMode.creditcardmandatoryfields()){
      tabForms = false;
     }
     else if(this.paymentdepositcashMode.activeTab == "Demand Draft" &&  !this.paymentdepositcashMode.demanddraftmandatoryfields()){
      tabForms = false;
     } 
     else if(this.paymentdepositcashMode.activeTab == "Internet Payment" &&  !this.paymentdepositcashMode.internetmandatoryfields()){
      tabForms = false;
     } 
     else if(this.paymentdepositcashMode.activeTab == "UPI" &&  !this.paymentdepositcashMode.upimandatoryfields()){
      tabForms = false;
     } 
    }

    if(tabForms && this.depositpatientidentity){
       if(this.depositpatientidentity.patientidentityform.value.panno && this.depositpatientidentityinfo.mainradio == "pancardno"){
         if(!this.depositpatientidentity.validatepanncardno()){
          tabForms = false;
         }
       }
    }
    if(!tabForms){
      return false;
    }else{
      return true;
    }
  }
}
