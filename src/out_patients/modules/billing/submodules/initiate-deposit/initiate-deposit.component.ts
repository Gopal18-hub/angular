import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import { QuestionControlService } from '@shared/ui/dynamic-forms/service/question-control.service';
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: 'out-patients-initiate-deposit',
  templateUrl: './initiate-deposit.component.html',
  styleUrls: ['./initiate-deposit.component.scss']
})
export class InitiateDepositComponent implements OnInit {

  constructor(public matDialog: MatDialog, private formService:QuestionControlService) { }
  
  
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
  
  private readonly _destroying$ = new Subject<void>();
  ngOnInit(): void {
    let formResult = this.formService.createForm(
      this.initiatedepositformdata.properties,{}
    );
    this.initiatedepositForm=formResult.form;
    this.questions=formResult.questions;
  }

}
