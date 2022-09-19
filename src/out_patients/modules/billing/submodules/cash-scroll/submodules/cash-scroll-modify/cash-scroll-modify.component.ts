import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";
import { Router } from "@angular/router";
import { MessageDialogService } from "@shared/ui/message-dialog/message-dialog.service";
import { ModifyCashScrollInterface } from "../../../../../../core/types/cashscroll/modifycashscroll.Interface";
import { getERPscrollDetailDtoInterface } from "../../../../../../core/types/cashscroll/modifycashscroll.Interface";
import { HttpClient } from "@angular/common/http";
import { ApiConstants } from "@core/constants/ApiConstants";
import { Subject, takeUntil } from "rxjs";
import { DatePipe } from "@angular/common";
import { AckDetailsForScrollModel } from "../../../../../../core/models/ackdetailsforscroll.Model";
import { dtExcelforScrollInterface } from "../../../../../../core/models/ackdetailsforscroll.Model";
@Component({
  selector: "out-patients-cash-scroll-modify",
  templateUrl: "./cash-scroll-modify.component.html",
  styleUrls: ["./cash-scroll-modify.component.scss"],
})
export class CashScrollModifyComponent implements OnInit {
  cashscrollmodifyForm!: FormGroup;
  questions: any;
  private readonly _destroying$ = new Subject<void>();
  scrolldataObject!: ModifyCashScrollInterface;
  billList: getERPscrollDetailDtoInterface[] = [];
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
      "receiptNo",
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
      "modifiedCash",
      "cheque",
      "modifiedCheqAmt",
      "chequeNo",
      "dd",
      "modifiedDDAmt",
      "ddnumber",
      "creditCard",
      "modifiedCCAmt",
      "authorizationcode",
      "cashpaymtbymobile",
      "actualcashpaymt",
      "onlinePayment",
      "modifiedOnlinePayment",
      "transactionid",
      "dues",
      "tdsamount",
      "totalamount",
      "modifiedUPIAmt",
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
      receiptNo: {
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
      modifiedCash: {
        title: "Actual Cash",
        type: "number",
        style: {
          width: "9rem",
        },
        tooltipColumn: "modifiedCash",
      },
      cheque: {
        title: "Cheque",
        type: "number",
        style: {
          width: "9rem",
        },
        tooltipColumn: "cheque",
      },
      modifiedCheqAmt: {
        title: "Actual Cheque Amount",
        type: "number",
        style: {
          width: "12rem",
        },
        tooltipColumn: "modifiedCheqAmt",
      },
      chequeNo: {
        title: "Cheque No",
        type: "number",
        style: {
          width: "9rem",
        },
        tooltipColumn: "chequeNo",
      },
      dd: {
        title: "DD",
        type: "number",
        style: {
          width: "5rem",
        },
        tooltipColumn: "dd",
      },
      modifiedDDAmt: {
        title: "Actual DD Amount",
        type: "number",
        style: {
          width: "9rem",
        },
        tooltipColumn: "modifiedDDAmt",
      },
      ddnumber: {
        title: "DD Number",
        type: "number",
        style: {
          width: "9rem",
        },
        tooltipColumn: "ddnumber",
      },
      creditCard: {
        title: "Credit Card",
        type: "number",
        style: {
          width: "9rem",
        },
        tooltipColumn: "creditCard",
      },
      modifiedCCAmt: {
        title: "Actual CC Amount",
        type: "number",
        style: {
          width: "9rem",
        },
        tooltipColumn: "modifiedCCAmt",
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
      onlinePayment: {
        title: "Online Payment",
        type: "number",
        style: {
          width: "9rem",
        },
        tooltipColumn: "onlinePayment",
      },
      modifiedOnlinePayment: {
        title: "Online Payment",
        type: "number",
        style: {
          width: "9rem",
        },
        tooltipColumn: "modifiedOnlinePayment",
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
      modifiedUPIAmt: {
        title: "Actual UPI Amount",
        type: "number",
        style: {
          width: "9rem",
        },
        tooltipColumn: "modifiedUPIAmt",
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
    private dialogservice: MessageDialogService,
    private http: HttpClient,
    private datepipe: DatePipe
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
    this.http
      .get(ApiConstants.getdetaileddataforoldscrollerp(1, 10412))
      .pipe(takeUntil(this._destroying$))
      .subscribe((data) => {
        console.log(data);
        this.scrolldataObject = data as ModifyCashScrollInterface;
        console.log(this.scrolldataObject);
        this.billList = this.scrolldataObject.getERPscrollDetailDto;
        console.log(this.billList);
        this.cashscrollmodifyForm.controls["employeename"].setValue(
          this.scrolldataObject.getERPscrollMainDto[0].name
        );
        this.cashscrollmodifyForm.controls["fromdate"].setValue(
          this.scrolldataObject.getERPscrollMainDto[0].fromdatetime
        );
        this.cashscrollmodifyForm.controls["todate"].setValue(
          this.scrolldataObject.getERPscrollMainDto[0].todatetime
        );
        this.cashscrollmodifyForm.controls["takenat"].setValue(
          this.datepipe.transform(
            this.scrolldataObject.getERPscrollMainDto[0].scrolldatetime,
            "MM/dd/yyyy hh:mm:ss a"
          )
        );
        this.cashscrollmodifyForm.controls["scrollno"].setValue(
          this.scrolldataObject.getERPscrollMainDto[0].stationslno
        );
      });
  }
  ngAfterViewInit() {
    this.questions[0].elementRef.addEventListener("keypress", (event: any) => {
      if (event.key == "Enter") {
        event.preventDefault();
      }
    });
  }

  navigatetomain() {
    this.router.navigate(["out-patient-billing", "cash-scroll"]);
  }
  acknowledge() {
    this.dialogservice.success("Scroll Has Been Acknowledged");
  }
  modify() {
    // this.http.post(ApiConstants.ackdetailsforscroll, this.modifyObject());
    //this.dialogservice.success("Scroll Has Been Modified");
  }
  fromdate: any;
  todate: any;
  tableList: dtExcelforScrollInterface[] = [];
  // modifyObject(): AckDetailsForScrollModel {
  //   this.fromdate = this.datepipe.transform(
  //     this.cashscrollmodifyForm.controls["fromdate"].value,
  //     "yyyy-MM-ddThh:mm:ss"
  //   );
  //   this.todate = this.datepipe.transform(
  //     this.cashscrollmodifyForm.controls["todate"].value,
  //     "yyyy-MM-ddThh:mm:ss"
  //   );
  //    return new AckDetailsForScrollModel(this.fromdate, this.todate,);
  // }
  checktotal() {
    this.billList.forEach((row, index) => {
      if (
        row.cash +
          row.dd +
          row.onlinePayment +
          row.netamount +
          row.modifiedDDAmt +
          row.chequeNo +
          row.upiAmt !=
        row.cheque +
          row.creditCard +
          row.dues +
          row.modifiedCheqAmt +
          row.modifiedCash +
          row.creditCardNo +
          row.modifiedUPIAmt
      ) {
      }
    });
  }

  print() {}
  clear() {
    this.cashscrollmodifyForm.reset();
  }
}
