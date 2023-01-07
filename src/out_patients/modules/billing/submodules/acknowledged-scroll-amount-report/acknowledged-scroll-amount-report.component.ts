import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { CookieService } from "@shared/services/cookie.service";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";
import { HttpService } from "@shared/services/http.service";
import { LookupService } from "@core/services/lookup.service";
import { ApiConstants } from "@core/constants/ApiConstants";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { getackdetailsforscroll } from "@core/types/GetackdetailsforScroll.Interface";
import { ackscrolldetailslist } from "@core/types/GetackdetailsforScroll.Interface";
import { DatePipe } from "@angular/common";

@Component({
  selector: "out-patients-acknowledged-scroll-amount-report",
  templateUrl: "./acknowledged-scroll-amount-report.component.html",
  styleUrls: ["./acknowledged-scroll-amount-report.component.scss"],
})
export class AcknowledgedScrollAmountReportComponent implements OnInit {
  acknowledgedFormData = {
    properties: {
      fromdate: {
        type: "date",
        required: true,
      },
      todate: {
        type: "date",
        required: true,
      },
      scrollno: {
        type: "number",
        required: false,
        readonly: true,
      },
    },
  };
  acknowledgementForm!: FormGroup;

  private readonly _destroying$ = new Subject<void>();
  config: any = {
    clickedRows: true,
    actionItems: false,
    dateformat: "dd/MM/YYYY HH:mm:ss.ss",
    displayedColumns: ["stationslno", "ackDateTime", "name", "amount"],
    columnsInfo: {
      stationslno: {
        title: "Scroll.No",
        type: "string",
        tooltipColumn: "stationslno",
        style: {
          width: "1.5rem",
        },
      },
      ackDateTime: {
        title: "Acknowledge Date Time",
        type: "date",
        tooltipColumn: "ackDateTime",
        style: {
          width: "2.5rem",
        },
      },
      name: {
        title: "Employee Name",
        type: "string",
        tooltipColumn: "name",
        style: {
          width: "3rem",
        },
      },
      amount: {
        title: "Amount",
        type: "number",
        style: {
          width: "8rem",
        },
      },
    },
  };

  public acknowledgementscroll: ackscrolldetailslist[] = [];
  data: any[] = this.acknowledgementscroll;
  // data: any[] = [
  //   {
  //     ScrollNo: "BLDP24920",
  //     AcknowledgeDateTime: "05/11/2022",
  //     Amount: "150.00",
  //     EmployeeName: "Sanjeev Singh (EMP001)",
  //   },
  //   {
  //     ScrollNo: "BLDP24920",
  //     AcknowledgeDateTime: "05/11/2022",
  //     Amount: "150.00",
  //     EmployeeName: "Sanjeev Singh (EMP001)",
  //   },
  //   {
  //     ScrollNo: "BLDP24920",
  //     AcknowledgeDateTime: "05/11/2022",
  //     Amount: "150.00",
  //     EmployeeName: "Sanjeev Singh (EMP001)",
  //   },
  //   {
  //     ScrollNo: "BLDP24920",
  //     AcknowledgeDateTime: "05/11/2022",
  //     Amount: "150.00",
  //     EmployeeName: "Sanjeev Singh (EMP001)",
  //   },
  //   {
  //     ScrollNo: "BLDP24920",
  //     AcknowledgeDateTime: "05/11/2022",
  //     Amount: "150.00",
  //     EmployeeName: "Sanjeev Singh (EMP001)",
  //   },
  // ];
  @ViewChild("table") tableRows: any;
  questions: any;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cookie: CookieService,
    private formService: QuestionControlService,
    private http: HttpService,
    private lookupservice: LookupService,
    private datepipe: DatePipe
  ) {}
  apiProcessing: boolean = true;
  showtable: boolean = false;
  today: any;
  fromdate: any;
  ngOnInit(): void {
    this.router.navigate([], {
      queryParams: {},
      relativeTo: this.route,
    });
    let formResult: any = this.formService.createForm(
      this.acknowledgedFormData.properties,
      {}
    );

    this.acknowledgementForm = formResult.form;
    this.questions = formResult.questions;
    this.today = new Date();
    this.acknowledgedFormData = formResult.form;
    this.acknowledgementForm.controls["fromdate"].setValue(this.today);
    this.acknowledgementForm.controls["todate"].setValue(this.today);
    this.questions[1].minimum =
      this.acknowledgementForm.controls["fromdate"].value;
    this.questions[0].maximum =
      this.acknowledgementForm.controls["todate"].value;
  }
  ngAfterViewInit(): void {
    this.acknowledgementForm.controls["fromdate"].valueChanges.subscribe(
      (value) => {
        this.questions[1].minimum = value;
      }
    );
    this.acknowledgementForm.controls["todate"].valueChanges.subscribe(
      (value) => {
        this.questions[0].maximum = value;
      }
    );
  }
  Viewbtn() {
    this.acknowledgementlist1();
    // "2022-09-16",
    // "2022-09-17",
  }
  acknowledgementlist1() {
    this.http
      .get(
        ApiConstants.getackdetailsforscroll(
          this.datepipe.transform(
            this.acknowledgementForm.controls["fromdate"].value,
            "YYYY-MM-dd"
          ),
          this.datepipe.transform(
            this.acknowledgementForm.controls["todate"].value,
            "YYYY-MM-dd"
          ),
          Number(this.cookie.get("StationId")),
          // "2022-09-16",
          // "2022-09-17",
          // 12969,
          // 9923
          Number(this.cookie.get("UserId"))
        )
      )
      .pipe(takeUntil(this._destroying$))
      .subscribe((data) => {
        this.acknowledgementscroll = data as ackscrolldetailslist[];
        console.log(data);
      });
    console.log(this.acknowledgementscroll);
  }
  clear() {
    this.acknowledgementscroll = [];
    this.acknowledgementForm.controls["fromdate"].setValue(this.today);
    this.acknowledgementForm.controls["todate"].setValue(this.today);
  }
}
