import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { CookieService } from "@shared/services/cookie.service";
import { Router, ActivatedRoute } from "@angular/router";
import { ApiConstants } from "@core/constants/ApiConstants";
import { HttpClient } from "@angular/common/http";
import { MessageDialogService } from "@shared/ui/message-dialog/message-dialog.service";
import { getdataForScrollMain } from "@core/types/cashscroll/getscrollmain.Interface";
import { DatePipe } from "@angular/common";
import { CashScrollNewDetail } from "@core/models/cashscrollNewModel.Model";
import { savecashscroll } from "@core/models/savecashscrollModel.Model";
import { ReportService } from "@shared/services/report.service";
import { GetDataForOldScroll } from "@core/types/cashscroll/getdataforoldscroll.Interface";

@Component({
  selector: "out-patients-cash-scroll-new",
  templateUrl: "./cash-scroll-new.component.html",
  styleUrls: ["./cash-scroll-new.component.scss"],
})
export class CashScrollNewComponent implements OnInit {
  questions: any;
  @ViewChild("cashscrollnewtable") cashScrollNewTable!: any;

  constructor(
    private formService: QuestionControlService,
    private cookie: CookieService,
    private router: Router,
    private http: HttpClient,
    private dialogservice: MessageDialogService,
    private datepipe: DatePipe,
    private reportService: ReportService,
    private route: ActivatedRoute
  ) {
    this.route.queryParams
      .pipe(takeUntil(this._destroying$))
      .subscribe(async (value) => {
        console.log(Object.keys(value).length);
        if (Object.keys(value).length > 0) {
          this.getoldscroll(value["scrollno"]);
        }
      });
  }

  cashscrollnewformdata = {
    type: "object",
    title: "",
    properties: {
      employeename: {
        type: "string",
        readonly: true,
      },
      scrollno: {
        type: "string",
        readonly: true,
      },
      takenat: {
        type: "string",
        readonly: true,
      },
      fromdate: {
        type: "datetime",
      },
      todate: {
        type: "datetime",
      },
    },
  };
  cashscrollnewconfig: any = {
    clickedRows: true,
    clickSelection: "single",
    dateformat: "dd/MM/yyyy - HH:mm:ss",
    selectBox: false,
    footer: true,
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
      "cheque",
      "dd",
      "creditcard",
      "mobilePayment",
      "onlinePayment",
      "dues",
      "tdsamount",
      "donation",
      "upiamount",
      "totalamount",
      "compName",
    ],
    rowLayout: { dynamic: { rowClass: "row['rowhighlight']" } },
    columnsInfo: {
      sno: {
        title: "S.No",
        type: "string",
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
        type: "date",
        style: {
          width: "9rem",
        },
      },
      billamount: {
        title: "Bill Amount",
        type: "number",
        style: {
          width: "9rem",
        },
      },
      refund: {
        title: "Refund",
        type: "number",
        style: {
          width: "9rem",
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
        type: "string",
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
      dd: {
        title: "DD",
        type: "number",
        style: {
          width: "9rem",
        },
      },
      creditcard: {
        title: "Credit Card",
        type: "number",
        style: {
          width: "9rem",
        },
      },
      mobilePayment: {
        title: "Cash Payment by Mobile",
        type: "number",
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
      donation: {
        title: "Donation",
        type: "number",
        style: {
          width: "8rem",
        },
      },
      upiamount: {
        title: "UPI Amount",
        type: "string",
        style: {
          width: "9rem",
        },
      },
      totalamount: {
        title: "Total Amount",
        type: "string",
        style: {
          width: "9rem",
        },
      },
      compName: {
        title: "Company Name",
        type: "string",
        tooltipColumn: "compName",
        style: {
          width: "10rem",
        },
      },
    },
  };
  cashscrollnewForm!: FormGroup;
  scrolldetailsexists: boolean = true;
  printsexists: boolean = true;
  excelexists: boolean = true;
  lastUpdatedBy: string = "";
  EmployeeName: string = "";
  currentTime: string = new Date().toLocaleString();
  queryparamssearch: boolean = false;
  takenat: any;
  apiProcessing: boolean = false;
  uniquescrollnumber!: GetDataForOldScroll;

  private readonly _destroying$ = new Subject<void>();
  fromdatedetails: string | undefined;
  scrolldetailsList: any = [];

  hsplocationId:any = Number(this.cookie.get("HSPLocationId"));
  stationId:any = Number(this.cookie.get("StationId"));
  operatorID:any = Number(this.cookie.get("UserId"));


  fromdatedisable: boolean = false;
  todatedisable: boolean = false;
  scrollno: string | undefined;
  billamount: number = 0;
  refund: number = 0;
  depositamount: number = 0;
  discountamount: number = 0;
  planamount: number = 0;
  plandiscount: number = 0;
  netamount: number = 0;
  cash: number = 0;
  cheque: number = 0;
  dd: number = 0;
  creditcard: number = 0;
  dues: number = 0;
  tdsamount: number = 0;
  duereceved: number = 0;
  mobilePayment: number = 0;
  OnlinePayment: number = 0;
  DonationAmount: number = 0;
  UPIAmt: number = 0;

  tableFooterData: any = {};

  ngOnInit(): void {
    console.log("inside cash scroll new");
    let formResult = this.formService.createForm(
      this.cashscrollnewformdata.properties,
      {}
    );
    this.cashscrollnewForm = formResult.form;
    this.questions = formResult.questions;

    this.lastUpdatedBy = this.cookie.get("UserName");
    this.EmployeeName = this.cookie.get("Name");
    this.cashscrollnewForm.controls["fromdate"].disable();
    this.fromdatedisable = true;
    this.todatedisable = false;
    if (this.queryparamssearch) {
      this.todatedisable = true;
      this.cashscrollnewForm.controls["todate"].disable();
      this.cashscrollnewForm.controls["scrollno"].setValue(this.scrollno);
      this.printsexists = false;
      this.excelexists = false;
    } else {
      this.formint();
    }
  }

  formint() {
    this.getdetailsfornewscroll();
    this.cashscrollnewForm.controls["todate"].enable();
    this.cashscrollnewForm.controls["takenat"].setValue(
      this.datepipe.transform(this.currentTime, "dd/MM/yyyy hh:mm:ss a")
    );
    this.cashscrollnewForm.controls["todate"].setValue(
      this.datepipe.transform(this.currentTime, "YYYY-MM-ddTHH:mm:ss")
    );
    this.cashscrollnewForm.controls["employeename"].setValue(this.EmployeeName);
    this.takenat = new Date();
  }
  opencashscroll() {
    this.router.navigate(["report/cash-scroll", "cash-scroll"]);
  }

  getdetailsfornewscroll() {
    this.http
      .get(
        ApiConstants.getdetailsforcashscroll(this.operatorID, this.stationId)
      )
      .pipe(takeUntil(this._destroying$))
      .subscribe((resultdata) => {
        let cashdetails;
        let fromdatetime, todatetime;
        cashdetails = resultdata as getdataForScrollMain;
        fromdatetime =
          cashdetails.getDetailsForMainScrollDatetime[0].todatetime;
        todatetime =
          cashdetails.getDetailsForMainScrollDatetime[0].currentDateTime;

        if(fromdatetime == null || fromdatetime == undefined || fromdatetime == "")
        {
          this.cashscrollnewForm.controls["fromdatetime"].setValue(
            this.datepipe.transform(this.currentTime, "YYYY-MM-ddTHH:mm:ss")
          );
        }
        else
        {
          this.cashscrollnewForm.controls["fromdate"].setValue(
            this.datepipe.transform(fromdatetime, "YYYY-MM-ddTHH:mm:ss.SSS")
          );
        }
       
        this.cashscrollnewForm.controls["todate"].setValue(
          this.datepipe.transform(todatetime, "YYYY-MM-ddTHH:mm:ss.SSS")
        );
      }, (error) =>{
        console.log(error)
      });
  }

  viewscrolldetails() {
    let todaysdate;
    todaysdate = new Date();   
    if (this.cashscrollnewForm.controls["todate"].value > todaysdate) {
      this.dialogservice.error("To Date Can Not be greater then Current Date");
    } else {
      this.apiProcessing = true;
      this.http
        .get(
          ApiConstants.getscrolldetailsforoneuser(
            this.datepipe.transform(
              this.cashscrollnewForm.controls["fromdate"].value,
              "yyyy-MM-ddTHH:mm:ss"
            ) || "",
            this.datepipe.transform(
              this.cashscrollnewForm.controls["todate"].value,
              "yyyy-MM-ddTHH:mm:ss"
            ) || "",
            this.operatorID,
            this.stationId,
            this.hsplocationId
          )
        )
        .pipe(takeUntil(this._destroying$))
        .subscribe(
          (resultdata) => {
            this.scrolldetailsList = resultdata as CashScrollNewDetail[];
            if (this.scrolldetailsList.length == 0) {
              this.scrolldetailsList = [];
              this.apiProcessing = false;
            } else {
              this.scrolldetailsexists = false;
              this.todatedisable = true;
              this.cashscrollnewForm.controls["todate"].disable();
              for (var i = 0; i < this.scrolldetailsList.length; i++) {
                this.scrolldetailsList[i].sno = i + 1;
              }
              this.apiProcessing = false;
              this.billamount = this.scrolldetailsList
                .map((t: any) => t.billamount)
                .reduce((acc: any, value: any) => acc + value, 0);
              this.refund = this.scrolldetailsList
                .map((t: any) => t.refund)
                .reduce((acc: any, value: any) => acc + value, 0);
              this.depositamount = this.scrolldetailsList
                .map((t: any) => t.depositamount)
                .reduce((acc: any, value: any) => acc + value, 0);
              this.discountamount = this.scrolldetailsList
                .map((t: any) => t.discountamount)
                .reduce((acc: any, value: any) => acc + value, 0);
              this.planamount = this.scrolldetailsList
                .map((t: any) => t.planamount)
                .reduce((acc: any, value: any) => acc + value, 0);

              this.plandiscount = this.scrolldetailsList
                .map((t: any) => t.plandiscount)
                .reduce((acc: any, value: any) => acc + value, 0);
              this.netamount = this.scrolldetailsList
                .map((t: any) => t.netamount)
                .reduce((acc: any, value: any) => acc + value, 0);
              this.cash = this.scrolldetailsList
                .map((t: any) => t.cash)
                .reduce((acc: any, value: any) => acc + value, 0);
              this.cheque = this.scrolldetailsList
                .map((t: any) => t.cheque)
                .reduce((acc: any, value: any) => acc + value, 0);
              this.duereceved = this.scrolldetailsList
                .map((t: any) => t.duesrec)
                .reduce((acc: any, value: any) => acc + value, 0);

              this.dd = this.scrolldetailsList
                .map((t: any) => t.dd)
                .reduce((acc: any, value: any) => acc + value, 0);
              this.creditcard = this.scrolldetailsList
                .map((t: any) => t.creditCard)
                .reduce((acc: any, value: any) => acc + value, 0);
              this.mobilePayment = this.scrolldetailsList
                .map((t: any) => t.mobilePayment)
                .reduce((acc: any, value: any) => acc + value, 0);
              this.OnlinePayment = this.scrolldetailsList
                .map((t: any) => t.onlinePayment)
                .reduce((acc: any, value: any) => acc + value, 0);
              this.dues = this.scrolldetailsList
                .map((t: any) => t.dues)
                .reduce((acc: any, value: any) => acc + value, 0);
              this.tdsamount = this.scrolldetailsList
                .map((t: any) => t.tdsamount)
                .reduce((acc: any, value: any) => acc + value, 0);
              this.DonationAmount = this.scrolldetailsList
                .map((t: any) => t.donationAmount)
                .reduce((acc: any, value: any) => acc + value, 0);
              this.UPIAmt = this.scrolldetailsList
                .map((t: any) => t.upiAmt)
                .reduce((acc: any, value: any) => acc + value, 0);

              this.scrolldetailsList = this.scrolldetailsList.map(
                (item: any) => {
                  item.billamount = parseFloat(item.billamount).toFixed(2);
                  item.refund = parseFloat(item.refund).toFixed(2);
                  item.depositamount = parseFloat(item.depositamount).toFixed(
                    2
                  );
                  item.planamount = parseFloat(item.planamount).toFixed(2);
                  item.discountamount = parseFloat(item.discountamount).toFixed(
                    2
                  );
                  item.plandiscount = parseFloat(item.plandiscount).toFixed(2);
                  item.netamount = parseFloat(item.netamount).toFixed(2);
                  item.cash = parseFloat(item.cash).toFixed(2);
                  item.cheque = parseFloat(item.cheque).toFixed(2);
                  item.dd = parseFloat(item.dd).toFixed(2);
                  item.creditcard =
                    item.creditcard == undefined
                      ? "0.00"
                      : parseFloat(item.creditcard).toFixed(2);
                  item.mobilePayment =
                    item.mobilePayment == undefined
                      ? "0.00"
                      : parseFloat(item.mobilePayment).toFixed(2);
                  item.onlinePayment =
                    item.onlinePayment == undefined
                      ? "0.00"
                      : parseFloat(item.onlinePayment).toFixed(2);
                  item.tdsamount = parseFloat(item.tdsamount).toFixed(2);
                  item.dues =
                    item.dues == undefined
                      ? "0"
                      : parseFloat(item.dues).toFixed(2);
                  item.donation =
                    item.donation == undefined
                      ? "0.00"
                      : parseFloat(item.donation).toFixed(2);
                  item.upiamount =
                    item.upiamount == undefined
                      ? "0.00"
                      : parseFloat(item.upiamount).toFixed(2);
                  item.totalamount = (
                    parseFloat(item.billamount) + parseFloat(item.donation)
                  ).toFixed(2);
                  item.rowhighlight = "";
                  return item;
                }
              );

              this.tableFooterData = {
                sno: "",
                receiptNo: "TOTAL",
                billamount: this.billamount.toFixed(2),
                refund: this.refund.toFixed(2),
                discountamount: this.discountamount.toFixed(2),
                planamount: this.planamount.toFixed(2),
                plandiscount: this.plandiscount.toFixed(2),
                depositamount: this.depositamount.toFixed(2),
                netamount: this.netamount.toFixed(2),
                cash: this.cash.toFixed(2),
                cheque: this.cheque.toFixed(2),
                dd: this.dd.toFixed(2),
                creditcard: this.creditcard.toFixed(2),
                mobilePayment: this.mobilePayment.toFixed(2),
                onlinePayment: this.OnlinePayment.toFixed(2),
                dues: this.dues.toFixed(2),
                tdsamount: this.tdsamount.toFixed(2),
                upiamount: this.UPIAmt.toFixed(2),
                donation: this.DonationAmount.toFixed(2),
                totalamount: (this.billamount + this.DonationAmount).toFixed(2),
                rowhighlight: "highlight",
              };
              console.log(resultdata);
            }
          },
          (error) => {
            this.scrolldetailsList = [];
            this.apiProcessing = false;
            this.dialogservice.error("No search found");
          }
        );
    }
  }
  resetcashscrollnew() {
    this.scrolldetailsexists = true;
    this.queryparamssearch = false;
    this.printsexists = true;
    this.excelexists = true;
    this.todatedisable = false;
    this.fromdatedisable = true;
    this.cashscrollnewForm.controls["scrollno"].setValue("");
    this.scrolldetailsList = [];
    this.tableFooterData = [];
    this.formint();
  }
  savecashscrollDetails: savecashscroll | undefined;
  savecashscroll() {
    if (!this.operatorID) {
      this.dialogservice.error("You are Not Valid User to Save Details");
    } else if (
      this.cashscrollnewForm.value.fromdate >
      this.cashscrollnewForm.value.todate
    ) {
      this.dialogservice.error("From Date cannot be greater then Todate");
    } else if (this.scrolldetailsList.length == 0) {
      this.dialogservice.error("There is no data to Save");
    } else {
      this.http
        .post(ApiConstants.savecashscroll, this.getcshscrollSubmitRequestBody())
        .pipe(takeUntil(this._destroying$))
        .subscribe((resultData) => {
          if (resultData > 0) {
            this.dialogservice.success("Scroll has been Saved");
            this.scrolldetailsexists = true;
            this.printsexists = false;
            this.excelexists = false;
            this.cashscrollnewForm.controls["scrollno"].setValue(resultData);
          } else {
            this.dialogservice.error("Invalid Station. Cannot save scroll.");
            this.scrolldetailsexists = false;
            this.printsexists = true;
            this.excelexists = true;
          }
        });
      this.excelexists = false;
    }
  }

  getcshscrollSubmitRequestBody() {
    this.savecashscrollDetails = new savecashscroll(
      this.datepipe.transform(
        this.cashscrollnewForm.controls["fromdate"].value,
        "YYYY-MM-ddTHH:mm:ss.SSS"
      ) || "{}",
      this.datepipe.transform(
        this.cashscrollnewForm.controls["todate"].value,
        "YYYY-MM-ddTHH:mm:ss.SSS"
      ) || "{}",
      this.discountamount,
      this.cash,
      this.creditcard,
      this.cheque,
      this.dues,
      this.refund,
      this.datepipe.transform(this.takenat, "YYYY-MM-ddTHH:mm:ss.SSS") || "{}",
      this.billamount,
      this.netamount,
      this.duereceved,
      this.billamount,
      this.dd,
      this.planamount,
      this.planamount,
      this.tdsamount,
      this.depositamount,
      this.mobilePayment,
      this.OnlinePayment,
      this.UPIAmt,
      this.DonationAmount,
      this.stationId,
      this.operatorID,
      this.hsplocationId
    );
    return this.savecashscrollDetails;
  }
  exportTable() {
    if (this.cashScrollNewTable) {
      this.cashScrollNewTable.exportAsExcel();
    }
  }
  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

  print() {
    this.openReportModal("CashScrollReport");
  }
  openReportModal(btnname: string) {
    let todatetime =  this.datepipe.transform(
      this.cashscrollnewForm.controls["todate"].value,
      "yyyy-MM-ddTHH:mm:ss"
    ) || "";
    this.reportService.openWindow(btnname, btnname, {
      Fromdate: this.cashscrollnewForm.controls["fromdate"].value,
      Todate: todatetime,
      Operatorid: this.operatorID,
      LocationID: this.hsplocationId,
      EmployeeName: this.EmployeeName,
      EmployeeID: this.lastUpdatedBy,
      TimeTakenAt: this.cashscrollnewForm.value.takenat,
      ack: 1,
      IsAckByOperator: false,
      ScrollNo: Number(this.cashscrollnewForm.value.scrollno),
    });
  }
  navigatetomain() {
    this.router.navigate(["out-patient-billing", "cash-scroll"]);
  }

  getoldscroll(scrollno: any) {
    let ackdetails;
    this.queryparamssearch = true;
    this.scrollno = scrollno;
    this.http
      .get(ApiConstants.getdetaileddataforoldscroll(scrollno, this.stationId))
      .pipe(takeUntil(this._destroying$))
      .subscribe((resultdata) => {
        this.uniquescrollnumber = resultdata as GetDataForOldScroll;
        ackdetails = this.uniquescrollnumber.getACKDetails;

        this.cashscrollnewForm.controls["takenat"].setValue(
          this.datepipe.transform(
            ackdetails[0].scrolldatetime,
            "dd/MM/yyyy hh:mm:ss a"
          )
        );
        this.cashscrollnewForm.controls["todate"].setValue(
          this.datepipe.transform(
            ackdetails[0].todatetime,
            "YYYY-MM-ddTHH:mm:ss"
          )
        );
        this.cashscrollnewForm.controls["fromdate"].setValue(
          this.datepipe.transform(
            ackdetails[0].fromdatetime,
            "YYYY-MM-ddTHH:mm:ss"
          )
        );
        this.cashscrollnewForm.controls["employeename"].setValue(
          ackdetails[0].name
        );

        this.scrolldetailsList = this.uniquescrollnumber.getACKOtherdetails;

        for (var i = 0; i < this.scrolldetailsList.length; i++) {
          this.scrolldetailsList[i].sno = i + 1;
        }
        this.billamount = this.scrolldetailsList
          .map((t: any) => t.billamount)
          .reduce((acc: any, value: any) => acc + value, 0);
        this.refund = this.scrolldetailsList
          .map((t: any) => t.refund)
          .reduce((acc: any, value: any) => acc + value, 0);
        this.depositamount = this.scrolldetailsList
          .map((t: any) => t.depositamount)
          .reduce((acc: any, value: any) => acc + value, 0);
        this.discountamount = this.scrolldetailsList
          .map((t: any) => t.discountamount)
          .reduce((acc: any, value: any) => acc + value, 0);
        this.planamount = this.scrolldetailsList
          .map((t: any) => t.planamount)
          .reduce((acc: any, value: any) => acc + value, 0);

        this.plandiscount = this.scrolldetailsList
          .map((t: any) => t.plandiscount)
          .reduce((acc: any, value: any) => acc + value, 0);
        this.netamount = this.scrolldetailsList
          .map((t: any) => t.netamount)
          .reduce((acc: any, value: any) => acc + value, 0);
        this.cash = this.scrolldetailsList
          .map((t: any) => t.cash)
          .reduce((acc: any, value: any) => acc + value, 0);
        this.cheque = this.scrolldetailsList
          .map((t: any) => t.cheque)
          .reduce((acc: any, value: any) => acc + value, 0);
        this.duereceved = this.scrolldetailsList
          .map((t: any) => t.duesrec)
          .reduce((acc: any, value: any) => acc + value, 0);

        this.dd = this.scrolldetailsList
          .map((t: any) => t.dd)
          .reduce((acc: any, value: any) => acc + value, 0);
        this.creditcard = this.scrolldetailsList
          .map((t: any) => t.creditCard)
          .reduce((acc: any, value: any) => acc + value, 0);
        this.mobilePayment = this.scrolldetailsList
          .map((t: any) => t.mobilePayment)
          .reduce((acc: any, value: any) => acc + value, 0);
        this.OnlinePayment = this.scrolldetailsList
          .map((t: any) => t.onlinePayment)
          .reduce((acc: any, value: any) => acc + value, 0);
        this.dues = this.scrolldetailsList
          .map((t: any) => t.dues)
          .reduce((acc: any, value: any) => acc + value, 0);
        this.tdsamount = this.scrolldetailsList
          .map((t: any) => t.tdsamount)
          .reduce((acc: any, value: any) => acc + value, 0);
        this.DonationAmount = this.scrolldetailsList
          .map((t: any) => t.donationAmount)
          .reduce((acc: any, value: any) => acc + value, 0);
        this.UPIAmt = this.scrolldetailsList
          .map((t: any) => t.upiAmt)
          .reduce((acc: any, value: any) => acc + value, 0);

        this.scrolldetailsList = this.scrolldetailsList.map((item: any) => {
          item.billamount = parseFloat(item.billamount).toFixed(2);
          item.refund = parseFloat(item.refund).toFixed(2);
          item.depositamount = parseFloat(item.depositamount).toFixed(2);
          item.planamount = parseFloat(item.planamount).toFixed(2);
          item.discountamount = parseFloat(item.discountamount).toFixed(2);
          item.plandiscount = parseFloat(item.plandiscount).toFixed(2);
          item.netamount = parseFloat(item.netamount).toFixed(2);
          item.cash = parseFloat(item.cash).toFixed(2);
          item.cheque = parseFloat(item.cheque).toFixed(2);
          item.dd = parseFloat(item.dd).toFixed(2);
          item.dues = parseFloat(item.dues).toFixed(2);
          item.creditcard =
            item.creditcard == undefined
              ? "0.00"
              : parseFloat(item.creditcard).toFixed(2);
          item.mobilePayment =
            item.mobilePayment == undefined
              ? "0.00"
              : parseFloat(item.mobilePayment).toFixed(2);
          item.onlinePayment =
            item.onlinePayment == undefined
              ? "0.00"
              : parseFloat(item.onlinePayment).toFixed(2);
          item.tdsamount = parseFloat(item.tdsamount).toFixed(2);
          item.donation =
            item.donation == undefined
              ? "0.00"
              : parseFloat(item.donation).toFixed(2);
          item.upiamount =
            item.upiamount == undefined
              ? "0.00"
              : parseFloat(item.upiamount).toFixed(2);
          item.totalamount =
            item.totalamount == undefined
              ? "0.00"
              : parseFloat(item.totalamount).toFixed(2);

          return item;
        });

        this.tableFooterData = {
          sno: "",
          receiptNo: "TOTAL",
          billamount: this.billamount.toFixed(2),
          refund: this.refund.toFixed(2),
          discountamount: this.discountamount.toFixed(2),
          planamount: this.planamount.toFixed(2),
          plandiscount: this.plandiscount.toFixed(2),
          depositamount: this.depositamount.toFixed(2),
          netamount: this.netamount.toFixed(2),
          cash: this.cash.toFixed(2),
          cheque: this.cheque.toFixed(2),
          dd: this.dd.toFixed(2),
          creditcard: this.creditcard.toFixed(2),
          mobilePayment: this.mobilePayment.toFixed(2),
          onlinePayment: this.OnlinePayment.toFixed(2),
          dues: this.dues.toFixed(2),
          tdsamount: this.tdsamount.toFixed(2),
          upiamount: this.UPIAmt.toFixed(2),
          donation: this.DonationAmount.toFixed(2),
          totalamount: (this.billamount + this.DonationAmount).toFixed(2),
        };
      });
  }
}
