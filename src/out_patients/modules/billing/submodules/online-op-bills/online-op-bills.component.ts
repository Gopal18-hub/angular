import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import { QuestionControlService } from '@shared/ui/dynamic-forms/service/question-control.service';
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ApiConstants } from "@core/constants/ApiConstants";
import { CookieService } from "@shared/services/cookie.service";


@Component({
  selector: 'out-patients-online-op-bills',
  templateUrl: './online-op-bills.component.html',
  styleUrls: ['./online-op-bills.component.scss']
})
export class OnlineOpBillsComponent implements OnInit {

  constructor(public matDialog: MatDialog, private formService:QuestionControlService, private cookie: CookieService) { }
  
  lastUpdatedBy: string = "";
  currentTime: string = new Date().toLocaleString();

  @ViewChild("onlineopbillstable") onlineopbillstable: any;
  onlineopbillsformdata = {
    type:"object",
    title:"",
    properties:{
      fromdate:{
        type:"date",
      },
      todate:{
        type:"date",
      },
      specialisation:{
        type:"dropdown",        
      },
    }
  }
  onlineopbillsconfig: any = {
    clickedRows: true,
    clickSelection: "multiple",
    dateformat: "dd/MM/yyyy",
    selectBox: true,
    displayedColumns: [
      "billno",
      "appointmentdatetime",
      "doctorname",
      "specialisation",
      "patientname",
      "mobilenumber",
      "email",
      "printtobill"        
    ],
    columnsInfo: {
      billno: {
        title: "Bill No.",
        type: "string",
         style: {
          width: "70px",
        },
      },
      appointmentdatetime: {
        title: "Appointment Date/Time",
        type: "date",
      },
      doctorname: {
        title: "Doctor Name",
        type: "string",
      },
      specialisation: {
        title: "Specialisation",
        type: "autocomplete",       
      },
      patientname: {
        title: "Patient Name",
        type: "string",
      },
      mobilenumber: {
        title: "Mobile Number",
        type: "number",
      },
      email: {
        title: "Email",
        type: "string",
        tooltipColumn: "uEmail",
      },
      printtobill: {
        title: "Print to Bill",
        type: "string",
      },     
    },
  };

  onlineopbillsForm !: FormGroup;
  questions:any;
  MaxIDExist: boolean = false;
  
  private readonly _destroying$ = new Subject<void>();

 
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
  }

}
