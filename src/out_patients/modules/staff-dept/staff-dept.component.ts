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
  staffDetails : any =[];
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
    displayedColumns: ['enterBy','groupCompanyName', 'empCode', 'empName','dob','gender','doj'],
    columnsInfo: {
      enterBy: {
        title: 'S.No',
        type: 'number',
        style: {
          width: "70px",
        },
      },
      groupCompanyName : {
        title: 'Name of Organisation',
        type: 'string',
        style: {
          width: "170px",
        },
      },
      empCode : {
        title: 'Employee Code',
        type: 'string',
        style: {
          width: "150px",
        },
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
  search()
  {
     //Search Type Dropdown
     this.http.get(ApiConstants.getstaffdependentdetails(this.staffForm.value.employeeCode,this.staffForm.value.employeeName,this.staffForm.value.organisation))
     .pipe(takeUntil(this._destroying$))
     .subscribe((res :any)=>
     {  
      if(res)
      if(res.dtsStaffDependentDetails[0].relationship =="Self")
      {
       
        this.staffDetails.push(res.dtsStaffDependentDetails[0]);
        if(this.staffDetails)
        this.staffDeptDetails = res.dtsStaffDependentDetails;
      }
      });
     // this.staffDetails = res.dtsStaffDependentDetails1; 
    
      //this.staffDeptDetails = res.
      console.log(this.staffDetails,"res.dtsStaffDependentDetails[0].relationship")
     
     //});
    
  }
  staffColumnClick(event:any)
  {
    console.log(event.row,"column");
  }

}
