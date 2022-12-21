import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { ApiConstants } from "@core/constants/ApiConstants";
import { QuestionControlService } from "../../../shared/ui/dynamic-forms/service/question-control.service";
import { MessageDialogService } from "../../../shared/ui/message-dialog/message-dialog.service";
import { HttpService } from "@shared/services/http.service";
import { DatePipe } from "@angular/common";
import { CookieService } from "@shared/services/cookie.service";
import { getpatienthistorytransactiontypeModel } from "@core/models/getpatienthistorytransactiontypeModel.Model";
import { getRegisteredPatientDetailsModel } from "@core/models/getRegisteredPatientDetailsModel.Model";
import { getPatientHistoryModel } from "@core/models/getPatientHistoryModel.Model";
import { SimilarSoundPatientResponse } from "@core/models/getsimilarsound.Model";
import { Subject, takeUntil } from "rxjs";
import { ReportService } from "@shared/services/report.service";
import { SearchService } from "@shared/services/search.service";
import { SimilarDetailsPopupComponent } from "./similar-details-popup/similar-details-popup.component";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { SimilarPatientDialog } from "@modules/registration/submodules/op-registration/op-registration.component";
import { ActivatedRoute, Router } from "@angular/router";
import { LookupService } from "@core/services/lookup.service";
import { Form60YesOrNoComponent } from "@modules/billing/submodules/deposit/form60-dialog/form60-yes-or-no.component";
import {
  MaxHealthSnackBar,
  MaxHealthSnackBarService,
} from "@shared/ui/snack-bar";
import { PermissionService } from "@shared/services/permission.service";
@Component({
  selector: "out-patients-patient-history",
  templateUrl: "./patient-history.component.html",
  styleUrls: ["./patient-history.component.scss"],
})
export class PatientHistoryComponent implements OnInit {
  public patientDetails: getRegisteredPatientDetailsModel[] = [];
  public transactiontype: getpatienthistorytransactiontypeModel[] = [];
  public patienthistorylist: getPatientHistoryModel[] = [];
  similarContactPatientList: SimilarSoundPatientResponse[] = [];
  patienthistoryFormData = {
    title: "",
    type: "object",
    properties: {
      maxid: {
        type: "string",
        defaultValue: this.cookie.get("LocationIACode") + ".",
      },
      mobile: {
        title: "Mobile No",
        type: "tel",
        // pattern: "^[1-9]{1}[0-9]{9}",
      },
      fromdate: {
        type: "date",
      },
      todate: {
        type: "date",
      },
      transactiontype: {
        type: "dropdown",
        options: this.transactiontype,
      },
    },
  };
  patienthistoryform!: FormGroup;
  questions: any;

  config: any = {
    clickedRows: false,
    // clickSelection: "single",
    actionItems: false,
    dateformat: "dd/MM/yyyy",
    selectBox: false,
    displayedColumns: [
      "billNo",
      "billType",
      "billDate",
      "ipNo",
      "admDateTime",
      "billAmount",
      "discountAmount",
      "receiptAmt",
      "refundAmount",
      "balanceAmt",
      "companyName",
      "operatorName",
      "printIcon",
    ],
    columnsInfo: {
      billNo: {
        title: "Bill.No",
        type: "string",
        tooltipColumn: "billNo",
        style: {
          width: "6.5rem",
        },
      },
      billType: {
        title: "Type",
        type: "string",
        tooltipColumn: "billType",
        style: {
          width: "6rem",
        },
      },
      billDate: {
        title: "Bill Date",
        type: "string",
        tooltipColumn: "billDate",
        style: {
          width: "5rem",
        },
      },
      ipNo: {
        title: "IP No.",
        type: "number",
        style: {
          width: "4rem",
        },
      },
      admDateTime: {
        title: "Adm/Dis Date",
        type: "date",
        style: {
          width: "7rem",
        },
      },
      billAmount: {
        title: "Bill Amt",
        type: "number",
        style: {
          width: "7rem",
        },
      },
      discountAmount: {
        title: "Discount Amt",
        type: "number",
        style: {
          width: "7rem",
        },
      },
      receiptAmt: {
        title: "Receipt Amt",
        type: "number",
        style: {
          width: "6rem",
        },
      },
      refundAmount: {
        title: "Refund Amt",
        type: "number",
        style: {
          width: "6rem",
        },
      },
      balanceAmt: {
        title: "Balance Amt",
        type: "number",
        style: {
          width: "6.5rem",
        },
      },
      companyName: {
        title: "Company",
        type: "string",
        tooltipColumn: "companyName",
        style: {
          width: "5rem",
        },
      },
      operatorName: {
        title: "Operator Name",
        type: "string",
        tooltipColumn: "operatorName",
        style: {
          width: "7.5rem",
        },
      },
      printIcon: {
        title: "Print History",
        type: "image",
        width: 25,
        style: {
          width: "5.5rem",
        },
        disabledSort: true,
      },
    },
  };

  pname: any;
  age: any;
  gender: any;
  dob: any;
  nationality: any;
  ssn: any;

  billno: any;
  receiptno: any;
  billId: any;
  showtable: boolean = true;
  apiProcessing: boolean = false;
  searchbtn: boolean = true;
  clearbtn: boolean = true;
  hsplocationId: any = Number(this.cookie.get("HSPLocationId"));
  StationId: any = Number(this.cookie.get("StationId"));
  iacode: any;
  regNumber: any;
  form60: any;
  @ViewChild("table") tableRows: any;
  private readonly _destroying$ = new Subject<void>();
  constructor(
    private formService: QuestionControlService,
    private msgdialog: MessageDialogService,
    private http: HttpService,
    private datepipe: DatePipe,
    private cookie: CookieService,
    public matDialog: MatDialog,
    private reportService: ReportService,
    private searchService: SearchService,
    private router: Router,
    private route: ActivatedRoute,
    private lookupService: LookupService,
    private snackbar: MaxHealthSnackBarService,
    private permissionservice: PermissionService
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
        this.iacode = this.patienthistoryform.value.maxid.split(".")[0];
        this.patienthistoryform.controls["maxid"].setValue(
          lookupdata[0]["maxid"]
        );
        this.regNumber = Number(
          this.patienthistoryform.value.maxid.split(".")[1]
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
            this.patienthistoryform.controls["maxid"].setValue(maxID);

            this.iacode = maxID.split(".")[0];
            this.regNumber = Number(maxID.split(".")[1]);
            this.patienthistoryform.controls["maxid"].setValue(maxID);
            this.getPatientDetails();
            this.clearbtn = false;
          }

          this.similarContactPatientList = [];
        });
    }
  }
  today: any;
  fromdate: any;
  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.patienthistoryFormData.properties,
      {}
    );
    this.patienthistoryform = formResult.form;
    this.questions = formResult.questions;
    this.today = new Date();
    this.patienthistoryform.controls["todate"].setValue(this.today);
    this.fromdate = new Date(this.today);
    this.fromdate.setDate(this.fromdate.getDate() - 20);
    this.patienthistoryform.controls["fromdate"].setValue(this.fromdate);
    this.questions[2].maximum =
      this.patienthistoryform.controls["todate"].value;
    this.questions[3].minimum =
      this.patienthistoryform.controls["fromdate"].value;
    this.gettransactiontype();
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
            this.patienthistoryform.controls["maxid"].setValue(
              lookupdata[0]["maxid"]
            );
            this.patienthistoryform.value.maxid = lookupdata[0]["maxid"];
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
                this.patienthistoryform.controls["maxid"].setValue(maxID);
                this.getPatientDetails();
                this.clearbtn = false;
              }
              this.similarContactPatientList = [];
            });
        }
      });
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
        this.getPatientDetails();
      }
    });
    this.questions[1].elementRef.addEventListener("keypress", (event: any) => {
      console.log(event);
      if (event.key === "Enter") {
        event.preventDefault();
        var digit = this.patienthistoryform.value.mobile.toString().length;
        if (digit == 10) {
          this.mobilechange();
        } else {
          this.snackbar.open("Invalid Mobile No", "error");
        }
      }
    });
    this.questions[1].elementRef.addEventListener("keydown", (event: any) => {
      console.log(event);
      if (event.key === "Tab") {
        var digit = this.patienthistoryform.value.mobile.toString().length;
        if (digit == 10) {
          this.mobilechange();
        }
      }
    });
    console.log(this.patienthistoryform);
    setTimeout(() => {
      this.patienthistoryform.valueChanges.subscribe((val) => {
        console.log("val");
        console.log(val);
        this.clearbtn = false;
      });
    }, 300);

    this.patienthistoryform.controls["fromdate"].valueChanges.subscribe(
      (val) => {
        this.questions[3].minimum = val;
      }
    );
    this.patienthistoryform.controls["todate"].valueChanges.subscribe((val) => {
      this.questions[2].maximum = val;
    });
  }

  gettransactiontype() {
    this.http
      .get(ApiConstants.gettransactiontype)
      .pipe(takeUntil(this._destroying$))
      .subscribe((resultdata: any) => {
        this.transactiontype = resultdata;
        console.log(this.transactiontype);
        this.patienthistoryform.controls["transactiontype"].setValue(
          this.transactiontype[0].valueString
        );
        this.transactiontype.forEach((item) => {
          if (item.dispalyString == "Deposit Refund") {
            item.valueString = "Deposit Refund";
          }
        });
        this.questions[4].options = this.transactiontype.map((l) => {
          return { title: l.dispalyString, value: l.valueString };
        });
      });
  }

  mobilechange() {
    console.log("mobile changed");
    this.matDialog.closeAll();
    this.apiProcessing = true;
    console.log(this.similarContactPatientList.length);
    this.http
      .post(ApiConstants.similarSoundPatientDetail, {
        phone: this.patienthistoryform.value.mobile,
      })
      .pipe(takeUntil(this._destroying$))
      .subscribe(
        (resultData: SimilarSoundPatientResponse[]) => {
          this.similarContactPatientList = resultData;
          console.log(this.similarContactPatientList);
          if (this.similarContactPatientList.length == 1) {
            console.log(this.similarContactPatientList[0]);
            let maxID = this.similarContactPatientList[0].maxid;
            this.patienthistoryform.controls["maxid"].setValue(maxID);
            this.getPatientDetails();
          } else {
            if (this.similarContactPatientList.length != 0) {
              // let dialogRef = this.matDialog.open(SimilarDetailsPopupComponent, {width: "30vw", height: "30vh"});
              // dialogRef.afterClosed().subscribe(result=>{
              //   console.log(result);
              // })
              this.apiProcessing = false;
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
                    this.patienthistoryform.controls["maxid"].setValue(maxID);
                    this.getPatientDetails();
                  }
                  this.similarContactPatientList = [];
                });
            } else {
              this.apiProcessing = false;
              this.snackbar.open("Invalid Mobile No", "error");
              console.log("no data found");
            }
          }
        },
        (error) => {
          console.log(error);
          this.apiProcessing = false;
          this.snackbar.open(error.error, "error");
          // this.msgdialog.info(error.error);
        }
      );
  }
  getPatientDetails() {
    this.apiProcessing = true;
    this.showtable = false;
    this.clearbtn = false;
    let regnumber = Number(this.patienthistoryform.value.maxid.split(".")[1]);
    let iacode = this.patienthistoryform.value.maxid.split(".")[0];
    if (regnumber) {
      this.http
        .get(ApiConstants.getregisteredpatientdetails(iacode, regnumber))
        .pipe(takeUntil(this._destroying$))
        .subscribe(
          (resultData: getRegisteredPatientDetailsModel[]) => {
            console.log(resultData);
            if (resultData == null) {
              this.snackbar.open("Registration number does not exist", "error");
              // this.msgdialog.info("Registration number does not exist");
              this.apiProcessing = false;
              this.showtable = true;
            } else if (resultData.length == 0) {
              this.snackbar.open("Registration number does not exist", "error");
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
              this.patienthistoryform.controls["mobile"].setValue(
                this.patientDetails[0].mobileNo
              );
              this.questions[0].readonly = true;
              this.searchbtn = false;
              this.apiProcessing = false;
              this.showtable = true;
              this.patienthistorysearch();
            }
          },
          (error) => {
            console.log(error);
            // this.patienthistoryform.controls["maxid"].setErrors({
            //   incorrect: true,
            // });
            // this.questions[0].customErrorMessage = "Invalid MaxID";
            this.snackbar.open("Registration number does not exist", "error");
            this.apiProcessing = false;
            this.showtable = true;
          }
        );
    } else {
      this.snackbar.open("Invalid Max ID", "error");
      this.apiProcessing = false;
      this.showtable = true;
    }
  }

  patienthistorysearch() {
    this.apiProcessing = true;
    this.showtable = false;
    if (this.patientDetails.length == 1) {
      console.log(this.patienthistoryform.value);
      let regnumber = Number(this.patienthistoryform.value.maxid.split(".")[1]);
      let iacode = this.patienthistoryform.value.maxid.split(".")[0];
      if (regnumber != 0) {
        this.http
          .get(
            ApiConstants.getpatienthistory(
              this.datepipe.transform(
                this.patienthistoryform.value.fromdate,
                "YYYY-MM-dd"
              ),
              this.datepipe.transform(
                this.patienthistoryform.value.todate,
                "YYYY-MM-dd"
              ),
              iacode,
              regnumber,
              this.hsplocationId,
              this.StationId,
              this.patienthistoryform.value.transactiontype
            )
          )
          .pipe(takeUntil(this._destroying$))
          .subscribe(
            (resultdata: any) => {
              console.log(resultdata);
              if (resultdata.length > 0) {
                console.log("data");
                this.patienthistorylist = resultdata;
                console.log(this.patienthistorylist);
                this.patienthistorylist.forEach((e) => {
                  e.billAmount = Number(e.billAmount).toFixed(2);
                  e.discountAmount = Number(e.discountAmount).toFixed(2);
                  e.receiptAmt = Number(e.receiptAmt).toFixed(2);
                  e.refundAmount = Number(e.refundAmount).toFixed(2);
                  e.balanceAmt = Number(e.balanceAmt).toFixed(2);
                  e.billDate = e.billDate.split(" ")[0];
                });
                this.patienthistorylist = this.setimage(
                  this.patienthistorylist
                );
                console.log(this.patienthistorylist);
                this.apiProcessing = false;
                this.showtable = true;
              } else {
                console.log("empty");
                this.patienthistorylist = [];
                this.apiProcessing = false;
                this.showtable = true;
              }
            },
            (error) => {
              console.log(error);
              this.apiProcessing = false;
              this.showtable = true;
            }
          );
      }
    }
  }

  clear() {
    this.patienthistoryform.reset();
    this.pname = "";
    this.age = "";
    this.gender = "";
    this.dob = "";
    this.nationality = "";
    this.ssn = "";
    this.today = new Date();
    this.patienthistoryform.controls["todate"].setValue(this.today);
    this.fromdate = new Date(this.today);
    this.fromdate.setDate(this.fromdate.getDate() - 20);
    this.patienthistoryform.controls["fromdate"].setValue(this.fromdate);
    this.patienthistoryform.controls["transactiontype"].setValue(
      this.transactiontype[0].valueString
    );
    this.questions[0].readonly = false;
    this.patienthistoryform.controls["maxid"].setValue(
      this.cookie.get("LocationIACode") + "."
    );
    this.patientDetails = [];
    this.searchbtn = true;
    this.patienthistorylist = [];
    this.apiProcessing = false;
    this.showtable = true;
    this.clearbtn = true;
    this.router.navigate(["patient-history"]).then(() => {
      window.location.reload;
    });
  }

  printrow(event: any) {
    console.log(event);
    if (event.column == "printIcon") {
      console.log(event.row.billType);
      this.billId = event.row.billId;
      this.receiptno = event.row.billNo;
      this.billno = event.row.billNo;
      if (event.row.billType == "Deposit" || event.row.billType == "Donation") {
        let regno = Number(this.patienthistoryform.value.maxid.split(".")[1]);
        let iacode = this.patienthistoryform.value.maxid.split(".")[0];
        let billno = event.row.billNo;
        this.http
          .get(
            ApiConstants.getform60(
              Number(this.cookie.get("HSPLocationId")),
              billno,
              iacode,
              regno
            )
          )
          .pipe(takeUntil(this._destroying$))
          .subscribe(
            (resultdata: any) => {
              console.log(resultdata);
              this.form60 = resultdata;
              console.log(this.form60);
              if (this.form60 == 1) {
                const dialogref = this.matDialog.open(Form60YesOrNoComponent, {
                  width: "30vw",
                  height: "35vh",
                });
                dialogref.afterClosed().subscribe((res) => {
                  if (res == "yes") {
                    this.openReportModal("DepositReport");
                    this.formreport();
                  } else if (res == "no") {
                    this.openReportModal("DepositReport");
                  }
                });
              } else {
                this.openReportModal("DepositReport");
              }
            },
            (error) => {
              console.log(error);
            }
          );
        // this.openReportModal("DepositReport");
      } else if (event.row.billType == "Deposit Refund") {
        this.openReportModal("rptRefund");
      } else if (
        event.row.billType == "OPD" ||
        event.row.billType == "OPD Bill"
      ) {
        this.openReportModal("billdetailsreport");
      } else if (event.row.billType == "OP Refund") {
        this.openReportModal("refundReport");
      } else {
        this.msgdialog.success(
          "Unable to Print. Working on other transaction type(s) !!!"
        );
      }
    }
  }

  openReportModal(btnname: string) {
    const accessControls: any = this.permissionservice.getAccessControls();
    const exist: any = accessControls[2][7][534][1436];
    if (btnname == "DepositReport") {
      console.log(exist);
      this.reportService.openWindow(
        "Deposit Report - " + this.billno,
        btnname,
        {
          receiptnumber: this.receiptno,
          locationID: this.hsplocationId,
          exportflagEnable: exist,
        }
      );
    } else if (btnname == "rptRefund") {
      console.log(exist);
      this.reportService.openWindow(
        "Deposit Refund Report - " + this.billno,
        btnname,
        {
          receiptno: this.billno,
          locationID: this.hsplocationId,
          exportflagEnable: exist,
        }
      );
    } else if (btnname == "billdetailsreport") {
      this.reportService.openWindow("OPD Report - " + this.billno, btnname, {
        opbillid: this.billId,
        locationID: this.hsplocationId,
        enableexport: exist,
      });
    } else if (btnname == "refundReport") {
      this.reportService.openWindow(
        "OP Refund Report- " + this.billno,
        btnname,
        {
          refundBill: this.billno,
          locationID: this.hsplocationId,
        }
      );
    }
  }
  formreport() {
    let regno = Number(this.patienthistoryform.value.maxid.split(".")[1]);
    let iacode = this.patienthistoryform.value.maxid.split(".")[0];
    let billno = this.billno;
    this.reportService.openWindow(
      "FormSixty",
      "FormSixty",
      {
        LocationId: Number(this.cookie.get("HSPLocationId")),
        Iacode: iacode,
        RegistrationNo: regno,
        BillNo: billno,
      },
      "right",
      "center"
    );
  }
  setimage(
    patienthsitory: getPatientHistoryModel[],
    model: any = getPatientHistoryModel
  ) {
    patienthsitory.forEach((e) => {
      e.printIcon = this.getimage();
    });
    return patienthsitory as typeof model;
  }

  getimage() {
    let returnicon: any = [];
    var tempPager: any = {
      src: "assets/print_Icon.svg",
    };
    returnicon.push(tempPager);
    return returnicon;
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
