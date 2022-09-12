import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";

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
      "cheque",
    ],
    columnsInfo: {
      slno: {
        title: "Sl No.",
        type: "number",
        style: {
          width: "10rem",
        },
      },
      receiptno: {
        title: "Receipt No.",
        type: "string",
        style: {
          width: "6rem",
        },
        tooltipColumn: "receiptno",
      },
      billno: {
        title: "Bill No.",
        type: "string",
        style: {
          width: "5.5rem",
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
          width: "9rem",
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
          width: "9rem",
        },
        tooltipColumn: "cash",
      },
      cheque: {
        title: "Cheque",
        type: "string",
        style: {
          width: "9rem",
        },
        tooltipColumn: "cheque",
      },
    },
  };

  constructor(private formService: QuestionControlService) {}

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.cashscrollModifyData.properties,
      {}
    );
    this.cashscrollmodifyForm = formResult.form;
    this.questions = formResult.questions;
  }
}
