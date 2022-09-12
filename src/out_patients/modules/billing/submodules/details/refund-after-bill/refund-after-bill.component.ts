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
    selectBox: true,
    selectCheckBoxPosition: 5,
    selectCheckBoxLabel: 'Refund',
    removeRow: false,
    clickedRows: true,
    displayedColumns: [
      "Sno",
      "servicename",
      "itemname",
      "amount",
      "discountamount",
      // "cancelled",
    ],
    rowLayout: { dynamic: { rowClass: "row['cancelled']" } },
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
      // cancelled: {
      //   title: "Refund",
      //   type: "checkbox",
      //   disabledSort: true,
      // },
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
    for (var i = 0; i < this.billDetailservice.billafterrefund.length; i++) {
      this.billDetailservice.billafterrefund[i].Sno = i + 1;
      if(this.billDetailservice.serviceList[i].cancelled == 1)
      {
        this.billDetailservice.serviceList[i].cancelled = 'cancelledrefund'
      }
      else if(this.billDetailservice.serviceList[i].cancelled == 0)
      {
        this.billDetailservice.serviceList[i].cancelled = 'notcancelledrefund'
      }
    }
    this.billDetailservice.sendforapproval = [];
    this.billDetailservice.calculateTotalRefund();
    this.billDetailservice.totalrefund = 0;
    this.data = [...this.billDetailservice.billafterrefund];
    console.log(this.billDetailservice.patientbilldetaillist.billDetialsForRefund_RequestNoGeivePaymentModeRefund[0].notApproved);
  }
  ngAfterViewInit()
  { 
    this.data.forEach((item: any) => {
      if(item.cancelled == 'cancelledrefund')
      {
        this.tableRows.selection.select(item);
      }
    }) 
    console.log(this.tableRows);
    this.tableRows.selection.changed.subscribe((s: any) => {
      console.log(s);
      console.log(this.tableRows.selection.selected);
      if(this.tableRows.selection.selected.length > 0)
        {  
          this.billDetailservice.sendforapproval = [];
          this.billDetailservice.totalrefund = 0;
          for(var i = 0; i < this.tableRows.selection.selected.length; i++)
          {
            for(var j = 0; j < this.tableRows.selection.selected.length; j++)
            {
              var list = this.billDetailservice.patientbilldetaillist.billDetialsForRefund_ServiceItemID.filter((a:any)=>{
                return a.serviceId == this.tableRows.selection.selected[j].serviceid;
              }) 
            }
            for(var z = 0; z < list.length; z++)
            {
              if(list[z].ackby == 0)
              {
                var acklist = this.billDetailservice.serviceList.filter((a: any) => {
                  console.log(a);
                  return a.serviceid == list[z].serviceId;
                })
                console.log(acklist);
                console.log(list[z]);
                this.data.forEach((item: any) => {
                  console.log(item)
                  var flag = 0;
                  for(var x = 0; x < acklist.length, flag < 1; x++)
                  {
                    if(item.serviceid == acklist[x].serviceid && item.cancelled == 'notcancelledrefund')
                    {
                      flag++;
                      this.msgdialog.info('Sample is Not Acknowledged, Refund Item from the Service Tab');
                      console.log(this.tableRows.selection);
                      setTimeout(() => {
                      this.tableRows.selection.deselect(item);
                    }, 100);
                    break;                      
                    }
                    return;
                  }
                })
              }
            }
            console.log(this.tableRows.selection.selected[i])
            if(this.tableRows.selection.selected[i].cancelled == 'notcancelledrefund')
            {
              console.log(this.tableRows.selection.selected[i].itemid);
              this.billDetailservice.addForApproval({
              ssn: this.billDetailservice.patientbilldetaillist.billDetialsForRefund_Table0[0].ssn,
              maxid: this.billDetailservice.patientbilldetaillist.billDetialsForRefund_Table0[0].uhid,
              ptnName: this.billDetailservice.patientbilldetaillist.billDetialsForRefund_Table0[0].name,
              billNo: this.billDetailservice.patientbilldetaillist.billDetialsForRefund_DepositRefundAmountDetail[0].billno,
              operatorName: this.billDetailservice.patientbilldetaillist.billDetialsForRefund_Table0[0].operator,
              authorisedby: '',
              reason: '',
              refundAmt: this.tableRows.selection.selected[i].amount,
              mop: '',
              serviceId: this.tableRows.selection.selected[i].serviceid,
              itemid: this.tableRows.selection.selected[i].itemid,
              serviceName: this.tableRows.selection.selected[i].servicename,
              itemName: this.tableRows.selection.selected[i].itemname,
              refundAfterAck: this.billDetailservice.patientbilldetaillist.billDetialsForRefund_RequestNoGeivePaymentModeRefund[0].refundAfterAck,
              itemOrderId: this.tableRows.selection.selected[i].orderid,
            })
            console.log(this.billDetailservice.sendforapproval);
            this.billDetailservice.calculateTotalRefund();
            console.log(this.billDetailservice.sendforapproval);
            }
          }                  
        }
        else
        {
          this.billDetailservice.sendforapproval = [];
          this.billDetailservice.totalrefund = 0;
          for(var i = 0; i < this.tableRows.selection.selected.length; i++)
                {
                  this.billDetailservice.addForApproval({
                    ssn: this.billDetailservice.patientbilldetaillist.billDetialsForRefund_Table0[0].ssn,
                    maxid: this.billDetailservice.patientbilldetaillist.billDetialsForRefund_Table0[0].uhid,
                    ptnName: this.billDetailservice.patientbilldetaillist.billDetialsForRefund_Table0[0].name,
                    billNo: this.billDetailservice.patientbilldetaillist.billDetialsForRefund_DepositRefundAmountDetail[0].billno,
                    operatorName: this.billDetailservice.patientbilldetaillist.billDetialsForRefund_Table0[0].operator,
                    authorisedby: '',
                    reason: '',
                    refundAmt: this.tableRows.selection.selected[i].amount,
                    mop: '',
                    serviceId: this.tableRows.selection.selected[i].serviceid,
                    itemId: this.tableRows.selection.selected[i].itemid,
                    serviceName: this.tableRows.selection.selected[i].servicename,
                    itemName: this.tableRows.selection.selected[i].itemname,
                    refundAfterAck: this.billDetailservice.patientbilldetaillist.billDetialsForRefund_RequestNoGeivePaymentModeRefund[0].refundAfterAck,
                    itemOrderId: this.tableRows.selection.selected[i].orderid,
                  })
                  this.billDetailservice.calculateTotalRefund();
                  console.log(this.billDetailservice.sendforapproval);
                }
        }
      if(s.removed.length > 0)
      {
        s.removed.forEach((item: any) =>{
          if(item.cancelled == 'cancelledrefund')
          {
            console.log(item);
            // this.msgdialog.info('Item in this list Already Refunded');
            setTimeout(() => {
              this.tableRows.selection.select(item);
            }, 1);
            // this.tableRows.selection.select(item);
          }
        })
      }
    })
    
  }
  

}
