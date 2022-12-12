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
import { NavigationEnd, Router } from "@angular/router";
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
import { PaymentDialogComponent } from "./payment-dialog/payment-dialog.component";
import { BillDetailsRefundDialogComponent } from "./refund-dialog/refund-dialog.component";
import {
  objSendApprovalTableList,
  sendForBillDetailsApproval,
} from "../../../../core/models/sendForBillDetailsApproval.Model";
import { PrintRefundReceiptDialogComponent } from "./printrefundreceiptdialog/print-refund-receipt-dialog.component";
import { ResendBillEmailDialogComponent } from "./resend-bill-email-dialog/resend-bill-email-dialog.component";
import { ReportService } from "@shared/services/report.service";
import { ActivatedRoute } from "@angular/router";
import { DMSrefreshModel } from "@core/models/DMSrefresh.Model";
import { DMSComponent } from "@modules/registration/submodules/dms/dms.component";
import { OpPrescriptionDialogComponent } from "./op-prescription-dialog/op-prescription-dialog.component";
import { SearchService } from "@shared/services/search.service";
import { LookupService } from "@core/services/lookup.service";
import { MoreThanMonthComponent } from "../dispatch-report/more-than-month/more-than-month.component";
import { Form60YesOrNoComponent } from "../deposit/form60-dialog/form60-yes-or-no.component";
import { PermissionService } from "@shared/services/permission.service";
@Component({
  selector: "out-patients-details",
  templateUrl: "./details.component.html",
  styleUrls: ["./details.component.scss"],
})
export class DetailsComponent implements OnInit {
  private check!: KeyValueDiffer<string, any>;
  maxid: any;
  billno: any;
  frombill: any = 0;
  duesettlement: any = 0;
  constructor(
    public matDialog: MatDialog,
    private formService: QuestionControlService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpService,
    public cookie: CookieService,
    private datepipe: DatePipe,
    private billdetailservice: billDetailService,
    private differ: KeyValueDiffers,
    private patientService: PatientService,
    private msgdialog: MessageDialogService,
    private snackbar: MaxHealthSnackBarService,
    private reportService: ReportService,
    private searchService: SearchService,
    private lookupService: LookupService,
    private permissionservice: PermissionService
  ) {
    this.route.queryParams
      .pipe(takeUntil(this._destroying$))
      .subscribe(async (value: any) => {
        console.log(Object.keys(value).length);
        console.log(value);
        if (value.billno) {
          this.duesettlement = 1;
          this.getpatientbilldetails();
        }
        if (value.from == 1) {
          this.frombill = 1;
        }
        if (Object.keys(value).length > 0) {
          const lookupdata = await this.loadGrid(value);
        } else {
          // this.ngOnInit();
          // this.clear();
        }
      });
    this.check = this.differ
      .find(this.billdetailservice.sendforapproval)
      .create();
  }
  async loadGrid(formdata: any): Promise<any> {
    this.maxid = formdata.maxID;
  }

  moment = moment;
  @ViewChild("selectedServices") selectedServicesTable: any;
  public refundreasonlist: getrefundreason[] = [];
  public patientbilldetaillist!: getPatientPersonalandBillDetails;
  // for icons
  public patientDetailsforicon!: PatientDetails;
  categoryIcons: [] = [];

  linkList: any = [
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
  paymentmode: any = [];
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
        //pattern: "^[1-9]{1}[0-9]{9}",
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
        defaultValue: new Date(),
      },
      toDate: {
        type: "date",
        defaultValue: new Date(),
      },
      billAmt: {
        type: "string",
        required: false,
        defaultValue: "0.00",
        readonly: true,
      },
      dipositrAmt: {
        type: "string",
        required: false,
        defaultValue: "0.00",
        readonly: true,
      },
      discAmt: {
        type: "string",
        required: false,
        defaultValue: "0.00",
        readonly: true,
      },
      discAftBill: {
        type: "string",
        required: false,
        defaultValue: "0.00",
        readonly: true,
      },
      refundAmt: {
        type: "string",
        required: false,
        defaultValue: "0.00",
        readonly: true,
      },
      authBy: {
        type: "string",
        required: false,
      },
      reason: {
        type: "dropdown",
        required: false,
        options: this.refundreasonlist,
      },
      paymentMode: {
        type: "dropdown",
        required: false,
        options: this.paymentmode,
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
  form60: any;

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

  billexist: boolean = true;
  apiProcessing: boolean = false;
  result: any = [];
  locationexclude: any = [67, 69];
  paymentBreakuplist: any;
  ngOnInit() {
    this.router.navigate(["out-patient-billing/details"]);
    let formResult = this.formService.createForm(
      this.BDetailFormData.properties,
      {}
    );
    this.BServiceForm = formResult.form;
    this.questions = formResult.questions;
    this.lastUpdatedBy = this.cookie.get("UserName");
    console.log(this.maxid);
    if (this.maxid != "" && this.maxid != undefined) {
      this.BServiceForm.controls["maxid"].setValue(this.maxid);
      this.searchbillapi(this.maxid);
      console.log(this.result);
      this.maxid = "";
    }
    this.BServiceForm.controls["fromDate"].disable();
    this.BServiceForm.controls["toDate"].disable();
    this.BServiceForm.controls["authBy"].disable();
    this.BServiceForm.controls["reason"].disable();
    this.BServiceForm.controls["paymentMode"].disable();
    this.questions[5].maximum = this.BServiceForm.controls["toDate"].value;
    this.questions[6].minimum = this.BServiceForm.controls["fromDate"].value;
    this.getrefundreason();
    this.paymentmode = this.billdetailservice.paymentmode;
    this.questions[14].options = this.paymentmode.map((l: any) => {
      return { title: l.title, value: l.title };
    });

    this.BServiceForm.controls["paymentMode"].setValue(
      this.paymentmode[0].title
    );
    this.BServiceForm.controls["reason"].valueChanges.subscribe(() => {
      this.sendapprovalcheck();
    });

    this.searchService.searchTrigger
      .pipe(takeUntil(this._destroying$))
      .subscribe(async (formdata: any) => {
        this.router.navigate([], {
          queryParams: {},
          relativeTo: this.route,
        });
        const lookupdata = await this.lookupService.searchPatient(formdata);
        console.log(lookupdata);
        if (lookupdata.length == 1) {
          this.BServiceForm.controls["maxid"].setValue(lookupdata[0].maxid);
          this.search();
        } else if (lookupdata.length > 1) {
          this.BServiceForm.controls["mobileno"].setValue(lookupdata[0].phone);
          this.search();
        }
      });
    this.billdetailservice.onload();
  }

  searchbillapi(maxid: any = "", mobileno: any = "") {
    console.log(maxid);
    this.http
      .get(
        BillDetailsApiConstants.getsearchopbills(
          "",
          maxid ? maxid.split(".")[1] : "",
          maxid ? maxid.split(".")[0] : "",
          mobileno,
          false,
          this.datepipe.transform(new Date(), "YYYY-MM-dd"),
          this.datepipe.transform(new Date(), "YYYY-MM-dd"),
          Number(this.cookie.get("HSPLocationId"))
        )
      )
      .pipe(takeUntil(this._destroying$))
      .subscribe(async (res) => {
        console.log(res);
        this.result = res;
        this.BServiceForm.markAsDirty();
        if (this.result.length > 1) {
          if (this.frombill == 1) {
            this.result = this.result.filter((i: any) => {
              return i.balance > 0;
            });
            if (this.result.length == 1) {
              this.BServiceForm.controls["billNo"].setValue(
                this.result[0].billno
              );
              this.getpatientbilldetails();
            } else {
              this.search();
            }
          } else {
            this.search();
          }
        } else if (this.result.length == 1) {
          this.BServiceForm.controls["billNo"].setValue(this.result[0].billno);
          this.getpatientbilldetails();
        }
      });
  }
  lastUpdatedBy: string = "";
  currentTime: string = new Date().toLocaleString();

  ngAfterViewInit(): void {
    this.questions[0].elementRef.focus();
    this.formEvents();
    this.BServiceForm.controls["datevalidation"].valueChanges.subscribe(
      (value) => {
        if (value == true) {
          this.BServiceForm.controls["fromDate"].enable();
          this.BServiceForm.controls["toDate"].enable();
        } else {
          this.BServiceForm.controls["fromDate"].disable();
          this.BServiceForm.controls["toDate"].disable();
        }
      }
    );
    this.BServiceForm.controls["fromDate"].valueChanges.subscribe((val) => {
      this.questions[6].minimum = val;
    });
    this.BServiceForm.controls["refundAmt"].valueChanges.subscribe((res) => {
      this.sendapprovalcheck();
    });
    this.questions[12].elementRef.addEventListener(
      "blur",
      this.sendapprovalcheck.bind(this)
    );
    // this.questions[13].elementRef.addEventListener('blur',this.sendapprovalcheck.bind(this));
    this.BServiceForm.controls["reason"].valueChanges.subscribe((res) => {
      this.sendapprovalcheck();
    });
    this.BServiceForm.controls["paymentMode"].valueChanges.subscribe((res) => {
      this.sendapprovalcheck();
    });
  }
  getrefundreason() {
    this.http
      .get(BillDetailsApiConstants.getrefundreason)
      .pipe(takeUntil(this._destroying$))
      .subscribe((resuldata) => {
        this.refundreasonlist = resuldata;
        this.questions[13].options = this.refundreasonlist.map((l) => {
          return { title: l.name, value: l.id };
        });
      });
  }
  approvedfalg: boolean = false;
  sendapprovalcheck() {
    if (
      this.BServiceForm.controls["authBy"].value != "" &&
      this.BServiceForm.controls["reason"].value != "" &&
      this.BServiceForm.controls["reason"].value != "0" &&
      this.BServiceForm.controls["paymentMode"].value != "" &&
      this.BServiceForm.controls["refundAmt"].value > 0 &&
      this.approvedfalg == false
    ) {
      this.approvalsend = false;
      this.billdetailservice.authorisedby =
        this.BServiceForm.controls["authBy"].value;
      this.billdetailservice.reason =
        this.BServiceForm.controls["reason"].value;
      this.billdetailservice.mop =
        this.BServiceForm.controls["paymentMode"].value;
    } else {
      this.approvalsend = true;
    }
  }
  sendforapproval() {
    if (
      Number(this.BServiceForm.controls["refundAmt"].value) >= 10000 &&
      this.BServiceForm.controls["paymentMode"].value == "Cash"
    ) {
      this.msgdialog.info(
        "Refund Amount can't be greater than 10000 for Cash Payment. Please Select Other Payment Method"
      );
    } else {
      this.sendforapprovalcall();
    }
  }
  sendforapprovalcall() {
    var reas = this.refundreasonlist.filter((i) => {
      return i.id == this.BServiceForm.controls["reason"].value;
    });
    this.billdetailservice.sendforapproval.forEach((i: any) => {
      (i.authorisedby = this.BServiceForm.controls["authBy"].value),
        (i.reason = reas[0].name),
        (i.mop = this.BServiceForm.controls["paymentMode"].value);
    });
    this.http
      .post(
        BillDetailsApiConstants.sendapproval(
          "Gavs",
          this.cookie.get("HSPLocationId"),
          this.cookie.get("UserId")
        ),
        this.approvelist()
      )
      .subscribe((res) => {
        if (res.length > 0) {
          if (res[0].successFlag == true) {
            let dialogref = this.msgdialog.success(res[0].returnMessage);
            dialogref.afterClosed().subscribe(() => {
              this.billno = this.BServiceForm.controls["billNo"].value;
              this.clear();
              this.BServiceForm.controls["billNo"].setValue(this.billno);
              this.getpatientbilldetails();
            });
          } else {
            this.msgdialog.info(res[0].returnMessage);
          }
        }
      });
  }
  sendforapprovallist: sendForBillDetailsApproval =
    new sendForBillDetailsApproval();
  approvelist() {
    this.sendforapprovallist.objSendApprovalTableList =
      [] as Array<objSendApprovalTableList>;
    this.billdetailservice.sendforapproval.forEach((i: any) => {
      this.sendforapprovallist.objSendApprovalTableList.push({
        ssn: i.ssn,
        maxid: i.maxid,
        ptnName: i.ptnName,
        billNo: i.billNo,
        operatorName: i.operatorName,
        authorisedby: i.authorisedby,
        reason: i.reason,
        refundAmt: i.refundAmt,
        mop: i.mop,
        serviceId: i.serviceId,
        itemId: i.itemid,
        serviceName: i.serviceName,
        itemName: i.itemName,
        refundAfterAck: i.refundAfterAck,
        itemOrderId: i.itemOrderId,
      });
    });
    console.log(this.sendforapprovallist);
    return this.sendforapprovallist;
  }
  formEvents() {
    //ON billno CHANGE
    this.questions[0].elementRef.addEventListener("keypress", (event: any) => {
      if (event.key === "Enter") {
        event.preventDefault();
        this.billno = this.BServiceForm.controls["billNo"].value;
        this.getpatientbilldetails();
      }
    });
    this.questions[1].elementRef.addEventListener("keypress", (event: any) => {
      if (event.key === "Enter") {
        event.preventDefault();
        if (
          this.BServiceForm.value.maxid ==
          this.cookie.get("LocationIACode") + "."
        ) {
          this.snackbar.open("Invalid Max ID");
        } else if (this.BServiceForm.value.maxid == "") {
          this.snackbar.open("Invalid Max ID");
        } else if (
          !this.BServiceForm.value.maxid.split(".")[0] ||
          !this.BServiceForm.value.maxid.split(".")[1]
        ) {
          this.snackbar.open("Invalid Max ID");
        } else {
          this.search();
        }
      }
    });
    this.questions[2].elementRef.addEventListener("keypress", (event: any) => {
      if (event.key === "Enter") {
        event.preventDefault();
        if (this.BServiceForm.value.mobileno.toString().length < 10) {
          this.snackbar.open("Invalid Mobile No");
        } else {
          this.search();
        }
      }
    });
  }

  noteRemarkdb: any;
  vipdb: any;
  hwcRemarkdb: any;
  hotlistReasondb: any;
  hotlistRemarkdb: any;
  bplcardNo: any;
  bplCardAddress: any;
  getPatientIcon() {
    let iacode = this.BServiceForm.value.maxid.split(".")[0];
    let regNumber = this.BServiceForm.value.maxid.split(".")[1];
    this.http
      .get(
        ApiConstants.getregisteredpatientdetailsForBilling(
          iacode,
          regNumber,
          Number(this.cookie.get("HSPLocationId"))
        )
      )
      .pipe(takeUntil(this._destroying$))
      .subscribe(
        (resultData: Registrationdetails) => {
          this.patientDetails = resultData;
        },
        (error) => {}
      );

    this.http
      .get(ApiConstants.patientDetails(regNumber, iacode))
      .pipe(takeUntil(this._destroying$))
      .subscribe((res: PatientDetails) => {
        this.patientDetailsforicon = res;
        this.noteRemarkdb = res.notereason;
        this.vipdb = res.vipreason;
        this.hwcRemarkdb = res.hwcRemarks;
        this.hotlistReasondb = { title: res.hotlistreason, valu: 0 };
        this.hotlistRemarkdb = res.hotlistcomments;
        this.bplcardNo = res.bplcardNo;
        this.bplCardAddress = res.addressOnCard;
        this.categoryIcons = this.patientService.getCategoryIconsForPatient(
          this.patientDetailsforicon
        );
      });
  }

  doCategoryIconAction(categoryIcon: any) {
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
      ppagerNumber: {
        bplCardNo: this.bplcardNo,
        BPLAddress: this.bplCardAddress,
      },
      hotlist: {
        hotlistTitle: this.hotlistReasondb,
        reason: this.hotlistRemarkdb,
      },
    };
    if (
      categoryIcon.tooltip != "CASH" &&
      categoryIcon.tooltip != "INS" &&
      categoryIcon.tooltip != "PSU"
    ) {
      this.patientService.doAction(categoryIcon.type, data[categoryIcon.type]);
    }
  }
  getpatientbilldetails() {
    this.billdetailservice.clear();
    this.BServiceForm.controls["refundAmt"].setValue("0.00");
    this.apiProcessing = true;
    this.http
      .get(
        BillDetailsApiConstants.getpatientbilldetails(
          this.BServiceForm.controls["billNo"].value
        )
      )
      .pipe(takeUntil(this._destroying$))
      .subscribe(
        (resultdata) => {
          if (
            resultdata == null ||
            resultdata.billDetialsForRefund_Table0.length == 0
          ) {
            this.snackbar.open("Invalid Bill No");
            this.apiProcessing = false;
          } else {
            this.questions[0].readonly = true;
            this.questions[1].readonly = true;
            this.questions[2].readonly = true;
            this.activeLink = this.linkList[0];
            this.getpatientandbilldetailsforrefund();
            this.patientbilldetaillist =
              resultdata as getPatientPersonalandBillDetails;
            this.patientbilldetaillist.billDetialsForRefund_ServiceDetail.forEach(
              (item) => {
                item.amount = item.amount.toFixed(2);
                item.discountamount = item.discountamount.toFixed(2);
                item.planAmount = item.planAmount.toFixed(2);
              }
            );
            this.billdetailservice.patientbilldetaillist = resultdata;
            var printrefundflag = 0;
            this.apiProcessing = false;
            console.log(
              this.patientbilldetaillist.billDetialsForRefund_IdName.length
            );
            if (
              this.patientbilldetaillist.billDetialsForRefund_IdName.length > 0
            ) {
              this.resendbill = false;
            }
            this.patientbilldetaillist.billDetialsForRefund_ServiceDetail.forEach(
              (k) => {
                if (k.cancelled == 1) {
                  printrefundflag++;
                }
              }
            );
            if (printrefundflag > 0) {
              this.printrefund = false;
            } else {
              this.printrefund = true;
            }
            if (
              this.patientbilldetaillist.billDetialsForRefund_Table0.length >= 1
            ) {
              this.billdetailservice.billafterrefund =
                this.patientbilldetaillist.billDetialsForRefund_ServiceDetail;
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
                this.linkList[1].disabled = true;
                this.linkList[2].disabled = true;
                this.linkList[3].disabled = true;
              } else {
                this.linkList[1].disabled = false;
                this.linkList[2].disabled = false;
                this.linkList[3].disabled = false;
              }
              var approvalpending: any = 0;
              for (
                var i = 0;
                i <
                this.patientbilldetaillist
                  .billDetialsForRefund_RequestNoGeivePaymentModeRefund.length;
                i++
              ) {
                if (
                  this.patientbilldetaillist
                    .billDetialsForRefund_RequestNoGeivePaymentModeRefund[i]
                    .notApproved == 0 &&
                  this.patientbilldetaillist
                    .billDetialsForRefund_RequestNoGeivePaymentModeRefund[i]
                    .itemId != 0
                ) {
                  approvalpending++;
                }
              }
              if (approvalpending > 0) {
                this.msgdialog.info("Approval Pending");
              }
              this.BServiceForm.controls["billNo"].setValue(this.billno);
              this.billFormfill();
              if (
                this.patientbilldetaillist
                  .billDetialsForRefund_RequestNoGeivePaymentModeRefund[0]
                  .authorisedby == "" &&
                this.patientbilldetaillist
                  .billDetialsForRefund_RequestNoGeivePaymentModeRefund[0]
                  .reason == "" &&
                this.patientbilldetaillist
                  .billDetialsForRefund_RequestNoGeivePaymentModeRefund[0]
                  .paymentMode == ""
              ) {
                // this.BServiceForm.controls['authBy'].enable();
                // this.BServiceForm.controls['reason'].enable();
                // this.BServiceForm.controls['paymentMode'].enable();
              } else {
                this.BServiceForm.controls["authBy"].disable();
                this.BServiceForm.controls["reason"].disable();
                this.BServiceForm.controls["paymentMode"].disable();
              }
              var healthlist = 0;
              var consultlist = 0;
              var consumablelist = 0;
              this.patientbilldetaillist.billDetialsForRefund_ServiceDetail.forEach(
                (item: any) => {
                  if (item.servicename == "Health Checkups") {
                    healthlist++;
                  } else if (
                    (item.servicename == "Consultations" ||
                      item.servicename == "Consultation Charges") &&
                    this.locationexclude.includes(
                      Number(this.cookie.get("HSPLocationId"))
                    )
                  ) {
                    consultlist++;
                  } else if (item.servicename == "Consumable") {
                    consumablelist++;
                  }
                }
              );
              console.log(healthlist, consultlist, consumablelist, consultlist);
              if (healthlist > 0) {
                this.phptracksheet = false;
              } else {
                this.phptracksheet = true;
              }
              if (
                consultlist > 0 &&
                this.patientbilldetaillist.billDetialsForRefund_Cancelled[0]
                  .cancelled == 0
              ) {
                this.opprescription = false;
              } else {
                this.opprescription = true;
              }
              if (consumablelist > 0) {
                this.consumableprint = false;
              } else {
                this.consumableprint = true;
              }
              if (consultlist > 0) {
                this.doxperprint = false;
              } else {
                this.doxperprint = true;
              }
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
              this.printbill = false;
              if (this.frombill == 1 || this.duesettlement == 1) {
                this.router.navigate(
                  ["out-patient-billing/details", "cred-bill-settlement"],
                  {
                    queryParams: {
                      maxid: this.BServiceForm.controls["maxid"].value,
                    },
                    queryParamsHandling: "merge",
                  }
                );
              } else {
                this.router.navigate(
                  ["out-patient-billing/details", "services"],
                  {
                    queryParams: {
                      maxid: this.BServiceForm.controls["maxid"].value,
                    },
                    queryParamsHandling: "merge",
                  }
                );
              }
            }
          }
        },
        (error: any) => {
          console.log(error);
          this.apiProcessing = false;
          this.msgdialog.error(error.error);
        }
      );
  }
  getpatientandbilldetailsforrefund() {
    this.http
      .get(
        BillDetailsApiConstants.getpatientandbilldetailsforrefund(
          this.BServiceForm.controls["billNo"].value
        )
      )
      .pipe(takeUntil(this._destroying$))
      .subscribe((res) => {
        console.log(res);
        this.paymentBreakuplist = res;
        this.billdetailservice.paymentBreakuplist = this.paymentBreakuplist;
      });
  }
  billFormfill() {
    this.billexist = false;
    this.BServiceForm.markAsDirty();
    this.BServiceForm.controls["billNo"].setValue(
      this.patientbilldetaillist
        .billDetialsForRefund_DepositRefundAmountDetail[0].billno
    );
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
      this.patientbilldetaillist.billDetialsForRefund_Table0[0].dateOfBirth,
      "dd/MM/YYYY"
    );
    this.country =
      this.patientbilldetaillist.billDetialsForRefund_Table0[0].nationalityName;
    this.ssn = this.patientbilldetaillist.billDetialsForRefund_Table0[0].ssn;
    this.operator =
      this.patientbilldetaillist.billDetialsForRefund_Table0[0].operator;
    this.billdate = this.datepipe.transform(
      this.patientbilldetaillist.billDetialsForRefund_Table0[0].datetime,
      "dd/MM/YYYY hh:mm:ss"
    );
    this.BServiceForm.controls["billAmt"].setValue(
      this.patientbilldetaillist.billDetialsForRefund_DepositRefundAmountDetail[0].billamount.toFixed(
        2
      )
    );
    this.BServiceForm.controls["dipositrAmt"].setValue(
      this.patientbilldetaillist.billDetialsForRefund_DepositRefundAmountDetail[0].depositamount.toFixed(
        2
      )
    );
    this.BServiceForm.controls["discAmt"].setValue(
      this.patientbilldetaillist.billDetialsForRefund_DepositRefundAmountDetail[0].discountamount.toFixed(
        2
      )
    );
    this.BServiceForm.controls["discAftBill"].setValue(Number(0).toFixed(2));
    // this.BServiceForm.controls["refundAmt"].setValue(this.patientbilldetaillist.billDetialsForRefund_RequestNoGeivePaymentModeRefund[0].refundAmt);
    this.BServiceForm.controls["authBy"].setValue(
      this.patientbilldetaillist
        .billDetialsForRefund_RequestNoGeivePaymentModeRefund[0].authorisedby
    );
    var reasonid = this.refundreasonlist.find((id) => {
      return (
        id.name ==
        this.patientbilldetaillist
          .billDetialsForRefund_RequestNoGeivePaymentModeRefund[0].reason
      );
    });
    var payid = this.billdetailservice.paymentmode.find((id: any) => {
      return (
        id.title ==
        this.patientbilldetaillist
          .billDetialsForRefund_RequestNoGeivePaymentModeRefund[0].paymentMode
      );
    });
    this.BServiceForm.controls["reason"].setValue(reasonid?.id);
    if (payid != undefined) {
      this.BServiceForm.controls["paymentMode"].setValue(payid.title);
    }
    this.billdetailservice.setActiveBillnNo(
      this.BServiceForm.controls["billNo"].value
    );
    this.billdetailservice.setActiveMaxId(
      this.BServiceForm.controls["maxid"].value
    );
    this.sendapprovalcheck();
  }
  dms() {
    const patientDetails =
      this.patientDetails.dsPersonalDetails.dtPersonalDetails1[0];
    this.http
      .get(
        ApiConstants.PatientDMSDetail(
          patientDetails.iacode,
          patientDetails.registrationno
        )
      )
      .pipe(takeUntil(this._destroying$))
      .subscribe((resultData: DMSrefreshModel[]) => {
        this.matDialog.open(DMSComponent, {
          width: "100vw",
          maxWidth: "90vw",
          maxHeight: "80vh",
          data: {
            list: resultData,
            maxid: patientDetails.iacode + "." + patientDetails.registrationno,
            firstName: patientDetails.firstname,
            lastName: patientDetails.lastname,
          },
        });
        // this.dmsProcessing = false;
      });
  }
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
    if (this.BServiceForm.value.datevalidation == true) {
      var fdate = new Date(this.BServiceForm.controls["fromDate"].value);
      var tdate = new Date(this.BServiceForm.controls["toDate"].value);
      var dif_in_time = tdate.getTime() - fdate.getTime();
      var dif_in_days = dif_in_time / (1000 * 3600 * 24);
      if (dif_in_days > 31) {
        this.matDialog.open(MoreThanMonthComponent, {
          width: "30vw",
          height: "30vh",
        });
      } else {
        this.searchdialog();
      }
    } else {
      this.searchdialog();
    }
  }
  searchdialog() {
    let dialogref = this.matDialog.open(SearchDialogComponent, {
      maxWidth: "90vw",
      height: "85%",
      data: {
        maxid: this.BServiceForm.value.maxid,
        mobileno: this.BServiceForm.value.mobileno,
        check: this.BServiceForm.value.datevalidation,
        fromdate: this.BServiceForm.value.fromDate,
        todate: this.BServiceForm.value.toDate,
        frombill: this.frombill,
      },
    });
    dialogref.afterClosed().subscribe((res) => {
      if (res) {
        this.BServiceForm.controls["billNo"].setValue(res);
        this.billno = this.BServiceForm.controls["billNo"].value;
        this.getpatientbilldetails();
      } else {
      }
    });
    this.BServiceForm.markAsDirty();
  }
  refunddialog() {
    if (
      this.patientbilldetaillist.billDetialsForRefund_Table0[0].age.split(
        " "
      )[0] > "65"
    ) {
      var dialogref = this.msgdialog.info("Patient is Senior Citizen.");
      dialogref.afterClosed().subscribe((res) => {
        this.refunddialogopen();
      });
    } else {
      this.refunddialogopen();
    }
  }
  refunddialogopen() {
    var reas = this.refundreasonlist.filter((i) => {
      return i.id == this.BServiceForm.controls["reason"].value;
    });
    const RefundDialog = this.matDialog.open(BillDetailsRefundDialogComponent, {
      panelClass: "refund-bill-dialog",
      width: "80vw",
      height: "98vh",
      data: {
        patientinfo: {
          emailId:
            this.patientbilldetaillist.billDetialsForRefund_Table0[0].emailId,
          mobileno:
            this.patientbilldetaillist.billDetialsForRefund_Table0[0].pcellno,
          screename: "Billing",
          toPaidAmount: this.billdetailservice.totalrefund,
        },
        refundamount: this.BServiceForm.value.refundAmt,
        authby: this.BServiceForm.controls["authBy"].value,
        reasonname: reas[0].name,
        reasonid: reas[0].id,
        mop: this.BServiceForm.controls["paymentMode"].value,
        mobile:
          this.patientbilldetaillist.billDetialsForRefund_Table0[0].pcellno,
        billid:
          this.patientbilldetaillist.billDetialsForRefund_Table1[0].opBillID,
        billno: this.BServiceForm.value.billNo,
        maxid: this.patientbilldetaillist.billDetialsForRefund_Table0[0].uhid,
        email:
          this.patientbilldetaillist.billDetialsForRefund_Table0[0].emailId,
      },
    });
    RefundDialog.afterClosed()
      .pipe(takeUntil(this._destroying$))
      .subscribe((result) => {
        if (result == "success") {
          var billno = this.BServiceForm.controls["billNo"].value;
          this.clear();
          this.billdetailservice.clear();
          this.BServiceForm.controls["billNo"].setValue(billno);
          this.getpatientbilldetails();
        }
      });
  }
  clear() {
    this.BServiceForm.reset();
    this.categoryIcons = [];
    this.activeLink = this.linkList[0];
    this.questions[0].readonly = false;
    this.questions[1].readonly = false;
    this.questions[2].readonly = false;
    this.BServiceForm.controls["paymentMode"].setValue(
      this.paymentmode[0].title
    );
    this.BServiceForm.controls["maxid"].setValue(
      this.cookie.get("LocationIACode") + "."
    );
    this.BServiceForm.controls["fromDate"].setValue(new Date());
    this.BServiceForm.controls["toDate"].setValue(new Date());
    this.BServiceForm.controls["billAmt"].setValue(Number(0).toFixed(2));
    this.BServiceForm.controls["dipositrAmt"].setValue(Number(0).toFixed(2));
    this.BServiceForm.controls["discAmt"].setValue(Number(0).toFixed(2));
    this.BServiceForm.controls["discAftBill"].setValue(Number(0).toFixed(2));
    this.BServiceForm.controls["refundAmt"].setValue(Number(0).toFixed(2));
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
    this.billexist = true;
    this.billdetailservice.clear();
    this.linkList[1].disabled = false;
    this.linkList[2].disabled = false;
    this.linkList[3].disabled = false;
    this.frombill = 0;
    this.duesettlement = 0;
    // this.ngOnInit();
  }
  doxperredirect() {
    var maxid = this.BServiceForm.controls["maxid"].value;
    var visitid =
      this.patientbilldetaillist.billDetialsForRefund_ServiceDetail[0].id;
    var token =
      this.patientbilldetaillist.billDetialsForRefund_ConfigValueToken[0].token;
    var config =
      this.patientbilldetaillist.billDetialsForRefund_ConfigValueToken[0].configValue.split(
        "?"
      )[0];
    var iacode = maxid.split(".")[0];
    var location = this.cookie.get("Location").split("%");
    this.doxperurl =
      config +
      "?patient_id=" +
      maxid +
      "&visit_id=" +
      visitid +
      "&organisation=" +
      location[0].split(" ")[0] +
      "&token=" +
      token;
    window.open(this.doxperurl, "_blank");
  }
  printrefunddialog() {
    const printrefunddialog = this.matDialog.open(
      PrintRefundReceiptDialogComponent,
      {
        width: "30vw",
        height: "30vh",
      }
    );
  }
  resendbilldialog() {
    const printrefunddialog = this.matDialog.open(
      ResendBillEmailDialogComponent,
      {
        width: "35vw",
        height: "40vh",
        data: {
          billno: this.BServiceForm.controls["billNo"].value,
        },
      }
    );
  }
  reportprint(name: any) {
    //this.openReportModal(name);
    if (name == "billdetailsreport") {
      let regno = Number(this.BServiceForm.value.maxid.split(".")[1]);
      let iacode = this.BServiceForm.value.maxid.split(".")[0];
      let billno = this.BServiceForm.controls["billNo"].value;
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
        .subscribe((resultdata: any) => {
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
                this.openReportModal("billdetailsreport");
                this.formreport();
              } else if (res == "no") {
                this.openReportModal("billdetailsreport");
              }
            });
          } else {
            this.openReportModal("billdetailsreport");
          }
        });
    } else if (name == "PHPTracksheet") {
      this.openReportModal("PHPTracksheet");
    } else if (name == "ConsumabaleEntryDetailsReport") {
      this.openReportModal("ConsumabaleEntryDetailsReport");
    } else if (name == "PrintOPPrescriptionReport") {
      this.openReportModal("PrintOPPrescriptionReport");
    }
  }
  openReportModal(btnname: string) {
    if (btnname == "PHPTracksheet") {
      this.reportService.openWindow(
        "PHP Tracksheet - " + this.BServiceForm.value.billNo,
        btnname,
        {
          BillNo: this.BServiceForm.value.billNo,
        }
      );
    } else if (btnname == "billdetailsreport") {
      this.reportService.openWindow(
        "Billing Report - " + this.BServiceForm.value.billNo,
        btnname,
        {
          opbillid:
            this.patientbilldetaillist.billDetialsForRefund_Table1[0].opBillID,
          locationID: this.cookie.get("HSPLocationId"),
        }
      );
    } else if (btnname == "ConsumabaleEntryDetailsReport") {
      const accessControls: any = this.permissionservice.getAccessControls();
      const exist: any = accessControls[2][7][534][1430];
      console.log(exist);

      this.reportService.openWindow(
        "Consumable Report - " + this.BServiceForm.value.billNo,
        btnname,
        {
          billno: this.BServiceForm.value.billNo,
          locationID: this.cookie.get("HSPLocationId"),
          MAXID: this.BServiceForm.value.maxid,
          exportflagEnable: exist,
        }
      );
    } else if (btnname == "PrintOPPrescriptionReport") {
      const dialogref = this.msgdialog.confirm(
        "",
        "Do you want to print Blank Op Prescription?"
      );
      dialogref.afterClosed().subscribe((res) => {
        console.log(res);
        if (res.type == "yes") {
          this.reportService.openWindow(
            "OP Prescription Report - " + this.BServiceForm.value.billNo,
            btnname,
            {
              opbillid:
                this.patientbilldetaillist.billDetialsForRefund_Table1[0]
                  .opBillID,
              locationID: this.cookie.get("HSPLocationId"),
            }
          );
        }
      });
    }
  }
  formreport() {
    let regno = Number(this.BServiceForm.value.maxid.split(".")[1]);
    let iacode = this.BServiceForm.value.maxid.split(".")[0];
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
  ngDoCheck(): void {
    const changes = this.check.diff(this.billdetailservice.sendforapproval);
    if (changes) {
      var approvedlist;
      if (
        this.billdetailservice.totalrefund > 0 &&
        this.patientbilldetaillist
          .billDetialsForRefund_RequestNoGeivePaymentModeRefund[0]
          .authorisedby == "" &&
        this.patientbilldetaillist
          .billDetialsForRefund_RequestNoGeivePaymentModeRefund[0].reason ==
          "" &&
        this.patientbilldetaillist
          .billDetialsForRefund_RequestNoGeivePaymentModeRefund[0]
          .paymentMode == ""
      ) {
        this.BServiceForm.controls["authBy"].enable();
        this.BServiceForm.controls["reason"].enable();
        this.BServiceForm.controls["paymentMode"].enable();
      } else if (
        this.billdetailservice.totalrefund == 0 &&
        this.patientbilldetaillist
          .billDetialsForRefund_RequestNoGeivePaymentModeRefund[0]
          .authorisedby == "" &&
        this.patientbilldetaillist
          .billDetialsForRefund_RequestNoGeivePaymentModeRefund[0].reason ==
          "" &&
        this.patientbilldetaillist
          .billDetialsForRefund_RequestNoGeivePaymentModeRefund[0]
          .paymentMode == ""
      ) {
        this.BServiceForm.controls["authBy"].disable();
        this.BServiceForm.controls["reason"].disable();
        this.BServiceForm.controls["paymentMode"].disable();
        this.BServiceForm.controls["authBy"].setValue("");
        this.BServiceForm.controls["reason"].setValue("");
        this.BServiceForm.controls["paymentMode"].setValue(
          this.paymentmode[0].title
        );
      }
      var forenablerefundbill: any = [];
      var temp: any;
      if (this.billdetailservice.sendforapproval.length > 0) {
        // this.billdetailservice.sendforapproval.forEach((j: any) => {
        //   temp =
        //     this.patientbilldetaillist.billDetialsForRefund_RequestNoGeivePaymentModeRefund.filter(
        //       (k) => {
        //         return k.itemId == j.itemid;
        //       }
        //     );
        //     console.log('temp', temp);
        //     if(temp.length > 0)
        //     {
        //       forenablerefundbill.push(temp[0]);
        //     }

        // });
        var m = 0;
        console.log(
          this.billdetailservice.sendforapproval,
          this.patientbilldetaillist
            .billDetialsForRefund_RequestNoGeivePaymentModeRefund
        );
        this.billdetailservice.sendforapproval.forEach((j: any) => {
          this.patientbilldetaillist.billDetialsForRefund_RequestNoGeivePaymentModeRefund.forEach(
            (k) => {
              console.log(j, k);
              if (k.itemId == j.itemid) {
                console.log(m);
                forenablerefundbill[m] = k;
                m++;
                console.log(m, forenablerefundbill[m]);
              }
            }
          );
        });
        console.log("enable refund bill", forenablerefundbill);
        console.log("approval list", this.billdetailservice.sendforapproval);
        // if(forenablerefundbill.length == this.billdetailservice.sendforapproval.length)
        // {
        //   this.refundbill = false;
        //   this.approvalsend = true;
        // }
        // else
        // {
        //   this.refundbill = true;
        //   this.approvalsend = false;
        // }

        //newly added
        console.log(this.approvedfalg);
        if (
          forenablerefundbill.length == 0 &&
          this.billdetailservice.sendforapproval.length > 0 &&
          this.patientbilldetaillist
            .billDetialsForRefund_RequestNoGeivePaymentModeRefund[0]
            .authorisedby != ""
        ) {
          this.refundbill = true;
          this.approvalsend = false;

          this.approvedfalg = false;
        } else if (
          forenablerefundbill.length !=
          this.billdetailservice.sendforapproval.length
        ) {
          this.refundbill = true;
          this.approvalsend = true;
        }
        //end
        var forboth = 0;
        forenablerefundbill.forEach((k: any) => {
          forboth = 0;
          if (
            k.notApproved == 1 &&
            this.patientbilldetaillist.billDetialsForRefund_Cancelled[0]
              .cancelled == 0 &&
            this.billdetailservice.sendforapproval.length ==
              forenablerefundbill.length
          ) {
            this.refundbill = false;
            this.approvalsend = true;

            this.approvedfalg = true;
            forboth++;
          } else if (
            k.notApproved == 0 &&
            this.patientbilldetaillist.billDetialsForRefund_Cancelled[0]
              .cancelled == 0 &&
            this.billdetailservice.sendforapproval.length ==
              forenablerefundbill.length
          ) {
            this.refundbill = true;
            this.approvalsend = true;

            this.approvedfalg = true;
            forboth++;
          }
        });
        if (forboth > 1 && forenablerefundbill.length != 0) {
          this.refundbill = true;
          this.approvalsend = true;
        }
      } else {
        this.refundbill = true;
        this.approvalsend = true;
      }

      this.billdetailservice.patientbilldetaillist.billDetialsForRefund_RequestNoGeivePaymentModeRefund.forEach(
        (j: any) => {
          approvedlist = this.billdetailservice.sendforapproval.filter(
            (e: any) => {
              return (e.itemId = j.itemId);
            }
          );
        }
      );
      this.BServiceForm.controls["refundAmt"].setValue(
        this.billdetailservice.totalrefund.toFixed(2)
      );
      this.sendapprovalcheck();
    }
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
