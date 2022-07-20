import { Component, OnInit, ViewChild } from '@angular/core';
import { RefundDialogComponent } from './refund-dialog/refund-dialog.component';
import { MatDialog } from '@angular/material/dialog';
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
import { PatientPersonalDetails } from "@core/types/PatientPersonalDetail";
import { PatientDepositDetails } from "@core/types/PatientDepositDetail";
import { MessageDialogService } from '@shared/ui/message-dialog/message-dialog.service';
import { PatientPreviousDepositDetail } from "@core/models/patientpreviousdepositdetailModel.Model";

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
        defaultValue: "pancardno",
      },
    }
  }

  depositconfig: any = {
    clickedRows: true,
    clickSelection: "multiple",
    dateformat: "dd/MM/yyyy",
    selectBox: true,
    displayedColumns: [
      "deposittype",
      "receiptno",
      "datetime",
      "deposit",
      "usedop",
      "usedip",
      "refund",
      "balance",
      "taxpercentage",
      "totaltaxvalue",
      "deposithead",
      "servicetype",
      "operatornameid",
    ],
    columnsInfo: {
      deposittype: {
        title: "Deposit Type",
        type: "string",
      },
      receiptno: {
        title: "Receipt No.",
        type: "number",
      },
      datetime: {
        title: "Date & Time",
        type: "date",
      },
      deposit: {
        title: "Deposit",
        type: "string",
        tooltipColumn: "modifiedPtnName",
      },
      usedop: {
        title: "Used(OP)",
        type: "string",
      },
      usedip: {
        title: "Used(IP)",
        type: "number",
      },
      refund: {
        title: "Refund",
        type: "string",
        tooltipColumn: "uEmail",
      },
      balance: {
        title: "Balance",
        type: "string",
      },
      taxpercentage: {
        title: "Tax %",
        type: "checkbox",
      },
      totaltaxvalue: {
        title: "Total Tax Value",
        type: "number",
      },
      deposithead: {
        title: "Deposit Head",
        type: "string",
      },
      servicetype: {
        title: "Service Type",
        type: "string",
      },
      operatornameid: {
        title: "Operator Name & ID",
        type: "string",
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
  patientDepositDetails: any;
  patientpersonaldetails: any;
  patientservicetype: any;
  patientdeposittype: any;
  regNumber: number = 0;
  iacode: string | undefined;
  hspLocationid: any = 69;// Number(this.cookie.get("HSPLocationId"));
  depoistList: PatientPreviousDepositDetail[] = [];
  MaxIDExist: boolean = false;
  MaxIDRefundExist: boolean = false;

  private readonly _destroying$ = new Subject<void>();

  ngOnInit(): void {
    let formResult = this.formService.createForm(
      this.depositformdata.properties, {}
    );
    this.depositForm = formResult.form;
    this.questions = formResult.questions;   
    }
  openrefunddialog() {
    this.matDialog.open(RefundDialogComponent, {
      width: "70vw",
      height: "98vh",
      data: {
        Mobile: 9898989898,
        Mail: "mail@gmail.com"
      }
    });
  }
  openDepositdialog() {
    const DepositDialogref = this.matDialog.open(DepositDialogComponent, {
      width: '70vw', height: '98vh', data: {
        servicetype: this.patientservicetype, deposittype: this.patientdeposittype,
        patientinfo: {
          emailId: this.patientpersonaldetails[0]?.pEMail  , mobileno: this.patientpersonaldetails[0]?.pcellno,
          panno : this.patientpersonaldetails[0]?.paNno
        }
      
      },
    });

    DepositDialogref.afterClosed()
      .pipe(takeUntil(this._destroying$))
      .subscribe((result) => {
        console.log("Deposit Dialog closed");
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
          (resultData: PatientPersonalDetails) => {
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
          }
          else if (resultData == CheckPatientDetails.HaveDeposit) {
            this.getPatientDetailsByMaxId();
          }

        });
  }

  getPatientPreviousDepositDetails() {
    this.http
      .get(ApiConstants.getpatientpreviousdepositdetails(this.regNumber, this.iacode))
      .pipe(takeUntil(this._destroying$))
      .subscribe((resultData: any) => {
        this.depoistList = resultData;
      });
  }
}
export const CheckPatientDetails = {
  PatientNotReg: 0,
  Inpatient: 1,
  HaveDeposit: 2,
  NoDeposit: 3
};

