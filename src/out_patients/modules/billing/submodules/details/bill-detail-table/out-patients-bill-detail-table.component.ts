import { Component, KeyValueDiffer, KeyValueDiffers, OnInit, SimpleChanges, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { CookieService } from "@shared/services/cookie.service";
import { HttpService } from "@shared/services/http.service";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";

import { empty, Subject } from "rxjs";
import { GstComponent } from "../../miscellaneous-billing/billing/gst/gst.component";
import { billDetailService } from "../billDetails.service";
import { MessageDialogService } from "@shared/ui/message-dialog/message-dialog.service";

@Component({
  selector: "out-patients-bill-detail-table",
  templateUrl: "./out-patients-bill-detail-table.component.html",
  styleUrls: ["./out-patients-bill-detail-table.component.scss"],
})
export class BillDetailTableComponent implements OnInit {

  @ViewChild("selectedServices") tableRows: any;
  private check!: KeyValueDiffer<string, any>;
  constructor(
    public matDialog: MatDialog,
    private formService: QuestionControlService,
    private router: Router,
    private http: HttpService,
    private cookie: CookieService,
    private differ: KeyValueDiffers,
    private billDetailservice: billDetailService,
    private msgdialog: MessageDialogService
  ) {
    
  }

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
  servicetable: boolean = true;
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
  }
  ngAfterViewInit()
  {
    this.check = this.differ
      .find(this.tableRows)
      .create();
      this.data.forEach((item: any) => {
        if(item.cancelled == 1)
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
              if(list[z].ackby > 0)
              {
                var acklist = this.billDetailservice.serviceList.filter((a: any) => {
                  console.log(a);
                  return a.serviceid == list[z].serviceId;
                })
                console.log(acklist);
                console.log(list[z]);
                this.data.forEach((item: any) => {
                  console.log(item)
                  for(var x = 0; x < acklist.length; x++)
                  {
                    if(item.serviceid == acklist[x].serviceid && item.cancelled == 0)
                    {
                      this.msgdialog.info('Sample For Item has been Acknowledged, Cannot Refund this Item');
                      console.log(this.tableRows.selection);
                      setTimeout(() => {
                        this.tableRows.selection.deselect(item);
                      }, 100);
                    }
                  }
                })
              }
            }
            console.log(this.tableRows.selection.selected[i])
            if(this.tableRows.selection.selected[i].cancelled == 0)
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
          if(item.cancelled == 1)
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
  // ngDoCheck(): void {
  //   setTimeout(() => {
  //     const changes = this.check.diff(this.tableRows.selection);
  //     if (changes) {
  //       console.log(changes);
  //       console.log(this.tableRows.selection.selected);
  //       if(this.tableRows.selection.selected.length > 0)
  //       {
  //         for(var i = 0; i < this.tableRows.selection.selected.length; i++){
  //           var id = this.billDetailservice.patientbilldetaillist.billDetialsForRefund_ServiceDetail.filter((a:any) => {
  //             return a.serviceId == this.tableRows.selection.selected[i].serviceid;
  //         })
  //         for(var i = 0; i < this.tableRows.selection.selected.length; i++)
  //         {
  //           var list = this.billDetailservice.patientbilldetaillist.billDetialsForRefund_ServiceItemID.filter((a:any)=>{
  //             return a.serviceId == this.tableRows.selection.selected[i].serviceid;
  //           }) 
  //         }
  //         if(list.length > 0)
  //         {
  //           var flag = 0;
  //           for(var i = 0; i < list.length; i++)
  //           {
  //             if(list[i].ackby > 0)
  //             {
  //               flag++;
  //             }
  //           }
  //           var cancelflag = 0;
  //           for(var i = 0; i< this.tableRows.selection.selected.length; i++)
  //           {
  //             if( this.tableRows.selection.selected[i].cancelled == 1)
  //             {
  //               cancelflag++;
  //             }
  //           }
  //           if(flag > 0)
  //           {
  //             // this.msgdialog.info('Sample For Item has been Acknowledged, Cannot Refund this Item');
  //             // this.servicetable = false;
  //             // // setTimeout(() => {
  //             // //   this.servicetable = true;
  //             // // }, 100);
  //             // this.billDetailservice.sendforapproval = [];
  //             // this.billDetailservice.totalrefund = 0;
  //           }
  //           else if(cancelflag > 0)
  //           {
  //             // this.msgdialog.info('Item in this list Already Refunded');
  //             // this.servicetable = false;
  //             // // setTimeout(() => {
  //             // //   this.servicetable = true;
  //             // // }, 100);
  //             // this.billDetailservice.sendforapproval = [];
  //             // this.billDetailservice.totalrefund = 0;
  //           }  
  //           else
  //             {
  //               this.billDetailservice.sendforapproval = [];
  //               this.billDetailservice.totalrefund = 0;
  //               for(var i = 0; i < this.tableRows.selection.selected.length; i++)
  //               {
  //                 console.log(this.tableRows.selection.selected[i].itemid);
  //                 this.billDetailservice.addForApproval({
  //                   ssn: this.billDetailservice.patientbilldetaillist.billDetialsForRefund_Table0[0].ssn,
  //                   maxid: this.billDetailservice.patientbilldetaillist.billDetialsForRefund_Table0[0].uhid,
  //                   ptnName: this.billDetailservice.patientbilldetaillist.billDetialsForRefund_Table0[0].name,
  //                   billNo: this.billDetailservice.patientbilldetaillist.billDetialsForRefund_DepositRefundAmountDetail[0].billno,
  //                   operatorName: this.billDetailservice.patientbilldetaillist.billDetialsForRefund_Table0[0].operator,
  //                   authorisedby: '',
  //                   reason: '',
  //                   refundAmt: this.tableRows.selection.selected[i].amount,
  //                   mop: '',
  //                   serviceId: this.tableRows.selection.selected[i].serviceid,
  //                   itemid: this.tableRows.selection.selected[i].itemid,
  //                   serviceName: this.tableRows.selection.selected[i].servicename,
  //                   itemName: this.tableRows.selection.selected[i].itemname,
  //                   refundAfterAck: this.billDetailservice.patientbilldetaillist.billDetialsForRefund_RequestNoGeivePaymentModeRefund[0].refundAfterAck,
  //                   itemOrderId: this.tableRows.selection.selected[i].orderid,
  //                 })
  //                 console.log(this.billDetailservice.sendforapproval);
  //                 this.billDetailservice.calculateTotalRefund();
  //                 console.log(this.billDetailservice.sendforapproval);
  //               }
  //             }  
              
  //         }
  //         console.log('id:', id, 'list:', list);
  //         }
  //       }
  //       else
  //       {
  //         this.billDetailservice.sendforapproval = [];
  //         this.billDetailservice.totalrefund = 0;
  //         for(var i = 0; i < this.tableRows.selection.selected.length; i++)
  //               {
  //                 this.billDetailservice.addForApproval({
  //                   ssn: this.billDetailservice.patientbilldetaillist.billDetialsForRefund_Table0[0].ssn,
  //                   maxid: this.billDetailservice.patientbilldetaillist.billDetialsForRefund_Table0[0].uhid,
  //                   ptnName: this.billDetailservice.patientbilldetaillist.billDetialsForRefund_Table0[0].name,
  //                   billNo: this.billDetailservice.patientbilldetaillist.billDetialsForRefund_DepositRefundAmountDetail[0].billno,
  //                   operatorName: this.billDetailservice.patientbilldetaillist.billDetialsForRefund_Table0[0].operator,
  //                   authorisedby: '',
  //                   reason: '',
  //                   refundAmt: this.tableRows.selection.selected[i].amount,
  //                   mop: '',
  //                   serviceId: this.tableRows.selection.selected[i].serviceid,
  //                   itemId: this.tableRows.selection.selected[i].itemid,
  //                   serviceName: this.tableRows.selection.selected[i].servicename,
  //                   itemName: this.tableRows.selection.selected[i].itemname,
  //                   refundAfterAck: this.billDetailservice.patientbilldetaillist.billDetialsForRefund_RequestNoGeivePaymentModeRefund[0].refundAfterAck,
  //                   itemOrderId: this.tableRows.selection.selected[i].orderid,
  //                 })
  //                 this.billDetailservice.calculateTotalRefund();
  //                 console.log(this.billDetailservice.sendforapproval);
  //               }
  //       }
  //     }
  //   }, 1000);
  // }
  printrow(event:any)
  {
    console.log(event);
    setTimeout(() => {
      console.log(event)
      console.log(event.row.cancelled);
      if(event.row.cancelled == true )
      {
        console.log("true");
        var id = this.billDetailservice.patientbilldetaillist.billDetialsForRefund_ServiceDetail.filter((a:any) => {
            return a.serviceId == event.row.serviceid;
        })
        var list = this.billDetailservice.patientbilldetaillist.billDetialsForRefund_ServiceItemID.filter((a:any)=>{
          return a.serviceId == event.row.serviceid;
        }) 
        if(list[0].ackby > 0)
        {
          this.msgdialog.info('Sample For Item has been Acknowledged, Cannot Refund this Item');
          event.row.cancelled = false;
        }
        else
        {
            this.billDetailservice.addForApproval({
              ssn: this.billDetailservice.patientbilldetaillist.billDetialsForRefund_Table0[0].ssn,
              maxid: this.billDetailservice.patientbilldetaillist.billDetialsForRefund_Table0[0].uhid,
              ptnName: this.billDetailservice.patientbilldetaillist.billDetialsForRefund_Table0[0].name,
              billNo: this.billDetailservice.patientbilldetaillist.billDetialsForRefund_DepositRefundAmountDetail[0].billno,
              operatorName: this.billDetailservice.patientbilldetaillist.billDetialsForRefund_Table0[0].operator,
              authorisedby: '',
              reason: '',
              refundAmt: event.row.amount,
              mop: '',
              serviceId: event.row.serviceid,
              itemId: event.row.itemid,
              serviceName: event.row.servicename,
              itemName: event.row.itemname,
              refundAfterAck: this.billDetailservice.patientbilldetaillist.billDetialsForRefund_RequestNoGeivePaymentModeRefund[0].refundAfterAck,
              itemOrderId: event.row.orderid,
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
