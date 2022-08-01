import { Component, OnInit } from '@angular/core';
import { FormGroup} from '@angular/forms';
import { QuestionControlService } from '../../../shared/ui/dynamic-forms/service/question-control.service';
import { __values } from 'tslib';
import { HttpService } from '@shared/services/http.service';
import { ApiConstants } from '../../../out_patients/core/constants/ApiConstants';
import { StaffDependentTypeModel } from "@core/models/staffDependentTypeModel.Model";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { MessageDialogService } from "@shared/ui/message-dialog/message-dialog.service";

@Component({
  selector: 'out-patients-staff-dept',
  templateUrl: './staff-dept.component.html',
  styleUrls: ['./staff-dept.component.scss']
})
export class StaffDeptComponent implements OnInit {
  public staffDependentTypeList: StaffDependentTypeModel[] = [];
  staffDetails : any ;
  staffDetail: any=[];
  staffDeptDetails : any;
  selectedCode : any;
  private readonly _destroying$ = new Subject<void>();
  orgList=["id","1","name","Max HealthCare"]
  staffFormData={
    title: "",
    type: "object",
    properties:{
      organisation:{
        type: "dropdown",              
        options: this.staffDependentTypeList, 
        placeholder: "Select",    
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
          width: "100px",
        },
      },
      groupCompanyName : {
        title: 'Name of Organisation',
        type: 'string',
        style: {
          width: "300px",
        },
      },
      empCode : {
        title: 'Employee Code',
        type: 'string',
        style: {
          width: "250px",
        },
      },
     
      empName : {
        title: 'Employee Name',
        type: 'string',
        style: {
          width: "300px",
        },
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
        type: 'string',
        style: {
          width: "240px",
        },
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
   
  constructor(private formService: QuestionControlService,private http: HttpService,private messageDialogService: MessageDialogService,) { }

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
  staffColumnClick(event:any)
  {
    this.staffDeptDetails = [];
    this.selectedCode = event.row.empCode;      
     this.http.get(ApiConstants.getstaffdependentdetails(1,this.selectedCode,""))
     .pipe(takeUntil(this._destroying$))
     .subscribe((res :any)=>
     {  
      this.staffDeptDetails = res.dtsStaffDependentDetails
     })
  }

  search()
  {
    
    if(this.staffForm.value.organisation === "")
    {
      this.messageDialogService.info("Select Search Type");
    }
    else if(this.staffForm.value.employeeCode === "" && this.staffForm.value.employeeName === "")
    {
      this.messageDialogService.info("At least one information is required to search.");
    }
    else
    {
      var employeeCode = String(this.staffForm.value.employeeCode.trim());
      var employeeName = String(this.staffForm.value.employeeName.trim());
      
      this.http.get(ApiConstants.getstaffdependentdetails(this.staffForm.value.organisation,employeeCode,employeeName))
      //this.http.get(ApiConstants.getstaffdependentdetails(1,"","sab"))
      //this.http.get(ApiConstants.getstaffdependentdetails(1,"m015842",""))
      .pipe(takeUntil(this._destroying$))
      .subscribe((res :any)=>
      {  
       if(res)      
       this.staffDeptDetails=[];     
       this.staffDetails=[];
       res.dtsStaffDependentDetails.forEach((e:any) => {
         if(e.relationship === "Self")
         {        
           this.staffDetail.push(e);
         }
       });       
      if(this.staffDetail.length === 0)
      {
        this.messageDialogService.info("No Records Founds.");
      }      
       else if(this.staffDetail.length > 1)
       {
         this.staffDetails=res.dtsStaffDependentDetails;
       }       
       else{
         this.staffDeptDetails = res.dtsStaffDependentDetails;
         if(res.dtsStaffDependentDetails[0].relationship == "Self")
              this.staffDetail.push(res.dtsStaffDependentDetails[0]);
              this.staffDetails = this.staffDetail;
              this.staffDetail=[];              
       }
       });
    }   
    
    
  }
 
}
