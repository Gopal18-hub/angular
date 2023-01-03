import { Component, OnInit, ViewChild, Inject } from "@angular/core";
import { RefundDialogComponent } from "./refund-dialog/refund-dialog.component";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { DepositDialogComponent } from "./deposit-dialog/deposit-dialog.component";
import { FormGroup } from "@angular/forms";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { Router, ActivatedRoute } from "@angular/router";
import { FormSixtyComponent } from "@core/UI/billing/submodules/form60/form-sixty.component";
import { HttpService } from "@shared/services/http.service";
import { ApiConstants } from "@core/constants/ApiConstants";
import { CookieService } from "@shared/services/cookie.service";
import { PatientPersonalDetailInterface } from "@core/types/PatientPersonalDetail.Interface";
import { PatientDepositDetailInterface } from "@core/types/PatientDepositDetail.Interface";
import { MessageDialogService } from "@shared/ui/message-dialog/message-dialog.service";
import { PatientPreviousDepositDetail } from "@core/models/patientpreviousdepositdetailModel.Model";
import { MakedepositDialogComponent } from "./makedeposit-dialog/makedeposit-dialog.component";
import { SimilarSoundPatientResponse } from "@core/models/getsimilarsound.Model";
import { SimilarPatientDialog } from "@modules/registration/submodules/op-registration/op-registration.component";
import { DepositService } from "@core/services/deposit.service";
import { ReportService } from "@shared/services/report.service";
import { SearchService } from "../../../../../shared/services/search.service";
import { LookupService } from "@core/services/lookup.service";
import { PatientService } from "@core/services/patient.service";
import { Form60YesOrNoComponent } from "./form60-dialog/form60-yes-or-no.component";
import { BillingApiConstants } from "../billing/BillingApiConstant";
import * as moment from "moment";
import { MaxHealthSnackBarService } from "@shared/ui/snack-bar";
import { PermissionService } from "@shared/services/permission.service";

@Component({
  selector: "out-patients-deposit",
  templateUrl: "./deposit.component.html",
  styleUrls: ["./deposit.component.scss"],
})
export class DepositComponent implements OnInit {
  constructor(
    public matDialog: MatDialog,
    private formService: QuestionControlService,
    private router: Router,
    private http: HttpService,
    private cookie: CookieService,
    private messageDialogService: MessageDialogService,
    private depositservice: DepositService,
    private reportService: ReportService,
    private searchService: SearchService,
    private route: ActivatedRoute,
    private patientService: PatientService,
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
        this.apiProcessing = true;
        this.depositForm.value.maxid = lookupdata[0]["maxid"];
        this.iacode = this.depositForm.value.maxid.split(".")[0];
        this.regNumber = Number(this.depositForm.value.maxid.split(".")[1]);
        const expiredStatus = await this.checkPatientExpired(
          this.iacode,
          this.regNumber
        );
        if (expiredStatus) {
          this.apiProcessing = false;
          const dialogRef = this.messageDialogService.error(
            "Patient is an Expired Patient!"
          );
          await dialogRef.afterClosed().toPromise();
          this.expiredpatientexists = true;
          this.questions[0].readonly = false;
          this.questions[0].elementRef.focus();
        }
        this.getPatientDetailsForDeposit();
        this.apiProcessing = false;
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
        .subscribe(async (result: any) => {
          if (result) {
            this.apiProcessing = true;
            console.log(result.data["added"][0].maxid);
            let maxID = result.data["added"][0].maxid;
            this.depositForm.controls["maxid"].setValue(maxID);

            this.iacode = maxID.split(".")[0];
            this.regNumber = Number(maxID.split(".")[1]);
            const expiredStatus = await this.checkPatientExpired(
              this.iacode,
              this.regNumber
            );
            if (expiredStatus) {
              this.apiProcessing = false;
              const dialogRef = this.messageDialogService.error(
                "Patient is an Expired Patient!"
              );
              await dialogRef.afterClosed().toPromise();
              this.expiredpatientexists = true;
              this.questions[0].readonly = false;
              this.questions[0].elementRef.focus();
            }
            this.getPatientDetailsForDeposit();
            this.apiProcessing = false;
          }
        });
    }
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
        type: "tel",
        title: "Mobile No.",
        pattern: "^[1-9]{1}[0-9]{9}",
      },
      checkbox: {
        type: "checkbox",
        options: [
          {
            title: "",
          },
        ],
      },
      dateInput: {
        type: "date",
      },
      totaldeposit: {
        type: "string",
        defaultValue: "0.00",
        readonly: true,
      },
      avalaibledeposit: {
        type: "string",
        defaultValue: "0.00",
        readonly: true,
      },
      totalrefund: {
        type: "string",
        defaultValue: "0.00",
        readonly: true,
      },
      remarks: {
        type: "textarea",
        defaultValue: "Write Remarks",
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
        readonly: true,
      },
    },
  };

  depositconfig: any = {
    clickedRows: true,
    clickSelection: "single",
    dateformat: "dd/MM/yyyy - HH:mm",
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
      "remarks",
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
          width: "10rem",
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
          width: "7rem",
        },
      },
      usedIP: {
        title: "Used(IP)",
        type: "number",
        style: {
          width: "8rem",
        },
      },
      refund: {
        title: "Refund",
        type: "string",
        tooltipColumn: "uEmail",
        style: {
          width: "9rem",
        },
      },
      balance: {
        title: "Balance",
        type: "string",
        style: {
          width: "10rem",
        },
      },
      gst: {
        title: "Tax %",
        type: "number",
        style: {
          width: "5rem",
        },
      },
      gstValue: {
        title: "Total Tax Value",
        type: "number",
        style: {
          width: "9rem",
        },
      },
      advanceType: {
        title: "Deposit Head",
        type: "string",
        style: {
          width: "9.5rem",
        },
        tooltipColumn: "advanceType",
      },
      serviceTypeName: {
        title: "Service Type",
        type: "string",
        style: {
          width: "11rem",
        },
        tooltipColumn: "serviceTypeName",
      },
      operatorName: {
        title: "Operator Name & ID",
        type: "string",
        style: {
          width: "13rem",
        },
        tooltipColumn: "operatorName",
      },
      remarks: {
        title: "Remarks",
        type: "string",
        style: {
          width: "8.5rem",
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
  tableselectionexists: boolean = false;
  expiredpatientexists: boolean = false;
  moment = moment;
  apiProcessing: boolean = false;
  mobilenocall: boolean = false;

  depositForm!: FormGroup;
  questions: any;
  patientRefundDetails: any = [];
  patientpersonaldetails: any = [];
  patientservicetype: any;
  patientdeposittype: any;
  regNumber: number = 0;
  iacode: string = "";
  hspLocationid: any = Number(this.cookie.get("HSPLocationId"));
  depoistList: any = [];
  MaxIDExist: boolean = false;
  MaxIDdepositExist: boolean = false;
  totaldeposit: number = 0;
  totalrefund: number = 0;
  avalaibleamount: number = 0;
  vipdb!: string;
  noteRemarkdb!: string;
  hwcRemarkdb!: string;
  form60: any;
  ewsDetailsdb: {
    bplCardNo: string;
    bplCardAddress: string;
  } = {
    bplCardNo: "",
    bplCardAddress: "",
  };

  hotlistRemarkdb: any;
  hotlistReasondb: { title: string; value: number } = { title: "", value: 0 };

  private readonly _destroying$ = new Subject<void>();

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

  ngOnInit(): void {
    let formResult = this.formService.createForm(
      this.depositformdata.properties,
      {}
    );
    this.depositForm = formResult.form;
    this.questions = formResult.questions;
    this.lastUpdatedBy =
      this.cookie.get("Name") + " ( " + this.cookie.get("UserName") + " )";
    this.depositForm.controls["panno"].disable();
    this.depositForm.controls["mainradio"].disable();

    this.searchService.searchTrigger
      .pipe(takeUntil(this._destroying$))
      .subscribe(async (formdata: any) => {
        console.log(formdata);
        await this.loadGrid(formdata);
      });
  }

  openrefunddialog() {
    const RefundDialog = this.matDialog.open(RefundDialogComponent, {
      width: "80vw",
      height: "96vh",
      data: {
        patientinfo: {
          emailId: this.patientpersonaldetails[0]?.pEMail,
          mobileno: this.patientpersonaldetails[0]?.pcellno,
          screename: "Deposit",
        },
        clickedrowdepositdetails: this.patientRefundDetails,
      },
    });

    RefundDialog.afterClosed()
      .pipe(takeUntil(this._destroying$))
      .subscribe((result) => {
        //if(result == "Success"){
        this.getPatientPreviousDepositDetails();
        console.log("Refund Dialog closed");
        //}
        this.MaxIDdepositExist = false;
        this.tableselectionexists = false;
        this.deposittable.selection.clear();
      });
  }

  openDepositdialog() {
    const availDepositsPopup = this.messageDialogService.confirm(
      "",
      `Do you want to make Deposits?`
    );
    availDepositsPopup
      .afterClosed()
      .pipe(takeUntil(this._destroying$))
      .subscribe((result) => {
        if ("type" in result) {
          if (result.type == "yes") {
            const DepositDialogref = this.matDialog.open(
              DepositDialogComponent,
              {
                width: "80vw",
                height: "96vh",
                data: {
                  servicetype: this.patientservicetype,
                  deposittype: this.patientdeposittype,
                  patientinfo: {
                    emailId: this.patientpersonaldetails[0]?.pEMail,
                    mobileno: this.patientpersonaldetails[0]?.pcellno,
                    panno: this.patientpersonaldetails[0]?.paNno,
                    registrationno: this.regNumber,
                    iacode: this.iacode,
                  },
                },
              }
            );

            DepositDialogref.afterClosed()
              .pipe(takeUntil(this._destroying$))
              .subscribe((result) => {
                this.MaxIDdepositExist = false;
                this.tableselectionexists = false;
                this.deposittable.selection.clear();
                if (result == "Success") {
                  this.getPatientPreviousDepositDetails();
                }
              });
          }
        }
      });
  }

  openinitiatedeposit() {
    this.router.navigate(["out-patient-billing", "initiate-deposit"], {
      queryParams: { maxID: this.depositForm.value.maxid },
    });
  }

  ngAfterViewInit(): void {
    this.questions[0].elementRef.addEventListener(
      "keypress",
      async (event: any) => {
        // If the user presses the "Enter" key on the keyboard

        if (event.key === "Enter") {
          this.expiredpatientexists = false;
          event.preventDefault();
          if (this.depositForm.value.maxid == "") {
            this.messageDialogService.error(
              "Blank Registration Number is not Allowed"
            );
          } else {
            this.iacode = this.depositForm.value.maxid.split(".")[0];
            this.regNumber = Number(this.depositForm.value.maxid.split(".")[1]);
            if (
              this.iacode != "" &&
              this.iacode != "0" &&
              this.regNumber != 0 &&
              !Number.isNaN(Number(this.regNumber))
            ) {
              this.apiProcessing = true;
              const expiredStatus = await this.checkPatientExpired(
                this.iacode,
                this.regNumber
              );
              if (expiredStatus) {
                const dialogRef = this.messageDialogService.error(
                  "Patient is an Expired Patient!"
                );
                await dialogRef.afterClosed().toPromise();

                this.questions[0].readonly = false;
                this.questions[0].elementRef.focus();
                this.expiredpatientexists = true;
              }
              this.getDepositType();
              this.getPatientDetailsForDeposit();
              this.apiProcessing = false;
            } else {
             // this.snackbar.open("Invalid Max ID", "error"); bala told to change to error
              this.messageDialogService.error("Invalid Max ID");
            }
          }
        }
      }
    );

    this.questions[1].elementRef.addEventListener("keypress", (event: any) => {
      console.log(event);
      if (event.key === "Enter") {
        if (this.depositForm.controls["mobileno"].valid) {
          this.onEnterPhoneModify();
        } else {
          //this.snackbar.open("Invalid Mobile No.", "error");
          this.messageDialogService.error("Invalid Mobile No.");
        }
      }
    });

    this.questions[1].elementRef.addEventListener(
      "blur",
      this.mobilechange.bind(this)
    );

    this.questions[1].elementRef.addEventListener(
      "change",
      this.resetPhoneFlag.bind(this)
    );
  }
  resetPhoneFlag() {
    this.phoneNumberFlag = false;
  }

  phoneNumberFlag: boolean = false;
  //CLEARING OLDER PHONE SEARCH
  onEnterPhoneModify() {
    this.similarContactPatientList = [] as any;
    this.mobilechange();
    this.phoneNumberFlag = true;
  }
  getPatientDetailsByMaxId() {
    console.log(this.depositForm.value.maxid);
    this.MaxIDExist = true;
    if (this.regNumber != 0) {
      this.http
        .get(
          ApiConstants.getpatientpersonaldetails(this.regNumber, this.iacode)
        )
        .pipe(takeUntil(this._destroying$))
        .subscribe(
          (resultData: PatientPersonalDetailInterface) => {
            this.patientpersonaldetails = resultData.getPATIENTDETAILS;
            this.patientservicetype = resultData.getServiceType;

            if (this.patientpersonaldetails.length === 0) {
              //this.snackbar.open("Invalid Max ID", "error");
              this.messageDialogService.error("Invalid Max ID");
            } else {
              this.depositForm.controls["mobileno"].setValue(
                this.patientpersonaldetails[0]?.pcellno
              );
              this.name =
                this.patientpersonaldetails[0]?.title +
                " " +
                this.patientpersonaldetails[0]?.firstname +
                " " +
                this.patientpersonaldetails[0]?.lastname;
              this.age =
                this.patientpersonaldetails[0]?.age +
                " " +
                this.patientpersonaldetails[0].agetypename;
              this.gender = this.patientpersonaldetails[0]?.sex;
              this.dob = this.patientpersonaldetails[0]?.dateOfBirth;
              this.nationality =
                this.patientpersonaldetails[0]?.nationalityName;
              this.ssn = this.patientpersonaldetails[0]?.ssn;

              if (!this.expiredpatientexists) {
                this.questions[0].readonly = true;
                this.questions[1].readonly = true;
              }

              this.depositForm.controls["panno"].setValue(
                this.patientpersonaldetails[0]?.paNno
              );
              this.depositForm.controls["maxid"].setValue(
                this.patientpersonaldetails[0]?.iacode +
                  "." +
                  this.patientpersonaldetails[0]?.registrationno
              );

              this.categoryIcons =
                this.depositservice.getCategoryIconsForDeposit(
                  this.patientpersonaldetails[0]
                );
              this.noteRemarkdb = this.patientpersonaldetails[0]?.noteReason;
              this.vipdb = this.patientpersonaldetails[0]?.vipreason;
              this.hwcRemarkdb = this.patientpersonaldetails[0]?.hwcRemarks;
              this.hotlistRemarkdb =
                this.patientpersonaldetails[0]?.hotlistcomments;
              this.hotlistReasondb.title =
                this.patientpersonaldetails[0]?.hotlistreason;
              this.ewsDetailsdb.bplCardNo =
                this.patientpersonaldetails[0]?.bplCardNo;
              this.ewsDetailsdb.bplCardAddress =
                this.patientpersonaldetails[0]?.addressOnCard;

              console.log(this.categoryIcons);
              console.log(this.patientpersonaldetails[0]);
            }
          },
          (error) => {
            if (error == []) {
              this.depositForm.controls["maxid"].setValue(
                this.iacode + "." + this.regNumber
              );
              //this.snackbar.open("Invalid Max ID", "error");
              this.messageDialogService.error("Invalid Max ID");
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
      .get(
        ApiConstants.getpatientdetailsfordeposit(this.regNumber, this.iacode)
      )
      .pipe(takeUntil(this._destroying$))
      .subscribe(
        (resultData) => {
          if (resultData == CheckPatientDetails.Inpatient) {
            this.messageDialogService.error("This Patient is an InPatient");
          } else if (resultData == CheckPatientDetails.PatientNotReg) {
            //this.snackbar.open("Invalid Max ID", "error");
            this.messageDialogService.error("Invalid Max ID");
          } else if (resultData == CheckPatientDetails.NoDeposit) {
            this.getPatientDetailsByMaxId();
            this.getPatientPreviousDepositDetails();
          } else if (resultData == CheckPatientDetails.HaveDeposit) {
            this.getPatientDetailsByMaxId();
            this.getPatientPreviousDepositDetails();
          } else if (resultData == null) {
            //this.snackbar.open("Invalid Max ID", "error");
            this.messageDialogService.error("Invalid Max ID");
          }
        },
        (error) => {
          //this.snackbar.open("Invalid Max ID", "error");
          this.messageDialogService.error("Invalid Max ID");
        }
      );
  }

  getPatientPreviousDepositDetails() {
    this.depoistList = [];
    this.http
      .get(
        ApiConstants.getpatientpreviousdepositdetails(
          this.regNumber,
          this.iacode
        )
      )
      .pipe(takeUntil(this._destroying$))
      .subscribe(
        (resultData: PatientPreviousDepositDetail[]) => {
          this.totaldeposit = resultData
            .filter((dp) => dp.depositRefund == "Deposit")
            .map((t) => t.deposit)
            .reduce((acc, value) => acc + value, 0);

          this.totalrefund = resultData
            .filter((dp) => dp.depositRefund == "Refund")
            .map((t) => t.refund)
            .reduce((acc, value) => acc + value, 0);

          this.avalaibleamount = resultData
            .filter((dp) => dp.depositRefund == "Deposit")
            .map((t) => t.balance)
            .reduce((acc, value) => acc + value, 0);

          //this.avalaibleamount = this.totaldeposit - this.totalrefund;
          this.depositForm.controls["totaldeposit"].setValue(
            this.totaldeposit.toFixed(2)
          );
          this.depositForm.controls["totalrefund"].setValue(
            this.totalrefund.toFixed(2)
          );
          this.depositForm.controls["avalaibledeposit"].setValue(
            this.avalaibleamount.toFixed(2)
          );

          resultData = resultData.map((item: any) => {
            item.usedIP = item.usedIP.toFixed(2);
            item.usedOP = item.usedOP.toFixed(2);
            item.balance = item.balance.toFixed(2);
            item.refund = item.refund.toFixed(2);
            item.deposit = item.deposit.toFixed(2);
            item.gst = item.gst.toFixed(2);
            item.gstValue = item.gstValue.toFixed(2);
            item.paymentType = item.paymentType != null ? item.paymentType.toCapitalize() : "";
            return item;
          });

          this.depoistList = resultData;
          console.log(resultData);
          setTimeout(() => {
            // console.log(this.deposittable.childTable.selection);
            this.deposittable.selection.changed
              .pipe(takeUntil(this._destroying$))
              .subscribe((res: any) => {
                console.log(this.deposittable.selection.selected.length);
                if (this.deposittable.selection.selected.length > 0) {
                  console.log(this.MaxIDdepositExist);
                  if (res.added.length > 0) {
                    // const childTableExist = this.deposittable.childTable;
                    this.deposittable.childTable.forEach((childItem: any) => {
                      childItem.selection.clear();
                    });
                    // .find(
                    //   (r: any) =>
                    //     r.childTableRefId == res.added[0].cashTransactionID
                    // );
                    // if (childTableExist) {
                    //   childTableExist.selection.clear();
                    // }
                  }
                  this.tableselectionexists = true;
                  if (
                    res.added[0].depositRefund == "Deposit" &&
                    res.added[0].balance > 0
                  ) {
                    this.MaxIDdepositExist = true;
                    console.log(this.MaxIDdepositExist);
                    this.patientRefundDetails = res.added[0];
                  } else {
                    this.MaxIDdepositExist = false;
                    this.patientRefundDetails = [];
                  }
                } else {
                  this.MaxIDdepositExist = false;
                  this.tableselectionexists = false;
                }
              });
            this.deposittable.childTable.map((r: any) => {
              r.selection.changed
                .pipe(takeUntil(this._destroying$))
                .subscribe((res: any) => {
                  if (res.added.length > 0) {
                    r.parentTable.selection.clear();
                    this.tableselectionexists = true;
                  } else {
                    this.tableselectionexists = false;
                  }
                });
            });
          }, 100);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  clearDepositpage() {
    this._destroying$.next(undefined);
    this._destroying$.complete();
    this.depositForm.reset();    
    this.similarContactPatientList = [];
    this.questions[0].readonly = false;
    this.questions[1].readonly = false;
    this.depositForm.controls["maxid"].setValue(
      this.cookie.get("LocationIACode") + "."
    );
    this.name = "";
    this.age = "";
    this.gender = "";
    this.dob = "";
    this.nationality = "";
    this.ssn = "";
    this.router.navigate([], {
      queryParams: {},
      relativeTo: this.route,
    });
    this.deposittable.selection.clear();
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

  //FLAG FOR TRIGGERED EVENT ON PHONE NUMBER
  similarSoundListPresent(): boolean {
    return this.similarContactPatientList.length > 0 ? true : false;
  }

  getSimilarPatientDetails() {
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
          if (this.similarContactPatientList.length > 1) {
            const similarSoundDialogref = this.matDialog.open(
              SimilarPatientDialog,
              {
                width: "60vw",
                height: "80vh",
                data: {
                  searchResults: this.similarContactPatientList,
                },
              }
            );
            similarSoundDialogref
              .afterClosed()
              .pipe(takeUntil(this._destroying$))
              .subscribe(async (result) => {
                if (result) {
                  this.apiProcessing = true;
                  console.log(result.data["added"][0].maxid);
                  let maxID = result.data["added"][0].maxid;
                  this.iacode = maxID.split(".")[0];
                  this.regNumber = Number(maxID.split(".")[1]);
                  this.depositForm.controls["maxid"].setValue(maxID);
                  const expiredStatus = await this.checkPatientExpired(
                    this.iacode,
                    this.regNumber
                  );
                  if (expiredStatus) {
                    this.apiProcessing = false;
                    const dialogRef = this.messageDialogService.error(
                      "Patient is an Expired Patient!"
                    );
                    await dialogRef.afterClosed().toPromise();
                    this.expiredpatientexists = true;
                    this.questions[0].readonly = false;
                    this.questions[0].elementRef.focus();
                  }
                  this.getPatientDetailsForDeposit();
                  this.apiProcessing = false;
                }
                this.similarContactPatientList = [];
              });
              this.mobilenocall = false;
          } else if (this.similarContactPatientList.length == 1) {
            console.log(resultData);
            let maxID = resultData[0].maxid;
            this.depositForm.controls["maxid"].setValue(maxID);
            this.regNumber = Number(maxID.split(".")[1]);
            this.iacode = maxID.split(".")[0];
            this.getPatientDetailsForDeposit();
            this.mobilenocall = false;
          } else {
            console.log("no data found");
            this.mobilenocall = true;
            const MobilenoNotExists =  this.messageDialogService.error("Invalid Mobile No.");
            MobilenoNotExists.afterClosed().subscribe((res:any) => {
              this.mobilenocall = false;
            });

          }
        },
        (error) => {
          console.log(error);
          this.messageDialogService.info(error.error);
        }
      );
  }

  mobilechange() {
    if (this.depositForm.controls["mobileno"].valid && !this.phoneNumberFlag && !this.mobilenocall) {
      if (!this.similarSoundListPresent()) {
        this.getSimilarPatientDetails();
      }
    }
  }

  printpatientreceipt() {
    let regno = Number(this.depositForm.value.maxid.split(".")[1]);
    let iacode = this.depositForm.value.maxid.split(".")[0];

    if (this.deposittable.selection.selected[0]) {
      let billno = this.deposittable.selection.selected[0].receiptno;
      if (this.containsSpecialChars(billno)) {
        billno = billno.replaceAll("/", "-");
      }

      this.http
        .get(ApiConstants.getform60(this.hspLocationid, billno, iacode, regno))
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
                  this.depositreport();
                  this.formreport();
                } else if (res == "no") {
                  this.depositreport();
                }
              });
            } else {
              this.depositreport();
            }
          },
          (error) => {
            console.log(error);
          }
        );
    } else {
      let exist = this.checkaccesscontrol();
      let refundreceiptno;
      this.deposittable.childTable.map((r: any) => {
        r.selection.selected.map((res: any) => {
          if (res) {
            if (this.containsSpecialChars(res.receiptno)) {
              refundreceiptno = res.receiptno.replaceAll("/", "-");
            } else {
              refundreceiptno = res.receiptno;
            }
            this.reportService.openWindow("rptRefund", "rptRefund", {
              receiptno: refundreceiptno,
              locationID: this.hspLocationid,
              exportflagEnable: exist,
            });
          }
        });
      });
    }

    console.log(this.deposittable.selection.selected);
  }
  depositreport() {
   let exist = this.checkaccesscontrol();
    let receiptno;
    this.deposittable.selection.selected.map((s: any) => {
      if (this.containsSpecialChars(s.receiptno)) {
        receiptno = s.receiptno.replaceAll("/", "-");
      } else {
        receiptno = s.receiptno;
      }
      this.reportService.openWindow("DepositReport", "DepositReport", {
        receiptnumber: receiptno,
        locationID: this.hspLocationid,
        exportflagEnable: exist,
      });
    });
  }
  formreport() {
    let regno = Number(this.depositForm.value.maxid.split(".")[1]);
    let iacode = this.depositForm.value.maxid.split(".")[0];
    let billno = this.deposittable.selection.selected[0].receiptno;
    if (this.containsSpecialChars(billno)) {
      billno = billno.replaceAll("/", "-");
    }
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
  depositCategoryIconAction(categoryIcon: any) {
    const data: any = {
      note: {
        notes: this.noteRemarkdb,
      },
      vip: {
        notes: this.vipdb,
      },
      hwc: {
        notes: this.hwcRemarkdb,
      },
      pPagerNumber: {
        bplCardNo: this.ewsDetailsdb.bplCardNo,
        BPLAddress: this.ewsDetailsdb.bplCardAddress,
      },
      hotList: {
        hotlistTitle: this.hotlistReasondb,
        reason: this.hotlistRemarkdb,
      },
    };
    if (
      categoryIcon.tooltip != "CASH" &&
      categoryIcon.tooltip != "INS" &&
      categoryIcon.tooltip != "PSU"
    ) {
      if (categoryIcon.type == "pPagerNumber") {
        this.patientService.doAction("ppagerNumber", data[categoryIcon.type]);
      } else {
        this.patientService.doAction(
          categoryIcon.type,
          data[categoryIcon.type]
        );
      }
    }
  }

  async checkPatientExpired(iacode: string, regNumber: number) {
    const res = await this.http
      .get(
        BillingApiConstants.getforegexpiredpatientdetails(
          iacode,
          Number(regNumber)
        )
      )
      .toPromise()
      .catch(() => {
        return;
      });
    if (res == null || res == undefined) {
      return false;
    }
    if (res.length > 0) {
      if (res[0].flagexpired == 1) {
        return true;
      }
    }
    return false;
  }
  containsSpecialChars(str: any) {
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    return specialChars.test(str);
  }

  checkaccesscontrol(){
    const accessControls: any = this.permissionservice.getAccessControls();
    let exist: any = accessControls[2][7][534];
    if (exist == undefined){    
      return false;
    } else{
      exist = accessControls[2][7][534][1436];
      exist = exist == undefined ? false : exist;
      return exist;
    }
  }
}

export const CheckPatientDetails = {
  PatientNotReg: 0,
  Inpatient: 1,
  HaveDeposit: 2,
  NoDeposit: 3,
};
