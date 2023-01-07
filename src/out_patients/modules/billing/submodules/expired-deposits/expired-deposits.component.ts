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
import { ExpdepositRefundDialogComponent } from "./expdeposit-refund-dialog/expdeposit-refund-dialog.component";
import { ExpdepositCheckddDialogComponent } from "./expdeposit-checkdd-dialog/expdeposit-checkdd-dialog.component";
import { ThisReceiver } from "@angular/compiler";
import { MaxHealthSnackBarService } from "@shared/ui/snack-bar";

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

  response: any;
  ExpiredDepositformData = {
    title: "",
    type: "object",
    properties: {
      maxid: {
        title: "MaxID",
        type: "string",
        //required: false,
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
    clickedRows: false,
    clickSelection: "single",
    actionItems: false,
    dateformat: "dd/MM/yyyy",
    selectBox: true,
    rowLayout: { dynamic: { rowClass: "'isExpdeop'+row['isExpdeop']" } }, //"'isExpdeop'+row['isExpdeop']"
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
      "executeBy",
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
          width: "5.5rem",
        },
      },
      datetime: {
        title: "Date & Time",
        type: "Datetime",
        tooltipColumb: "datetime",
        style: {
          width: "8.5rem",
        },
      },
      deposit: {
        title: "Deposit ",
        type: "decimal",
        tooltipColumb: "deposit",
        style: {
          width: "3.5rem",
        },
      },
      usedOP: {
        title: "Used(OP)",
        type: "number",
        tooltipColumb: "Usedop",
        style: {
          width: "5.5rem",
        },
      },
      usedIP: {
        title: "Used(IP)",
        type: "number",
        tooltipColumb: "usedip",
        style: {
          width: "3.5rem",
        },
      },
      refund: {
        title: "Refund",
        type: "string",
        tooltipColumb: "refund",
        style: {
          width: "5rem",
        },
      },
      balance: {
        title: "Balance",
        type: "string",
        tooltipColumb: "balance",
        style: {
          width: "3.5rem",
        },
      },
      checkDD: {
        title: "Check/DD",
        type: "string",
        tooltipColumb: "checkdd",
        style: {
          width: "4.5rem",
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
      executeBy: {
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

  searchbtn: boolean = true;
  clearbtn: boolean = true;
  exportbtn = true;
  showtable: boolean = true;
  iacode: any;
  registrationno: any;
  apiProcessing: boolean = false;
  pname: any;
  age: any;
  gender: any;
  dob: any;
  nationality: any;
  ssn: any;
  msgdialog: any;
  private readonly _destroying$ = new Subject<void>();
  @ViewChild("expireTable") tablerow: any;
  onDelete: boolean = false;
  OpenCheckdddialog: boolean = false;
  messageDialogService: any;
  sucessflag = false;
  selectedrowid = 0;
  checkDD: any;
  regNumber: any;
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
    private dialogService: MessageDialogService,
    private snackbar: MaxHealthSnackBarService
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
    this.searchbtn = false;
    this.today = new Date();
    this.ExpiredDepositform.controls["todate"].setValue(this.today);
    this.fromdate = new Date(this.today);
    this.fromdate.setDate(this.fromdate.getDate());
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
                this.exportbtn = true;
              }
              this.similarContactPatientList = [];
            });
        }
      });
  }
  expireddepositsearch() {
    //this.getPatientDetails();
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
            "",
            ""
          )
        )

        .pipe(takeUntil(this._destroying$))
        .subscribe((resultdata: any) => {
          console.log(resultdata);
          if (resultdata.length > 0) {
            //this.sucessflag = false;
            console.log("data");
            this.ExpiredDepositformlist = resultdata;
            this.exportbtn = false;
            this.tablerow.selection.clear();
            this.ExpiredDepositformlist.forEach((e: any) => {
              console.log(e);
              if (e.checkDD != "") {
                e.isExpdeop = "isExpdeop";
              }
            });
            this.ExpiredDepositformlist = [...this.ExpiredDepositformlist];
            //this.getPatientDetails();
            this.apiProcessing = false;
            this.searchbtn = true;
          } else {
            this.apiProcessing = false;
            this.snackbar.open("MAXID Has No Expired Deposits");
          }
        });
    } else if (registrationno == 0) {
      this.http
        .get(
          ApiConstants.getPatientExpiredDepositDetails(
            (this.iacode = ""),
            (this.registrationno = 0),
            this.datepipe.transform(
              this.ExpiredDepositform.controls["fromdate"].value,
              "yyyy-MM-dd"
            ),
            this.datepipe.transform(
              this.ExpiredDepositform.controls["todate"].value,
              "yyyy-MM-dd"
            )
          )
        )

        .pipe(takeUntil(this._destroying$))
        .subscribe((resultdata: any) => {
          console.log(resultdata);
          if (resultdata.length > 0) {
            //this.sucessflag = false;
            console.log("data");
            this.ExpiredDepositformlist = resultdata;
            this.exportbtn = false;
            this.tablerow.selection.clear();
            this.ExpiredDepositformlist.forEach((e: any) => {
              console.log(e);
              if (e.checkDD != "") {
                e.isExpdeop = "isExpdeop";
              }
            });
            this.ExpiredDepositformlist = [...this.ExpiredDepositformlist];
            this.apiProcessing = false;
            this.searchbtn = true;
          } else {
            this.apiProcessing = false;
            this.snackbar.open(
              "Specific Date Criteria Has No Expired Deposits"
            );
          }
        });
    }
  }

  ngAfterViewInit(): void {
    this.questions[0].elementRef.addEventListener("keypress", (event: any) => {
      if (event.key === "Enter") {
        event.preventDefault();
        this.getPatientDetails();
      }
    });
    this.questions[0].elementRef.addEventListener("keydown", (event: any) => {
      if (event.key === "Tab") {
        event.preventDefault();
        this.getPatientDetails();
      }
    });
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
    this.ExpiredDepositform.controls["fromdate"].valueChanges.subscribe(
      (val) => {
        this.questions[3].minimum = val;
      }
    );
    this.ExpiredDepositform.controls["todate"].valueChanges.subscribe((val) => {
      this.questions[2].maximum = val;
    });
    console.log(this.ExpiredDepositform);
    setTimeout(() => {
      this.ExpiredDepositform.valueChanges.subscribe((val) => {
        console.log("val");
        console.log(val);
        this.clearbtn = false;
      });
    }, 300);

    this.ExpiredDepositform.controls["fromdate"].valueChanges.subscribe(
      (val) => {
        this.questions[3].minimum = val;
      }
    );
    this.ExpiredDepositform.controls["todate"].valueChanges.subscribe((val) => {
      this.questions[2].maximum = val;
    });

    this.tablerow.selection.changed.subscribe((res: any) => {
      console.log(res);
      if (res.added[0].checkDD != "") {
        this.snackbar.open("Refund Does Not Exist!", "error");
      } else {
        if (this.tablerow.selection.selected.length > 0) {
          console.log("table selected");
          this.onDelete = false;
          let dialogRef = this.matDialog.open(ExpdepositRefundDialogComponent, {
            width: "38vw",
            height: "35vh",
          });
          (this.selectedrowid = this.tablerow.selection.selected[0].id),
            dialogRef.afterClosed().subscribe((res) => {
              console.log(res);
              if (res == "yes") {
                console.log("this.OpenCheckdddialog");
                let dialogRef = this.matDialog.open(
                  ExpdepositCheckddDialogComponent,
                  {
                    width: "30vw",
                    height: "25vh",
                    data: {
                      id: this.tablerow.selection.selected[0].id,
                      episode: this.tablerow.selection.selected[0].episode,
                    },
                  }
                );
                dialogRef.afterClosed().subscribe((res) => {
                  this.sucessflag = false;
                  console.log(res);
                  this.response = res;
                  console.log(this.response);
                  console.log(this.response.message);

                  if (this.response.message == "Records Updated!") {
                    this.dialogService.success("Saved Sucessfully!");
                    this.sucessflag = true;
                    this.expireddepositsearch();
                    this.exportbtn = false;
                    this.apiProcessing = false;
                    this.searchbtn = true;
                  }
                });
              } else {
                this.tablerow.selection.clear();
              }
            });
        }
      }
    });
  }
  export() {
    console.log(this.tablerow);
    this.tablerow.exportAsExcel();
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
                    this.iacode = maxID.split(".")[0];
                    this.regNumber = Number(maxID.split(".")[1]);
                    this.expireddepositsearch();
                    if (length == 0) {
                      this.snackbar.open("MAXID Has No Expired Deposits");
                    }
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
        },
        (error) => {
          console.log(error);
          this.msgdialog.info(error.error);
        }
      );
  }

  getPatientDetails() {
    this.apiProcessing = true;
    this.showtable = true;
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
          this.expireddepositsearch();
          console.log(resultData);
          if (resultData == null) {
            this.ExpiredDepositform.controls["maxid"].setErrors({
              incorrect: true,
            });
            this.questions[0].customErrorMessage = "Invalid MaxID";
            this.apiProcessing = false;
            this.showtable = true;
            this.searchbtn = true;
          } else if (resultData.length == 0) {
            this.ExpiredDepositform.controls["maxid"].setErrors({
              incorrect: true,
            });
            this.questions[0].customErrorMessage = "Invalid MaxID";
            this.apiProcessing = false;
            this.showtable = true;
            this.searchbtn = true;
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
          }
        },
        (error) => {
          console.log(error);
          this.ExpiredDepositform.controls["maxid"].setErrors({
            incorrect: true,
          });
          this.questions[0].customErrorMessage = "Invalid MaxID";
          this.msgdialog.info("Registration number does not exist");
          this.apiProcessing = false;
          this.showtable = true;
        }
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
    this.fromdate.setDate(this.fromdate.getDate());
    this.ExpiredDepositform.controls["fromdate"].setValue(this.fromdate);
    this.questions[0].readonly = false;
    this.ExpiredDepositform.controls["maxid"].setValue(
      this.cookie.get("LocationIACode") + "."
    );
    this.patientDetails = [];
    this.ExpiredDepositformlist = [];
    this.searchbtn = false;
    this.patienthistorylist = [];
    this.showtable = true;
    this.clearbtn = true;
    this.exportbtn = true;
  }

  activeClick(event: any) {
    console.log(event);
  }
  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
