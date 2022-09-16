import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";
import { Router } from "@angular/router";
import { MessageDialogService } from "@shared/ui/message-dialog/message-dialog.service";
import { ThisTypeNode } from "typescript";
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
        type: "number",
        style: {
          width: "9.5rem",
        },
        tooltipColumn: "billamount",
      },
      refund: {
        title: "Refund",
        type: "number",
        style: {
          width: "8rem",
        },
        tooltipColumn: "refund",
      },
      depositamount: {
        title: "Deposit Amount",
        type: "number",
        style: {
          width: "9rem",
        },
        tooltipColumn: "depositamount",
      },
      discountamount: {
        title: "Discount Amount",
        type: "number",
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
        type: "number",
        style: {
          width: "9rem",
        },
        tooltipColumn: "plandiscount",
      },
      netamount: {
        title: "Net Amount",
        type: "number",
        style: {
          width: "9rem",
        },
        tooltipColumn: "netamount",
      },
      cash: {
        title: "Cash",
        type: "number",
        style: {
          width: "8rem",
        },
        tooltipColumn: "cash",
      },
      actualcash: {
        title: "Actual Cash",
        type: "number",
        style: {
          width: "9rem",
        },
        tooltipColumn: "actualcash",
      },
      cheque: {
        title: "Cheque",
        type: "number",
        style: {
          width: "9rem",
        },
        tooltipColumn: "cheque",
      },
      actualchequeamount: {
        title: "Actual Cheque Amount",
        type: "number",
        style: {
          width: "12rem",
        },
        tooltipColumn: "actualchequeamount",
      },
      chequeno: {
        title: "Cheque No",
        type: "number",
        style: {
          width: "9rem",
        },
        tooltipColumn: "chequeno",
      },
      dd: {
        title: "DD",
        type: "number",
        style: {
          width: "5rem",
        },
        tooltipColumn: "dd",
      },
      actualddamount: {
        title: "Actual DD Amount",
        type: "number",
        style: {
          width: "9rem",
        },
        tooltipColumn: "actualddamount",
      },
      ddnumber: {
        title: "DD Number",
        type: "number",
        style: {
          width: "9rem",
        },
        tooltipColumn: "ddnumber",
      },
      creditcard: {
        title: "Credit Card",
        type: "number",
        style: {
          width: "9rem",
        },
        tooltipColumn: "creditcard",
      },
      actualccamount: {
        title: "Actual CC Amount",
        type: "number",
        style: {
          width: "9rem",
        },
        tooltipColumn: "actualccamount",
      },
      authorizationcode: {
        title: "Authorization Code",
        type: "number",
        style: {
          width: "9rem",
        },
        tooltipColumn: "authorizationcode",
      },
      cashpaymtbymobile: {
        title: "Cash Payment By Mobile",
        type: "number",
        style: {
          width: "12rem",
        },
        tooltipColumn: "cashpaymtbymobile",
      },
      actualcashpaymt: {
        title: "Actual Cash Payment",
        type: "number",
        style: {
          width: "12rem",
        },
        tooltipColumn: "actualcashpaymt",
      },
      onlinepaymt: {
        title: "Online Payment",
        type: "number",
        style: {
          width: "9rem",
        },
        tooltipColumn: "onlinepaymt",
      },
      actualonlinepaymt: {
        title: "Online Payment",
        type: "number",
        style: {
          width: "9rem",
        },
        tooltipColumn: "actualonlinepaymt",
      },
      transactionid: {
        title: "Transaction ID",
        type: "number",
        style: {
          width: "9rem",
        },
        tooltipColumn: "transactionid",
      },
      dues: {
        title: "Dues",
        type: "number",
        style: {
          width: "9rem",
        },
        tooltipColumn: "dues",
      },
      tdsamount: {
        title: "TDS Amount",
        type: "number",
        style: {
          width: "9rem",
        },
        tooltipColumn: "tdsamount",
      },
      totalamount: {
        title: "Total Amount",
        type: "number",
        style: {
          width: "9rem",
        },
        tooltipColumn: "totalamount",
      },
      actualupiamt: {
        title: "Actual UPI Amount",
        type: "number",
        style: {
          width: "9rem",
        },
        tooltipColumn: "actualupiamt",
      },
      internetpaymtamt: {
        title: "Internet Payment Amt",
        type: "number",
        style: {
          width: "12rem",
        },
        tooltipColumn: "internetpaymtamt",
      },
      actualinternetpaymtamt: {
        title: "Actual Internet Payment",
        type: "number",
        style: {
          width: "14rem",
        },
        tooltipColumn: "actualinternetpaymtamt",
      },
    },
  };

  constructor(
    private formService: QuestionControlService,
    private router: Router,
    private dialogservice: MessageDialogService
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
  ngAfterViewInit() {
    this.questions[0].elementRef.addEventListener("keypress", (event: any) => {
      if (event.key == "Enter") {
        event.preventDefault();
        this.filterTableData();
      }
    });
  }
  dataconfig: any[] = [
    {
      slno: "1",
      receiptno: "BLCR4",
      billno: "BLCR5",
      datetime: "2022-01-01T12:12:00",
      billamount: 0,
      refund: 0,
      depositamount: 0,
      discountamount: 0,
      planamount: 0,
      plandiscount: 0,
      netamount: 0,
      cash: 0,
      actualcash: 0,
      cheque: 0,
      actualchequeamount: 0,
      chequeno: 0,
      dd: 0,
      actualddamount: 0,
      ddnumber: 0,
      creditcard: 0,
      actualccamount: 0,
      authorizationcode: 0,
      cashpaymtbymobile: 0,
      actualcashpaymt: 0,
      onlinepaymt: 0,
      actualonlinepaymt: 0,
      transactionid: 0,
      dues: 0,
      tdsamount: 0,
      totalamount: 0,
      actualupiamt: 0,
      internetpaymtamt: 0,
      actualinternetpaymtamt: 0,
    },
    {
      slno: "1",
      receiptno: "BLCR5",
      billno: "BLCR6",
      datetime: "2022-01-01T12:12:00",
      billamount: 0,
      refund: 0,
      depositamount: 0,
      discountamount: 0,
      planamount: 0,
      plandiscount: 0,
      netamount: 0,
      cash: 0,
      actualcash: 0,
      cheque: 0,
      actualchequeamount: 0,
      chequeno: 0,
      dd: 0,
      actualddamount: 0,
      ddnumber: 0,
      creditcard: 0,
      actualccamount: 0,
      authorizationcode: 0,
      cashpaymtbymobile: 0,
      actualcashpaymt: 0,
      onlinepaymt: 0,
      actualonlinepaymt: 0,
      transactionid: 0,
      dues: 0,
      tdsamount: 0,
      totalamount: 0,
      actualupiamt: 0,
      internetpaymtamt: 0,
      actualinternetpaymtamt: 0,
    },
    {
      slno: "1",
      receiptno: "BLCR7",
      billno: "BLCR8",
      datetime: "2022-01-01T12:12:00",
      billamount: 0,
      refund: 0,
      depositamount: 0,
      discountamount: 0,
      planamount: 0,
      plandiscount: 0,
      netamount: 0,
      cash: 0,
      actualcash: 0,
      cheque: 0,
      actualchequeamount: 0,
      chequeno: 0,
      dd: 0,
      actualddamount: 0,
      ddnumber: 0,
      creditcard: 0,
      actualccamount: 0,
      authorizationcode: 0,
      cashpaymtbymobile: 0,
      actualcashpaymt: 0,
      onlinepaymt: 0,
      actualonlinepaymt: 0,
      transactionid: 0,
      dues: 0,
      tdsamount: 0,
      totalamount: 0,
      actualupiamt: 0,
      internetpaymtamt: 0,
      actualinternetpaymtamt: 0,
    },
    {
      slno: "1",
      receiptno: "BLCR9",
      billno: "BLCR10",
      datetime: "2022-01-01T12:12:00",
      billamount: 0,
      refund: 0,
      depositamount: 0,
      discountamount: 0,
      planamount: 0,
      plandiscount: 0,
      netamount: 0,
      cash: 0,
      actualcash: 0,
      cheque: 0,
      actualchequeamount: 0,
      chequeno: 0,
      dd: 0,
      actualddamount: 0,
      ddnumber: 0,
      creditcard: 0,
      actualccamount: 0,
      authorizationcode: 0,
      cashpaymtbymobile: 0,
      actualcashpaymt: 0,
      onlinepaymt: 0,
      actualonlinepaymt: 0,
      transactionid: 0,
      dues: 0,
      tdsamount: 0,
      totalamount: 0,
      actualupiamt: 0,
      internetpaymtamt: 0,
      actualinternetpaymtamt: 0,
    },
    {
      slno: "1",
      receiptno: "BLCR11",
      billno: "BLCR12",
      datetime: "2022-01-01T12:12:00",
      billamount: 0,
      refund: 0,
      depositamount: 0,
      discountamount: 0,
      planamount: 0,
      plandiscount: 0,
      netamount: 0,
      cash: 0,
      actualcash: 0,
      cheque: 0,
      actualchequeamount: 0,
      chequeno: 0,
      dd: 0,
      actualddamount: 0,
      ddnumber: 0,
      creditcard: 0,
      actualccamount: 0,
      authorizationcode: 0,
      cashpaymtbymobile: 0,
      actualcashpaymt: 0,
      onlinepaymt: 0,
      actualonlinepaymt: 0,
      transactionid: 0,
      dues: 0,
      tdsamount: 0,
      totalamount: 0,
      actualupiamt: 0,
      internetpaymtamt: 0,
      actualinternetpaymtamt: 0,
    },
    {
      slno: "1",
      receiptno: "BLCR13",
      billno: "BLCR14",
      datetime: "2022-01-01T12:12:00",
      billamount: 0,
      refund: 0,
      depositamount: 0,
      discountamount: 0,
      planamount: 0,
      plandiscount: 0,
      netamount: 0,
      cash: 0,
      actualcash: 0,
      cheque: 0,
      actualchequeamount: 0,
      chequeno: 0,
      dd: 0,
      actualddamount: 0,
      ddnumber: 0,
      creditcard: 0,
      actualccamount: 0,
      authorizationcode: 0,
      cashpaymtbymobile: 0,
      actualcashpaymt: 0,
      onlinepaymt: 0,
      actualonlinepaymt: 0,
      transactionid: 0,
      dues: 0,
      tdsamount: 0,
      totalamount: 0,
      actualupiamt: 0,
      internetpaymtamt: 0,
      actualinternetpaymtamt: 0,
    },
    {
      slno: "1",
      receiptno: "BLCR15",
      billno: "BLCR16",
      datetime: "2022-01-01T12:12:00",
      billamount: 0,
      refund: 0,
      depositamount: 0,
      discountamount: 0,
      planamount: 0,
      plandiscount: 0,
      netamount: 0,
      cash: 0,
      actualcash: 0,
      cheque: 0,
      actualchequeamount: 0,
      chequeno: 0,
      dd: 0,
      actualddamount: 0,
      ddnumber: 0,
      creditcard: 0,
      actualccamount: 0,
      authorizationcode: 0,
      cashpaymtbymobile: 0,
      actualcashpaymt: 0,
      onlinepaymt: 0,
      actualonlinepaymt: 0,
      transactionid: 0,
      dues: 0,
      tdsamount: 0,
      totalamount: 0,
      actualupiamt: 0,
      internetpaymtamt: 0,
      actualinternetpaymtamt: 0,
    },
    {
      slno: "1",
      receiptno: "BLCR17",
      billno: "BLCR18",
      datetime: "2022-01-01T12:12:00",
      billamount: 0,
      refund: 0,
      depositamount: 0,
      discountamount: 0,
      planamount: 0,
      plandiscount: 0,
      netamount: 0,
      cash: 0,
      actualcash: 0,
      cheque: 0,
      actualchequeamount: 0,
      chequeno: 0,
      dd: 0,
      actualddamount: 0,
      ddnumber: 0,
      creditcard: 0,
      actualccamount: 0,
      authorizationcode: 0,
      cashpaymtbymobile: 0,
      actualcashpaymt: 0,
      onlinepaymt: 0,
      actualonlinepaymt: 0,
      transactionid: 0,
      dues: 0,
      tdsamount: 0,
      totalamount: 0,
      actualupiamt: 0,
      internetpaymtamt: 0,
      actualinternetpaymtamt: 0,
    },
    {
      slno: "1",
      receiptno: "BLCR19",
      billno: "BLCR20",
      datetime: "2022-01-01T12:12:00",
      billamount: 0,
      refund: 0,
      depositamount: 0,
      discountamount: 0,
      planamount: 0,
      plandiscount: 0,
      netamount: 0,
      cash: 0,
      actualcash: 0,
      cheque: 0,
      actualchequeamount: 0,
      chequeno: 0,
      dd: 0,
      actualddamount: 0,
      ddnumber: 0,
      creditcard: 0,
      actualccamount: 0,
      authorizationcode: 0,
      cashpaymtbymobile: 0,
      actualcashpaymt: 0,
      onlinepaymt: 0,
      actualonlinepaymt: 0,
      transactionid: 0,
      dues: 0,
      tdsamount: 0,
      totalamount: 0,
      actualupiamt: 0,
      internetpaymtamt: 0,
      actualinternetpaymtamt: 0,
    },
    {
      slno: "1",
      receiptno: "BLCR21",
      billno: "BLCR22",
      datetime: "2022-01-01T12:12:00",
      billamount: 0,
      refund: 0,
      depositamount: 0,
      discountamount: 0,
      planamount: 0,
      plandiscount: 0,
      netamount: 0,
      cash: 0,
      actualcash: 0,
      cheque: 0,
      actualchequeamount: 0,
      chequeno: 0,
      dd: 0,
      actualddamount: 0,
      ddnumber: 0,
      creditcard: 0,
      actualccamount: 0,
      authorizationcode: 0,
      cashpaymtbymobile: 0,
      actualcashpaymt: 0,
      onlinepaymt: 0,
      actualonlinepaymt: 0,
      transactionid: 0,
      dues: 0,
      tdsamount: 0,
      totalamount: 0,
      actualupiamt: 0,
      internetpaymtamt: 0,
      actualinternetpaymtamt: 0,
    },
  ];
  filtertableList: any[] = this.dataconfig;
  filterTableData() {
    if (this.cashscrollmodifyForm.controls["billreceiptno"].value != "") {
      this.filtertableList = this.dataconfig.filter((item) => {
        if (
          item.billno ==
            this.cashscrollmodifyForm.controls["billreceiptno"].value ||
          item.receiptno ==
            this.cashscrollmodifyForm.controls["billreceiptno"].value
        ) {
          return item;
        }
      });
    } else {
      this.filtertableList = this.dataconfig;
      //this.dialogservice.info("Scroll")
    }
  }
  navigatetomain() {
    this.router.navigate(["out-patient-billing", "cash-scroll"]);
  }
  acknowledge() {
    this.dialogservice.success("Scroll Has Been Acknowledged");
  }
  modify() {
    this.dialogservice.success("Scroll Has Been Modified");
  }
  print() {}
  clear() {
    this.cashscrollmodifyForm.reset();
  }
}
