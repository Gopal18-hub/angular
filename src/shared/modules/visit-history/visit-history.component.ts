import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ApiConstants } from "../../constants/ApiConstants";
import { HttpService } from "@shared/services/http.service";
import { getPatientVisitHistory } from "@shared/types/getPatientVisitHistory.Interface";
import { Subject, takeUntil } from "rxjs";
import { CookieService } from "@shared/services/cookie.service";
import { DatePipe, formatDate } from "@angular/common";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";
import { FormGroup } from "@angular/forms";
@Component({
  selector: "out-patients-visit-history",
  templateUrl: "./visit-history.component.html",
  styleUrls: ["./visit-history.component.scss"],
})
export class VisitHistoryComponent implements OnInit {
  config: any = {
    actionItems: false,
    dateformat: "dd/MM/yyyy",
    selectBox: false,
    displayedColumns: [
      "visitDate",
      "billNo",
      "paymentMode",
      "companyName",
      "doctorName",
      "days",
      "consultationType",
      "amount",
    ],
    columnsInfo: {
      visitDate: {
        title: "Visit Date",
        type: "string",
      },
      billNo: {
        title: "Bill No.",
        type: "number",
      },
      paymentMode: {
        title: "Payment Mode",
        type: "string",
      },
      companyName: {
        title: "Company Billed",
        type: "string",
      },
      doctorName: {
        title: "Doctor Name",
        type: "string",
      },
      days: {
        title: "Days",
        type: "number",
      },
      consultationType: {
        title: "Consultation Type",
        type: "string",
      },
      amount: {
        title: "Amount",
        type: "number",
      },
    },
  };
  data1: any[] = [
    {
      visitdate: "30/12/1999",
      lastbillno: "BL789456",
      lastpaymentmode: "Online",
      lastcompanybilled: "ABC Company",
      doctorname: "Ravi kant behl",
      days: "5",
      consultationtype: "Consultation",
      amount: "1500.00",
    },
    {
      visitdate: "30/12/1999",
      lastbillno: "BL789456",
      lastpaymentmode: "Online",
      lastcompanybilled: "ABC Company",
      doctorname: "Ravi kant behl",
      days: "5",
      consultationtype: "Consultation",
      amount: "1500.00",
    },
    {
      visitdate: "30/12/1999",
      lastbillno: "BL789456",
      lastpaymentmode: "Online",
      lastcompanybilled: "ABC Company",
      doctorname: "Ravi kant behl",
      days: "5",
      consultationtype: "Consultation",
      amount: "1500.00",
    },
    {
      visitdate: "30/12/1999",
      lastbillno: "BL789456",
      lastpaymentmode: "Online",
      lastcompanybilled: "ABC Company",
      doctorname: "Ravi kant behl",
      days: "5",
      consultationtype: "Consultation",
      amount: "1500.00",
    },
    {
      visitdate: "30/12/1999",
      lastbillno: "BL789456",
      lastpaymentmode: "Online",
      lastcompanybilled: "ABC Company",
      doctorname: "Ravi kant behl",
      days: "5",
      consultationtype: "Consultation",
      amount: "1500.00",
    },
    {
      visitdate: "30/12/1999",
      lastbillno: "BL789456",
      lastpaymentmode: "Online",
      lastcompanybilled: "ABC Company",
      doctorname: "Ravi kant behl",
      days: "5",
      consultationtype: "Consultation",
      amount: "1500.00",
    },
    {
      visitdate: "30/12/1999",
      lastbillno: "BL789456",
      lastpaymentmode: "Online",
      lastcompanybilled: "ABC Company",
      doctorname: "Ravi kant behl",
      days: "5",
      consultationtype: "Consultation",
      amount: "1500.00",
    },
  ];
  maxId: any;
  docId: any;
  iacode: any;
  regnumber: any;
  hspId: any;
  public visithistorylist: getPatientVisitHistory = {
    lastConsultationData: [],
    opPreviousDMGMappingDoctorData: [],
    opdmgmAppingDoctorData: [],
    opGroupDoctorLog: [],
  };
  private readonly _destroying$ = new Subject<void>();

  visitFormData = {
    title: "",
    type: "object",
    properties: {         
    checkbox: {
      type: "checkbox",
      options: [{ title: "Consultation" }],
      defaultValue: true
    },   
    },
  };
  visitform!: FormGroup;
  questions: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { maxid: any; docid: any },
    private http: HttpService,
    private cookie: CookieService,
    private datepipe: DatePipe,
    private formService: QuestionControlService
  ) {
    this.maxId = data.maxid;
    this.docId = data.docid;
  }

  ngOnInit(): void {
    let formResult = this.formService.createForm(
      this.visitFormData.properties,
      {}
    );
    this.visitform = formResult.form;
    this.questions = formResult.questions;
    const id = this.maxId.split(".");
    this.iacode = id[0];
    this.regnumber = id[1];
    this.hspId = Number(this.cookie.get("HSPLocationId"));
    this.getvisithistory(this.iacode, this.regnumber, this.hspId, this.docId);
  }

  ngAfterViewInit(): void {
    this.visitform.controls['checkbox'].valueChanges.subscribe((res) => {
      console.log(res);
      setTimeout(() => {
        this.getvisithistory(this.iacode, this.regnumber, this.hspId, this.docId);
      }, 100);
    })
  }

  getvisithistory(iacode: any, regnumber: any, hspId: any, docid: any) {
    this.http
      .get(ApiConstants.getpatientvisithistory(iacode, regnumber, hspId, docid, this.visitform.value.checkbox))
      .pipe(takeUntil(this._destroying$))
      .subscribe(
        (resultdata) => {
          console.log(resultdata);
          this.visithistorylist = {
            lastConsultationData: [],
            opPreviousDMGMappingDoctorData: [],
            opdmgmAppingDoctorData: [],
            opGroupDoctorLog: [],
          };
          this.visithistorylist = resultdata;
          this.visithistorylist.lastConsultationData.forEach((e) => {
            e.visitDate = e.visitDate.replaceAll("-", "/");
          });
        },
        (error) => {
          console.log(error);
        }
      );
  }
}
