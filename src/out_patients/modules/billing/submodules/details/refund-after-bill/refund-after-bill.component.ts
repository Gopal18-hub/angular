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
import { MessageDialogService } from '@shared/ui/message-dialog/message-dialog.service';

@Component({
  selector: 'out-patients-refund-after-bill',
  templateUrl: './refund-after-bill.component.html',
  styleUrls: ['./refund-after-bill.component.scss']
})
export class RefundAfterBillComponent implements OnInit {

  @ViewChild("afterbill") tableRows: any;
  constructor(
    public matDialog: MatDialog,
    private formService: QuestionControlService,
    private router: Router,
    private http: HttpService,
    private cookie: CookieService,
    private billDetailservice: billDetailService,
    private msgdialog: MessageDialogService
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
      "cancelled",
    ],
    // rowLayout: { dynamic: { rowClass: "row['cancelled']" } },
    columnsInfo: {
      Sno: {
        title: "S.No.",
        type: "string",
        style: {
          width: "6rem"
        }
      },
      servicename: {
        title: "Service Name",
        type: "string",
        style: {
          width: "13rem"
        }
      },
      itemname: {
        title: "Item Name",
        type: "string",
        style: {
          width: "19rem"
        }
      },
      amount: {
        title: "Billed Amount",
        type: "string",
        style: {
          width: "12rem"
        }
      },
      discountamount: {
        title: "Discount Amount",
        type: "number",
        style: {
          width: "13rem"
        }
      },
      cancelled: {
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
  ngAfterViewInit()
  {
    
  }
  printrow(event:any)
  {
    setTimeout(() => {
      console.log(event)
      console.log(event.row.cancelled);

      if(event.row.cancelled == true )
      {
        console.log("true");
        this.billDetailservice.patientbilldetaillist.billDetialsForRefund_ServiceItemID.forEach((e:any) => {
          var id = this.billDetailservice.patientbilldetaillist.billDetialsForRefund_ServiceItemID.find((a:any) => {
            
          })
        });
        var list = this.billDetailservice.patientbilldetaillist.billDetialsForRefund_ServiceItemID.filter((a:any)=>{
          return a.serviceId == event.row.serviceid;
        }) 
        if(list[0].ackby == 0)
        {
          this.msgdialog.info('Only Acknowledged items can be refunded from this Tab. Refund this item from Service Tab');
          event.row.cancelled = false;
        }
        else
        {
            this.billDetailservice.addForApproval({
              cancelled: event.row.cancelled,
              Sno: event.row.Sno,
              amount: event.row.amount,
              requestToApproval: event.row.requestToApproval,
              itemid: event.row.itemid,
              orderid: event.row.orderid
            })
            this.billDetailservice.calculateTotalRefund();
            console.log(this.billDetailservice.sendforapproval);
        }
      }
      else if(event.row.cancelled == false)
      {
        console.log("false");
        var index = this.billDetailservice.sendforapproval.findIndex((val: any) => val.Sno === event.row.Sno);
        console.log(index);
        // this.billDetailservice.sendforapproval.splice(index, 1);
        this.billDetailservice.removeForApproval(index);
        this.billDetailservice.calculateTotalRefund();
        console.log(this.billDetailservice.sendforapproval);
      }
    }, 100);
    
  }

}
