import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { CookieService } from "@shared/services/cookie.service";
import { HttpService } from "@shared/services/http.service";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";

import { Subject } from "rxjs";
import { GstComponent } from "../../miscellaneous-billing/billing/gst/gst.component";
import { billDetailService } from "../billDetails.service";
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
    private cookie: CookieService,
    private billDetailService: billDetailService
  ) {}

  BDetailFormData = {
    type: "object",
    title: "",
    properties: {
      billAmt: {
        type: "string",
        required: false,
        defaultValue: '0.0',
        readonly: true,
      },
      dipositrAmt: {
        type: "string",
        required: false,
        defaultValue: '0.0',
        readonly: true,
      },
      discAmt: {
        type: "string",
        required: false,
        defaultValue: '0.0',
        readonly: true,
      },
      prePaidAMt: {
        type: "string",
        required: false,
        defaultValue: '0.0',
        readonly: true,
      },
      plandic: {
        type: "string",
        required: false,
        readonly: true,
        defaultValue: '0.0',
      },
      planamt: {
        type: "string",
        required: false,
        readonly: true,
        defaultValue: '0.0',
      },
      companyDue: {
        type: "string",
        required: false,
        readonly: true,
        defaultValue: '0.0',
      },
      patienDue: {
        type: "string",
        required: false,
        readonly: true,
        defaultValue: '0.0',
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
        defaultValue: "patientDue",
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
    this.BServiceForm.controls["billAmt"].setValue(this.billDetailService.patientbilldetaillist.billDetialsForRefund_DepositRefundAmountDetail[0].billamount);
    this.BServiceForm.controls["dipositrAmt"].setValue(this.billDetailService.patientbilldetaillist.billDetialsForRefund_DepositRefundAmountDetail[0].depositamount);
    this.BServiceForm.controls["discAmt"].setValue(this.billDetailService.patientbilldetaillist.billDetialsForRefund_DepositRefundAmountDetail[0].discountamount);
    this.BServiceForm.controls["discAftBill"].setValue(this.billDetailService.patientbilldetaillist.billDetialsForRefund_DepositRefundAmountDetail[0].companyPaidAmt);
    this.BServiceForm.controls["refundAmt"].setValue(this.billDetailService.patientbilldetaillist.billDetialsForRefund_RequestNoGeivePaymentModeRefund[0].refundAmt);
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
