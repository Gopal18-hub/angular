import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { CookieService } from "@shared/services/cookie.service";
import { Router } from "@angular/router";
import { ApiConstants } from "@core/constants/ApiConstants";
import { HttpClient } from "@angular/common/http";
import { MessageDialogService } from "@shared/ui/message-dialog/message-dialog.service";
import { GetDataForOldScroll } from "@core/types/cashscroll/getdataforoldscroll.Interface";

@Component({
  selector: "out-patients-cash-scroll",
  templateUrl: "./cash-scroll.component.html",
  styleUrls: ["./cash-scroll.component.scss"],
})
export class CashScrollComponent implements OnInit {
  questions: any;
  constructor(
    private formService: QuestionControlService,
    private cookie: CookieService,
    private router: Router,
    private http: HttpClient,
    private dialogservice: MessageDialogService
  ) {}
  cashscrollformdata = {
    type: "object",
    title: "",
    properties: {
      scrollno: {
        type: "string",
      },
      mainradio: {
        type: "radio",
        required: false,
        options: [
          { title: "Pending", value: "1" },
          { title: "Acknowledge", value: "2" },
        ],
        defaultValue: "1"
      },
    },
  };
  cashscrollconfig: any = {
    clickedRows: true,
    clickSelection: "single",
    dateformat: "dd/MM/yyyy - hh:mm:ss",
    selectBox: false,
    displayedColumns: [
      "scrollno",
      "fromdateTime",
      "todateTime",
      "timetakenTime",
      "employeeName",
    ],
    columnsInfo: {
      scrollno: {
        title: "Scroll No.",
        type: "string",
        style: {
          width: "3.5rem",
        },
      },
      fromdateTime: {
        title: "From Date Time",
        type: "number",
        style: {
          width: "6rem",
        },
      },
      todateTime: {
        title: "To Date Time",
        type: "date",
        style: {
          width: "6rem",
        },
      },
      timetakenTime: {
        title: "Taken Date Time",
        type: "date",
        style: {
          width: "6rem",
        },
      },
      employeeName: {
        title: "Employee Name",
        type: "string",
        style: {
          width: "6rem",
        },
      },
    },
  };
  cashscrollForm!: FormGroup;

  lastUpdatedBy: string = "";
  currentTime: string = new Date().toLocaleString();
  private readonly _destroying$ = new Subject<void>();  
  
  hsplocationId:any =  Number(this.cookie.get("HSPLocationId"));
  stationId:any = 12969 ;// Number(this.cookie.get("StationId"));
  operatorID:any =  Number(this.cookie.get("UserId"));

  ngOnInit(): void {
    let formResult = this.formService.createForm(
      this.cashscrollformdata.properties,
      {}
    );
    this.cashscrollForm = formResult.form;
    this.questions = formResult.questions;

    this.lastUpdatedBy = this.cookie.get("UserName");
    this.getdetailsforscroll();
  }
  CashScrolldetails !: GetDataForOldScroll;

  ngAfterViewInit() {
    this.questions[0].elementRef.addEventListener("keypress", (event: any) => {
      if (event.key == "Enter") {
        event.preventDefault();
       if(!this.cashscrollForm.value.scrollno){
        this.dialogservice.error("Please Enter the Scroll Number");
        this.questions[0].elementRef.focus();
       }
       else{
        this.http
        .get(ApiConstants.getdetaileddataforoldscroll(this.cashscrollForm.value.scrollno, this.stationId))
        .pipe(takeUntil(this._destroying$))
        .subscribe(
          (resultdata) => 
        {
         this.CashScrolldetails = resultdata as GetDataForOldScroll;
        });
       }
      }
    });
  }
  scrollnoSearch() {
    if (this.cashscrollForm.controls["mainradio"].value != null && this.cashscrollForm.controls["mainradio"].value != "" ) {
    
      }
      else if(this.cashscrollForm.controls["scrollno"].value == null || this.cashscrollForm.controls["scrollno"].value == "" ){
        this.dialogservice.error("Please Enter the Scroll Number");
        this.questions[0].elementRef.focus();
      }
  }

  opennewcashscroll() {
    this.router.navigate(["out-patient-billing/cash-scroll/cash-scroll-new"]);
    // this.router.navigate([
    //   "out-patient-billing/cash-scroll",
    //   "cash-scroll-new",
    // ]);
  }
  cashscrollmodify() {
    this.router.navigate([
      // "out-patient-billing",
      "out-patient-billing",
      "cash-scroll",
      "cash-scroll-modify",
    ]);
  }

  cashscrollColumnClick(event: any) {
    this.router.navigate(["report/cash-scroll", "cash-scroll-new"]);
  }

  clearcashscroll() {
    this.cashscrollForm.reset();
  }

  getdetailsforscroll(){
    // this.http
    // .get(ApiConstants.getdetailsforscroll(, this.stationId))
    // .pipe(takeUntil(this._destroying$))
    // .subscribe(
    //   (resultdata) => 
    // {
    //  this.CashScrolldetails = resultdata as GetDataForOldScroll;
    // });
  }
}
