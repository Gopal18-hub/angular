import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import { QuestionControlService } from '@shared/ui/dynamic-forms/service/question-control.service';
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ApiConstants } from "@core/constants/ApiConstants";
import { CookieService } from "@shared/services/cookie.service";
import { Router, ActivatedRoute } from "@angular/router";
import { MessageDialogService } from '@shared/ui/message-dialog/message-dialog.service';
import { HttpService } from '@shared/services/http.service';

@Component({
  selector: 'out-patients-initiate-deposit',
  templateUrl: './initiate-deposit.component.html',
  styleUrls: ['./initiate-deposit.component.scss']
})
export class InitiateDepositComponent implements OnInit, AfterViewInit {

  constructor(public matDialog: MatDialog, private formService:QuestionControlService,
     private cookie: CookieService,
     private route: ActivatedRoute,
     private messageDialogService: MessageDialogService,private http: HttpService,) { }

 
  
  initiatedepositformdata = {
    type:"object",
    title:"",
    properties:{
      maxid:{
        type:"string",
      },
      mobileno:{
        type:"number",
      },
      selectpatient:{
        type:"dropdown",       
      },
      emailid:{
        type:"string"
      },     
      mobilenoinput:{
        type:"string",      
      },
      deposittype:{
        type:"dropdown",     
      },
      depositamount:{
        type:"string",      
      },
      remarks:{
        type:"textarea",      
      },
    }
  }
  initiatedepositForm !: FormGroup;
  questions:any;
  patientdeposittype: any;
  lastUpdatedBy: string = "";
  currentTime: string = new Date().toLocaleString();
  regNumber: number = 0;
  iacode: string | undefined;
  
  private readonly _destroying$ = new Subject<void>();
  
  hspLocationid: any = Number(this.cookie.get("HSPLocationId"));
  ngOnInit(): void {
    let formResult = this.formService.createForm(
      this.initiatedepositformdata.properties,{}
    );
    this.initiatedepositForm=formResult.form;
    this.questions=formResult.questions;
    
    this.lastUpdatedBy = this.cookie.get("UserName"); 
    this.route.queryParams
    .pipe(takeUntil(this._destroying$))
    .subscribe((value) => {
      if (value["maxId"]) {
        this.initiatedepositForm.value.maxid = value["maxId"];
        this.getInitatedepositDetailsByMaxId();
      }
    });
  }

  ngAfterViewInit(): void {
    this.questions[0].elementRef.addEventListener("keypress", (event: any) => {
      // If the user presses the "Enter" key on the keyboard

      if (event.key === "Enter") {
        event.preventDefault();
        if (this.initiatedepositForm.value.maxid == "") {
          this.messageDialogService.error("Blank Registration Number is not Allowed");
        }
        else {
          this.iacode = this.initiatedepositForm.value.maxid.split(".")[0];
          this.regNumber = Number(this.initiatedepositForm.value.maxid.split(".")[1]);
          if ((this.iacode != "" && this.iacode != "0") && (this.regNumber != 0 && !Number.isNaN(Number(this.regNumber)))) {
            this.getDepositType();
           // this.getPatientDetailsForDeposit();

          } else {
            this.initiatedepositForm.controls["maxid"].setErrors({ incorrect: true });
            this.questions[0].customErrorMessage = "Invalid Max ID";
          }
        }
      }
    });
  }
  
  resetinitiatedeposit(){
    this.initiatedepositForm.reset();
  }

  getInitatedepositDetailsByMaxId(){
    if (this.initiatedepositForm.value.maxid == "" && this.initiatedepositForm.value.mobileno == "") {
      this.messageDialogService.error("Please enter either MAX Id or Mobile No. for search");
    }
  }
  getDepositType() {
    this.http
      .get(ApiConstants.getadvancetype(this.hspLocationid))
      .pipe(takeUntil(this._destroying$))
      .subscribe((resultData: any) => {
        this.patientdeposittype = resultData;
      });
  }


}
