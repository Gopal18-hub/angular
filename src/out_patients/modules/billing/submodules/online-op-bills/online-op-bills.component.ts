import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import { QuestionControlService } from '@shared/ui/dynamic-forms/service/question-control.service';
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ApiConstants } from "@core/constants/ApiConstants";
import { CookieService } from "@shared/services/cookie.service";
import { HttpService } from '@shared/services/http.service';
import { DatePipe } from '@angular/common';
import { ReportService } from '@shared/services/report.service';
import * as moment from "moment";

@Component({
  selector: 'out-patients-online-op-bills',
  templateUrl: './online-op-bills.component.html',
  styleUrls: ['./online-op-bills.component.scss']
})
export class OnlineOpBillsComponent implements OnInit {

  constructor(public matDialog: MatDialog, private formService:QuestionControlService, 
    private cookie: CookieService, private http: HttpService,
    private datepipe: DatePipe, private reportService: ReportService,) { }
  
  lastUpdatedBy: string = "";
  currentTime: string = new Date().toLocaleString();

  @ViewChild("onlineopbillstable") onlineopbillstable: any;


  onlineopbillsForm !: FormGroup;
  questions:any;
  MaxIDExist: boolean = false;
  specialisationlist=[];
  private readonly _destroying$ = new Subject<void>();
  hspLocationid:any = Number(this.cookie.get("HSPLocationId"));
  onlineopbillList: any = [];
  moment = moment;
  apiProcessing: boolean = false;

  onlineopbillsformdata = {
    type:"object",
    title:"",
    properties:{
      fromdate:{
        type:"date",
        title: "From Date",
        required:true
      },
      todate:{
        type:"date",
        title: "To Date",
        required:true
      },
      specialisation:{
        type:"autocomplete",
       // options: this.specialisationlist,
        emptySelect: true,
        placeholder: "Select",  
      },
    }
  }
  onlineopbillsconfig: any = {
    clickedRows: true,
    dateformat: "dd/MM/yyyy - hh:mm",
    clickSelection: "single",
    selectBox: true,
    displayedColumns: [
      "billNo",
      "appointmentDate",
      "doctorName",
      "specialisation",
      "ptnName",
      "mobileno",
      "email",
      //"printtobill"        
    ],
    columnsInfo: {
      billNo: {
        title: "Bill No.",
        type: "string",
         style: {
          width: "5rem",
        },
      },
      appointmentDate: {
        title: "Appointment Date/Time",
        type: "date",
        style: {
          width: "7.5rem",
        },
      },
      doctorName: {
        title: "Doctor Name",
        type: "string",
        style: {
          width: "9rem",
        },
      },
      specialisation: {
        title: "Specialisation",
        type: "autocomplete", 
        style: {
          width: "9rem",
        },      
      },
      ptnName: {
        title: "Patient Name",
        type: "string",
        style: {
          width: "8rem",
        },
      },
      mobileno: {
        title: "Mobile Number",
        type: "number",
        style: {
          width: "5rem",
        },
      },
      email: {
        title: "Email",
        type: "string",
        tooltipColumn: "uEmail",
        style: {
          width: "9rem",
        },
      },
      // printtobill: {
      //   title: "Print to Bill",
      //   type: "string",
      // },     
    },
  };
  ngOnInit(): void {
    let formResult = this.formService.createForm(
      this.onlineopbillsformdata.properties,{}
    );
    this.onlineopbillsForm=formResult.form;
    this.questions=formResult.questions;
    let todaydate = new Date();
    this.onlineopbillsForm.controls["fromdate"].setValue(todaydate);
    this.onlineopbillsForm.controls["todate"].setValue(todaydate);
    
    this.lastUpdatedBy =
    this.cookie.get("Name") + " ( " + this.cookie.get("UserName") + " )";
    this.getspecialisation();
  }

  getspecialisation(){
    this.http
    .get(ApiConstants.getonlineopbillspecialisation)
    .pipe(takeUntil(this._destroying$))
    .subscribe((resultData: any) => {
      this.specialisationlist = resultData;
      this.questions[2].options = this.specialisationlist.map((l:any) => {
        return { title: l.name, value: l.id };
      });
      this.questions[2] = { ...this.questions[2] };
    });
  }
  displayallspecialisation(){
    this.apiProcessing = true;
    let fromdate = this.datepipe.transform(this.onlineopbillsForm.value.fromdate, "YYYY-MM-dd");
    let todate = this.datepipe.transform(this.onlineopbillsForm.value.todate, "YYYY-MM-dd");
    let specialisationid = (this.onlineopbillsForm.value.specialisation == undefined || this.onlineopbillsForm.value.specialisation == "")  ? 0 : this.onlineopbillsForm.value.specialisation.value;
    this.http
    .get(ApiConstants.getselectedspecialisationonlineop(fromdate, todate,specialisationid, this.hspLocationid))
    .pipe(takeUntil(this._destroying$))
    .subscribe((resultData: any) => {        
      this.onlineopbillList = resultData;
      this.apiProcessing = false; 
      console.log(resultData);
      if(resultData.length > 0 ){
        this.MaxIDExist = true;
      }   
    });
  }

  resetonlineopbill(){
    this.onlineopbillsForm.reset();  
    this.onlineopbillList = [];  
    let todaydate = new Date();
    this.MaxIDExist = false;
    this.onlineopbillsForm.controls["fromdate"].setValue(todaydate);
    this.onlineopbillsForm.controls["todate"].setValue(todaydate);
  
  }
  printonlineopbillreceipt(){ 
    this.onlineopbillstable.selection.selected.map((s: any) => { 
      this.reportService.openWindow("billingreport", "billingreport", {
        opbillid: s.billid,
        locationID: this.hspLocationid
      });
    });
  }
}
