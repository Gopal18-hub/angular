import { Component, OnInit } from '@angular/core';
import { FormGroup} from '@angular/forms';
import { QuestionControlService } from '../../../shared/ui/dynamic-forms/service/question-control.service';
import { __values } from 'tslib';
import { HttpService } from '@shared/services/http.service';
import { ApiConstants } from '../../../out_patients/core/constants/ApiConstants';
import { StaffDependentTypeModel } from "@core/models/staffDependentTypeModel.Model";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";

@Component({
  selector: 'out-patients-staff-dept',
  templateUrl: './staff-dept.component.html',
  styleUrls: ['./staff-dept.component.scss']
})
export class StaffDeptComponent implements OnInit {
  public staffDependentTypeList: StaffDependentTypeModel[] = [];
  staffDetails : any;
  staffDeptDetails : any;
  private readonly _destroying$ = new Subject<void>();
  orgList=["id","1","name","Max HealthCare"]
  staffFormData={
    title: "",
    type: "object",
    properties:{
      organisation:{
        type: "dropdown",              
        options: this.staffDependentTypeList,     
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
    displayedColumns: ['sno','groupCompanyName', 'empCode', 'empName','dob','gender','doj'],
    columnsInfo: {
      sno: {
        title: 'S.No',
        type: 'number'
      },
      groupCompanyName : {
        title: 'Name of Organisation',
        type: 'string'
      },
      empCode : {
        title: 'Employee Code',
        type: 'string'
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

  constructor(private formService: QuestionControlService,private http: HttpService,) { }

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.staffFormData.properties,
      {}
    );
    this.staffForm = formResult.form;
    this.questions = formResult.questions;
     //Search Type Dropdown
     this.http.get(ApiConstants.getstaffdependentsearchtype())
     .pipe(takeUntil(this._destroying$))
     .subscribe((res :any)=>
     {   
      this.staffDependentTypeList= res;      
      this.questions[0].options = this.staffDependentTypeList.map((l) => {
        return { title: l.name, value: l.id };
      });    
     });
  }
  showmain(link:any)
  {
    
  }
  search()
  {
     //Search Type Dropdown
     this.http.get(ApiConstants.getstaffdependentdetails(this.staffForm.value.employeeCode,this.staffForm.value.employeeName,this.staffForm.value.organisation))
     .pipe(takeUntil(this._destroying$))
     .subscribe((res :any)=>
     {  
      this.staffDetails = res.dtsStaffDependentDetails1; 
      this.staffDeptDetails = res.dtsStaffDependentDetails;
      //this.staffDeptDetails = res.
      // resultData = resultData.map((item: any) => {
      //   item.fullname = item.firstName + " " + item.lastName;
      //   return item;
      // });
     
     });
    
  }
  staffColumnClick(event:any)
  {
    console.log(event.row,"column");
  }

}
