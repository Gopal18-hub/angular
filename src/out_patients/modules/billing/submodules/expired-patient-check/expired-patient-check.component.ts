import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { QuestionControlService } from '../../../../../shared/ui/dynamic-forms/service/question-control.service';

@Component({
  selector: 'out-patients-expired-patient-check',
  templateUrl: './expired-patient-check.component.html',
  styleUrls: ['./expired-patient-check.component.scss']
})
export class ExpiredPatientCheckComponent implements OnInit {
  
  expiredpatientformdata={
    type:"object",
    title:"",
    properties:{
      maxid:{
        type:"string",

      },
      mobileno:{
        type:"number"
      }
    }
  }

  expiredpatientForm!:FormGroup;
  questions:any;

  constructor(
    private formService:QuestionControlService
  ) { }

  ngOnInit(): void {
    let formResult= this.formService.createForm(
      this.expiredpatientformdata.properties,
      {}
    )
    this.expiredpatientForm=formResult.form;
    this.questions=formResult.questions;
  }

}
