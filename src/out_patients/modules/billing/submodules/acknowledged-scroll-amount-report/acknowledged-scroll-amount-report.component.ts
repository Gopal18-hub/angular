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
      "billNo",
      "billType",
      "billDate",
      "ipNo",
      "admDateTime",
      "billAmount",
      "discountAmount",
      "receiptAmt",
      "refundAmount",
      "balanceAmt",
      "companyName",
      "operatorName",
      "printIcon",
    ],
    columnsInfo: {
      billNo: {
        title: "Bill.No",
        type: "string",
        tooltipColumn: "billNo",
        style: {
          width: "6.5rem",
        },
      },
      billType: {
        title: "Type",
        type: "string",
        tooltipColumn: "billType",
        style: {
          width: "6rem",
        },
      },
      billDate: {
        title: "Bill Date",
        type: "string",
        tooltipColumn: "billDate",
        style: {
          width: "5rem",
        },
      },
      ipNo: {
        title: "IP No.",
        type: "number",
        style: {
          width: "4rem",
        },
      },
      admDateTime: {
        title: "Adm/Dis Date",
        type: "date",
        style: {
          width: "7rem",
        },
      },
      billAmount: {
        title: "Bill Amt",
        type: "number",
        style: {
          width: "7rem",
        },
      },
      discountAmount: {
        title: "Discount Amt",
        type: "number",
        style: {
          width: "7rem",
        },
      },
      receiptAmt: {
        title: "Receipt Amt",
        type: "number",
        style: {
          width: "6rem",
        },
      },
      refundAmount: {
        title: "Refund Amt",
        type: "number",
        style: {
          width: "6rem",
        },
      },
      balanceAmt: {
        title: "Balance Amt",
        type: "number",
        style: {
          width: "6.5rem",
        },
      },
      companyName: {
        title: "Company",
        type: "string",
        tooltipColumn: "companyName",
        style: {
          width: "5rem",
        },
      },
      operatorName: {
        title: "Operator Name",
        type: "string",
        tooltipColumn: "operatorName",
        style: {
          width: "7.5rem",
        },
      },
      printIcon: {
        title: "Print History",
        type: "image",
        width: 25,
        style: {
          width: "5.5rem",
        },
        disabledSort: true,
      },
    },
  };
  data: any[] = [
    {
      billno: "BLDP24920",
      type: "OP Refund",
      billdate: "05/11/2022",
      ipno: "1234",
      admdischargedate: "05/11/2022",
      billamt: "150.00",
      discountamt: "0.00",
      receiptamt: "1000.00",
      refundamt: "0.0",
      balanceamt: "10000.00",
      company: "DGEHS-NABH (BLK)",
      operatorname: "Sanjeev Singh (EMP001)",
      printhistory: "",
    },
    {
      billno: "BLDP24921",
      type: "IP Deposit",
      billdate: "05/11/2022",
      ipno: "1234",
      admdischargedate: "05/11/2022",
      billamt: "150.00",
      discountamt: "0.00",
      receiptamt: "1000.00",
      refundamt: "0.0",
      balanceamt: "10000.00",
      company: "DGEHS-NABH (BLK)",
      operatorname: "Sanjeev Singh (EMP001)",
      printhistory: "",
    },
    {
      billno: "BLDP24922",
      type: "IP Refund",
      billdate: "05/11/2022",
      ipno: "1234",
      admdischargedate: "05/11/2022",
      billamt: "150.00",
      discountamt: "0.00",
      receiptamt: "1000.00",
      refundamt: "0.0",
      balanceamt: "10000.00",
      company: "DGEHS-NABH (BLK)",
      operatorname: "Sanjeev Singh (EMP001)",
      printhistory: "",
    },
    {
      billno: "BLDP24923",
      type: "Er Bill",
      billdate: "05/11/2022",
      ipno: "1234",
      admdischargedate: "05/11/2022",
      billamt: "150.00",
      discountamt: "0.00",
      receiptamt: "1000.00",
      refundamt: "0.0",
      balanceamt: "10000.00",
      company: "DGEHS-NABH (BLK)",
      operatorname: "Sanjeev Singh (EMP001)",
      printhistory: "",
    },
    {
      billno: "BLDP24924",
      type: "Er Deposit",
      billdate: "05/11/2022",
      ipno: "1234",
      admdischargedate: "05/11/2022",
      billamt: "150.00",
      discountamt: "0.00",
      receiptamt: "1000.00",
      refundamt: "0.0",
      balanceamt: "10000.00",
      company: "DGEHS-NABH (BLK)",
      operatorname: "Sanjeev Singh (EMP001)",
      printhistory: "",
    },
    {
      billno: "BLDP24925",
      type: "Er Refund",
      billdate: "05/11/2022",
      ipno: "1234",
      admdischargedate: "05/11/2022",
      billamt: "150.00",
      discountamt: "0.00",
      receiptamt: "1000.00",
      refundamt: "0.0",
      balanceamt: "10000.00",
      company: "DGEHS-NABH (BLK)",
      operatorname: "Sanjeev Singh (EMP001)",
      printhistory: "",
    },
    {
      billno: "BLDP24926",
      type: "Deposit Refund",
      billdate: "05/11/2022",
      ipno: "1234",
      admdischargedate: "05/11/2022",
      billamt: "150.00",
      discountamt: "0.00",
      receiptamt: "1000.00",
      refundamt: "0.0",
      balanceamt: "10000.00",
      company: "DGEHS-NABH (BLK)",
      operatorname: "Sanjeev Singh (EMP001)",
      printhistory: "",
    },
    {
      billno: "BLDP24927",
      type: "Deposit",
      billdate: "05/11/2022",
      ipno: "1234",
      admdischargedate: "05/11/2022",
      billamt: "150.00",
      discountamt: "0.00",
      receiptamt: "1000.00",
      refundamt: "0.0",
      balanceamt: "10000.00",
      company: "DGEHS-NABH (BLK)",
      operatorname: "Sanjeev Singh (EMP001)",
      printhistory: "",
    },
    {
      billno: "BLDP24928",
      type: "Deposit",
      billdate: "05/11/2022",
      ipno: "1234",
      admdischargedate: "05/11/2022",
      billamt: "150.00",
      discountamt: "0.00",
      receiptamt: "1000.00",
      refundamt: "0.0",
      balanceamt: "10000.00",
      company: "DGEHS-NABH (BLK)",
      operatorname: "Sanjeev Singh (EMP001)",
      printhistory: "",
    },
    {
      billno: "BLDP24929",
      type: "Deposit",
      billdate: "05/11/2022",
      ipno: "1234",
      admdischargedate: "05/11/2022",
      billamt: "150.00",
      discountamt: "0.00",
      receiptamt: "1000.00",
      refundamt: "0.0",
      balanceamt: "10000.00",
      company: "DGEHS-NABH (BLK)",
      operatorname: "Sanjeev Singh (EMP001)",
      printhistory: "",
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
