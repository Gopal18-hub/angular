import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { CookieService } from "@shared/services/cookie.service";
import { HttpService } from "@shared/services/http.service";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";

import { Subject } from "rxjs";
import { GstComponent } from "../../miscellaneous-billing/billing/gst/gst.component";

@Component({
  selector: "part-cred-bill-settlement",
  templateUrl: "./part-cred-bill-settlement.component.html",
  styleUrls: ["./part-cred-bill-settlement.component.scss"],
})
export class PartialCredBillComponent implements OnInit {
  constructor(
    public matDialog: MatDialog,
    private formService: QuestionControlService,
    private router: Router,
    private http: HttpService,
    private cookie: CookieService
  ) {}

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
      mobileNo: {
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
      fromDate: { type: "date", required: false },
      toDate: { type: "date", required: false },
      billAmt: {
        type: "number",
        required: false,
        defaultValue: 0.0,
        readonly: true,
      },
      dipositrAmt: {
        type: "number",
        required: false,
        defaultValue: 0.0,
        readonly: true,
      },
      discAmt: {
        type: "number",
        required: false,
        defaultValue: 0.0,
        readonly: true,
      },
      discAftBill: {
        type: "number",
        required: false,
        defaultValue: 0.0,
        readonly: true,
      },
      refundAmt: {
        type: "number",
        required: false,
        defaultValue: 0.0,
        readonly: true,
      },
      companyDue: {
        type: "string",
        required: false,
        readonly: true,
      },
      patienDue: {
        type: "string",
        required: false,
        readonly: true,
      },
      paymentMode: {
        type: "radio",
        options: [
          {
            title: "Patient Due",
            value: "patientDue",
          },
          {
            title: "Company Due",
            value: "companyDue",
          },
        ],
      },
      otpTxt: {
        type: "number",
        required: false,
        defaultValue: 0.0,
        readonly: true,
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
      "ItemName",
      "BilledAmount",
      "DiscAmount",
      "Refund",
    ],
    columnsInfo: {
      Sno: {
        title: "S.No.",
        type: "string",
      },
      ServiceType: {
        title: "Service Name",
        type: "string",
      },
      ItemName: {
        title: "Item Name",
        type: "string",
      },
      BilledAmount: {
        title: "Billed Amount",
        type: "string",
      },

      DiscAmount: {
        title: "Discount Amount",
        type: "string",
      },
      Refund: {
        title: "Refund",
        type: "string",
      },
    },
  };

  serviceselectedList: [] = [] as any;

  BServiceForm!: FormGroup;

  questions: any;
  private readonly _destroying$ = new Subject<void>();

  ngOnInit(): void {
    let serviceFormResult = this.formService.createForm(
      this.BDetailFormData.properties,
      {}
    );

    this.BServiceForm = serviceFormResult.form;
    this.questions = serviceFormResult.questions;
  }
  gst: { service: string; percentage: number; value: number }[] = [
    { service: "CGST", percentage: 0.0, value: 0.0 },
    { service: "SGST", percentage: 0.0, value: 0.0 },
    { service: "UTGST", percentage: 0.0, value: 0.0 },
    { service: "IGST", percentage: 0.0, value: 0.0 },
    { service: "CESS", percentage: 0.0, value: 0.0 },
    { service: "TOTAL TAX", percentage: 0.0, value: 0.0 },
  ];
  openGSTDialog() {
    this.matDialog.open(GstComponent, {
      width: "24vw",
      height: "56vh",

      data: {
        gstDetails: this.gst,
      },
    });
  }
}
