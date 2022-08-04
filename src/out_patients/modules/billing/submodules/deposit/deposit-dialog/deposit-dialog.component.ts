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
  stationId:any = Number(this.cookie.get("stationId"));
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
    private datepipe: DatePipe,) { }

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
          deposittypeList : this.data.deposittype
        };
    this.patientIdentityInfo = this.data.patientinfo;
    this.patientsavedepositdetailgst = [];
    this.isNSSHLocation = false; // this.cookie.get("LocationIACode") == "NSSH" ? true : false;
  }

  ngAfterViewInit():void {   
  }
  
  selecteddepositservicetype:any=[];
  DepositcashMode:any=[];
  depositpatientidentityinfo:any=[];

  validationexists: boolean = true;
  depositformvalidation(){
    this.selecteddepositservicetype = this.servicedeposittype.servicedepositForm.value;
    this.DepositcashMode = this.paymentdepositcashMode.refundform.value;
    this.depositpatientidentityinfo = this.depositpatientidentity.patientidentityform.value;
    
    //Service and Deposit Type
    if(this.selecteddepositservicetype.deposithead == null || (this.selecteddepositservicetype.deposithead.value == 0 && this.isNSSHLocation)){
      this.messageDialogService.error("Please Select Deposit Head");
    }
    else if(this.selecteddepositservicetype.servicetype == null){
      this.messageDialogService.error("Please Select Service Type");
    }

    //deposit - payment method
    else if(this.DepositcashMode){
      this.validationexists = false;
      if(this.DepositcashMode.cashamount > 0 ){
        this.PaymentTypedepositamount =  this.DepositcashMode.cashamount;
       }
       else if(this.DepositcashMode.chequeamount > 0){
          this.PaymentType = 2;
          this.PaymentTypedepositamount =  this.DepositcashMode.chequeamount;
       }
       else if(this.DepositcashMode.creditamount > 0){
          this.PaymentType = 4;
          this.PaymentTypedepositamount =  this.DepositcashMode.creditamount;
      }
      else if(this.DepositcashMode.demandamount > 0){
        this.PaymentType = 3;
        this.PaymentTypedepositamount =  this.DepositcashMode.demandamount;
      }
       else if(this.DepositcashMode.upiamount > 0){
        this.PaymentType = 8;
        this.PaymentTypedepositamount =  this.DepositcashMode.upiamount;
      }
    else  if(this.DepositcashMode.internetamount > 0){
        this.PaymentTypedepositamount =  this.DepositcashMode.internetamount;
      }
      else if(this.PaymentTypedepositamount == 0){
        this.messageDialogService.error("Amount Zero is not Allowed");
        this.validationexists = true;
      }
    }

    //pan card and form 60
    else if((this.PaymentTypedepositamount >= 200000) && (this.depositpatientidentityinfo.length == 0 || 
      this.depositpatientidentityinfo.mainradio == "pancardno" && (this.depositpatientidentityinfo.panno == undefined || this.depositpatientidentityinfo.panno == ""))){
        this.messageDialogService.error("Please Enter a valid PAN Number");   
     }
     else if(this.depositpatientidentityinfo.mainradio == "form60"){
      this.messageDialogService.error("Please fill the form60 ");   
     }
     else{
      this.validationexists = false;
     }
    
  }

  savedialogpayment()
  {
    this.depositformvalidation();
   if(!this.validationexists){
      console.log("deposit request body" + this.getPatientDepositSubmitRequestBody());
      this.http
        .post(ApiConstants.SavePatientsDepositDetailsGST, this.getPatientDepositSubmitRequestBody())
        .pipe(takeUntil(this._destroying$))
        .subscribe(
          (resultData) => {
            this.matDialog.closeAll();
            this.dialogRef.close("Success");
            this.messageDialogService.success("Deposit Has Been Successfully Save");
          
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
      this.PaymentTypedepositamount,
      this.stationId,
      this.hsplocationId,
      String(this.operatorID),
      this.makedepositdialogForm.value.remarksText,
      0,
      this.PaymentType,
      this.DepositcashMode.chequeno,      
      this.datepipe.transform(Date.now(), "yyyy-MM-ddThh:mm:ss") || "{}",
      this.DepositcashMode.banknamecheque,
      this.DepositcashMode.branchnamecheque,
      this.DepositcashMode.demandddno,
      this.datepipe.transform(Date.now(), "yyyy-MM-ddThh:mm:ss") || "{}",
      this.DepositcashMode.demandbankname,
      this.DepositcashMode.demandbranchname,
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      0,
      this.depositpatientidentityinfo.panno,
      this.selecteddepositservicetype.servicetype.value,
      0,
      this.selecteddepositservicetype.deposithead.value,
      this.depositpatientidentityinfo.mobileno,
      "",     
      ""
    ));
  }

  clearsiblingcomponents:boolean = false;
  cleardepositdialog(){
    this.clearsiblingcomponents = true;
    this.makedepositdialogForm.reset();
  }
}
