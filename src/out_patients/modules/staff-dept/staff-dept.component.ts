import { Component, OnInit } from '@angular/core';
import { FormGroup} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { QuestionControlService } from '../../../shared/ui/dynamic-forms/service/question-control.service';
import { CookieService } from'../../../shared/services/cookie.service';
import { DatePipe } from '@angular/common';
import { __values } from 'tslib';

@Component({
  selector: 'out-patients-staff-dept',
  templateUrl: './staff-dept.component.html',
  styleUrls: ['./staff-dept.component.scss']
})
export class StaffDeptComponent implements OnInit {
  orgList=["id","1","name","Max HealthCare"]
  investigatorformData={
    title: "",
    type: "object",
    properties:{
      organisation:{
        type: "dropdown",              
        options: this.orgList,     
      },     
      employeeCode:{
        type:"string",
      },
      employeeName:{
        type:"string",
      }
    }
  }
  name:any;
  staffForm!: FormGroup;
  questions: any;
  config1: any  = {
    actionItems: false,
    dateformat: 'dd/MM/yyyy',
    selectBox : false,
    displayedColumns: ['sno','organisation', 'empCode', 'empName','dob','gender','doj'],
    columnsInfo: {
      sno: {
        title: 'S.No',
        type: 'number'
      },
      organisation : {
        title: 'Name of Organisation',
        type: 'string'
      },
      empCode : {
        title: 'Employee Code',
        type: 'number'
      },
     
      empName : {
        title: 'Employee Name',
        type: 'string'
      },
     
      dob : {
        title: 'DOB',
        type: 'date'
      },
      gender : {
        title: 'Gender',
        type: 'string'
      },
      doj : {
        title: 'DOJ',
        type: 'date'
      },
    
    }
 
    }
  config2: any  = {
    actionItems: false,
    dateformat: 'dd/MM/yyyy',
    selectBox : false,
    displayedColumns: ['empCode', 'dependantName','dob','gender','relationship'],
    columnsInfo: {
      empCode : {
        title: 'Employee Code',
        type: 'string'
      },
      dependantName : {
        title: 'Dependent Name',
        type: 'string'
      },
      dob : {
        title: 'Date Of Birth',
        type: 'date'
      },
      gender : {
        title: 'Gender',
        type: 'string'
      },
      relationship : {
        title: 'Relationship',
        type: 'string'
      },
     
    }
 
    }
    data:any[]=[
      {
        sno:"1",
        organisation:"Max healthcare",
        empCode:"B015330",
        empName:"Mr.Amit kumar",
        dob:"05/11/2000",
        gender:"Male",
        doj:"06/11/2022"    
      },
     
    ]
    data1:any[]=[
      {
        
        empCode:"B015330",
        dependantName:"Mr.Amit kumar",
        dob:"05/11/2000",
        gender:"Male",
        relationship:"Owner"    
      },
     
    ]

  constructor(private dialog:MatDialog,
    private formService: QuestionControlService,
    private cookie: CookieService) { }

  ngOnInit(): void {

    let formResult: any = this.formService.createForm(
      this.investigatorformData.properties,
      {}
    );
    this.staffForm = formResult.form;
    this.questions = formResult.questions;
  }

}
