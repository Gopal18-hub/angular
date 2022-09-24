import { Component, OnInit, ViewChild } from "@angular/core";
import { Subject } from "rxjs";
import { FormGroup } from "@angular/forms";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";
import { takeUntil } from "rxjs/operators";
import { BillingService } from "../../billing.service";
import { BillPaymentDialogComponent } from "../../prompts/payment-dialog/payment-dialog.component";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { MessageDialogService } from "@shared/ui/message-dialog/message-dialog.service";
import { ReportService } from "@shared/services/report.service";
import { CookieService } from "@shared/services/cookie.service";
import { DisountReasonComponent } from "../../prompts/discount-reason/disount-reason.component";
import { DepositDetailsComponent } from "../../prompts/deposit-details/deposit-details.component";
import { GstTaxComponent } from "../../prompts/gst-tax-popup/gst-tax.component";
import { ApiConstants } from "@core/constants/ApiConstants";
import { HttpService } from "@shared/services/http.service";
import { MaxHealthSnackBarService } from "@shared/ui/snack-bar";

@Component({
  selector: "out-patients-bill",
  templateUrl: "./bill.component.html",
  styleUrls: ["./bill.component.scss"],
})
export class BillComponent implements OnInit {
  billDataForm = {
    type: "object",
    title: "",
    properties: {
      referralDoctor: {
        type: "dropdown",
        required: true,
        title: "Referral Doctor",
        placeholder: "--Select--",
      },
      interactionDetails: {
        type: "dropdown",
        required: true,
        title: "Interaction Details",
        placeholder: "--Select--",
      },
      billAmt: {
        type: "number",
        required: false,
        defaultValue: 0.0,
        readonly: true,
      },
      availDiscCheck: {
        type: "checkbox",
        required: false,
        options: [{ title: "Avail Plan Disc ( - )" }],
      },
      availDisc: {
        type: "number",
        required: false,
        defaultValue: 0.0,
        readonly: true,
      },
      discAmtCheck: {
        type: "checkbox",
        required: false,
        options: [{ title: " Discount  Amount  (  -  ) " }],
      },
      discAmt: {
        type: "number",
        required: false,
        defaultValue: 0.0,
        readonly: true,
      },
      dipositAmtcheck: {
        type: "checkbox",
        required: false,
        options: [{ title: "Deposit Amount ( - )" }],
      },

      dipositAmt: {
        type: "number",
        required: false,
        defaultValue: 0.0,
        readonly: true,
      },
      patientDisc: {
        type: "number",
        required: false,
        defaultValue: 0.0,
        readonly: true,
      },
      compDisc: {
        type: "number",
        required: false,
        defaultValue: 0.0,
        readonly: true,
      },
      planAmt: {
        type: "number",
        required: false,
        defaultValue: 0.0,
        readonly: true,
      },
      coupon: {
        type: "number",
        required: false,
        defaultValue: 0.0,
        readonly: true,
      },
      coPay: {
        type: "number",
        required: false,
        defaultValue: 0.0,
        readonly: true,
      },
      credLimit: {
        type: "number",
        required: false,
        defaultValue: 0.0,
        readonly: true,
      },
      gstTax: {
        type: "number",
        required: false,
        defaultValue: 0.0,
        readonly: true,
      },
      amtPayByPatient: {
        type: "number",
        required: false,
        defaultValue: 0.0,
        readonly: true,
      },
      amtPayByComp: {
        type: "number",
        required: false,
        defaultValue: 0.0,
        readonly: true,
      },
      paymentMode: {
        type: "radio",
        required: true,
        options: [
          { title: "Cash", value: "cash" },
          { title: "Credit", value: "credit" },
          { title: "Gen. OPD", value: "Gen OPD" },
        ],
        defaultValue: "cash",
      },
      self: {
        type: "checkbox",
        required: false,
        options: [{ title: "Self" }],
      },
      dipositAmtEdit: {
        type: "number",
        required: false,
        defaultValue: "0.00",
        readonly: false,
      },
    },
  };
  @ViewChild("table") tableRows: any;
  data: any = [];
  config: any = {
    clickedRows: false,
    actionItems: false,
    dateformat: "dd/MM/yyyy",
    selectBox: false,
    removeRow: true,
    displayedColumns: [
      "sno",
      "serviceName",
      "itemName",
      "precaution",
      "procedure",
      "qty",
      "credit",
      "cash",
      "disc",
      "discAmount",
      "totalAmount",
      "gst",
      "gstValue",
    ],
    columnsInfo: {
      sno: {
        title: "S.No.",
        type: "number",
        style: {
          width: "80px",
        },
      },
      serviceName: {
        title: "Services Name",
        type: "string",
        style: {
          width: "150px",
        },
      },
      itemName: {
        title: "Item Name / Doctor Name",
        type: "string",
        style: {
          width: "200px",
        },
      },
      precaution: {
        title: "Precaution",
        type: "string_link",
        style: {
          width: "100px",
        },
      },
      procedure: {
        title: "Procedure Doctor",
        type: "string",
        style: {
          width: "130px",
        },
      },
      qty: {
        title: "Qty / Type",
        type: "string",
        style: {
          width: "120px",
        },
      },
      credit: {
        title: "Credit",
        type: "string",
        style: {
          width: "100px",
        },
      },
      cash: {
        title: "Cash",
        type: "string",
        style: {
          width: "100px",
        },
      },
      disc: {
        title: "Disc %",
        type: "string",
        style: {
          width: "80px",
        },
      },
      discAmount: {
        title: "Disc Amount",
        type: "number",
        style: {
          width: "120px",
        },
      },
      totalAmount: {
        title: "Total Amount",
        type: "number",
        style: {
          width: "130px",
        },
      },
      gst: {
        title: "GST%",
        type: "number",
        style: {
          width: "80px",
        },
      },
      gstValue: {
        title: "GST Value",
        type: "number",
        style: {
          width: "130px",
        },
      },
    },
  };

  formGroup!: FormGroup;
  question: any;

  billNo = "";
  billId = "";
  depositDetails: any = [];
  totalDeposit = 0;

  private readonly _destroying$ = new Subject<void>();

  constructor(
    private formService: QuestionControlService,
    private billingservice: BillingService,
    private matDialog: MatDialog,
    private messageDialogService: MessageDialogService,
    private reportService: ReportService,
    private cookie: CookieService,
    private http: HttpService,
    private snackbar: MaxHealthSnackBarService
  ) {}

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.billDataForm.properties,
      {}
    );
    this.formGroup = formResult.form;
    this.question = formResult.questions;
    this.billingservice.billItems.forEach((item: any, index: number) => {
      item["sno"] = index + 1;
    });
    this.data = this.billingservice.billItems;
    this.billingservice.clearAllItems.subscribe((clearItems) => {
      if (clearItems) {
        this.data = [];
      }
    });
  }

  rowRwmove($event: any) {
    this.billingservice.deleteFromService(
      this.billingservice.billItems[$event.index]
    );
    this.billingservice.billItems.splice($event.index, 1);
    this.billingservice.billItems = this.billingservice.billItems.map(
      (item: any, index: number) => {
        item["sno"] = index + 1;
        return item;
      }
    );

    this.data = [...this.billingservice.billItems];
    this.billingservice.calculateTotalAmount();
  }

  ngAfterViewInit() {
    this.tableRows.stringLinkOutput.subscribe((res: any) => {
      if (
        "patient_Instructions" in res.element &&
        res.element.patient_Instructions
      ) {
        this.messageDialogService.info(res.element.patient_Instructions);
      }
    });
    this.formGroup.controls["paymentMode"].valueChanges
      .pipe(takeUntil(this._destroying$))
      .subscribe((value: any) => {
        this.billingservice.setBilltype(value);
      });
    this.formGroup.controls["billAmt"].setValue(
      this.billingservice.totalCost + ".00"
    );
    this.formGroup.controls["amtPayByPatient"].setValue(
      this.billingservice.totalCost + ".00"
    );
    this.formGroup.controls["discAmtCheck"].valueChanges
      .pipe(takeUntil(this._destroying$))
      .subscribe((value: any) => {
        if (value == true) {
          this.discountreason();
        } else {
        }
      });

    this.formGroup.controls["dipositAmtcheck"].valueChanges
      .pipe(takeUntil(this._destroying$))
      .subscribe((value: any) => {
        if (value === true) {
          this.depositdetails();
        } else {
          this.formGroup.controls["dipositAmt"].reset();
          this.formGroup.controls["dipositAmtEdit"].reset();
          this.formGroup.controls["dipositAmtEdit"].disable();
          this.formGroup.controls["amtPayByPatient"].setValue(
            this.billingservice.totalCost + ".00"
          );
          this.formGroup.controls["dipositAmtcheck"].setValue(false);
        }
      });
  }

  makeBill() {
    const dialogRef = this.messageDialogService.confirm(
      "",
      `Do you want to make the Bill?`
    );
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this._destroying$))
      .subscribe((result) => {
        if ("type" in result) {
          if (result.type == "yes") {
            this.makereceipt();
          } else {
          }
        }
      });
  }

  makereceipt() {
    const RefundDialog = this.matDialog.open(BillPaymentDialogComponent, {
      width: "70vw",
      height: "98vh",
      data: {
        billAmount: this.billingservice.totalCost,
      },
    });

    RefundDialog.afterClosed()
      .pipe(takeUntil(this._destroying$))
      .subscribe((result: any) => {
        if (result && "billNo" in result && result.billNo) {
          this.billingservice.billNoGenerated.next(true);
          this.billNo = result.billNo;
          this.billId = result.billId;
          this.config.removeRow = false;
          this.config = { ...this.config };
          const successInfo = this.messageDialogService.info(
            `Bill saved with the Bill No ${result.billNo} and Amount ${this.billingservice.totalCost}`
          );
          successInfo
            .afterClosed()
            .pipe(takeUntil(this._destroying$))
            .subscribe((result: any) => {
              const printDialog = this.messageDialogService.confirm(
                "",
                `Do you want to print bill?`
              );
              printDialog
                .afterClosed()
                .pipe(takeUntil(this._destroying$))
                .subscribe((result: any) => {
                  if ("type" in result) {
                    if (result.type == "yes") {
                      this.makePrint();
                    } else {
                    }
                  }
                });
            });
        }
      });
  }

  makePrint() {
    this.reportService.openWindow(
      this.billNo + " - Billing Report",
      "billingreport",
      {
        opbillid: this.billId,

        locationID: this.cookie.get("HSPLocationId"),
      }
    );
  }

  discountreason() {
    this.matDialog.open(DisountReasonComponent, {
      width: "80vw",
      minWidth: "90vw",
    });
  }

  depositdetails() {
    this.getDipositedAmountByMaxID(
      this.billingservice.activeMaxId.iacode,
      this.billingservice.activeMaxId.regNumber
    );
  }

  gsttaxdialog() {
    this.matDialog.open(GstTaxComponent, {
      width: "30vw",
      height: "50vh",
    });
  }

  getDipositedAmountByMaxID(iacode: any, regNumber: any) {
    this.http
      .get(
        ApiConstants.getDipositedAmountByMaxID(
          iacode,
          regNumber,
          Number(this.cookie.get("HSPLocationId"))
        )
      )
      .pipe(takeUntil(this._destroying$))
      .subscribe(
        (resultData: any) => {
          if (resultData) {
            this.depositDetails = resultData;
            resultData.forEach((element: any) => {
              this.totalDeposit += element.balanceamount;
            });

            this.depositDetails = this.depositDetails.filter(
              (e: any) =>
                e.isAdvanceTypeEnabled == true && e.isSecurityDeposit == false
            );
            console.log(this.depositDetails);

            const dialogref = this.matDialog.open(DepositDetailsComponent, {
              width: "60vw",
              height: "50vh",
              data: { data: this.depositDetails },
            });

            dialogref.afterClosed().subscribe((res) => {
              console.log(res);
              this.formGroup.controls["dipositAmt"].setValue(res.data);
              this.formGroup.controls["dipositAmtEdit"].setValue(res.data);
              if (res.data)
                this.snackbar.open("Deposit Amount availed successfully!");
            });
          }
        },
        (error) => {}
      );
  }
}
