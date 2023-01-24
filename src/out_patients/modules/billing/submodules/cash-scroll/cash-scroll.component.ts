import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { CookieService } from "@shared/services/cookie.service";
import { Router, ActivatedRoute } from "@angular/router";
import { ApiConstants } from "@core/constants/ApiConstants";
import { HttpClient } from "@angular/common/http";
import { MessageDialogService } from "@shared/ui/message-dialog/message-dialog.service";
import { GetDataForOldScroll } from "@core/types/cashscroll/getdataforoldscroll.Interface";
import { getdataForScrollMain } from "@core/types/cashscroll/getscrollmain.Interface";
import { DatePipe } from "@angular/common";

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
    private dialogservice: MessageDialogService,
    private datepipe: DatePipe
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
          { title: "Pending", value: "pending" },
          { title: "Acknowledge", value: "acknowledge" },
        ],
        defaultValue: "pending",
      },
    },
  };
  cashscrollconfig: any = {
    clickedRows: true,
    clickSelection: "single",
    dateformat: "dd/MM/yyyy - HH:mm:ss",
    selectBox: true,
    displayedColumns: [
      "stationslno",
      "fromdatetime",
      "todatetime",
      "scrolldatetime",
      "name",
    ],
    columnsInfo: {
      stationslno: {
        title: "Scroll No.",
        type: "string",
        style: {
          width: "3rem",
        },
      },
      fromdatetime: {
        title: "From Date Time",
        type: "number",
        style: {
          width: "6rem",
        },
      },
      todatetime: {
        title: "To Date Time",
        type: "date",
        style: {
          width: "6rem",
        },
      },
      scrolldatetime: {
        title: "Taken Date Time",
        type: "date",
        style: {
          width: "6rem",
        },
      },
      name: {
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

  hsplocationId: any = Number(this.cookie.get("HSPLocationId"));
  stationId: any = Number(this.cookie.get("StationId"));
  operatorID: any = Number(this.cookie.get("UserId"));

  Modifyscollnumber: boolean = true;
  selectedscrollnumber: string = "";

  @ViewChild("cashscrolltable") cashscrolltable: any;

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
  CashScrolldetails!: getdataForScrollMain;
  uniquescrollnumber!: GetDataForOldScroll;

  ngAfterViewInit() {
    this.questions[0].elementRef.addEventListener("keypress", (event: any) => {
      if (event.key == "Enter") {
        event.preventDefault();
        if (!this.cashscrollForm.value.scrollno) {
          this.dialogservice.error("Please Enter the Scroll Number");
          this.questions[0].elementRef.focus();
        } else {
          this.getoldscroll();
        }
      }
    });

    this.cashscrollForm.controls["mainradio"].valueChanges.subscribe(
      (value: any) => {
        if (value == "pending") {
          this.getdetailsforscroll();
        } else {
          this.cashscrollList = [];
        }
      }
    );
  }
  scrollnoSearch() {
    if (
      this.cashscrollForm.controls["scrollno"].value == null ||
      this.cashscrollForm.controls["scrollno"].value == ""
    ) {
      if (this.cashscrollForm.controls["mainradio"].value == "pending") {
        this.getdetailsforscroll();
      } else {
        this.cashscrollList = [];
      }
    } else if (this.cashscrollForm.controls["scrollno"].value) {
      this.getoldscroll();
    }
  }

  getoldscroll() {
    this.http
      .get(
        ApiConstants.getdetaileddataforoldscroll(
          this.cashscrollForm.value.scrollno,
          this.stationId
        )
      )
      .pipe(takeUntil(this._destroying$))
      .subscribe((resultdata) => {
        this.uniquescrollnumber = resultdata as GetDataForOldScroll;
        this.cashscrollList = this.uniquescrollnumber.getACKDetails;
        this.cashscrollList = this.cashscrollList.map((item: any) => {
          item.fromdatetime = this.datepipe.transform(
            item.fromdatetime,
            "dd/MM/yyyy hh:mm:ss"
          );
          return item;
        });
        setTimeout(() => {
          this.cashscrolltable.selection.changed
            .pipe(takeUntil(this._destroying$))
            .subscribe((res: any) => {
              if (this.cashscrolltable.selection.selected.length > 0) {
                this.Modifyscollnumber = false;
                let scrolldetails = this.cashscrolltable.selection.selected;
                this.selectedscrollnumber = scrolldetails[0].stationslno;
              } else {
                this.Modifyscollnumber = true;
              }
            });
        });
      },
      (error) => {
        this.dialogservice.error("No data Found");
      });
  }

  opennewcashscroll() {
    this.router.navigate(["out-patient-billing/cash-scroll/cash-scroll-new"]);
  }
  cashscrollmodify() {
    this.router.navigate(
      ["out-patient-billing/cash-scroll/cash-scroll-modify"],
      {
        queryParams: { scrollno: this.selectedscrollnumber },
      }
    );
  }

  cashscrollColumnClick(event: any) {
    this.router.navigate(
      ["out-patient-billing/cash-scroll", "cash-scroll-new"],
      {
        queryParams: { scrollno: event.row.stationslno },
      }
    );
  }

  clearcashscroll() {
    this._destroying$.next(undefined);
    this._destroying$.complete();
    this.cashscrollForm.reset();
    this.cashscrollForm.controls["mainradio"].setValue("pending");
  }

  cashscrollList: any = [];
  getdetailsforscroll() {
    this.http
      .get(
        ApiConstants.getdetailsforcashscroll(this.operatorID, this.stationId)
      )
      .pipe(takeUntil(this._destroying$))
      .subscribe((resultdata) => {
        this.CashScrolldetails = resultdata as getdataForScrollMain;
        this.cashscrollList =
          this.CashScrolldetails.getDetailsForMainScrollDetails;
        this.cashscrollList = this.cashscrollList.map((item: any) => {
          item.fromdatetime = this.datepipe.transform(
            item.fromdatetime,
            "dd/MM/yyyy hh:mm:ss"
          );
          return item;
        });

        setTimeout(() => {
          this.cashscrolltable.selection.changed
            .pipe(takeUntil(this._destroying$))
            .subscribe((res: any) => {
              if (this.cashscrolltable.selection.selected.length > 0) {
                this.Modifyscollnumber = false;
                let scrolldetails = this.cashscrolltable.selection.selected;
                this.selectedscrollnumber = scrolldetails[0].stationslno;
              } else {
                this.Modifyscollnumber = true;
              }
            });
        });
      },(error) => {
        this.dialogservice.error("No data Found");
      });
  }
}
