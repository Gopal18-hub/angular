import { Component, OnInit, ViewChild , Inject} from '@angular/core';
import { RefundDialogComponent } from './refund-dialog/refund-dialog.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA,} from "@angular/material/dialog";
import { DepositDialogComponent } from './deposit-dialog/deposit-dialog.component';
import { FormGroup } from '@angular/forms';
import { QuestionControlService } from '@shared/ui/dynamic-forms/service/question-control.service';
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { Router } from "@angular/router";
import { FormSixtyComponent } from '@core/UI/billing/submodules/form60/form-sixty.component';
import { HttpService } from '@shared/services/http.service';
import { ApiConstants } from "@core/constants/ApiConstants";
import { CookieService } from "@shared/services/cookie.service";
import { PatientPersonalDetailInterface } from "@core/types/PatientPersonalDetail.Interface";
import { PatientDepositDetailInterface } from "@core/types/PatientDepositDetail.Interface";
import { MessageDialogService } from '@shared/ui/message-dialog/message-dialog.service';
import { PatientPreviousDepositDetail } from "@core/models/patientpreviousdepositdetailModel.Model";
import { MakedepositDialogComponent } from './makedeposit-dialog/makedeposit-dialog.component';
import { SimilarSoundPatientResponse } from "@core/models/getsimilarsound.Model";
import { PatientDepositCashLimitLocationDetail } from "@core/types/depositcashlimitlocation.Interface";

@Component({
  selector: 'out-patients-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.scss']
})
export class DepositComponent implements OnInit {

  constructor(public matDialog: MatDialog, private formService: QuestionControlService,
    private router: Router, private http: HttpService, private cookie: CookieService,
    private messageDialogService: MessageDialogService) { }

  @ViewChild("deposittable") deposittable: any;

  depositformdata = {
    type: "object",
    title: "",
    properties: {
      maxid: {
        type: "string",
        defaultValue: this.cookie.get("LocationIACode") + ".",
        // title: "Max ID"
      },
      mobileno: {
        type: "number",
        //title: "Mobile No."
      },
      checkbox: {
        type: "checkbox",
        options: [{
          title: ""
        }]
      },
      dateInput: {
        type: "date"
      },
      totaldeposit: {
        type: "string",
        // title:"Total Deposit",
        defaultValue: "0.00",
        readonly: true
      },
      avalaibledeposit: {
        type: "string",
        // title:"Avalaible Deposit",
        defaultValue: "0.00",
        readonly: true
      },
      totalrefund: {
        type: "string",
        // title:"Total Refund",
        defaultValue: "0.00",
        readonly: true
      },
      remarks: {
        type: "textarea",
        //  title:"Remarks",
        defaultValue: "Write Remarks"
      },
      panno: {
        type: "string"
      },
      mainradio: {
        type: "radio",
        required: false,
        options: [
          { title: "Form 60", value: "form60" },
          { title: "Pan card No.", value: "pancardno" },
        ],
        //defaultValue: "pancardno",
      },
    }
  }

  depositconfig: any = {
    clickedRows: true,
    clickSelection: "multiple",
    dateformat: "dd/MM/yyyy - hh:mm",
    selectBox: true,
    displayedColumns: [
      "depositRefund",
      "receiptno",
      "dateTime",
      "deposit",
      "paymentType",
      "usedOP",
      "usedIP",
      "refund",
      "balance",
      "gst",
      "gstValue",
      "advanceType",
      "serviceTypeName",
      "operatorName",
      "remarks"
    ],
    columnsInfo: {
      depositRefund: {
        title: "Deposit/Refund",
        type: "string",
        style: {
          width: "7rem",
        },
      },
      receiptno: {
        title: "Receipt No.",
        type: "number",
        style: {
          width: "6rem",
        },
      },
      dateTime: {
        title: "Date & Time",
        type: "date",
        style: {
          width: "8rem",
        },
      },
      deposit: {
        title: "Deposit",
        type: "string",
        tooltipColumn: "modifiedPtnName",
        style: {
          width: "6rem",
        },
      },
      paymentType: {
        title: "Payment Type",
        type: "string",
        style: {
          width: "7rem",
        },
      },
      usedOP: {
        title: "Used(OP)",
        type: "string",
        style: {
          width: "5rem",
        },
      },
      usedIP: {
        title: "Used(IP)",
        type: "number",
        style: {
          width: "5rem",
        },
      },
      refund: {
        title: "Refund",
        type: "string",
        tooltipColumn: "uEmail",
        style: {
          width: "6rem",
        },
      },
      balance: {
        title: "Balance",
        type: "string",
        style: {
          width: "6rem",
        },
      },
      gst: {
        title: "Tax %",
        type: "number",
        style: {
          width: "3.7rem",
        },
      },
      gstValue: {
        title: "Total Tax Value",
        type: "number",
        style: {
          width: "7rem",
        },
      },
      advanceType: {
        title: "Deposit Head",
        type: "string",
        style: {
          width: "7rem",
        },
      },
      serviceTypeName: {
        title: "Service Type",
        type: "string",
        style: {
          width: "7rem",
        },
      },
      operatorName: {
        title: "Operator Name & ID",
        type: "string",
        style: {
          width: "10rem",
        },
      },
      remarks: {
        title: "Remarks",
        type: "string",
        style: {
          width: "7rem",
        },
      },
     
    },
  };

  name: string | undefined;
  age: string | undefined;
  gender: string | undefined;
  dob: string | undefined;
  nationality: string | undefined;
  ssn: string | undefined;

  depositForm !: FormGroup;
  questions: any;
  patientDepositDetails: any = [];
  patientRefundDetails: any = [];
  patientpersonaldetails: any = [];
  depositcashlimitationdetails: any=[];
  patientservicetype: any;
  patientdeposittype: any;
  regNumber: number = 0;
  iacode: string | undefined;
  hspLocationid: any = 69;// Number(this.cookie.get("HSPLocationId"));
  depoistList: any = [];
  MaxIDExist: boolean = false;
  MaxIDdepositExist: boolean = false;
  totaldeposit: number = 0;
  totalrefund: number = 0;
  avalaibleamount: number = 0;

  private readonly _destroying$ = new Subject<void>();

  ngOnInit(): void {
    let formResult = this.formService.createForm(
      this.depositformdata.properties, {}
    );
    this.depositForm = formResult.form;
    this.questions = formResult.questions;   
    this.depositForm.controls["panno"].disable();
    this.depositForm.controls["mainradio"].disable();

    }
  openrefunddialog() {
  const RefundDialog =   this.matDialog.open(RefundDialogComponent, {
      width: "70vw",
      height: "98vh",
      data: {       
        patientinfo: {
          emailId: this.patientpersonaldetails[0]?.pEMail  , mobileno: this.patientpersonaldetails[0]?.pcellno,
         
        },
        clickedrowdepositdetails : this.patientRefundDetails
      }
    });

    RefundDialog.afterClosed()
    .pipe(takeUntil(this._destroying$))
    .subscribe((result) => {
      if(result == "Success"){
        this.getPatientPreviousDepositDetails();
        console.log("Refund Dialog closed");
      }
      this.MaxIDdepositExist = false;
    });
  }

  openDepositdialog() {
    const MakeDepositDialogref = this.matDialog.open(MakedepositDialogComponent,{
      width: '33vw', height: '40vh', data: {    
        message: "Do you want to make Deposits?",
      },
    });

    MakeDepositDialogref.afterClosed()
      .pipe(takeUntil(this._destroying$))
      .subscribe((result) => {
        if (result == "Success")  
         {
          const DepositDialogref = this.matDialog.open(DepositDialogComponent, {
            width: '70vw', height: '98vh', data: {
              servicetype: this.patientservicetype, deposittype: this.patientdeposittype,
              patientinfo: {
                emailId: this.patientpersonaldetails[0]?.pEMail  , mobileno: this.patientpersonaldetails[0]?.pcellno,
                panno : this.patientpersonaldetails[0]?.paNno, registrationno: this.regNumber, iacode:this.iacode
              }
            
            },
          });
      
          DepositDialogref.afterClosed()
            .pipe(takeUntil(this._destroying$))
            .subscribe((result) => {
              if(result == "Success"){
                this.getPatientPreviousDepositDetails();

                console.log("Deposit Dialog closed");
              }
             
            });
        }
      });  
  }

  openinitiatedeposit() {
    this.router.navigate(["out-patient-billing", "initiate-deposit"]);
  }

  ngAfterViewInit(): void {
    this.depositForm.controls["mainradio"].valueChanges.subscribe((value: any) => {
      if (value == "form60") {
        this.matDialog.open(FormSixtyComponent, { width: "50vw", height: "98vh" });
        this.depositForm.controls["panno"].disable();
      }
      else {
        this.depositForm.controls["panno"].enable();
      }
    });

    this.questions[0].elementRef.addEventListener("keypress", (event: any) => {
      // If the user presses the "Enter" key on the keyboard

      if (event.key === "Enter") {
        event.preventDefault();
        if (this.depositForm.value.maxid == "") {
          this.messageDialogService.error("Blank Registration Number is not Allowed");
        }
        else {
          this.iacode = this.depositForm.value.maxid.split(".")[0];
          this.regNumber = Number(this.depositForm.value.maxid.split(".")[1]);
          if ((this.iacode == "" || this.iacode != "0") && this.regNumber != 0) {
            this.getDepositType();
            this.getPatientDetailsForDeposit();
            this.getdepositcashlimit();
          } else {
            this.depositForm.controls["maxid"].setErrors({ incorrect: true });
            this.questions[0].customErrorMessage = "Invalid Max ID";
          }
        }
      }
    });
  }

  getPatientDetailsByMaxId() {
    console.log(this.depositForm.value.maxid);
    this.MaxIDExist = true;
    if (this.regNumber != 0) {
      this.http
        .get(ApiConstants.getpatientpersonaldetails(this.regNumber, this.iacode))
        .pipe(takeUntil(this._destroying$))
        .subscribe(
          (resultData: PatientPersonalDetailInterface) => {
            this.patientpersonaldetails = resultData.getPATIENTDETAILS;
            this.patientservicetype = resultData.getServiceType;

            if (this.patientpersonaldetails.length === 0) {
              this.depositForm.controls["maxid"].setErrors({ incorrect: true });
              this.questions[0].customErrorMessage = "Invalid Max ID";
            }
            else {
              this.depositForm.controls["mobileno"].setValue(this.patientpersonaldetails[0]?.pcellno);
              this.name = this.patientpersonaldetails[0]?.title + ' ' + this.patientpersonaldetails[0]?.firstname + ' ' + this.patientpersonaldetails[0]?.lastname;
              this.age = this.patientpersonaldetails[0]?.age + ' ' + this.patientpersonaldetails[0].agetypename;
              this.gender = this.patientpersonaldetails[0]?.sex;
              this.dob = this.patientpersonaldetails[0]?.dateOfBirth;
              this.nationality = this.patientpersonaldetails[0]?.nationalityName;
              this.ssn = this.patientpersonaldetails[0]?.ssn;

              this.depositForm.controls["panno"].setValue(this.patientpersonaldetails[0]?.paNno);
            }
          },
          (error) => {
            if (error == []) {
              this.depositForm.controls["maxid"].setValue(
                this.iacode + "." + this.regNumber
              );
              this.depositForm.controls["maxid"].setErrors({ incorrect: true });
              this.questions[0].customErrorMessage = "Invalid Max ID";
            }
          }
        );
    }

  }

  getdepositcashlimit(){
    this.http
    .get(ApiConstants.getcashlimitwithlocationsmsdetailsoflocation(this.hspLocationid))
    .pipe(takeUntil(this._destroying$))
    .subscribe((resultData: PatientDepositCashLimitLocationDetail) => {
      this.depositcashlimitationdetails = resultData;
    });
  }

  getDepositType() {
    this.http
      .get(ApiConstants.getadvancetype(this.hspLocationid))
      .pipe(takeUntil(this._destroying$))
      .subscribe((resultData: any) => {
        this.patientdeposittype = resultData;
      });
  }

  getPatientDetailsForDeposit() {
    this.http
      .get(ApiConstants.getpatientdetailsfordeposit(this.regNumber, this.iacode))
      .pipe(takeUntil(this._destroying$))
      .subscribe(
        (resultData) => {
          if (resultData == CheckPatientDetails.Inpatient) {
            this.messageDialogService.error("This Patient is an InPatient");
          }
          else if (resultData == CheckPatientDetails.PatientNotReg) {
            this.messageDialogService.error("This is not a Valid Registration Number");
          }
          else if (resultData == CheckPatientDetails.NoDeposit) {
            this.getPatientDetailsByMaxId();
            this.getPatientPreviousDepositDetails();
          }
          else if (resultData == CheckPatientDetails.HaveDeposit) {
            this.getPatientDetailsByMaxId();
            this.getPatientPreviousDepositDetails();
          }

        });
  }

  getPatientPreviousDepositDetails() {
    this.http
      .get(ApiConstants.getpatientpreviousdepositdetails(this.regNumber, this.iacode))
      .pipe(takeUntil(this._destroying$))
      .subscribe((resultData: PatientPreviousDepositDetail[]) => {
        this.depoistList = resultData;
       
        this.totaldeposit = resultData.map(t => t.deposit).reduce((acc, value) => acc + value, 0);   
        this.totalrefund = resultData.map(t => t.refund).reduce((acc, value) => acc + value, 0);   
        this.avalaibleamount = this.totaldeposit - this.totalrefund;
        this.depositForm.controls["totaldeposit"].setValue(this.totaldeposit);
        this.depositForm.controls["totalrefund"].setValue(this.totalrefund);
        this.depositForm.controls["avalaibledeposit"].setValue(this.avalaibleamount);

      },
      (error) => {
       console.log(error);
      }
      );
  }

  clear(){
    this.questions.reset();
    this._destroying$.next(undefined);
    this._destroying$.complete();
    this.patientDepositDetails = [];
    this.patientpersonaldetails = [];
    this.MaxIDExist = false;
  }

  setvaluestodepositform(){

  }
  depositColumnClick($event: any){
    if($event.row.depositRefund == "Deposit"){
      this.MaxIDdepositExist = true;
    }
    this.patientRefundDetails = $event.row;
  }
}
export const CheckPatientDetails = {
  PatientNotReg: 0,
  Inpatient: 1,
  HaveDeposit: 2,
  NoDeposit: 3
};


