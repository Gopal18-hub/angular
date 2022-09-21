import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { CookieService } from "@shared/services/cookie.service";
import { Router } from "@angular/router";

@Component({
  selector: "out-patients-cash-scroll-new",
  templateUrl: "./cash-scroll-new.component.html",
  styleUrls: ["./cash-scroll-new.component.scss"],
})
export class CashScrollNewComponent implements OnInit {
  questions: any;
  constructor(
    private formService: QuestionControlService,
    private cookie: CookieService,
    private router: Router
  ) {}
  cashscrollnewformdata = {
    type: "object",
    title: "",
    properties: {
      employeename: {
        type: "string",
      },
      scrollno: {
        type: "string",
      },
      takenat: {
        type: "string",
      },
      fromdate: {
        type: "date",
      },
      todate: {
        type: "date",
      },
    },
  };
  cashscrollnewconfig: any = {
    clickedRows: true,
    clickSelection: "single",
    dateformat: "dd/MM/yyyy - hh:mm:ss",
    selectBox: false,
    displayedColumns: [
      "sno",
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
      "cheque",
      "dd",
      "creditcard",
      "cashpaymentbymobile",
      "onlinepayment",
      "dues",
      "tdsamount",
      "donation",
      "upiamount",
      "totalamount",
      "companyname",
      "internetpayment",
    ],
    columnsInfo: {
      sno: {
        title: "S.No",
        type: "string",
        style: {
          width: "5rem",
        },
      },
      receiptno: {
        title: "Receipt No.",
        type: "string",
        style: {
          width: "6rem",
        },
      },
      billno: {
        title: "Bill No.",
        type: "string",
        style: {
          width: "6rem",
        },
      },
      datetime: {
        title: "Date Time",
        type: "date",
        style: {
          width: "6rem",
        },
      },
      billamount: {
        title: "Bill Amount",
        type: "string",
        style: {
          width: "6rem",
        },
      },
      refund: {
        title: "Refund",
        type: "string",
        style: {
          width: "6rem",
        },
      },
      depositamount: {
        title: "Deposit Amount",
        type: "string",
        style: {
          width: "9rem",
        },
      },
      discountamount: {
        title: "Discount Amount",
        type: "string",
        style: {
          width: "9rem",
        },
      },
      planamount: {
        title: "Plan Amount",
        type: "string",
        style: {
          width: "9rem",
        },
      },
      plandiscount: {
        title: "Plan Discount",
        type: "string",
        style: {
          width: "9rem",
        },
      },
      netamount: {
        title: "Net Amount",
        type: "string",
        style: {
          width: "9rem",
        },
      },
      cash: {
        title: "Cash",
        type: "string",
        style: {
          width: "6rem",
        },
      },
      cheque: {
        title: "Cheque",
        type: "string",
        style: {
          width: "6rem",
        },
      },
      dd: {
        title: "DD",
        type: "string",
        style: {
          width: "6rem",
        },
      },
      creditcard: {
        title: "Credit Card",
        type: "number",
        style: {
          width: "8rem",
        },
      },
      cashpaymentbymobile: {
        title: "Cash Payment by Mobile",
        type: "date",
        style: {
          width: "12rem",
        },
      },
      onlinepayment: {
        title: "Online Payment",
        type: "date",
        style: {
          width: "9rem",
        },
      },
      dues: {
        title: "Dues",
        type: "string",
        style: {
          width: "8rem",
        },
      },
      tdsamount: {
        title: "TDS Amount",
        type: "date",
        style: {
          width: "8rem",
        },
      },
      donation: {
        title: "Donation",
        type: "date",
        style: {
          width: "8rem",
        },
      },
      upiamount: {
        title: "UPI Amount",
        type: "string",
        style: {
          width: "8rem",
        },
      },
      totalamount: {
        title: "Total Amount",
        type: "string",
        style: {
          width: "8rem",
        },
      },
      companyname: {
        title: "Company Name",
        type: "string",
        style: {
          width: "9rem",
        },
      },
      internetpayment: {
        title: "Internet Payment",
        type: "string",
        style: {
          width: "9rem",
        },
      },
    },
  };
  cashscrollnewForm!: FormGroup;

  lastUpdatedBy: string = "";
  currentTime: string = new Date().toLocaleString();
  private readonly _destroying$ = new Subject<void>();

  ngOnInit(): void {
    console.log("inside cash scroll new");
    let formResult = this.formService.createForm(
      this.cashscrollnewformdata.properties,
      {}
    );
    this.cashscrollnewForm = formResult.form;
    this.questions = formResult.questions;

    this.lastUpdatedBy = this.cookie.get("UserName");
  }
  opencashscroll() {
    this.router.navigate(["report/cash-scroll", "cash-scroll"]);
  }
}
