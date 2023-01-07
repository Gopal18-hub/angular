import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'out-patients-visit-history-dialog',
  templateUrl: './visit-history-dialog.component.html',
  styleUrls: ['./visit-history-dialog.component.scss']
})
export class VisitHistoryDialogComponent implements OnInit {

  config: any = {
    actionItems: true,
    dateformat: "dd/MM/yyyy",
    selectBox: false,
    displayedColumns: [
      "visitdate",
      "lastbillno",
      "lastpaymentmode",
      "lastcompanybilled",
      "doctorname",
      "days",
      "consultationtype",
      "amount"
    ],
    columnsInfo: {
      visitdate: {
        title: "Visit Date",
        type: "date",
      },
      lastbillno: {
        title: "Last Bill No.",
        type: "number",
      },
      lastpaymentmode: {
        title: "Last Payment Mode",
        type: "string",
      },
      lastcompanybilled: {
        title: "Last Company Billed",
        type: "string",
      },
      doctorname: {
        title: "Doctor Name",
        type: "string",
      },
      days: {
        title: "Days",
        type: "number",
      },
      consultationtype: {
        title: "Consultation Type",
        type: "string",
      },
      amount: {
        title: "Amount",
        type: "number",
      }
    },
  };
  constructor() { }
  
  ngOnInit(): void {
  }

}
