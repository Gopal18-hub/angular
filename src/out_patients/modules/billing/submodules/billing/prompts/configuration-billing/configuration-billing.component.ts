import { Component, OnInit,ViewChild } from '@angular/core';
import { FormGroup } from "@angular/forms";

@Component({
  selector: 'out-patients-configuration-billing',
  templateUrl: './configuration-billing.component.html',
  styleUrls: ['./configuration-billing.component.scss']
})
export class ConfigurationBillingComponent implements OnInit {

  constructor() { }
  questions: any;
  Configurationbilling!: FormGroup;

  
  @ViewChild("configbillingtable") configbillingtable: any;

 
  configurationbillingconfig: any = {
    clickedRows: true,
    clickSelection: "single",
    dateformat: "dd/MM/yyyy - hh:mm",
    selectBox: true,
    groupby: {
      parentcolumn: "cashTransactionID",
      childcolumn: "parentID",
    },
    displayedColumns: [
      "depositRefund",
      "receiptno",
      "dateTime",
      "deposit",
      "paymentType",
      "usedOP",
      "usedIP",
      "refund",
      "balance",
      "gst",
      "gstValue",
      "advanceType",
      "serviceTypeName",
      "operatorName",
      "remarks"
    ],
    columnsInfo: {
      depositRefund: {
        title: "Deposit/Refund",
        type: "string",
        style: {
          width: "7rem",
        },
      },
      receiptno: {
        title: "Receipt No.",
        type: "number",
        style: {
          width: "6rem",
        },
      },
      dateTime: {
        title: "Date & Time",
        type: "date",
        style: {
          width: "8rem",
        },
      },
      deposit: {
        title: "Deposit",
        type: "string",
        tooltipColumn: "modifiedPtnName",
        style: {
          width: "6rem",
        },
      },
      paymentType: {
        title: "Payment Type",
        type: "string",
        style: {
          width: "7rem",
        },
      },
      usedOP: {
        title: "Used(OP)",
        type: "number",
        style: {
          width: "5rem",
        },
      },
      usedIP: {
        title: "Used(IP)",
        type: "number",
        style: {
          width: "5rem",
        },
      },
      refund: {
        title: "Refund",
        type: "string",
        tooltipColumn: "uEmail",
        style: {
          width: "6rem",
        },
      },
      balance: {
        title: "Balance",
        type: "string",
        style: {
          width: "6rem",
        },
      },
      gst: {
        title: "Tax %",
        type: "number",
        style: {
          width: "3.7rem",
        },
      },
      gstValue: {
        title: "Total Tax Value",
        type: "number",
        style: {
          width: "7rem",
        },
      },
      advanceType: {
        title: "Deposit Head",
        type: "string",
        style: {
          width: "7rem",
        },
        tooltipColumn: "advanceType",
      },
      serviceTypeName: {
        title: "Service Type",
        type: "string",
        style: {
          width: "7rem",
        },
        tooltipColumn: "serviceTypeName",
      },
      operatorName: {
        title: "Operator Name & ID",
        type: "string",
        style: {
          width: "10rem",
        },
        tooltipColumn: "operatorName",
      },
      remarks: {
        title: "Remarks",
        type: "string",
        style: {
          width: "7rem",
        },
        tooltipColumn: "remarks",
      },
     
    },
  };

  patientname: string | undefined;
  maxid: string | undefined;
  companyname: string | undefined;
  tpa: string | undefined;
  creditlimit: string | undefined;
  
  ngOnInit(): void {
  }

}
