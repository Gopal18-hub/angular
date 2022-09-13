import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";
import { Router } from "@angular/router";
@Component({
  selector: "out-patients-cash-scroll-modify",
  templateUrl: "./cash-scroll-modify.component.html",
  styleUrls: ["./cash-scroll-modify.component.scss"],
})
export class CashScrollModifyComponent implements OnInit {
  cashscrollmodifyForm!: FormGroup;
  questions: any;
  cashscrollModifyData = {
    type: "object",
    title: "",
    properties: {
      billreceiptno: {
        type: "string",
        title: "",
      },
      employeename: {
        type: "string",
        title: "",
      },
      scrollno: {
        type: "number",
        title: "",
      },
      takenat: {
        type: "string",
        title: "",
      },
      fromdate: {
        type: "date",
        title: "",
      },
      todate: {
        type: "date",
        title: "",
      },
      totalcash: {
        type: "number",
      },
      totalcc: {
        type: "number",
      },
      totalonline: {
        type: "number",
      },
      totalmobile: {
        type: "number",
      },
      totalcheque: {
        type: "number",
      },
      totaldd: {
        type: "number",
      },
      totalupi: {
        type: "number",
      },
      totalinternetpayment: {
        type: "number",
      },
    },
  };
  config: any = {
    displayedColumns: [
      "slno",
      "receiptno",
      "billno",
      "datetime",
      "billamount",
      "refund",
      "depositamount",
      "discountamount",
      "planamount",
      "plandiscount",
      "netamount",
      "cash",
      "actualcash",
      "cheque",
      "actualchequeamount",
      "chequeno",
      "dd",
      "actualddamount",
      "ddnumber",
      "creditcard",
      "actualccamount",
      "authorizationcode",
      "cashpaymtbymobile",
      "actualcashpaymt",
      "onlinepaymt",
      "actualonlinepaymt",
      "transactionid",
      "dues",
      "tdsamount",
      "totalamount",
      "actualupiamt",
      "internetpaymtamt",
      "actualinternetpaymtamt",
    ],
    columnsInfo: {
      slno: {
        title: "Sl No.",
        type: "number",
        style: {
          width: "5rem",
        },
      },
      receiptno: {
        title: "Receipt No.",
        type: "string",
        style: {
          width: "8rem",
        },
        tooltipColumn: "receiptno",
      },
      billno: {
        title: "Bill No.",
        type: "string",
        style: {
          width: "6rem",
        },
        tooltipColumn: "billno",
      },
      datetime: {
        title: "Date Time",
        type: "string",
        style: {
          width: "9rem",
        },
        tooltipColumn: "datetime",
      },
      billamount: {
        title: "Bill Amount",
        type: "string",
        style: {
          width: "9.5rem",
        },
        tooltipColumn: "billamount",
      },
      refund: {
        title: "Refund",
        type: "string",
        style: {
          width: "8rem",
        },
        tooltipColumn: "refund",
      },
      depositamount: {
        title: "Deposit Amount",
        type: "string",
        style: {
          width: "9rem",
        },
        tooltipColumn: "depositamount",
      },
      discountamount: {
        title: "Discount Amount",
        type: "string",
        style: {
          width: "9rem",
        },
        tooltipColumn: "discountamount",
      },
      planamount: {
        title: "Plan Amount",
        type: "number",
        style: {
          width: "9rem",
        },
        tooltipColumn: "planamount",
      },
      plandiscount: {
        title: "Plan Discount",
        type: "string",
        style: {
          width: "9rem",
        },
        tooltipColumn: "plandiscount",
      },
      netamount: {
        title: "Net Amount",
        type: "string",
        style: {
          width: "9rem",
        },
        tooltipColumn: "netamount",
      },
      cash: {
        title: "Cash",
        type: "string",
        style: {
          width: "8rem",
        },
        tooltipColumn: "cash",
      },
      actualcash: {
        title: "Actual Cash",
        type: "string",
        style: {
          width: "9rem",
        },
        tooltipColumn: "actualcash",
      },
      cheque: {
        title: "Cheque",
        type: "string",
        style: {
          width: "9rem",
        },
        tooltipColumn: "cheque",
      },
      actualchequeamount: {
        title: "Actual Cheque Amount",
        type: "string",
        style: {
          width: "12rem",
        },
        tooltipColumn: "actualchequeamount",
      },
      chequeno: {
        title: "Cheque No",
        type: "string",
        style: {
          width: "9rem",
        },
        tooltipColumn: "chequeno",
      },
      dd: {
        title: "DD",
        type: "string",
        style: {
          width: "5rem",
        },
        tooltipColumn: "dd",
      },
      actualddamount: {
        title: "Actual DD Amount",
        type: "string",
        style: {
          width: "9rem",
        },
        tooltipColumn: "actualddamount",
      },
      ddnumber: {
        title: "DD Number",
        type: "string",
        style: {
          width: "9rem",
        },
        tooltipColumn: "ddnumber",
      },
      creditcard: {
        title: "Credit Card",
        type: "string",
        style: {
          width: "9rem",
        },
        tooltipColumn: "creditcard",
      },
      actualccamount: {
        title: "Actual CC Amount",
        type: "string",
        style: {
          width: "9rem",
        },
        tooltipColumn: "actualccamount",
      },
      authorizationcode: {
        title: "Authorization Code",
        type: "string",
        style: {
          width: "9rem",
        },
        tooltipColumn: "authorizationcode",
      },
      cashpaymtbymobile: {
        title: "Cash Payment By Mobile",
        type: "string",
        style: {
          width: "12rem",
        },
        tooltipColumn: "cashpaymtbymobile",
      },
      actualcashpaymt: {
        title: "Actual Cash Payment",
        type: "string",
        style: {
          width: "12rem",
        },
        tooltipColumn: "actualcashpaymt",
      },
      onlinepaymt: {
        title: "Online Payment",
        type: "string",
        style: {
          width: "9rem",
        },
        tooltipColumn: "onlinepaymt",
      },
      actualonlinepaymt: {
        title: "Online Payment",
        type: "string",
        style: {
          width: "9rem",
        },
        tooltipColumn: "actualonlinepaymt",
      },
      transactionid: {
        title: "Transaction ID",
        type: "string",
        style: {
          width: "9rem",
        },
        tooltipColumn: "transactionid",
      },
      dues: {
        title: "Dues",
        type: "string",
        style: {
          width: "9rem",
        },
        tooltipColumn: "dues",
      },
      tdsamount: {
        title: "TDS Amount",
        type: "string",
        style: {
          width: "9rem",
        },
        tooltipColumn: "tdsamount",
      },
      totalamount: {
        title: "Total Amount",
        type: "string",
        style: {
          width: "9rem",
        },
        tooltipColumn: "totalamount",
      },
      actualupiamt: {
        title: "Actual UPI Amount",
        type: "string",
        style: {
          width: "9rem",
        },
        tooltipColumn: "actualupiamt",
      },
      internetpaymtamt: {
        title: "Internet Payment Amt",
        type: "string",
        style: {
          width: "12rem",
        },
        tooltipColumn: "internetpaymtamt",
      },
      actualinternetpaymtamt: {
        title: "Actual Internet Payment",
        type: "string",
        style: {
          width: "14rem",
        },
        tooltipColumn: "actualinternetpaymtamt",
      },
    },
  };

  constructor(
    private formService: QuestionControlService,
    private router: Router
  ) {}

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.cashscrollModifyData.properties,
      {}
    );
    this.cashscrollmodifyForm = formResult.form;
    this.questions = formResult.questions;
    this.cashscrollmodifyForm.controls["fromdate"].disable();
    this.cashscrollmodifyForm.controls["todate"].disable();
    this.cashscrollmodifyForm.controls["employeename"].disable();
    this.cashscrollmodifyForm.controls["takenat"].disable();
    this.cashscrollmodifyForm.controls["scrollno"].disable();
  }
  navigatetomain() {
    this.router.navigate(["out-patient-billing", "cash-scroll"]);
  }
}
