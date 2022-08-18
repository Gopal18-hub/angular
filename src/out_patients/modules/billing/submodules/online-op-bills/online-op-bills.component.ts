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

@Component({
  selector: 'out-patients-online-op-bills',
  templateUrl: './online-op-bills.component.html',
  styleUrls: ['./online-op-bills.component.scss']
})
export class OnlineOpBillsComponent implements OnInit {

  constructor(public matDialog: MatDialog, private formService:QuestionControlService, 
    private cookie: CookieService, private http: HttpService,
    private datepipe: DatePipe,) { }
  
  lastUpdatedBy: string = "";
  currentTime: string = new Date().toLocaleString();

  @ViewChild("onlineopbillstable") onlineopbillstable: any;


  onlineopbillsForm !: FormGroup;
  questions:any;
  MaxIDExist: boolean = false;
  specialisationlist=[];
  private readonly _destroying$ = new Subject<void>();
  hspLocationid:any = 67; // Number(this.cookie.get("HSPLocationId"));
  onlineopbillList: any = [];

  onlineopbillsformdata = {
    type:"object",
    title:"",
    properties:{
      fromdate:{
        type:"date",
        required:true
      },
      todate:{
        type:"date",
        required:true
      },
      specialisation:{
        type:"dropdown",
        options: this.specialisationlist,
        emptySelect: true,
        placeholder: "Select",  
      },
    }
  }
  onlineopbillsconfig: any = {
    clickedRows: true,
    dateformat: "dd/MM/yyyy - hh:mm",
    clickSelection: "multiple",
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
    
    this.lastUpdatedBy = this.cookie.get("UserName"); 
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
    });
  }
  displayallspecialisation(){
    let fromdate = this.datepipe.transform(this.onlineopbillsForm.value.fromdate, "YYYY-MM-dd");
    let todate = this.datepipe.transform(this.onlineopbillsForm.value.todate, "YYYY-MM-dd");
    let specialisationid = (this.onlineopbillsForm.value.specialisation == undefined || this.onlineopbillsForm.value.specialisation == "")  ? 0 : this.onlineopbillsForm.value.specialisation;
    this.http
    .get(ApiConstants.getselectedspecialisationonlineop(fromdate, todate,specialisationid, this.hspLocationid))
    .pipe(takeUntil(this._destroying$))
    .subscribe((resultData: any) => {    
      this.onlineopbillList = resultData;
     
    });
  }
}
