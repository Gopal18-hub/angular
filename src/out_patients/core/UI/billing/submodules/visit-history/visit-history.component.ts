import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiConstants } from '@core/constants/ApiConstants';
import { HttpService } from '@shared/services/http.service';
import { getPatientVisitHistory } from '@core/types/getPatientVisitHistory.Interface';
import { Subject, takeUntil } from 'rxjs';
import { CookieService } from '@shared/services/cookie.service';
@Component({
  selector: 'out-patients-visit-history',
  templateUrl: './visit-history.component.html',
  styleUrls: ['./visit-history.component.scss']
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
      "amount"
    ],
    columnsInfo: {
      visitDate: {
        title: "Visit Date",
        type: "string",
      },
      billNo: {
        title: "Last Bill No.",
        type: "number",
      },
      paymentMode: {
        title: "Last Payment Mode",
        type: "string",
      },
      companyName: {
        title: "Last Company Billed",
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
      }
    },
  };
  data1: any[] = [
    { visitdate: "30/12/1999", lastbillno: "BL789456", lastpaymentmode: "Online", lastcompanybilled: "ABC Company", doctorname: "Ravi kant behl", days: "5", consultationtype: "Consultation", amount: "1500.00"},
    { visitdate: "30/12/1999", lastbillno: "BL789456", lastpaymentmode: "Online", lastcompanybilled: "ABC Company", doctorname: "Ravi kant behl", days: "5", consultationtype: "Consultation", amount: "1500.00"},
    { visitdate: "30/12/1999", lastbillno: "BL789456", lastpaymentmode: "Online", lastcompanybilled: "ABC Company", doctorname: "Ravi kant behl", days: "5", consultationtype: "Consultation", amount: "1500.00"},
    { visitdate: "30/12/1999", lastbillno: "BL789456", lastpaymentmode: "Online", lastcompanybilled: "ABC Company", doctorname: "Ravi kant behl", days: "5", consultationtype: "Consultation", amount: "1500.00"},
    { visitdate: "30/12/1999", lastbillno: "BL789456", lastpaymentmode: "Online", lastcompanybilled: "ABC Company", doctorname: "Ravi kant behl", days: "5", consultationtype: "Consultation", amount: "1500.00"},
    { visitdate: "30/12/1999", lastbillno: "BL789456", lastpaymentmode: "Online", lastcompanybilled: "ABC Company", doctorname: "Ravi kant behl", days: "5", consultationtype: "Consultation", amount: "1500.00"},
    { visitdate: "30/12/1999", lastbillno: "BL789456", lastpaymentmode: "Online", lastcompanybilled: "ABC Company", doctorname: "Ravi kant behl", days: "5", consultationtype: "Consultation", amount: "1500.00"}
  ]
  maxId: any;
  docId: any;
  iacode: any;
  regnumber: any;
  hspId: any;
  public visithistorylist: getPatientVisitHistory = {lastConsultationData:[], opPreviousDMGMappingDoctorData:[], opdmgmAppingDoctorData:[], opGroupDoctorLog:[]};
  private readonly _destroying$ = new Subject<void>();
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {maxid: any, docid: any}, 
    private http: HttpService,
    private cookie: CookieService) { 
    this.maxId = data.maxid;
    this.docId = data.docid;
  }

  ngOnInit(): void {
    const id = this.maxId.split('.');
    this.iacode = id[0];
    this.regnumber = id[1];
    this.hspId = Number(this.cookie.get("HSPLocationId"));
    this.getvisithistory(this.iacode, this.regnumber, this.hspId, this.docId);
  }
  getvisithistory(iacode:any, regnumber:any, hspId: any, docid: any)
  {
    this.http.get(ApiConstants.getpatientvisithistory(iacode, regnumber, hspId, docid))
    .pipe(takeUntil(this._destroying$))
    .subscribe((resultdata)=>{
      console.log(resultdata);
        this.visithistorylist = resultdata;
    },
    (error)=>{
      console.log(error);
    })
  }
}
