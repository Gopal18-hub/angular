import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";
import { Subject } from "rxjs";

@Component({
  selector: "out-patients-miscellaneous-billing",
  templateUrl: "./miscellaneous-billing.component.html",
  styleUrls: ["./miscellaneous-billing.component.scss"],
})
export class MiscellaneousBillingComponent implements OnInit {
  constructor(
    public matDialog: MatDialog,
    private formService: QuestionControlService,
    private router: Router
  ) {}

  @ViewChild("selectedServices") selectedServicesTable: any;
  linkList = ["Bill", "Credit Details"];
  activeLink = this.linkList[1];

  miscFormData = {
    type: "object",
    title: "",
    properties: {
      maxid: {
        type: "string",
      },

      mobileNo: {
        type: "number",
      },
      bookingId: {
        type: "string",
        // title: "SSN",
      },
      company: {
        type: "autocomplete",
        // title: "SSN",
      },
      corporate: {
        type: "autocomplete",
        // title: "SSN",
      },
      narration: {
        type: "string",
        // title: "SSN",
      },

      b2bInvoiceType: {
        type: "checkbox",
        options: [
          {
            title: "B2B Invoice Type",
          },
        ],
      },
    },
  };

  miscBillData = {
    type: "object",
    title: "",
    properties: {
      serviceType: {
        type: "dropdown",
        title: "Service Type",
        required: true,
      },
      item: {
        type: "dropdown",
        title: "Item",
        required: true,
      },
      tffPrice: {
        type: "string",
        title: "Tarrif Price",
        required: true,
      },
      qty: {
        type: "string",
        title: "Qty",
        required: true,
      },
      reqAmt: {
        type: "string",
        title: "Req. Amt.",
        required: true,
      },
      pDoc: {
        type: "dropdown",
        title: "Procedure Doctor",
      },
      remark: {
        type: "dropdown",
        title: "Remarks",
        required: true,
      },
      self: {
        type: "checkbox",
        required: false,
        options: [{ title: "Self" }],
      },
      referralDoctor: {
        type: "dropdown",
        required: true,
        title: "Referral Doctor",
      },
      interactionDetails: {
        type: "dropdown",
        required: true,
        title: "Interaction Details",
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
        ],
        defaultValue: "cash",
      },
    },
  };

  config: any = {
    selectBox: false,
    clickedRows: false,
    clickSelection: "single",
    displayedColumns: [
      "Sno",
      "ServiceType",
      "ItemDescription",
      "ItemforModify",
      "TariffPrice",
      "Qty",
      "Price",
      "DoctorName",
      "Disc",
      "DiscAmount",
      "TotalAmount",
      "GST",
    ],
    columnsInfo: {
      Sno: {
        title: "S.No.",
        type: "string",
      },
      ServiceType: {
        title: "Service Type",
        type: "string",
        style: {
          width: "120px",
        },
      },
      ItemDescription: {
        title: "Item Description",
        type: "string",
        style: {
          width: "180px",
        },
      },
      ItemforModify: {
        title: "Item For Modify",
        type: "string",
        style: {
          width: "120px",
        },
      },
      TariffPrice: {
        title: "Tariff Price",
        type: "string",
      },
      Qty: {
        title: "Qty",
        type: "string",
      },
      Price: {
        title: "Price",
        type: "string",
      },
      DoctorName: {
        title: "Doctor Name",
        type: "string",
        style: {
          width: "120px",
        },
      },
      Disc: {
        title: "Disc%",
        type: "string",
      },
      DiscAmount: {
        title: "Disc. Amount",
        type: "string",
        style: {
          width: "120px",
        },
      },
      TotalAmount: {
        title: "Total Amount",
        type: "string",
        style: {
          width: "120px",
        },
      },
      GST: {
        title: "GST%",
        type: "string",
      },
    },
  };

  serviceselectedList: [] = [] as any;
  miscForm!: FormGroup;
  miscServBillForm!: FormGroup;
  questions: any;
  question: any;
  private readonly _destroying$ = new Subject<void>();

  ngOnInit(): void {
    let formResult = this.formService.createForm(
      this.miscFormData.properties,
      {}
    );
    let serviceFormResult = this.formService.createForm(
      this.miscBillData.properties,
      {}
    );
    this.miscForm = formResult.form;
    this.questions = formResult.questions;
    this.miscServBillForm = serviceFormResult.form;
    this.question = serviceFormResult.questions;
  }
}
