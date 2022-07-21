import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'out-patients-visit-history',
  templateUrl: './visit-history.component.html',
  styleUrls: ['./visit-history.component.scss']
})
export class VisitHistoryComponent implements OnInit {

  config: any = {
    actionItems: false,
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
        type: "string",
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
  data: any[] = [
    { visitdate: "30/12/1999", lastbillno: "BL789456", lastpaymentmode: "Online", lastcompanybilled: "ABC Company", doctorname: "Ravi kant behl", days: "5", consultationtype: "Consultation", amount: "1500.00"},
    { visitdate: "30/12/1999", lastbillno: "BL789456", lastpaymentmode: "Online", lastcompanybilled: "ABC Company", doctorname: "Ravi kant behl", days: "5", consultationtype: "Consultation", amount: "1500.00"},
    { visitdate: "30/12/1999", lastbillno: "BL789456", lastpaymentmode: "Online", lastcompanybilled: "ABC Company", doctorname: "Ravi kant behl", days: "5", consultationtype: "Consultation", amount: "1500.00"},
    { visitdate: "30/12/1999", lastbillno: "BL789456", lastpaymentmode: "Online", lastcompanybilled: "ABC Company", doctorname: "Ravi kant behl", days: "5", consultationtype: "Consultation", amount: "1500.00"},
    { visitdate: "30/12/1999", lastbillno: "BL789456", lastpaymentmode: "Online", lastcompanybilled: "ABC Company", doctorname: "Ravi kant behl", days: "5", consultationtype: "Consultation", amount: "1500.00"},
    { visitdate: "30/12/1999", lastbillno: "BL789456", lastpaymentmode: "Online", lastcompanybilled: "ABC Company", doctorname: "Ravi kant behl", days: "5", consultationtype: "Consultation", amount: "1500.00"},
    { visitdate: "30/12/1999", lastbillno: "BL789456", lastpaymentmode: "Online", lastcompanybilled: "ABC Company", doctorname: "Ravi kant behl", days: "5", consultationtype: "Consultation", amount: "1500.00"}
  ]
  constructor() { }

  ngOnInit(): void {
  }

}
