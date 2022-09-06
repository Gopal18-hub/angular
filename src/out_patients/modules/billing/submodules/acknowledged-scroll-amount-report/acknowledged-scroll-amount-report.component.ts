import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { CookieService } from "@shared/services/cookie.service";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";

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
      },
      todate: {
        type: "date",
      },
      scrollno: {
        type: "number",
      },
    },
  };

  acknowledgementForm!: FormGroup;
  config: any = {
    // clickedRows: false,
    // clickSelection: "single",
    // actionItems: false,
    dateformat: "dd/MM/yyyy",
    // selectBox: false,
    displayedColumns: [
      "ScrollNo",
      "AcknowledgeDateTime",
      "EmployeeName",
      "Amount",
    ],
    columnsInfo: {
      ScrollNo: {
        title: "Scroll.No",
        type: "string",
        tooltipColumn: "ScrollNo",
        style: {
          width: "1.5rem",
        },
      },
      AcknowledgeDateTime: {
        title: "Acknowledge Date Time",
        type: "string",
        tooltipColumn: "AcknowledgeDateTime",
        style: {
          width: "2.5rem",
        },
      },
      EmployeeName: {
        title: "Employee Name",
        type: "string",
        tooltipColumn: "EmployeeName",
        style: {
          width: "3rem",
        },
      },
      Amount: {
        title: "Amount",
        type: "number",
        style: {
          width: "8rem",
        },
      },
    },
  };
  data: any[] = [
    {
      ScrollNo: "BLDP24920",
      AcknowledgeDateTime: "05/11/2022",
      Amount: "150.00",
      EmployeeName: "Sanjeev Singh (EMP001)",
    },
    {
      ScrollNo: "BLDP24920",
      AcknowledgeDateTime: "05/11/2022",
      Amount: "150.00",
      EmployeeName: "Sanjeev Singh (EMP001)",
    },
    {
      ScrollNo: "BLDP24920",
      AcknowledgeDateTime: "05/11/2022",
      Amount: "150.00",
      EmployeeName: "Sanjeev Singh (EMP001)",
    },
    {
      ScrollNo: "BLDP24920",
      AcknowledgeDateTime: "05/11/2022",
      Amount: "150.00",
      EmployeeName: "Sanjeev Singh (EMP001)",
    },
    {
      ScrollNo: "BLDP24920",
      AcknowledgeDateTime: "05/11/2022",
      Amount: "150.00",
      EmployeeName: "Sanjeev Singh (EMP001)",
    },
  ];
  @ViewChild("table") tableRows: any;
  public acknowledgementlist = this.data;
  questions: any;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cookie: CookieService,
    private formService: QuestionControlService
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
    console.log(this.acknowledgementlist);
    let formResult: any = this.formService.createForm(
      this.acknowledgedFormData.properties,
      {}
    );

    this.acknowledgementForm = formResult.form;
    this.questions = formResult.questions;
    this.today = new Date();
    this.acknowledgementForm.controls["todate"].setValue(this.today);
    this.fromdate = new Date(this.today);
    this.fromdate.setDate(this.fromdate.getDate() - 20);
    this.acknowledgementForm.controls["fromdate"].setValue(this.fromdate);
    this.questions[2].maximum =
      this.acknowledgementForm.controls["todate"].value;
    this.questions[3].minimum =
      this.acknowledgementForm.controls["fromdate"].value;
    this.acknowledgedFormData = formResult.form;
    this.questions = formResult.questions;
  }
}
