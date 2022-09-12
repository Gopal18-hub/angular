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
        type: "string",
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
      },
      cash: {
        title: "Cash",
        type: "string",
      },
      disc: {
        title: "Disc %",
        type: "string",
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

  private readonly _destroying$ = new Subject<void>();

  constructor(
    private formService: QuestionControlService,
    private billingservice: BillingService,
    private matDialog: MatDialog,
    private messageDialogService: MessageDialogService
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

    this.data = [...this.billingservice.consultationItems];
    this.billingservice.calculateTotalAmount();
  }

  ngAfterViewInit() {
    this.formGroup.controls["paymentMode"].valueChanges
      .pipe(takeUntil(this._destroying$))
      .subscribe((value: any) => {
        this.billingservice.setBilltype(value);
      });
    this.formGroup.controls["billAmt"].setValue(this.billingservice.totalCost);
    this.formGroup.controls["amtPayByPatient"].setValue(
      this.billingservice.totalCost
    );
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
      .subscribe((result) => {
        if ("billNo" in result) {
          this.billNo = result.billNo;
          this.messageDialogService.info(
            `Bill saved with the Bill No ${result.billNo} and Amount ${this.billingservice.totalCost}`
          );
        }
      });
  }

  makePrint() {}
}
