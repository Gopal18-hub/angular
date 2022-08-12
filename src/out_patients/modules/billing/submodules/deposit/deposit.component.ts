import { Component, OnInit, ViewChild , Inject} from '@angular/core';
import { RefundDialogComponent } from './refund-dialog/refund-dialog.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA,} from "@angular/material/dialog";
import { DepositDialogComponent } from './deposit-dialog/deposit-dialog.component';
import { FormGroup } from '@angular/forms';
import { QuestionControlService } from '@shared/ui/dynamic-forms/service/question-control.service';
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { Router, ActivatedRoute } from "@angular/router";
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
import { SimilarPatientDialog } from '@modules/registration/submodules/op-registration/op-registration.component';
import { DepositService } from '@core/services/deposit.service';
import { ReportService } from '@shared/services/report.service';
import { SearchService } from "../../../../../shared/services/search.service";
import { LookupService } from "@core/services/lookup.service";

@Component({
  selector: 'out-patients-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.scss']
})
export class DepositComponent implements OnInit {

  constructor(public matDialog: MatDialog, private formService: QuestionControlService,
    private router: Router, private http: HttpService, private cookie: CookieService,
    private messageDialogService: MessageDialogService,
    private depositservice: DepositService,
    private reportService: ReportService,
    private searchService: SearchService,  private route: ActivatedRoute,
    private lookupService: LookupService,) {
      this.route.queryParams
      .pipe(takeUntil(this._destroying$))
      .subscribe(async (value) => {
        console.log(Object.keys(value).length);
        if (Object.keys(value).length > 0) {         
          //const lookupdata = await this.loadGrid(value);        
        }
        });
     }

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
        title: "Mobile No.",
        pattern: "^[1-9]{1}[0-9]{9}",
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
        defaultValue: "0.00",
        readonly: true
      },
      avalaibledeposit: {
        type: "string",
        defaultValue: "0.00",
        readonly: true
      },
      totalrefund: {
        type: "string",
        defaultValue: "0.00",
        readonly: true
      },
      remarks: {
        type: "textarea",
        defaultValue: "Write Remarks"
      },
      panno: {
        type: "string",
        readonly: true,
        title: "Pan card No.",
      },
      mainradio: {
        type: "radio",
        required: false,
        options: [
          { title: "Form 60", value: "form60" },
          { title: "Pan card No.", value: "pancardno" },
        ],
        readonly: true
      },
    }
  }

  depositconfig: any = {
    clickedRows: true,
    clickSelection: "single",
    dateformat: "dd/MM/yyyy - hh:mm",
    selectBox: true,
    groupby: {
      parentcolumn: "cashTransactionID",
      childcolumn: "parentID",
    },
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
        type: "number",
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
        tooltipColumn: "advanceType",
      },
      serviceTypeName: {
        title: "Service Type",
        type: "string",
        style: {
          width: "7rem",
        },
        tooltipColumn: "serviceTypeName",
      },
      operatorName: {
        title: "Operator Name & ID",
        type: "string",
        style: {
          width: "10rem",
        },
        tooltipColumn: "operatorName",
      },
      remarks: {
        title: "Remarks",
        type: "string",
        style: {
          width: "7rem",
        },
        tooltipColumn: "remarks",
      },
     
    },
  };

  name: string | undefined;
  age: string | undefined;
  gender: string | undefined;
  dob: string | undefined;
  nationality: string | undefined;
  ssn: string | undefined;
  lastUpdatedBy: string = "";
  currentTime: string = new Date().toLocaleString();
  categoryIcons: [] = [];
  similarContactPatientList: SimilarSoundPatientResponse[] = [];
  tableselectionexists:boolean = false;

  depositForm !: FormGroup;
  questions: any;
  patientRefundDetails: any = [];
  patientpersonaldetails: any = [];
  depositcashlimitationdetails: any=[];
  patientservicetype: any;
  patientdeposittype: any;
  regNumber: number = 0;
  iacode: string | undefined;
  hspLocationid:any =  Number(this.cookie.get("HSPLocationId"));
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
    this.lastUpdatedBy = this.cookie.get("UserName"); 
    this.depositForm.controls["panno"].disable();
    this.depositForm.controls["mainradio"].disable();

    this.searchService.searchTrigger
    .pipe(takeUntil(this._destroying$))
    .subscribe(async (formdata: any) => {
      console.log(formdata);
      this.router.navigate([], {
        queryParams: {},
        relativeTo: this.route,
      });
      const lookupdata = await this.lookupService.searchPatient(formdata);
        console.log(lookupdata);
        if (lookupdata.length == 1) {
          if (lookupdata[0] && "maxid" in lookupdata[0]) {
            this.depositForm.value.maxid = lookupdata[0]["maxid"];            
          this.iacode = this.depositForm.value.maxid.split(".")[0];
          this.regNumber = Number(this.depositForm.value.maxid.split(".")[1]);
            this.getPatientDetailsForDeposit();           
          }
        }else if (lookupdata.length > 1){
          const similarSoundDialogref = this.matDialog.open( SimilarPatientDialog,
            {
              width: "60vw",
              height: "80vh",
              data: {
                searchResults: lookupdata,
              },
            }
          );

          similarSoundDialogref
            .afterClosed()
            .pipe(takeUntil(this._destroying$))
            .subscribe((result: any) => {
              if (result) {
                console.log(result.data["added"][0].maxid);
                let maxID = result.data["added"][0].maxid;
                this.depositForm.controls["maxid"].setValue(maxID);
               
                      this.iacode = maxID.split(".")[0];
                      this.regNumber = Number(maxID.split(".")[1]);
                      this.depositForm.controls["maxid"].setValue(maxID);
                      this.getPatientDetailsByMaxId();
                      this.getPatientPreviousDepositDetails();
              }

              //this.similarContactPatientList = [];
            });
        }
    });

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
    this.router.navigate(["out-patient-billing", "initiate-deposit"], {
      queryParams: { maxId: this.depositForm.value.maxid },
    });
  }

  ngAfterViewInit(): void {   

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
          if ((this.iacode != "" && this.iacode != "0") && (this.regNumber != 0 && !Number.isNaN(Number(this.regNumber)))) {
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
    this.questions[1].elementRef.addEventListener("keydown", (event: any) => {
      console.log(event);
      if (event.key === "Enter" || event.key === "Tab") {
        event.preventDefault();
        this.mobilechange();
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
              this.depositForm.controls["maxid"].setValue(this.patientpersonaldetails[0]?.iacode + '.' + this.patientpersonaldetails[0]?.registrationno);   

              this.categoryIcons = this.depositservice.getCategoryIconsForDeposit(
                this.patientpersonaldetails[0]
              );
             console.log(this.categoryIcons);
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
            this.messageDialogService.error("This is not a valid Registration Number");
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
           
        this.totaldeposit = resultData.filter((dp) => dp.depositRefund == "Deposit").map(t => t.deposit).reduce((acc, value) => acc + value, 0);   
        this.totalrefund = resultData.filter((dp) => dp.depositRefund == "Refund").map(t => t.refund).reduce((acc, value) => acc + value, 0);   
        this.avalaibleamount = this.totaldeposit - this.totalrefund;
        this.depositForm.controls["totaldeposit"].setValue(this.totaldeposit.toFixed(2));
        this.depositForm.controls["totalrefund"].setValue(this.totalrefund.toFixed(2));
        this.depositForm.controls["avalaibledeposit"].setValue(this.avalaibleamount.toFixed(2));
        

        resultData = resultData.map((item: any) => {
          item.usedIP =  item.usedIP.toFixed(2);
          item.usedOP =  item.usedOP.toFixed(2);
          item.balance = item.balance.toFixed(2);
          item.refund = item.refund.toFixed(2);
          item.deposit = item.deposit.toFixed(2);
          item.gst = item.gst.toFixed(2);
          item.gstValue = item.gstValue.toFixed(2);
          return item;
        });
        
        this.depoistList = resultData;   
        setTimeout(() => {
          this.deposittable.selection.changed
          .pipe(takeUntil(this._destroying$))
          .subscribe((res: any) => {
            if (this.deposittable.selection.selected.length > 0) {
              this.tableselectionexists = true;
            } else {
              this.tableselectionexists = false;
            }
          });
        });   

      },
      (error) => {
       console.log(error);
      }
      );
  }

  clearDepositpage(){
    this._destroying$.next(undefined);
    this._destroying$.complete();
    this.depositForm.reset();
    this.depositForm.controls["maxid"].setValue(this.cookie.get("LocationIACode") + ".");
    this.name = "";
    this.age= "";
    this.gender= "";
    this.dob= "";
    this.nationality= "";
    this.ssn= "";
    this._destroying$.next(undefined);
    this._destroying$.complete();
    this.patientpersonaldetails = [];
    this.depoistList = [];
    this.MaxIDExist = false;
    this.MaxIDdepositExist = false;
    this.tableselectionexists = false;
    this.categoryIcons = [];
    this.depositForm.controls["totaldeposit"].setValue("0.00");
    this.depositForm.controls["totalrefund"].setValue("0.00");
    this.depositForm.controls["avalaibledeposit"].setValue("0.00");
  }

  depositColumnClick($event: any){
    if($event.row.depositRefund == "Deposit"){
      this.MaxIDdepositExist = true;
    }
    this.patientRefundDetails = $event.row;
  }

  mobilechange()
  {
    if(this.depositForm.value.mobileno.length == 10)
    console.log('mobile changed');
    this.matDialog.closeAll();
    console.log(this.similarContactPatientList.length);
      this.http
        .post(ApiConstants.similarSoundPatientDetail, {
          phone: this.depositForm.value.mobileno,
        })
        .pipe(takeUntil(this._destroying$))
        .subscribe(
          (resultData: SimilarSoundPatientResponse[]) => {
            this.similarContactPatientList = resultData;
            console.log(this.similarContactPatientList);           
             {
              if (this.similarContactPatientList.length != 0) {               
                const similarSoundDialogref = this.matDialog.open(
                  SimilarPatientDialog,
                  {
                    width: "60vw",
                    height: "65vh",
                    data: {
                      searchResults: this.similarContactPatientList,
                    },
                  }
                );
                similarSoundDialogref
                  .afterClosed()
                  .pipe(takeUntil(this._destroying$))
                  .subscribe((result) => {
                    if (result) {
                      console.log(result.data["added"][0].maxid);
                      let maxID = result.data["added"][0].maxid;
                      this.iacode = maxID.split(".")[0];
                      this.regNumber = Number(maxID.split(".")[1]);
                      this.depositForm.controls["maxid"].setValue(maxID);
                      this.getPatientDetailsByMaxId();
                      this.getPatientPreviousDepositDetails();
                    }
                    this.similarContactPatientList = [];
                  });
              } else {
                this.depositForm.controls["mobile"].setErrors({incorrect: true});
                this.questions[1].customErrorMessage = "Invalid Mobile No";
                console.log("no data found");
              }
            }
          },
          (error) => {
            console.log(error);
            this.messageDialogService.info(error.error);
          }
        );
  }

  printpatientreceipt(){
    this.deposittable.selection.selected.map((s: any) => {
      this.reportService.openWindow("DepositReport", "DepositReport", {
        receiptnumber: s.receiptno,
        locationID: this.hspLocationid
      });
    });
  }
}
export const CheckPatientDetails = {
  PatientNotReg: 0,
  Inpatient: 1,
  HaveDeposit: 2,
  NoDeposit: 3
};


