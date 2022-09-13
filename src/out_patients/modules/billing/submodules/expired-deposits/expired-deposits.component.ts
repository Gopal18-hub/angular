import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";
import { CookieService } from "@shared/services/cookie.service";
import { ApiConstants } from "@core/constants/ApiConstants";
import { Subject, takeUntil } from "rxjs";
import { getExpiredDepositReportModel } from "@core/models/getExpiredDepositReportmodel.Model";
import { ActivatedRoute, Router } from "@angular/router";
import { SimilarSoundPatientResponse } from "@core/models/getsimilarsound.Model";
import { AsyncPipe, DatePipe } from "@angular/common";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { getPatientHistoryModel } from "@core/models/getPatientHistoryModel.Model";
import { getRegisteredPatientDetailsModel } from "@core/models/getRegisteredPatientDetailsModel.Model";
import { SimilarPatientDialog } from "../billing/billing.component";
import { HttpService } from "@shared/services/http.service";
import { LookupService } from "@core/services/lookup.service";
import { SearchService } from "@shared/services/search.service";
import { SimilarDetailsPopupComponent } from "@modules/patient-history/similar-details-popup/similar-details-popup.component";
import { MessageDialogService } from "@shared/ui/message-dialog/message-dialog.service";

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
        format: "YYYY/MM/dd",
      },
      todate: {
        type: "date",
        format: "YYYY/MM/dd",
      },
    },
  };
  ExpiredDepositform!: FormGroup;
  questions: any;

  ExpiredDepositconfig = {
    clickedRows: true,
    clickSelection: "single",
    actionItems: false,
    dateformat: "dd/MM/yyyy",
    selectBox: true,
    displayedColumns: [
      "receiptno",
      "uhid",
      "datetime",
      "deposit",
      "usedOP",
      "usedIP",
      "refund",
      "balance",
      "checkDD",
      "executeDate",
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
      uhid: {
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
      usedOP: {
        title: "Used(OP)",
        type: "number",
        tooltipColumb: "Usedop",
        style: {
          width: "6.5rem",
        },
      },
      usedIP: {
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
          width: "6.5rem",
        },
      },
      checkDD: {
        title: "Check/DD",
        type: "string",
        tooltipColumb: "checkdd",
        style: {
          width: "6.5rem",
        },
      },
      executeDate: {
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
  showtable!: boolean;
  iacode: any;
  registrationno: any;
  // today: any;
  // fromdate: any;
  apiProcessing: boolean = false;
  pname: any;
  age: any;
  gender: any;
  dob: any;
  nationality: any;
  ssn: any;
  msgdialog: any;
  private readonly _destroying$ = new Subject<void>();
  @ViewChild("table") tablerow: any;
  constructor(
    private formService: QuestionControlService,
    private router: Router,
    private route: ActivatedRoute,
    public matDialog: MatDialog,
    private http: HttpService,
    private cookie: CookieService,
    private lookupService: LookupService,
    private datepipe: DatePipe,
    private searchService: SearchService,
    private dialogService: MessageDialogService
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
  fromdate: any;
  today: any;
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
            this.ExpiredDepositform.controls["maxid"].setValue(
              lookupdata[0]["maxid"]
            );
            this.ExpiredDepositform.value.maxid = lookupdata[0]["maxid"];
            this.getPatientDetails();
          }
        } else {
          const similarSoundDialogref = this.matDialog.open(
            SimilarPatientDialog,
            {
              width: "60vw",
              height: "65vh",
              data: {
                searchResults: lookupdata,
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
                this.ExpiredDepositform.controls["maxid"].setValue(maxID);
                this.getPatientDetails();
                this.clearbtn = false;
              }
              this.similarContactPatientList = [];
            });
        }
      });
  }
  expireddepositsearch() {
    this.apiProcessing = true;
    console.log(this.ExpiredDepositform.value);
    let registrationno = Number(
      this.ExpiredDepositform.value.maxid.split(".")[1]
    );
    let iacode = this.ExpiredDepositform.value.maxid.split(".")[0];
    if (registrationno != 0) {
      this.http
        .get(
          ApiConstants.getPatientExpiredDepositDetails(
            (this.iacode =
              this.ExpiredDepositform.controls["maxid"].value.split(".")[0]),
            (this.registrationno =
              this.ExpiredDepositform.controls["maxid"].value.split(".")[1]),
            this.datepipe.transform(
              this.ExpiredDepositform.value.fromdate,
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
  }
  ngAfterViewInit(): void {
    this.questions[1].elementRef.addEventListener("keypress", (event: any) => {
      console.log(event);
      if (event.key === "Enter") {
        event.preventDefault();
        var digit = this.ExpiredDepositform.value.mobile.toString().length;
        if (digit == 10) {
          this.mobilechange();
        }
      }
    });
    this.questions[1].elementRef.addEventListener("keydown", (event: any) => {
      console.log(event);
      if (event.key === "Tab") {
        var digit = this.ExpiredDepositform.value.mobile.toString().length;
        if (digit == 10) {
          this.mobilechange();
        }
      }
    });
    this.tablerow.selection.changed.subscribe((res: any) => {
      console.log(res);
      if (this.tablerow.selection.selected.length > 0) {
        console.log("table selected");
      }
    });
    console.log(this.ExpiredDepositform);
    // setTimeout(() => {
    //   this.ExpiredDepositform.valueChanges.subscribe((val) => {
    //     console.log("val");
    //     console.log(val);
    //     this.clearbtn = false;
    //   });
    // }, 300);
  }
  mobilechange() {
    console.log("mobile changed");
    this.matDialog.closeAll();
    console.log(this.similarContactPatientList.length);
    this.http
      .post(ApiConstants.similarSoundPatientDetail, {
        phone: this.ExpiredDepositform.value.mobile,
      })
      .pipe(takeUntil(this._destroying$))
      .subscribe(
        (resultData: SimilarSoundPatientResponse[]) => {
          this.similarContactPatientList = resultData;
          console.log(this.similarContactPatientList);
          if (this.similarContactPatientList.length == 1) {
            console.log(this.similarContactPatientList[0]);
            let maxID = this.similarContactPatientList[0].maxid;
            this.ExpiredDepositform.controls["maxid"].setValue(maxID);
            this.getPatientDetails();
          } else {
            if (this.similarContactPatientList.length != 0) {
              let dialogRef = this.matDialog.open(
                SimilarDetailsPopupComponent,
                { width: "30vw", height: "30vh" }
              );
              dialogRef.afterClosed().subscribe((result) => {
                console.log(result);
              });
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
                    this.ExpiredDepositform.controls["maxid"].setValue(maxID);
                    this.getPatientDetails();
                  }
                  this.similarContactPatientList = [];
                });
            } else {
              this.ExpiredDepositform.controls["mobile"].setErrors({
                incorrect: true,
              });
              this.questions[1].customErrorMessage = "Invalid Mobile No";
              console.log("no data found");
            }
          }
        }
        // (error) => {
        //   console.log(error);
        //   this.msgdialog.info(error.error);
        // }
      );
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
  activeClick(event: any) {
    console.log(event);
  }
  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
