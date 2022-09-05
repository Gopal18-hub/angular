import { Component, OnInit, ViewChild } from "@angular/core";
import { Subject } from "rxjs";
import { FormGroup } from "@angular/forms";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";
import { MatDialog } from "@angular/material/dialog";
import { GstTaxDialogComponent } from "../bills/gst-tax-dialog/gst-tax-dialog.component";
import { DiscountAmtDialogComponent } from "../bills/discount-amt-dialog/discount-amt-dialog.component";
@Component({
  selector: 'out-patients-bills',
  templateUrl: './bills.component.html',
  styleUrls: ['./bills.component.scss']
})
export class BillsComponent implements OnInit {
  billDataForm = {
    type: "object",
    title: "",
    properties: {
      // self: {
      //   type: "checkbox",
      //   required: false,
      //   options: [{ title: "Self" }],
      // },
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
        //readonly: true,
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
        //readonly: true,
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
        //readonly: true,
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
        //readonly: true,
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

      //Table
      serviceType: {
        type: "autocomplete",
        title: "Service Type",
        //options: this.serviceList,
        required: true,
        placeholder: "Select",

      },
      item: {
        type: "autocomplete",
        title: "Item",
        required: true,
        //options: this.serviceItemsList,
        placeholder: "Select",
      },
      tffPrice: {
        type: "number",
        title: "Tarrif Price",
        //required: true,
        readonly: true,
      },
      qty: {
        type: "number",
        title: "Qty",
        maximum: 9,
        minimum: 1,
        required: true,
      },
      reqAmt: {
        type: "number",
        title: "Req. Amt.",
        minimum: 1,
        required: true,
      },
      pDoc: {
        type: "autocomplete",
        title: "Procedure Doctor",
        //options: this.doctorList,
        placeholder: "Select",
      },
      remark: {
        type: "autocomplete",
        title: "Remarks",
        required: true,
        //options: this.remarkList,
        placeholder: "Select",
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
      "gstValue"
    ],
    columnsInfo: {
      sno: {
        title: "S.No.",
        type: "number",
        style: {
          width: "5%",
        },
      },
      serviceName: {
        title: "Services Type",
        type: "string",
        style: {
          width: "13%",
        },
      },
      itemName: {
        title: "Item Description",
        type: "string",
        style: {
          width: "11%",
        },
      },
      precaution: {
        title: "Item for Modify",
        type: "string",
        style: {
          width: "9%",
        },
      },
      procedure: {
        title: "Tarrif Price",
        type: "string",
        style: {
          width: "7%",
        },
      },
      qty: {
        title: "Qty",
        type: "string",
        style: {
          width: "3%",
        },
      },
      credit: {
        title: "Price",
        type: "string",
        style: {
          width: "4%",
        },
      },
      cash: {
        title: "Doctor Name",
        type: "string",
        style: {
          width: "9%",
        },
      },
      disc: {
        title: "Disc %",
        type: "string",
        style: {
          width: "5%",
        },
      },
      discAmount: {
        title: "Disc Amount",
        type: "number",
        style: {
          width: "9%",
        },
      },
      totalAmount: {
        title: "Total Amount",
        type: "number",
        style: {
          width: "9%",
        },
      },
      gst: {
        title: "GST%",
        type: "number",
        style: {
          width: "4%",
        },
      },
      gstValue: {
        title: "GST Value%",
        type: "number",
        style: {
          width: "7%",
        }
      },
    },
  };

  formGroup!: FormGroup;
  question: any;

  private readonly _destroying$ = new Subject<void>();

  constructor(private formService: QuestionControlService, public matdialog: MatDialog,) { }

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.billDataForm.properties,
      {}
    );
    this.formGroup = formResult.form;
    this.question = formResult.questions;
    // this.discAmtDialog();
  }

  openGstTaxDialog() {
    this.matdialog.open(GstTaxDialogComponent, {
      width: '35vw', height: '70vh', data: {
        message: "Do you want to save?"
      },
    });
  }

  discAmtDialog() {
    this.matdialog.open(DiscountAmtDialogComponent, {
      width: 'full', height: 'auto', data: {
        message: "Do you want to save?"
      },
    });
  }
}
