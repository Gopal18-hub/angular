import { Component, OnInit } from '@angular/core';
import { FormGroup} from '@angular/forms';
import { QuestionControlService } from '../../../shared/ui/dynamic-forms/service/question-control.service';
import { __values } from 'tslib';

@Component({
  selector: 'out-patients-staff-dept',
  templateUrl: './staff-dept.component.html',
  styleUrls: ['./staff-dept.component.scss']
})
export class StaffDeptComponent implements OnInit {
  orgList=["id","1","name","Max HealthCare"]
  staffFormData={
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
      {
        sno:"2",
        organisation:"Max healthcare",
        empCode:"B015330",
        empName:"Mr.Amit kumar",
        dob:"05/11/2000",
        gender:"Male",
        doj:"06/11/2022"    
      },
      {
        sno:"3",
        organisation:"Max healthcare",
        empCode:"B015330",
        empName:"Mr.Amit kumar",
        dob:"05/11/2000",
        gender:"Male",
        doj:"06/11/2022"    
      },
      {
        sno:"4",
        organisation:"Max healthcare",
        empCode:"B015330",
        empName:"Mr.Amit kumar",
        dob:"05/11/2000",
        gender:"Male",
        doj:"06/11/2022"    
      },
      {
        sno:"5",
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
      {
        
        empCode:"B015330",
        dependantName:"Mr.Amit kumar",
        dob:"05/11/2000",
        gender:"Male",
        relationship:"Owner"    
      },
      {
        
        empCode:"B015330",
        dependantName:"Mr.Amit kumar",
        dob:"05/11/2000",
        gender:"Male",
        relationship:"Owner"    
      },
      {
        
        empCode:"B015330",
        dependantName:"Mr.Amit kumar",
        dob:"05/11/2000",
        gender:"Male",
        relationship:"Owner"    
      },
      {
        
        empCode:"B015330",
        dependantName:"Mr.Amit kumar",
        dob:"05/11/2000",
        gender:"Male",
        relationship:"Owner"    
      }
     
    ]

  constructor(private formService: QuestionControlService) { }

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.staffFormData.properties,
      {}
    );
    this.staffForm = formResult.form;
    this.questions = formResult.questions;
  }
  showmain(link:any)
  {
    
  }

}
