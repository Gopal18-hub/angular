import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CookieService } from '@shared/services/cookie.service';
import { HttpService } from '@shared/services/http.service';
import { QuestionControlService } from '@shared/ui/dynamic-forms/service/question-control.service';
import { Subject } from 'rxjs';
import { GstComponent } from '../../miscellaneous-billing/billing/gst/gst.component';
import { billDetailService } from '../billDetails.service';

@Component({
  selector: 'out-patients-refund-after-bill',
  templateUrl: './refund-after-bill.component.html',
  styleUrls: ['./refund-after-bill.component.scss']
})
export class RefundAfterBillComponent implements OnInit {

  @ViewChild("selectedServices") tableRows: any;
  constructor(
    public matDialog: MatDialog,
    private formService: QuestionControlService,
    private router: Router,
    private http: HttpService,
    private cookie: CookieService,
    private billDetailservice: billDetailService
  ) {}

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
        maximum: 9,
        minimum: 1,
        required: true,
      },
      reqAmt: {
        type: "string",
        title: "Req. Amt.",
        minimum: 1,
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
    removeRow: false,
    displayedColumns: [
      "Sno",
      "servicename",
      "itemname",
      "amount",
      "discountamount",
      "Refund",
    ],
    columnsInfo: {
      Sno: {
        title: "S.No.",
        type: "string",
        style: {
          width: "5rem"
        }
      },
      servicename: {
        title: "Service Name",
        type: "string",
        style: {
          width: "11rem"
        }
      },
      itemname: {
        title: "Item Name",
        type: "string",
        style: {
          width: "15rem"
        }
      },
      amount: {
        title: "Billed Amount",
        type: "string",
        style: {
          width: "9rem"
        }
      },
      discountamount: {
        title: "Discount Amount",
        type: "number",
        style: {
          width: "9rem"
        }
      },
      Refund: {
        title: "Refund",
        type: "checkbox_active",
      },
    },
  };
  data: any = [];
  serviceselectedList: [] = [] as any;

  miscServBillForm!: FormGroup;

  question: any;
  private readonly _destroying$ = new Subject<void>();

  ngOnInit(): void {
    let serviceFormResult = this.formService.createForm(
      this.miscBillData.properties,
      {}
    );

    this.miscServBillForm = serviceFormResult.form;
    this.question = serviceFormResult.questions;
    for (var i = 0; i < this.billDetailservice.serviceList.length; i++) {
      this.billDetailservice.serviceList[i].Sno = i + 1;
    }
    this.data = [...this.billDetailservice.serviceList];
    console.log(this.billDetailservice.patientbilldetaillist.billDetialsForRefund_RequestNoGeivePaymentModeRefund[0].notApproved);
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
  ngAfterViewInit()
  {
    
  }
  printrow(event:any)
  {
    if(this.billDetailservice.patientbilldetaillist.billDetialsForRefund_ServiceItemID[0].ackby == 0)
    {
      console.log('not ackn');
    }
    else if(this.billDetailservice.patientbilldetaillist.billDetialsForRefund_ServiceItemID[0].ackby == 1)
    {
      console.log('ack');
    }
    console.log(event);
  }

}
