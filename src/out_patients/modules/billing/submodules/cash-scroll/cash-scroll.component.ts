import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { CookieService } from "@shared/services/cookie.service";
import { Router } from "@angular/router";

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
    private router: Router
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

  ngOnInit(): void {
    let formResult = this.formService.createForm(
      this.cashscrollformdata.properties,
      {}
    );
    this.cashscrollForm = formResult.form;
    this.questions = formResult.questions;

    this.lastUpdatedBy = this.cookie.get("UserName");
  }

  opennewcashscroll() {
    // this.router.navigate(["out-patient-billing", "op-refund-approval"]);
    // this.router.navigate([
    //   "out-patient-billing/cash-scroll/cash-scroll-new",
    //   // "cash-scroll",
    //   // "cash-scroll-new",
    // ]);
    this.router.navigate(["out-patient-billing/cash-scroll/cash-scroll-new"]);
    // this.router.navigate([
    //   "out-patient-billing/cash-scroll",
    //   "cash-scroll-new",
    // ]);
    // this.router
    //   .navigate(["out-patient-billing/cash-scroll", "cash-scroll-new"])
    //   .then(() => {
    //     window.location.reload;
    //   });
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
}
