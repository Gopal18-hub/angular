import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";
import { CookieService } from "@shared/services/cookie.service";
import { ApiConstants } from "@core/constants/ApiConstants";
import { takeUntil } from "rxjs";
import { getExpiredDepositReportModel } from "@core/models/getExpiredDepositReportmodel.Model";
import { ActivatedRoute, Router } from "@angular/router";
import { SimilarSoundPatientResponse } from "@core/models/getsimilarsound.Model";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { getPatientHistoryModel } from "@core/models/getPatientHistoryModel.Model";
import { getRegisteredPatientDetailsModel } from "@core/models/getRegisteredPatientDetailsModel.Model";
import { SimilarPatientDialog } from "../billing/billing.component";

@Component({
  selector: "out-patients-expired-deposits",
  templateUrl: "./expired-deposits.component.html",
  styleUrls: ["./expired-deposits.component.scss"],
})
export class ExpiredDepositsComponent implements OnInit {
  similarContactPatientList: SimilarSoundPatientResponse[] = [];
  public ExpiredDepositformlist: getExpiredDepositReportModel[] = [];
  public patienthistorylist: getPatientHistoryModel[] = [];
  public patientDetails: getRegisteredPatientDetailsModel[] = [];

  ExpiredDepositformData = {
    title: "",
    type: "object",
    properties: {
      maxid: {
        type: "string",
        defaultValue: this.cookie.get("LocationIACode") + ".",
      },
      mobile: {
        title: "Mobile No",
        type: "number",
        pattern: "^[1-9]{1}[0-9]{9}",
      },
      fromdate: {
        type: "date",
      },
      todate: {
        type: "date",
      },
    },
  };
  ExpiredDepositform!: FormGroup;
  questions: any;

  ExpiredDepositconfig = {
    clickedRows: false,
    clickSelection: "multiple",
    dateformat: "dd/MM/yyyy",
    selectBox: false,
    displayedColumns: [
      "receiptno",
      "maxid",
      "datetime",
      "deposit",
      "usedop",
      "usedip",
      "refund",
      "balance",
      "checkdd",
      "executeddate",
      "executedof",
      "episode",
    ],
    columnsInfo: {
      receiptno: {
        title: "Receipt No",
        type: "number",
        tooltipColumb: "receiptno",
        style: {
          width: "6.5rem",
        },
      },
      maxid: {
        title: "Max ID",
        type: "string",
        tooltipColumb: "maxid",
        style: {
          width: "6.5rem",
        },
      },
      datetime: {
        title: "Date & Time",
        type: "Datetime",
        tooltipColumb: "datetime",
        style: {
          width: "6.5rem",
        },
      },
      deposit: {
        title: "Deposit ",
        type: "decimal",
        tooltipColumb: "deposit",
        style: {
          width: "6.5rem",
        },
      },
      usedop: {
        title: "Used(OP)",
        type: "number",
        tooltipColumb: "Usedop",
        style: {
          width: "4.5rem",
        },
      },
      usedip: {
        title: "Used(IP)",
        type: "number",
        tooltipColumb: "usedip",
        style: {
          width: "6.5rem",
        },
      },
      refund: {
        title: "Refund",
        type: "string",
        tooltipColumb: "refund",
        style: {
          width: "6.5rem",
        },
      },
      balance: {
        title: "Balance",
        type: "string",
        tooltipColumb: "balance",
        style: {
          width: "7.5rem",
        },
      },
      checkdd: {
        title: "Check/DD",
        type: "string",
        tooltipColumb: "checkdd",
        style: {
          width: "6.5rem",
        },
      },
      executeddate: {
        title: "Executed Date",
        type: "date",
        tooltipColumb: "executeddate",
        style: {
          width: "6.5rem",
        },
      },
      executedof: {
        title: "Executed Of",
        type: "string",
        tooltipColumb: "executedof",
        style: {
          width: "6.5rem",
        },
      },
      episode: {
        title: "Episode",
        type: "string",
        tooltipColumb: "episode",
        style: {
          width: "6.5rem",
        },
      },
      disabledSort: true,
    },
  };
  // data: any[] = [
  //   {
  //     receiptno: "BLDP24512",
  //     maxid: "BLKH.101",
  //     datetime: "05/11/2022",
  //     deposit: "06/11/2022",
  //     usedop: "0",
  //     usedip: "0",
  //     refund: "0",
  //     balance: "0",
  //     checkdd: "0.00",
  //     executeddate: "05/11/2022",
  //     executedof: "NA",
  //     episode: "SA12",
  //   },
  // ];
  searchbtn: boolean = true;
  clearbtn: boolean = true;
  datepipe: any;
  http: any;
  showtable!: boolean;
  private _destroying$: any;
  iacode: any;
  registrationno: any;
  today: any;
  fromdate: any;
  lookupService: any;
  apiProcessing: boolean = false;
  pname: any;
  age: any;
  gender: any;
  dob: any;
  nationality: any;
  ssn: any;
  msgdialog: any;

  constructor(
    private formService: QuestionControlService,
    private router: Router,
    private route: ActivatedRoute,
    public matDialog: MatDialog,

    private cookie: CookieService
  ) {
    this.route.queryParams
      .pipe(takeUntil(this._destroying$))
      .subscribe(async (value) => {
        console.log(Object.keys(value).length);
        if (Object.keys(value).length > 0) {
          const lookupdata = await this.loadGrid(value);
        } else {
          this.ngOnInit();
          this.clear();
        }
      });
  }
  async loadGrid(formdata: any): Promise<any> {
    let lookupdata: string | any[];
    if (!formdata.data) {
      lookupdata = await this.lookupService.searchPatient({
        data: formdata,
      });
    } else {
      lookupdata = await this.lookupService.searchPatient(formdata);
    }

    console.log(lookupdata);
    if (lookupdata.length == 1) {
      if (lookupdata[0] && "maxid" in lookupdata[0]) {
        this.iacode = this.ExpiredDepositform.value.maxid.split(".")[0];
        this.ExpiredDepositform.controls["maxid"].setValue(
          lookupdata[0]["maxid"]
        );
        this.registrationno = Number(
          this.ExpiredDepositform.value.maxid.split(".")[1]
        );
        this.getPatientDetails();
        this.clearbtn = false;
      }
    } else if (lookupdata.length > 1) {
      const similarSoundDialogref = this.matDialog.open(SimilarPatientDialog, {
        width: "60vw",
        height: "80vh",
        data: {
          searchResults: lookupdata,
        },
      });

      similarSoundDialogref
        .afterClosed()
        .pipe(takeUntil(this._destroying$))
        .subscribe((result: any) => {
          if (result) {
            console.log(result.data["added"][0].maxid);
            let maxID = result.data["added"][0].maxid;
            this.ExpiredDepositform.controls["maxid"].setValue(maxID);

            this.iacode = maxID.split(".")[0];
            this.registrationno = Number(maxID.split(".")[1]);
            this.ExpiredDepositform.controls["maxid"].setValue(maxID);
            this.getPatientDetails();
            this.clearbtn = false;
          }

          this.similarContactPatientList = [];
        });
    }
  }

  ngOnInit(): void {
    let formResult = this.formService.createForm(
      this.ExpiredDepositformData.properties,
      {}
    );
    this.ExpiredDepositform = formResult.form;
    this.questions = formResult.questions;
    this.today = new Date();
    this.ExpiredDepositform.controls["todate"].setValue(this.today);
    this.fromdate = new Date(this.today);
    this.fromdate.setDate(this.fromdate.getDate() - 20);
    this.ExpiredDepositform.controls["fromdate"].setValue(this.fromdate);
    this.questions[2].maximum =
      this.ExpiredDepositform.controls["todate"].value;
    this.questions[3].minimum =
      this.ExpiredDepositform.controls["fromdate"].value;
  }
  expireddepositsearch() {
    this.apiProcessing = true;
    console.log(this.ExpiredDepositform.value);
    this.http
      .get(
        ApiConstants.getExpiredDepositReport(
          (this.iacode =
            this.ExpiredDepositform.controls["maxid"].value.split(".")[0]),
          (this.registrationno =
            this.ExpiredDepositform.controls["maxid"].value.split(".")[1]),
          this.datepipe.transform(
            this.ExpiredDepositform.value.startdate,
            "YYYY-MM-dd"
          ),
          this.datepipe.transform(
            this.ExpiredDepositform.value.todate,
            "YYYY-MM-dd"
          )
        )
      )

      .pipe(takeUntil(this._destroying$))
      .subscribe((resultdata: any) => {
        console.log(resultdata);
        if (resultdata.length > 0) {
          console.log("data");
          this.ExpiredDepositformlist = resultdata;
        }
      });
  }

  getPatientDetails() {
    this.apiProcessing = true;
    this.showtable = false;
    this.clearbtn = false;
    let registrationno = Number(
      this.ExpiredDepositform.value.maxid.split(".")[1]
    );
    let iacode = this.ExpiredDepositform.value.maxid.split(".")[0];
    this.http
      .get(ApiConstants.getregisteredpatientdetails(iacode, registrationno))
      .pipe(takeUntil(this._destroying$))
      .subscribe(
        (resultData: getRegisteredPatientDetailsModel[]) => {
          console.log(resultData);
          if (resultData == null) {
            this.ExpiredDepositform.controls["maxid"].setErrors({
              incorrect: true,
            });
            this.questions[0].customErrorMessage = "Invalid MaxID";
            // this.msgdialog.info("Registration number does not exist");
            this.apiProcessing = false;
            this.showtable = true;
          } else if (resultData.length == 0) {
            this.ExpiredDepositform.controls["maxid"].setErrors({
              incorrect: true,
            });
            this.questions[0].customErrorMessage = "Invalid MaxID";
            // this.msgdialog.info("Registration number does not exist");
            this.apiProcessing = false;
            this.showtable = true;
          } else {
            this.patientDetails = resultData;
            this.pname =
              this.patientDetails[0].firstName +
              " " +
              this.patientDetails[0].middleName +
              " " +
              this.patientDetails[0].lastName;
            this.age =
              this.patientDetails[0].age +
              " " +
              this.patientDetails[0].ageTypeName;
            this.gender = this.patientDetails[0].genderName;
            this.dob = this.datepipe.transform(
              this.patientDetails[0].dateOfBirth,
              "dd/MM/YYYY"
            );
            this.nationality = this.patientDetails[0].nationality;
            this.ssn = this.patientDetails[0].ssn;
            this.ExpiredDepositform.controls["mobile"].setValue(
              this.patientDetails[0].mobileNo
            );
            this.questions[0].readonly = true;
            this.searchbtn = false;
            this.apiProcessing = false;
            this.showtable = true;
            this.expireddepositsearch();
          }
        }
        // (error) => {
        //   console.log(error);
        //   this.ExpiredDepositform.controls["maxid"].setErrors({
        //     incorrect: true,
        //   });
        //   this.questions[0].customErrorMessage = "Invalid MaxID";
        //   this.msgdialog.info("Registration number does not exist");
        //   this.apiProcessing = false;
        //   this.showtable = true;
        // }
      );
  }
  clear() {
    this.ExpiredDepositform.reset();
    this.pname = "";
    this.age = "";
    this.gender = "";
    this.dob = "";
    this.nationality = "";
    this.ssn = "";
    this.today = new Date();
    this.ExpiredDepositform.controls["todate"].setValue(this.today);
    this.fromdate = new Date(this.today);
    this.fromdate.setDate(this.fromdate.getDate() - 20);
    this.ExpiredDepositform.controls["fromdate"].setValue(this.fromdate);
    this.questions[0].readonly = false;
    this.ExpiredDepositform.controls["maxid"].setValue(
      this.cookie.get("LocationIACode") + "."
    );
    this.patientDetails = [];
    this.searchbtn = true;
    this.patienthistorylist = [];
    this.apiProcessing = false;
    this.showtable = true;
    this.clearbtn = true;
    this.router.navigate(["expired-deposit"]).then(() => {
      window.location.reload;
    });
  }
  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
