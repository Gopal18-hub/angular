import { DatePipe } from "@angular/common";
import {
  Component,
  KeyValueDiffer,
  KeyValueDiffers,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { Registrationdetails } from "@core/types/registeredPatientDetial.Interface";
import { VisitHistoryComponent } from "@shared/modules/visit-history/visit-history.component";

import { CookieService } from "@shared/services/cookie.service";
import { HttpService } from "@shared/services/http.service";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";
import { Subject, takeUntil } from "rxjs";
import { SearchDialogComponent } from "./search-dialog/search-dialog.component";
import { getrefundreason } from "../../../../core/types/billdetails/getrefundreason.Interface";
import { getPatientPersonalandBillDetails } from "../../../../core/types/billdetails/getpatientpersonalandbilldetails.Interface";
import { BillDetailsApiConstants } from "./BillDetailsApiConstants";
import { billDetailService } from "./billDetails.service";
import { ApiConstants } from "@core/constants/ApiConstants";
import { PatientDetails } from "@core/models/patientDetailsModel.Model";
import { PatientService } from "@core/services/patient.service";
import { MessageDialogService } from "@shared/ui/message-dialog/message-dialog.service";
import { MaxHealthSnackBarService } from "@shared/ui/snack-bar";
import * as moment from "moment";

@Component({
  selector: "out-patients-details",
  templateUrl: "./details.component.html",
  styleUrls: ["./details.component.scss"],
})
export class DetailsComponent implements OnInit {
  private check!: KeyValueDiffer<string, any>;
  constructor(
    public matDialog: MatDialog,
    private formService: QuestionControlService,
    private router: Router,
    private http: HttpService,
    public cookie: CookieService,
    private datepipe: DatePipe,
    private billdetailservice: billDetailService,
    private differ: KeyValueDiffers,
    private patientService: PatientService,
    private msgdialog: MessageDialogService,
    private snackbar: MaxHealthSnackBarService
  ) {
    this.check = this.differ
      .find(this.billdetailservice.sendforapproval)
      .create();
  }
  moment = moment;
  @ViewChild("selectedServices") selectedServicesTable: any;
  public refundreasonlist: getrefundreason[] = [];
  public patientbilldetaillist!: getPatientPersonalandBillDetails;
  // for icons
  public patientDetailsforicon!: PatientDetails;
  categoryIcons: [] = [];

  linkList = [
    {
      title: "Services",
      path: "services",
    },
    {
      title: "Partial/Gen. Credit Bill Settlement",
      path: "cred-bill-settlement",
    },
    {
      title: " Refund After Bill",
      path: "refund-after-bill",
    },
    {
      title: " Refund Credit",
      // path: "",
    },
  ];
  activeLink = this.linkList[0];

  BDetailFormData = {
    type: "object",
    title: "",
    properties: {
      billNo: {
        type: "string",
      },
      maxid: {
        type: "string",
        defaultValue: this.cookie.get("LocationIACode") + ".",
      },
      mobileno: {
        type: "tel",
        pattern: "^[1-9]{1}[0-9]{9}",
      },
      billDate: {
        type: "date",
        // title: "SSN",
      },
      datevalidation: {
        type: "checkbox",
        required: false,
        options: [{ title: "" }],
        defaultValue: 0,
      },
      fromDate: {
        type: "date",
        maximum: new Date(),
        defaultValue: new Date(),
      },
      toDate: {
        type: "date",
        maximum: new Date(),
        defaultValue: new Date(),
      },
      billAmt: {
        type: "string",
        required: false,
        defaultValue: "0.0",
        readonly: true,
      },
      dipositrAmt: {
        type: "string",
        required: false,
        defaultValue: "0.0",
        readonly: true,
      },
      discAmt: {
        type: "string",
        required: false,
        defaultValue: "0.0",
        readonly: true,
      },
      discAftBill: {
        type: "string",
        required: false,
        defaultValue: "0.0",
        readonly: true,
      },
      refundAmt: {
        type: "string",
        required: false,
        defaultValue: "0.0",
        readonly: true,
      },
      authBy: {
        type: "string",
        required: false,
        readonly: true,
      },
      reason: {
        type: "dropdown",
        required: false,
        readonly: true,
        options: this.refundreasonlist,
      },
      paymentMode: {
        type: "dropdown",
        required: false,
        defaultValue: "0.0",
        readonly: true,
      },
      otpTxt: {
        type: "number",
        required: false,
        readonly: false,
      },
    },
  };

  patientDetails!: Registrationdetails;
  serviceselectedList: [] = [] as any;
  BServiceForm!: FormGroup;

  questions: any;

  private readonly _destroying$ = new Subject<void>();
  patientName: any;
  age: any;
  gender: any;
  dob: any;
  country: any;
  ssn: any;
  operator: any;
  billdate: any;

  // BTN
  otpbtn: boolean = true;
  managerotpbtn: boolean = true;
  refundbill: boolean = true;
  approvalsend: boolean = true;
  printbill: boolean = true;
  printrefund: boolean = true;
  resendbill: boolean = true;
  consumableprint: boolean = true;
  phptracksheet: boolean = true;
  opprescription: boolean = true;
  doxperprint: boolean = true;
  clearbtn: boolean = true;
  dmsbtn: boolean = true;
  visithistorybtn: boolean = true;
  doxperurl: any;
  ngOnInit(): void {
    this.router.navigate(["out-patient-billing/details"]).then(() => {
      window.location.reload;
    });
    let formResult = this.formService.createForm(
      this.BDetailFormData.properties,
      {}
    );

    this.BServiceForm = formResult.form;
    this.questions = formResult.questions;
    this.lastUpdatedBy = this.cookie.get("UserName");
    this.BServiceForm.controls["fromDate"].disable();
    this.BServiceForm.controls["toDate"].disable();
    this.getrefundreason();
  }
  lastUpdatedBy: string = "";
  currentTime: string = new Date().toLocaleString();

  ngAfterViewInit(): void {
    this.formEvents();
    this.BServiceForm.controls["datevalidation"].valueChanges.subscribe(
      (value) => {
        console.log(value);
        if (value == true) {
          this.BServiceForm.controls["fromDate"].enable();
          this.BServiceForm.controls["toDate"].enable();
        } else {
          this.BServiceForm.controls["fromDate"].disable();
          this.BServiceForm.controls["toDate"].disable();
        }
      }
    );
    console.log(this.billdetailservice.sendforapproval);
  }
  getrefundreason() {
    this.http
      .get(BillDetailsApiConstants.getrefundreason)
      .pipe(takeUntil(this._destroying$))
      .subscribe((resuldata) => {
        console.log(resuldata);
        this.refundreasonlist = resuldata;
        this.questions[13].options = this.refundreasonlist.map((l) => {
          return { title: l.name, value: l.id };
        });
      });
  }
  formEvents() {
    //ON billno CHANGE
    this.questions[0].elementRef.addEventListener("keypress", (event: any) => {
      if (event.key === "Enter") {
        event.preventDefault();
        console.log("event triggered");
        this.getpatientbilldetails();
      }
    });
    this.questions[1].elementRef.addEventListener("keypress", (event: any) => {
      if (event.key === "Enter") {
        event.preventDefault();
        console.log("event triggered");
        this.search();
      }
    });
    this.questions[2].elementRef.addEventListener("keypress", (event: any) => {
      if (event.key === "Enter") {
        event.preventDefault();
        console.log("event triggered");
        this.search();
      }
    });
  }

  getPatientIcon() {
    let iacode = this.BServiceForm.value.maxid.split(".")[0];
    let regNumber = this.BServiceForm.value.maxid.split(".")[1];
    this.http
      .get(ApiConstants.patientDetails(regNumber, iacode))
      .pipe(takeUntil(this._destroying$))
      .subscribe(
        (resultData: PatientDetails) => {
          // this.clear();
          this.patientDetailsforicon = resultData;
          this.categoryIcons = this.patientService.getCategoryIconsForPatient(
            this.patientDetailsforicon
          );
        },
        (error) => {}
      );
  }

  getpatientbilldetails() {
    this.billdetailservice.clear();
    this.http
      .get(
        BillDetailsApiConstants.getpatientbilldetails(
          this.BServiceForm.controls["billNo"].value
        )
      )
      .pipe(takeUntil(this._destroying$))
      .subscribe(
        (resultdata) => {
          console.log(resultdata);
          if (resultdata == null) {
            this.snackbar.open("Invalid Bill No");
          } else {
            this.patientbilldetaillist =
              resultdata as getPatientPersonalandBillDetails;
            this.billdetailservice.patientbilldetaillist = resultdata;
            console.log(this.patientbilldetaillist.billDetialsForRefund_Table0);
            if (
              this.patientbilldetaillist.billDetialsForRefund_Table0.length >= 1
            ) {
              this.billdetailservice.serviceList =
                this.patientbilldetaillist.billDetialsForRefund_ServiceDetail;
              if (
                this.patientbilldetaillist.billDetialsForRefund_Cancelled[0]
                  .cancelled == 1
              ) {
                var errtxt =
                  "Bill Number " +
                  this.BServiceForm.value.billNo +
                  " Has Been Cancelled";
                this.msgdialog.info(errtxt);
              }
              console.log(
                this.patientbilldetaillist
                  .billDetialsForRefund_ConfigValueToken[1]
              );
              this.billFormfill();
              this.printbill = false;
              this.consumableprint = false;
              this.phptracksheet = false;
              this.opprescription = false;
              this.doxperprint = false;
              if (
                this.patientbilldetaillist.billDetialsForRefund_ServiceDetail[0]
                  .requestToApproval == 0
              ) {
                this.refundbill == false;
              } else if (
                this.patientbilldetaillist.billDetialsForRefund_ServiceDetail[0]
                  .requestToApproval == 1
              ) {
                this.refundbill == true;
              }
              console.log(this.billdetailservice.serviceList);
              this.router.navigate(["out-patient-billing/details", "services"]);
            }
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }
  billFormfill() {
    console.log(this.patientbilldetaillist.billDetialsForRefund_Table0);
    this.BServiceForm.controls["maxid"].setValue(
      this.patientbilldetaillist.billDetialsForRefund_Table0[0].uhid
    );
    this.dmsbtn = false;
    this.visithistorybtn = false;
    this.getPatientIcon();
    this.BServiceForm.controls["mobileno"].setValue(
      this.patientbilldetaillist.billDetialsForRefund_Table0[0].pcellno
    );
    this.BServiceForm.controls["billDate"].setValue(
      this.patientbilldetaillist.billDetialsForRefund_Table0[0].datetime
    );
    this.patientName =
      this.patientbilldetaillist.billDetialsForRefund_Table0[0].name;
    this.age = this.patientbilldetaillist.billDetialsForRefund_Table0[0].age;
    this.gender = this.patientbilldetaillist.billDetialsForRefund_Table0[0].sex;
    this.dob = this.datepipe.transform(
      this.patientbilldetaillist.billDetialsForRefund_Table0[0].datetime,
      "dd/MM/YYYY"
    );
    this.country = "India";
    this.ssn = this.patientbilldetaillist.billDetialsForRefund_Table0[0].ssn;
    this.operator =
      this.patientbilldetaillist.billDetialsForRefund_Table0[0].operator;
    this.billdate = this.datepipe.transform(
      this.patientbilldetaillist.billDetialsForRefund_Table0[0].datetime,
      "dd/MM/YYYY"
    );
    this.BServiceForm.controls["billAmt"].setValue(
      this.patientbilldetaillist
        .billDetialsForRefund_DepositRefundAmountDetail[0].billamount
    );
    this.BServiceForm.controls["dipositrAmt"].setValue(
      this.patientbilldetaillist
        .billDetialsForRefund_DepositRefundAmountDetail[0].depositamount
    );
    this.BServiceForm.controls["discAmt"].setValue(
      this.patientbilldetaillist
        .billDetialsForRefund_DepositRefundAmountDetail[0].discountamount
    );
    // this.BServiceForm.controls["discAftBill"].setValue(this.patientbilldetaillist.billDetialsForRefund_DepositRefundAmountDetail[0]);
    // this.BServiceForm.controls["refundAmt"].setValue(this.patientbilldetaillist.billDetialsForRefund_RequestNoGeivePaymentModeRefund[0].refundAmt);
    this.BServiceForm.controls["authBy"].setValue(
      this.patientbilldetaillist
        .billDetialsForRefund_RequestNoGeivePaymentModeRefund[0].authorisedby
    );
    // this.BServiceForm.controls["billDate"].setValue();
  }
  // getPatientDetailsByMaxId() {
  //   let regNumber = Number(this.miscForm.value.maxid.split(".")[1]);

  //   //HANDLING IF MAX ID IS NOT PRESENT
  //   if (regNumber != 0) {
  //     let iacode = this.miscForm.value.maxid.split(".")[0];
  //     this.http
  //       .get(
  //         ApiConstants.getregisteredpatientdetailsForBilling(
  //           iacode,
  //           regNumber,
  //           Number(this.cookie.get("HSPLocationId"))
  //         )
  //       )
  //       .pipe(takeUntil(this._destroying$))
  //       .subscribe(
  //         (resultData: Registrationdetails) => {
  //           // this.clear();
  //           // this.flushAllObjects();
  //           this.patientDetails = resultData;
  //           // this.categoryIcons = this.patientService.getCategoryIconsForPatient(
  //           //   this.patientDetails
  //           // );
  //           // this.MaxIDExist = true;
  //           // console.log(this.categoryIcons);
  //           // this.checkForMaxID();
  //           //RESOPONSE DATA BINDING WITH CONTROLS

  //           this.setValuesToMiscForm(this.patientDetails);

  //           //SETTING PATIENT DETAILS TO MODIFIEDPATIENTDETAILOBJ
  //         },
  //         (error) => {
  //           if (error.error == "Patient Not found") {
  //             // this.messageDialogService.info(error.error);
  //             // this.router.navigate([], {
  //             //   queryParams: {},
  //             //   relativeTo: this.route,
  //             // });
  //             // this.flushAllObjects();
  //             // this.setValuesTo miscForm(this.patientDetails);
  //             this.miscForm.controls["maxid"].setValue(
  //               iacode + "." + regNumber
  //             );
  //             this.miscForm.controls["maxid"].setErrors({ incorrect: true });
  //             this.questions[0].customErrorMessage = "Invalid Max ID";
  //           }
  //           // this.clear();

  //           // this.maxIDChangeCall = false;
  //         }
  //       );
  //   }
  // }

  openhistory() {
    this.matDialog.open(VisitHistoryComponent, {
      width: "70%",
      height: "50%",
      data: {
        maxid: this.BServiceForm.value.maxid,
      },
    });
  }
  search() {
    let dialogref = this.matDialog.open(SearchDialogComponent, {
      maxWidth: "90vw",
      height: "85%",
      data: {
        maxid: this.BServiceForm.value.maxid,
        mobileno: this.BServiceForm.value.mobileno,
        check: this.BServiceForm.value.datevalidation,
        fromdate: this.BServiceForm.value.fromDate,
        todate: this.BServiceForm.value.toDate,
      },
    });
    dialogref.afterClosed().subscribe((res) => {
      console.log(res);
      if (res == "" || res == null || res == undefined) {
        // this.clear();
      } else {
        this.BServiceForm.controls["billNo"].setValue(res);
        this.getpatientbilldetails();
      }
    });
  }
  clear() {
    this.BServiceForm.reset();
    // this.BServiceForm.controls["maxid"].setValue(this.cookie.get("LocationIACode") + ".");
    // this.BServiceForm.controls["fromDate"].setValue(new Date());
    // this.BServiceForm.controls["toDate"].setValue(new Date());
    this.patientName = "";
    this.age = "";
    this.gender = "";
    this.dob = "";
    this.country = "";
    this.ssn = "";
    this.operator = "";
    this.billdate = "";
    this.otpbtn = true;
    this.managerotpbtn = true;
    this.refundbill = true;
    this.approvalsend = true;
    this.printbill = true;
    this.printrefund = true;
    this.resendbill = true;
    this.consumableprint = true;
    this.phptracksheet = true;
    this.opprescription = true;
    this.doxperprint = true;
    this.clearbtn = true;
    this.dmsbtn = true;
    this.visithistorybtn = true;
    this.billdetailservice.clear();
    this.ngOnInit();
  }
  doxperredirect() {
    let iacode = this.BServiceForm.value.maxid.split(".")[0];
    this.doxperurl =
      this.patientbilldetaillist.billDetialsForRefund_ConfigValueToken[1]
        .configValue +
      "patient_id=" +
      this.BServiceForm.value.maxid +
      "&visit_id=" +
      this.patientbilldetaillist.billDetialsForRefund_ServiceDetail[0].visitid +
      "&organisation=" +
      iacode +
      "&token=" +
      this.patientbilldetaillist.billDetialsForRefund_ConfigValueToken[1].token;
    window.open(this.doxperurl, "_blank");
  }
  ngDoCheck(): void {
    const changes = this.check.diff(this.billdetailservice.sendforapproval);
    if (changes) {
      console.log(this.billdetailservice.totalrefund);
      console.log(this.billdetailservice.sendforapproval);
      console.log(changes);
      this.BServiceForm.controls["refundAmt"].setValue(
        this.billdetailservice.totalrefund
      );
      if (this.billdetailservice.sendforapproval.length > 0) {
        this.approvalsend = false;
      } else if (this.billdetailservice.sendforapproval.length == 0) {
        this.approvalsend = true;
      }
    }
  }
}
