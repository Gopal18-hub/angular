import {
  Component,
  KeyValueDiffer,
  KeyValueDiffers,
  OnInit,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { FormGroup } from "@angular/forms";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";
import { ActivatedRoute, Router } from "@angular/router";
import { MessageDialogService } from "@shared/ui/message-dialog/message-dialog.service";
import { ModifyCashScrollInterface } from "../../../../../../core/types/cashscroll/modifycashscroll.Interface";
import { getERPscrollDetailDtoInterface } from "../../../../../../core/types/cashscroll/modifycashscroll.Interface";
import { HttpClient } from "@angular/common/http";
import { ApiConstants } from "@core/constants/ApiConstants";
import { Subject, takeUntil } from "rxjs";
import { DatePipe } from "@angular/common";
import {
  AckDetailsForScrollModel,
  dtExcelforScroll,
} from "../../../../../../core/models/ackdetailsforscroll.Model";
import { CookieService } from "@shared/services/cookie.service";
import { ReportService } from "@shared/services/report.service";
import * as moment from "moment";
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
  differ!: KeyValueDiffer<any, any>;
  ackdetailsreqbody: AckDetailsForScrollModel = new AckDetailsForScrollModel();
  lastUpdatedBy: string = this.cookie.get("UserName");
  currentTime: string = new Date().toLocaleString();
  moment = moment;
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
        readonly: true,
      },
      scrollno: {
        type: "number",
        title: "",
        readonly: true,
      },
      takenat: {
        type: "string",
        title: "",
        readonly: true,
      },
      fromdate: {
        type: "string",
        title: "",
        readonly: true,
      },
      todate: {
        type: "string",
        title: "",
        readonly: true,
      },
      totalcash: {
        type: "number",
        readonly: true,
        defaultValue: "0.00",
      },
      totalcc: {
        type: "number",
        readonly: true,
        defaultValue: "0.00",
      },
      totalonline: {
        type: "number",
        readonly: true,
        defaultValue: "0.00",
      },
      totalmobile: {
        type: "number",
        readonly: true,
        defaultValue: "0.00",
      },
      totalcheque: {
        type: "number",
        readonly: true,
        defaultValue: "0.00",
      },
      totaldd: {
        type: "number",
        readonly: true,
        defaultValue: "0.00",
      },
      totalupi: {
        type: "number",
        readonly: true,
        defaultValue: "0.00",
      },
      totalinternetpayment: {
        type: "number",
        readonly: true,
        defaultValue: "0.00",
      },
    },
  };
  config: any = {
    displayedColumns: [
      "sno",
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
      "batchno",
      "mobilePayment",
      "modifiedCashPaymentMobile",
      "onlinePayment",
      "modifiedOnlinePayment",
      "onlinePaymentDetails", //TransactionID
      "dues",
      "tdsamount",
      "totalamount",
      "upiAmt",
      "modifiedUPIAmt",
      "donationAmount",
      "modifiedDonationAmount",
    ],
    rowLayout: { dynamic: { rowClass: "row['forclr']" } },
    columnsInfo: {
      sno: {
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
        type: "string",
        style: {
          width: "9rem",
        },
      },
      billamount: {
        title: "Bill Amount",
        type: "number",
        style: {
          width: "9.5rem",
        },
      },
      refund: {
        title: "Refund Amount",
        type: "number",
        style: {
          width: "8rem",
        },
      },
      depositamount: {
        title: "Deposit Amount",
        type: "number",
        style: {
          width: "9rem",
        },
      },
      discountamount: {
        title: "Discount Amount",
        type: "number",
        style: {
          width: "9rem",
        },
      },
      planamount: {
        title: "Plan Amount",
        type: "number",
        style: {
          width: "9rem",
        },
      },
      plandiscount: {
        title: "Plan Discount",
        type: "number",
        style: {
          width: "9rem",
        },
      },
      netamount: {
        title: "Net Amount",
        type: "number",
        style: {
          width: "9rem",
        },
      },
      cash: {
        title: "Cash",
        type: "number",
        style: {
          width: "8rem",
        },
      },
      modifiedCash: {
        title: "Actual Cash",
        type: "input",
        style: {
          width: "9rem",
        },
      },
      cheque: {
        title: "Cheque",
        type: "number",
        style: {
          width: "9rem",
        },
      },
      modifiedCheqAmt: {
        title: "Actual Cheque Amount",
        type: "input",
        style: {
          width: "12rem",
        },
      },
      chequeNo: {
        title: "Cheque No",
        type: "input",
        style: {
          width: "9rem",
        },
      },
      dd: {
        title: "DD",
        type: "number",
        style: {
          width: "5rem",
        },
      },
      modifiedDDAmt: {
        title: "Actual DD Amount",
        type: "input",
        style: {
          width: "9rem",
        },
      },
      ddnumber: {
        title: "DD Number",
        type: "input",
        style: {
          width: "9rem",
        },
      },
      creditCard: {
        title: "Credit Card",
        type: "number",
        style: {
          width: "9rem",
        },
      },
      modifiedCCAmt: {
        title: "Actual CC Amount",
        type: "input",
        style: {
          width: "9rem",
        },
      },
      batchno: {
        title: "Authorization Code",
        type: "input",
        style: {
          width: "9rem",
        },
      },
      mobilePayment: {
        title: "Cash Payment By Mobile",
        type: "number",
        style: {
          width: "12rem",
        },
      },
      modifiedCashPaymentMobile: {
        title: "Actual Cash Payment",
        type: "input",
        style: {
          width: "12rem",
        },
      },
      onlinePayment: {
        title: "Online Payment",
        type: "number",
        style: {
          width: "9rem",
        },
      },
      modifiedOnlinePayment: {
        title: "Actual online Payment",
        type: "input",
        style: {
          width: "14rem",
        },
      },
      onlinePaymentDetails: {
        title: "Transaction ID",
        type: "input",
        style: {
          width: "9rem",
        },
      },
      dues: {
        title: "Dues",
        type: "number",
        style: {
          width: "9rem",
        },
      },
      tdsamount: {
        title: "TDS Amount",
        type: "number",
        style: {
          width: "9rem",
        },
      },
      totalamount: {
        title: "Total Amount",
        type: "number",
        style: {
          width: "9rem",
        },
      },
      upiAmt: {
        title: "UPI Amount",
        type: "string",
        style: {
          width: "9rem",
        },
      },
      modifiedUPIAmt: {
        title: "Actual UPI Amount",
        type: "input",
        style: {
          width: "9rem",
        },
      },
      donationAmount: {
        title: "Internet Payment Amt",
        type: "number",
        style: {
          width: "12rem",
        },
      },
      modifiedDonationAmount: {
        title: "Actual Internet Payment",
        type: "input",
        style: {
          width: "14rem",
        },
      },
    },
  };
  config1: any = {
    displayedColumns: [
      "sno",
      "receiptNo",
      "billno",
      "datetime",
      "billamount",
      "refund",
      "depositamount",
      "discountamount",
      // "planamount",
      // "plandiscount",
      // "netamount",
    ],
    rowLayout: { dynamic: { rowClass: "row['forclr']" } },
    columnsInfo: {
      sno: {
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
        type: "string",
        style: {
          width: "9rem",
        },
      },
      billamount: {
        title: "Bill Amount",
        type: "number",
        style: {
          width: "9.5rem",
        },
      },
      refund: {
        title: "Refund Amount",
        type: "number",
        style: {
          width: "8rem",
        },
      },
      depositamount: {
        title: "Deposit Amount",
        type: "number",
        style: {
          width: "9rem",
        },
      },
      discountamount: {
        title: "Discount Amount",
        type: "number",
        style: {
          width: "9rem",
        },
      },
      // planamount: {
      //   title: "Plan Amount",
      //   type: "number",
      //   style: {
      //     width: "9rem",
      //   },
      // },
      // plandiscount: {
      //   title: "Plan Discount",
      //   type: "number",
      //   style: {
      //     width: "9rem",
      //   },
      // },
      // netamount: {
      //   title: "Net Amount",
      //   type: "number",
      //   style: {
      //     width: "9rem",
      //   },
      // }
    },
  };
  display: boolean = true;
  @ViewChild("table") table: any;
  ackbtn: boolean = false;
  modifybtn: boolean = false;
  clearbtn: boolean = false;
  printbtn: boolean = false;
  makereadonly: boolean = false;

  apiProcessing: boolean = false;
  constructor(
    private formService: QuestionControlService,
    private router: Router,
    private dialogservice: MessageDialogService,
    private http: HttpClient,
    private datepipe: DatePipe,
    private differservice: KeyValueDiffers,
    public cookie: CookieService,
    private reportService: ReportService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.cashscrollModifyData.properties,
      {}
    );
    this.cashscrollmodifyForm = formResult.form;
    this.questions = formResult.questions;
    var scrollno: any;
    this.route.queryParams.subscribe((params: any) => {
      console.log(params.scrollno);
      scrollno = params.scrollno;
    });
    if (Number(scrollno) >= 0) {
      this.apiProcessing = true;
      this.http
        .get(
          ApiConstants.getdetaileddataforoldscrollerp(
            scrollno,
            Number(this.cookie.get("StationId"))
          )
        )
        .pipe(takeUntil(this._destroying$))
        .subscribe(
          (data: any) => {
            console.log(data);
            if (data != null && data.getERPscrollMainDto.length != 0) {
              this.scrolldataObject = data as ModifyCashScrollInterface;
              console.log(this.scrolldataObject);
              this.billList = this.scrolldataObject.getERPscrollDetailDto;
              this.filltable();
              setTimeout(() => {
                this.apiProcessing = false;
              }, 500);
            } else {
              this.ackbtn = true;
              this.modifybtn = true;
              this.clearbtn = true;
              this.printbtn = true;
              this.apiProcessing = false;
            }
          },
          (error) => {
            console.log(error);
            this.apiProcessing = false;
          }
        );
    } else {
      this.ackbtn = true;
      this.modifybtn = true;
      this.clearbtn = true;
      this.printbtn = true;
      this.apiProcessing = false;
    }
  }
  ngAfterViewInit() {
    this.questions[0].elementRef.addEventListener("keypress", (event: any) => {
      if (event.key == "Enter") {
        console.log(this.cashscrollmodifyForm.controls["billreceiptno"].value);
        if (this.cashscrollmodifyForm.controls["billreceiptno"].value != "") {
          this.filtercall();
        }
      }
    });
    this.cashscrollmodifyForm.controls["billreceiptno"].valueChanges.subscribe(
      (res) => {
        if (res != "") {
          this.filtercall();
        }
      }
    );
    console.log(this.table);
    setTimeout(() => {
      this.differ = this.differservice.find(this.table).create();
    }, 1000);
  }
  netamount: any = 0;
  filltable() {
    if (this.scrolldataObject.getERPscrollMainDto[0].ackCashier == 0) {
      this.ackbtn = true;
      this.modifybtn = false;
      this.makereadonly = false;
      this.display = true;
    } else {
      this.ackbtn = true;
      this.modifybtn = true;
      this.makereadonly = true;
      this.display = false;
      // this.dialogservice.info('Scroll has been modified');
    }
    this.cashscrollmodifyForm.controls["employeename"].setValue(
      this.scrolldataObject.getERPscrollMainDto[0].name
    );
    this.cashscrollmodifyForm.controls["fromdate"].setValue(
      this.datepipe.transform(
        this.scrolldataObject.getERPscrollMainDto[0].fromdatetime,
        "dd/MM/YYYY hh:mm:ss a"
      )
    );
    this.cashscrollmodifyForm.controls["todate"].setValue(
      this.datepipe.transform(
        this.scrolldataObject.getERPscrollMainDto[0].todatetime,
        "dd/MM/YYYY hh:mm:ss a"
      )
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
    var i = 1;
    this.scrolldataObject.getERPscrollDetailDto.forEach((item) => {
      this.netamount += Number(item.billamount);
      item.sno = i++;
      item.billamount = Number(item.billamount).toFixed(2);
      item.refund = Number(item.refund).toFixed(2);
      item.depositamount = Number(item.depositamount).toFixed(2);
      item.discountamount = Number(item.discountamount).toFixed(2);
      item.planamount = Number(item.planamount).toFixed(2);
      item.plandiscount = Number(item.plandiscount).toFixed(2);
      item.netamount = Number(item.netamount).toFixed(2);
      item.cash = Number(item.cash).toFixed(2);
      item.modifiedCash = Number(item.cash).toFixed(2);
      item.cheque = Number(item.cheque).toFixed(2);
      item.modifiedCheqAmt =
        Number(item.cheque) != 0
          ? Number(item.cheque).toFixed(2)
          : Number(item.modifiedCheqAmt).toFixed(2);
      item.dd = Number(item.dd).toFixed(2);
      item.dues = Number(item.dues).toFixed(2);
      item.tdsamount = Number(item.tdsamount).toFixed(2);
      item.totalamount = Number(item.netamount).toFixed(2);
      item.donationAmount = Number(item.donationAmount).toFixed(2);
      item.modifiedDonationAmount = Number(item.modifiedDonationAmount).toFixed(
        2
      );
      item.modifiedCashPaymentMobile =
        Number(item.mobilePayment) != 0
          ? Number(item.mobilePayment).toFixed(2)
          : Number(item.modifiedCashPaymentMobile).toFixed(2);
      item.modifiedDDAmt =
        Number(item.dd) != 0
          ? Number(item.dd).toFixed(2)
          : Number(item.modifiedDDAmt).toFixed(2);
      item.creditCard = Number(item.creditCard).toFixed(2);
      item.modifiedCCAmt =
        Number(item.creditCard) != 0
          ? Number(item.creditCard).toFixed(2)
          : Number(item.modifiedCCAmt).toFixed(2);
      item.mobilePayment = Number(item.mobilePayment).toFixed(2);
      item.modifiedCashMobileDetails =
        Number(item.mobilePayment) != 0
          ? Number(item.mobilePayment).toFixed(2)
          : Number(item.modifiedCashMobileDetails).toFixed(2);
      item.onlinePayment = Number(item.onlinePayment).toFixed(2);
      item.modifiedOnlinePayment =
        Number(item.onlinePayment) != 0
          ? Number(item.onlinePayment).toFixed(2)
          : Number(item.modifiedOnlinePayment).toFixed(2);
      item.upiAmt = Number(item.upiAmt).toFixed(2);
      item.modifiedUPIAmt =
        Number(item.upiAmt) != 0
          ? Number(item.upiAmt).toFixed(2)
          : Number(item.modifiedUPIAmt).toFixed(2);
      item.mobilePayment = Number(item.mobilePayment).toFixed(2);
      item.chequeNo = this.isNull(item.chequeNo);
      item.batchno = this.isNull(item.batchno);
      item.onlinePaymentDetails = this.isNull(item.onlinePaymentDetails);
    });
    console.log(this.table);
  }

  filtercall() {
    var value = this.cashscrollmodifyForm.controls["billreceiptno"].value;
    this.scrolldataObject.getERPscrollDetailDto.forEach((item) => {
      if (item.billno == value || item.receiptNo == value) {
        item.forclr = "rowcolorchange";
        // var tab = document.getElementsByTagName('tr');
        // var cls = document.getElementsByClassName('rowcolorchange');
        // setTimeout(() => {
        //   tab[item.sno - 1].scrollIntoView({
        //     behavior: 'smooth',
        //     block: 'center'
        //   })
        // }, 100);
      } else {
        item.forclr = "";
      }
    });
  }
  isNull(value: any) {
    if (value == null) return "";
    else return value;
  }
  navigatetomain() {
    this.router.navigate(["out-patient-billing", "cash-scroll"]);
  }
  acknowledge() {
    this.dialogservice.success("Scroll Has Been Acknowledged");
  }
  print() {
    this.openReportModal("CashScrollReport");
  }
  openReportModal(btnname: string) {
    this.reportService.openWindow("Cash Scroll Report", btnname, {
      Fromdate: this.scrolldataObject.getERPscrollMainDto[0].fromdatetime,
      Todate: this.scrolldataObject.getERPscrollMainDto[0].todatetime,
      Operatorid: this.scrolldataObject.getERPscrollMainDto[0].operatorid,
      LocationID: this.cookie.get("HSPLocationId"),
      EmployeeName: this.scrolldataObject.getERPscrollMainDto[0].name,
      EmployeeID: this.cookie.get("UserName"),
      TimeTakenAt: this.scrolldataObject.getERPscrollMainDto[0].scrolldatetime,
      ack: this.scrolldataObject.getERPscrollMainDto[0].ackOperator,
      IsAckByOperator:
        this.scrolldataObject.getERPscrollMainDto[0].ackCashier == 1
          ? true
          : false,
      ScrollNo: Number(
        this.scrolldataObject.getERPscrollMainDto[0].stationslno
      ),
    });
  }
  clear() {
    this.cashscrollmodifyForm.reset();
    this.ngOnInit();
  }

  ngDoCheck() {
    if (this.scrolldataObject) {
      if (this.differ) {
        const changes = this.differ.diff(this.table);
        this.totalvaluecheck();
      }
    }
  }
  totalcash: any = 0;
  totalcheque: any = 0;
  totalcredit: any = 0;
  totaldemand: any = 0;
  totalonline: any = 0;
  totalupi: any = 0;
  totalmobile: any = 0;
  totalinternet: any = 0;
  totalamount: any = 0;
  dues: any = 0;
  totalvaluecheck() {
    this.totalcash = 0;
    this.totalcheque = 0;
    this.totalcredit = 0;
    this.totaldemand = 0;
    this.totalonline = 0;
    this.totalupi = 0;
    this.totalmobile = 0;
    this.totalinternet = 0;
    this.dues = 0;
    this.scrolldataObject.getERPscrollDetailDto.forEach((item) => {
      this.totalcash += Number(item.modifiedCash);
      this.totalcheque += Number(item.modifiedCheqAmt);
      this.totalcredit += Number(item.modifiedCCAmt);
      this.totaldemand += Number(item.modifiedDDAmt);
      this.totalonline += Number(item.modifiedOnlinePayment);
      this.totalupi += Number(item.modifiedUPIAmt);
      this.totalmobile += Number(item.modifiedCashPaymentMobile);
      this.totalinternet += Number(item.modifiedDonationAmount);
      this.dues += Number(item.dues);
      this.totalamount =
        this.totalcash +
        this.totalcheque +
        this.totalcredit +
        this.totaldemand +
        this.totalonline +
        this.totalupi +
        this.totalmobile +
        this.totalinternet +
        this.dues;
    });
    this.cashscrollmodifyForm.controls["totalcash"].setValue(
      this.totalcash.toFixed(2)
    );
    this.cashscrollmodifyForm.controls["totalcheque"].setValue(
      this.totalcheque.toFixed(2)
    );
    this.cashscrollmodifyForm.controls["totalcc"].setValue(
      this.totalcredit.toFixed(2)
    );
    this.cashscrollmodifyForm.controls["totaldd"].setValue(
      this.totaldemand.toFixed(2)
    );
    this.cashscrollmodifyForm.controls["totalonline"].setValue(
      this.totalonline.toFixed(2)
    );
    this.cashscrollmodifyForm.controls["totalupi"].setValue(
      this.totalupi.toFixed(2)
    );
    this.cashscrollmodifyForm.controls["totalmobile"].setValue(
      this.totalmobile.toFixed(2)
    );
    this.cashscrollmodifyForm.controls["totalinternetpayment"].setValue(
      this.totalinternet.toFixed(2)
    );
  }
  modify() {
    var cashflag = 0,
      otherflag = 0,
      chequeflag = 0,
      ccflag = 0,
      ddflag = 0,
      onlineflag = 0;
    var billforcash,
      billforother,
      billforcheque,
      billforcc,
      billfordd,
      billforonline;
    this.scrolldataObject.getERPscrollDetailDto.forEach((item) => {
      //Cash
      if (item.netamount != 0) {
        if (
          item.modifiedCash < item.netamount ||
          item.modifiedCash > item.netamount
        ) {
          //Number(item.depositamount) +  Math.abs(Number(item.discountamount)) +
          var total =
            Number(item.dues) +
            Number(item.modifiedCash) +
            Number(item.modifiedCCAmt) +
            Number(item.modifiedCheqAmt) +
            Number(item.modifiedDDAmt) +
            Number(item.modifiedCashPaymentMobile) +
            Number(item.modifiedOnlinePayment) +
            Number(item.modifiedUPIAmt) +
            Number(item.modifiedDonationAmount);
          if (Number(total) == Number(item.netamount)) {
          } else {
            cashflag = 1;
            billforcash = item.billno;
          }
          console.log(
            Number(item.depositamount),
            Math.abs(Number(item.discountamount)),
            Number(item.dues),
            Number(item.modifiedCash),
            Number(item.modifiedCCAmt),
            Number(item.modifiedCheqAmt),
            Number(item.modifiedDDAmt),
            Number(item.modifiedCashPaymentMobile),
            Number(item.modifiedOnlinePayment),
            Number(item.modifiedUPIAmt),
            Number(item.modifiedDonationAmount)
          );
          console.log(item.receiptNo, Number(total), Number(item.netamount));
          return;
        }

        if (
          Number(item.modifiedCheqAmt) > 0 ||
          Number(item.modifiedDDAmt) > 0 ||
          Number(item.modifiedCCAmt) > 0 ||
          Number(item.modifiedCashPaymentMobile) > 0 ||
          Number(item.modifiedOnlinePayment) > 0 ||
          Number(item.modifiedUPIAmt) > 0 ||
          Number(item.modifiedDonationAmount) > 0
        ) {
          var total =
            Number(item.dues) +
            Number(item.modifiedCash) +
            Number(item.modifiedCCAmt) +
            Number(item.modifiedCheqAmt) +
            Number(item.modifiedDDAmt) +
            Number(item.modifiedCashPaymentMobile) +
            Number(item.modifiedOnlinePayment) +
            Number(item.modifiedUPIAmt) +
            Number(item.modifiedDonationAmount);
          console.log(Number(total), Number(item.netamount));
          if (Number(total) == Number(item.netamount)) {
          } else {
            otherflag = 1;
            billforother = item.billno;
          }
          console.log(Number(total), Number(item.netamount));
        }

        //cheque
        if (
          Number(item.modifiedCheqAmt) != 0 &&
          (item.chequeNo == "" ||
            item.chequeNo == null ||
            Number(item.chequeNo) == 0)
        ) {
          chequeflag = 1;
          billforcheque = item.billno;
        }

        //credit card
        if (
          Number(item.modifiedCCAmt) != 0 &&
          (item.batchno == "" ||
            item.batchno == null ||
            Number(item.batchno) == 0)
        ) {
          ccflag = 1;
          billforcc = item.billno;
        }

        //DD
        if (
          Number(item.modifiedDDAmt) != 0 &&
          (item.ddnumber == "" ||
            item.ddnumber == null ||
            Number(item.ddnumber) == 0)
        ) {
          ddflag = 1;
          billfordd = item.billno;
        }

        //Online
        if (
          Number(item.modifiedOnlinePayment) != 0 &&
          (item.onlinePaymentDetails == "" ||
            item.onlinePaymentDetails == null ||
            Number(item.onlinePaymentDetails) == 0)
        ) {
          onlineflag = 1;
          billforonline = item.billno;
        }
      }
    });
    if (cashflag == 1) {
      this.dialogservice.info(
        "Cannot save scroll Total Actual Amount Does not match Net Amount for Bill No: " +
          billforcash
      );
    } else if (otherflag == 1) {
      this.dialogservice.info(
        "Cannot save scroll Total Actual Amount Does not match Net Amount for Bill No: " +
          billforother
      );
    } else if (chequeflag == 1) {
      this.dialogservice.info(
        "Cheque No Cannot Be Blank for Bill No: " + billforcheque
      );
    } else if (ccflag == 1) {
      this.dialogservice.info(
        "Credit Card Authorization Code Cannot Be Blank for Bill No: " +
          billforcc
      );
    } else if (ddflag == 1) {
      this.dialogservice.info(
        "DD Number Cannot Be Blank for Bill No: " + billfordd
      );
    } else if (onlineflag == 1) {
      this.dialogservice.info(
        "Online TransactionID Cannot Be Blank for Bill No: " + billforonline
      );
    } else {
      this.apiProcessing = true;
      this.http
        .post(ApiConstants.ackdetailsforscroll, this.modifyrequestbody())
        .pipe(takeUntil(this._destroying$))
        .subscribe((res: any) => {
          console.log(res);
          if (res.success == true) {
            this.apiProcessing = false;
            const dialogref = this.dialogservice.success(res.message);
            dialogref.afterClosed().subscribe(() => {
              this.ngOnInit();
            });
          }
        });
    }
  }

  modifyrequestbody() {
    this.ackdetailsreqbody.dT_EXCELforScroll = [] as Array<dtExcelforScroll>;
    this.ackdetailsreqbody.fromdate =
      this.scrolldataObject.getERPscrollMainDto[0].fromdatetime;
    this.ackdetailsreqbody.todate =
      this.scrolldataObject.getERPscrollMainDto[0].todatetime;
    this.scrolldataObject.getERPscrollDetailDto.forEach((item) => {
      this.ackdetailsreqbody.totdisc += Number(item.discountamount);
      this.ackdetailsreqbody.totcash += Number(item.cash);
      this.ackdetailsreqbody.ccamt += Number(item.creditCard);
      this.ackdetailsreqbody.cheque += Number(item.cheque);
      this.ackdetailsreqbody.totdues += Number(item.dues);
      this.ackdetailsreqbody.totrefund += Number(item.refund);
      this.ackdetailsreqbody.gross += Number(item.totalamount);
      this.ackdetailsreqbody.netamt += Number(item.netamount);
      this.ackdetailsreqbody.duereceived += Number(item.duesrec);
      this.ackdetailsreqbody.totalamt += Number(item.totalamount);
      this.ackdetailsreqbody.totdd += Number(item.dd);
      this.ackdetailsreqbody.totplanamt += Number(item.planamount);
      this.ackdetailsreqbody.totplandiscount += Number(item.plandiscount);
      this.ackdetailsreqbody.totaltds += Number(item.tdsamount);
      this.ackdetailsreqbody.totaldeposit += Number(item.depositamount);
      this.ackdetailsreqbody.mobilePayment += Number(item.mobilePayment);
      this.ackdetailsreqbody.onlinePayment += Number(item.onlinePayment);
      this.ackdetailsreqbody.upiAmt += Number(item.upiAmt);
    });
    this.ackdetailsreqbody.scrolldate =
      this.scrolldataObject.getERPscrollMainDto[0].scrolldatetime;
    this.ackdetailsreqbody.modifiedCheqAmt = this.totalcheque;
    this.ackdetailsreqbody.modifiedCCAmt = this.totalcredit;
    this.ackdetailsreqbody.modifiedDDAmt = this.totaldemand;
    this.ackdetailsreqbody.modifiedCash = this.totalcash;
    this.ackdetailsreqbody.modifiedCashPaymentMobile = this.totalmobile;
    this.ackdetailsreqbody.modifiedOnlinePayment = this.totalonline;
    this.ackdetailsreqbody.modifiedUPIAmount = this.totalupi;
    this.ackdetailsreqbody.scrollID =
      this.scrolldataObject.getERPscrollMainDto[0].stationslno;
    this.ackdetailsreqbody.stationid = Number(this.cookie.get("StationId"));
    this.ackdetailsreqbody.isAckCashier = true;
    this.ackdetailsreqbody.operatorId = Number(this.cookie.get("UserId"));
    this.ackdetailsreqbody.hsplocationId = Number(
      this.cookie.get("HSPLocationId")
    );
    this.scrolldataObject.getERPscrollDetailDto.forEach((item) => {
      this.ackdetailsreqbody.dT_EXCELforScroll.push({
        slNo: Number(item.sno),
        receiptNo: String(item.receiptNo),
        billNo: String(item.billno),
        dateTime: moment(item.datetime.trim(), "DD/MM/YYYY[T]HH:mm:ss").format(
          "YYYY-MM-DD[T]HH:mm:ss"
        ),
        billAmount: String(item.billamount),
        refund: String(item.refund),
        depositamount: String(item.depositamount),
        discountAmount: String(item.discountamount),
        planAmount: String(item.planamount),
        planDiscount: String(item.plandiscount),
        netAmount: String(item.netamount),
        cash:
          Number(item.modifiedCash) > 0
            ? String(item.modifiedCash)
            : String(item.cash),
        cheque:
          Number(item.modifiedCheqAmt) > 0
            ? String(item.modifiedCheqAmt)
            : String(item.cheque),
        dd: String(item.dd),
        creaditCard:
          Number(item.modifiedCCAmt) > 0
            ? String(item.modifiedCCAmt)
            : String(item.creditCard),
        cashpaymentbyMobile: String(item.mobilePayment),
        onlinePayment: String(item.onlinePayment),
        dues: String(item.dues),
        tdsAmount: String(item.tdsamount),
        totalAmount: String(item.totalamount),
        modifiedCheqAmt: String(item.modifiedCheqAmt),
        modifiedCCAmt: String(item.modifiedCCAmt),
        modifiedDDAmt: String(item.modifiedDDAmt),
        modifiedCash: String(item.modifiedCash),
        chequeNo: String(item.chequeNo),
        creditCardNo: String(item.batchno),
        modifiedCashPaymentMobile: String(item.modifiedCashPaymentMobile),
        modifiedDDNumber: String(item.ddnumber),
        modifiedOnlinePayment: String(item.modifiedOnlinePayment),
        onlinePaymentDetails: String(item.onlinePaymentDetails),
        operatorName: this.cookie.get("UserName"),
        duereceved: String(item.duesrec),
        batchno: String(item.batchno),
        upiAmt: String(item.upiAmt),
        modifiedUPIAmount: Number(item.modifiedUPIAmt),
        upiPaymentDetails: Number(item.upiPaymentDetails),
      });
    });
    console.log(this.ackdetailsreqbody);
    return this.ackdetailsreqbody;
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
