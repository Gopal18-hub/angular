import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { CookieService } from "@shared/services/cookie.service";
import { Router } from "@angular/router";
import { ApiConstants } from "@core/constants/ApiConstants";
import { HttpClient } from "@angular/common/http";
import { MessageDialogService } from "@shared/ui/message-dialog/message-dialog.service";
import { getdataForScrollMain } from "@core/types/cashscroll/getscrollmain.Interface";
import { DatePipe } from "@angular/common";
import { cashscrollNewDetail } from "@core/models/cashscrollNewModel.Model";
import { savecashscroll } from "@core/models/savecashscrollModel.Model";

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
  ) {}
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
        type: "date",
        readonly: true,
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
      receiptNo: {
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
          width: "8rem",
        },
      },
      datetime: {
        title: "Date Time",
        type: "date",
        style: {
          width: "10rem",
        },
      },
      billamount: {
        title: "Bill Amount",
        type: "number",
        style: {
          width: "6rem",
        },
      },
      refund: {
        title: "Refund",
        type: "number",
        style: {
          width: "6rem",
        },
      },
      depositamount: {
        title: "Deposit Amount",
        type: "number",
        style: {
          width: "8rem",
        },
      },
      discountamount: {
        title: "Discount Amount",
        type: "number",
        style: {
          width: "8rem",
        },
      },
      planamount: {
        title: "Plan Amount",
        type: "number",
        style: {
          width: "8rem",
        },
      },
      plandiscount: {
        title: "Plan Discount",
        type: "number",
        style: {
          width: "8rem",
        },
      },
      netamount: {
        title: "Net Amount",
        type: "number",
        style: {
          width: "8rem",
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
        type: "number",
        style: {
          width: "6rem",
        },
      },
      dd: {
        title: "DD",
        type: "number",
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
      mobilePayment: {
        title: "Cash Payment by Mobile",
        type: "number",
        style: {
          width: "10.5rem",
        },
      },
      onlinePayment: {
        title: "Online Payment",
        type: "number",
        style: {
          width: "8rem",
        },
      },
      dues: {
        title: "Dues",
        type: "number",
        style: {
          width: "5rem",
        },
      },
      tdsamount: {
        title: "TDS Amount",
        type: "number",
        style: {
          width: "7rem",
        },
      },
      donation: {
        title: "Donation",
        type: "number",
        style: {
          width: "7rem",
        },
      },
      upiamount: {
        title: "UPI Amount",
        type: "string",
        style: {
          width: "7rem",
        },
      },
      totalamount: {
        title: "Total Amount",
        type: "string",
        style: {
          width: "8rem",
        },
      },
      compName: {
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
  scrolldetailsexists:boolean = true;
  lastUpdatedBy: string = "";
  currentTime: string = new Date().toLocaleString();
  private readonly _destroying$ = new Subject<void>();
  fromdatedetails: string | undefined;
  scrolldetailsList:any= [];

  hsplocationId:any = 67; // Number(this.cookie.get("HSPLocationId"));
  stationId:any = 12969 ;// Number(this.cookie.get("StationId"));
  operatorID:any = 60925; // Number(this.cookie.get("UserId"));

  billamount:number = 0;
  refund:number = 0;
  depositamount:number = 0;
  discountamount:number = 0;
  planamount :number = 0;
  plandiscount:number = 0;
  netamount :number = 0;
  cash :number = 0;
  cheque :number = 0;
  dd :number = 0;
  creditcard :number = 0;
  dues :number = 0;
  tdsamount :number = 0;
  duereceved :number = 0;
  mobilePayment :number = 0;
  OnlinePayment:number = 0;
  DonationAmount :number = 0;
  UPIAmt :number = 0;

  ngOnInit(): void {
    console.log("inside cash scroll new");
    let formResult = this.formService.createForm(
      this.cashscrollnewformdata.properties,
      {}
    );
    this.cashscrollnewForm = formResult.form;
    this.questions = formResult.questions;

    this.lastUpdatedBy = this.cookie.get("UserName");
    console.log(this.cookie.get("UserName"));
    this.getdetailsfornewscroll();
    this.cashscrollnewForm.controls["takenat"].setValue(this.datepipe.transform( this.currentTime, "dd/MM/yyyy hh:mm:ss a"));
    this.cashscrollnewForm.controls["todate"].setValue(this.datepipe.transform( this.currentTime, "dd/MM/yyyy hh:mm:ss"));
    this.cashscrollnewForm.controls["employeename"].setValue(this.lastUpdatedBy);
   
  }
  opencashscroll() {
    this.router.navigate(["report/cash-scroll", "cash-scroll"]);
  }
  
  getdetailsfornewscroll(){
    this.http
    .get(ApiConstants.getdetailsforcashscroll(this.operatorID, this.stationId))
    .pipe(takeUntil(this._destroying$))
    .subscribe(
      (resultdata) => 
    {
      let cashdetails;
      let fromdatetime;
      cashdetails = resultdata as getdataForScrollMain;
      fromdatetime = cashdetails.getDetailsForMainScrollDatetime[0].currentDateTime;
      this.cashscrollnewForm.controls["fromdate"].setValue(this.datepipe.transform(fromdatetime, "dd/MM/yyyy hh:mm:ss"));

    });
  }

  viewscrolldetails(){
 if(this.cashscrollnewForm.value.todate.getTime() < this.currentTime){
    this.dialogservice.error("To Date Can Not be greater then Current Date");
 }
 else{
    this.http
    .get(ApiConstants.getscrolldetailsforoneuser("2022-05-22 06:27:57", 
    //this.datepipe.transform(this.cashscrollnewForm.value.fromdate,"yyyy-MM-dd") || "",
    this.datepipe.transform(this.cashscrollnewForm.value.todate,"yyyy-MM-ddThh:mm:ss") || "",
      this.operatorID, this.stationId, this.hsplocationId))
    .pipe(takeUntil(this._destroying$))
    .subscribe(
      (resultdata) => 
    {
      this.scrolldetailsList = resultdata as cashscrollNewDetail[];

    this.scrolldetailsexists = false;
    this.cashscrollnewForm.controls["todate"].disable();
  
    for (var i = 0; i < this.scrolldetailsList.length; i++) {
      this.scrolldetailsList[i].sno = i + 1;
    }

    this.billamount = this.scrolldetailsList.map((t:any) => t.billamount).reduce((acc: any, value: any) => acc + value, 0);
    this.refund = this.scrolldetailsList.map((t:any) => t.refund).reduce((acc:any, value:any) => acc + value, 0);
    this.depositamount = this.scrolldetailsList.map((t:any) => t.depositamount).reduce((acc:any, value:any) => acc + value, 0);
    this.discountamount = this.scrolldetailsList.map((t:any) => t.discountamount).reduce((acc:any, value:any) => acc + value, 0);
    this.planamount = this.scrolldetailsList.map((t:any) => t.planamount).reduce((acc:any, value:any) => acc + value, 0);
    
    this.plandiscount = this.scrolldetailsList.map((t:any) => t.plandiscount).reduce((acc:any, value:any) => acc + value, 0);
    this.netamount = this.scrolldetailsList.map((t:any) => t.netamount).reduce((acc:any, value:any) => acc + value, 0);
    this.cash = this.scrolldetailsList.map((t:any) => t.cash).reduce((acc:any, value:any) => acc + value, 0);
    this.cheque = this.scrolldetailsList.map((t:any) => t.cheque).reduce((acc:any, value:any) => acc + value, 0);
    this.duereceved = this.scrolldetailsList.map((t:any) => t.duesrec).reduce((acc:any, value:any) => acc + value, 0);
    
    this.dd = this.scrolldetailsList.map((t:any) => t.dd).reduce((acc:any, value:any) => acc + value, 0);
    this.creditcard = this.scrolldetailsList.map((t:any) => t.creditCard).reduce((acc:any, value:any) => acc + value, 0);
    this.mobilePayment = this.scrolldetailsList.map((t:any) => t.mobilePayment).reduce((acc:any, value:any) => acc + value, 0);
    this.OnlinePayment = this.scrolldetailsList.map((t:any) => t.onlinePayment).reduce((acc:any, value:any) => acc + value, 0);
    this.dues = this.scrolldetailsList.map((t:any) => t.dues).reduce((acc:any, value:any) => acc + value, 0);
    this.tdsamount = this.scrolldetailsList.map((t:any) => t.tdsamount).reduce((acc:any, value:any) => acc + value, 0);
    this.DonationAmount = this.scrolldetailsList.map((t:any) => t.donationAmount).reduce((acc:any, value:any) => acc + value, 0);
    this.UPIAmt = this.scrolldetailsList.map((t:any) => t.upiAmt).reduce((acc:any, value:any) => acc + value, 0);
   
    

    this.scrolldetailsList = this.scrolldetailsList.map((item: any) => {
      item.billamount = Number(item.billamount).toFixed(2);
      item.refund = Number(item.refund.toFixed(2));
      item.depositamount = Number(item.depositamount.toFixed(2));
      item.planamount = Number(item.planamount.toFixed(2));
      item.discountamount = Number(item.discountamount.toFixed(2));
      item.plandiscount = Number(item.plandiscount.toFixed(2));
      item.netamount = Number(item.netamount.toFixed(2));
      item.cash = Number(item.cash.toFixed(2));
      item.cheque = Number(item.cheque.toFixed(3));
      item.dd = Number(item.dd.toFixed(3));
      item.creditcard = item.creditcard == undefined ? "0.000" : Number(item.creditcard.toFixed(3));
      item.mobilePayment = item.mobilePayment == undefined ? "0.00" : Number(item.mobilePayment.toFixed(2));
      item.onlinePayment = item.onlinePayment == undefined ? "0.00" : Number(item.onlinePayment.toFixed(2));
      item.tdsamount = Number(item.tdsamount.toFixed(2));
      item.donation = item.donation  == undefined ?  "0.00" : Number(item.donation.toFixed(2));
      item.upiamount = item.upiamount  == undefined ?  "0.00" : Number(item.upiamount.toFixed(3));
      item.totalamount = item.totalamount  == undefined ?  "0.00" : Number(item.totalamount.toFixed(2));
      
      
      return item;
    });
   
    this.scrolldetailsList.push({
      sno: "",
      receiptNo: "TOTAL",

    });
    console.log(resultdata);
    });
  }
  } 
  resetcashscrollnew(){
    //this.cashscrollnewForm.reset();
    this.scrolldetailsexists = true;
    this.cashscrollnewForm.controls["todate"].enable();
    this.scrolldetailsList = [];

  }
  savecashscrollDetails: savecashscroll | undefined;
  savecashscroll(){
    if(!this.operatorID){
      this.dialogservice.error("You are Not Valid User to Save Details");
    }
    else if(this.cashscrollnewForm.value.fromdate > this.cashscrollnewForm.value.todate){
      this.dialogservice.error("From Date cannot be greater then Todate");
    }
    else if(this.scrolldetailsList.length == 0){
      this.dialogservice.error("There is no data to Save");
    }
    else{
      // this.http
      // .post(ApiConstants.SavePatientsDepositDetailsGST, this.getcshscrollSubmitRequestBody())
      // .pipe(takeUntil(this._destroying$))
      // .subscribe(
      //   (resultData) => {
      //   });
     }
  }

 // getcshscrollSubmitRequestBody(): savecashscroll {  
    // return (this.savecashscrollDetails = new savecashscroll(
    //   this.cashscrollnewForm.value.fromdate,
    //   this.cashscrollnewForm.value.todate,

      
    // ));
  //}
    exportTable() {
    if (this.cashScrollNewTable) {
      this.cashScrollNewTable.exportAsExcel();
    }
  }
  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
