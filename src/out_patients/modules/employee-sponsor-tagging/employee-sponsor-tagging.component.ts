import { Component, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { FormGroup,FormControl} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SavedialogComponent } from './save-dialog/save-dialog.component';
import { DeletedialogComponent } from './delete-dialog/delete-dialog.component';
import { QuestionControlService } from '../../../shared/ui/dynamic-forms/service/question-control.service';
import { CookieService } from'../../../shared/services/cookie.service';
import { DatePipe } from '@angular/common';
import { __values } from 'tslib';
import { CompanydialogComponent } from './companydialog/companydialog.component';

@Component({
  selector: 'out-patients-employee-sponsor-tagging',
  templateUrl: './employee-sponsor-tagging.component.html',
  styleUrls: ['./employee-sponsor-tagging.component.scss']
})
export class EmployeeSponsorTaggingComponent implements OnInit {

  employeesponsorformData={
    title: "",
    type: "object",
    properties:{
      maxId:{
        type:"string",
        defaultValue: (this.cookie.get("LocationIACode")),
        // title:"Max ID"
      },
      mobileNo:{
        type:"number",
        //maximum:10
        // title:"Mobile No"
      },
      employeeCode:{
        type:"string",
        // title:"Employee code"
      },
      company:{
        type:"autocomplete",
        // title:"Company"
      },
      corporate:{
        type:"autocomplete",
        disabled:true
        // title:"Corporate"
      },
      name:{
       type:"string",
        //title:"Name"
      },
      age:{
        type:"number",
        // title:"Age"
      },
      gender:{
        type:"string",
        // title:"Gender"
      },
      dob:{
        type:"string",
        // title:"DOB"
      },
      nationality:{
        type:"string",
        // title:"Nationality"
      },
      ssn:{
        type:"number",
       // title:"SSN"
      },
      datecheckbox:{
        type:"checkbox",
        options:[{
          title:""
        }]
      },
      fromdate:{
        type:"date",
       // title:"From Date"
      },
      todate:{
        type:"date",
        //title:"To Date"
      }
    }
  }

  employeesponsorForm!: FormGroup;

  questions: any;

  constructor(
    private dialog:MatDialog,
    private formService: QuestionControlService,
    private cookie: CookieService,private datepipe:DatePipe
    ) { }

  ngOnInit(): void {
    console.log(this.cookie.get("LocationIACode"));
    
    
    let formResult: any = this.formService.createForm(
      this.employeesponsorformData.properties,
      {}
    );
    this.employeesponsorForm = formResult.form;
    this.questions = formResult.questions;
    let todaydate=new Date();
    this.employeesponsorForm.controls["fromdate"].setValue(todaydate);
    console.log(this.employeesponsorForm.controls["fromdate"].value);
    this.employeesponsorForm.controls["todate"].setValue(todaydate);
    console.log( this.employeesponsorForm.controls["todate"].value);
   //disable fromdate and todate
    this.employeesponsorForm.controls["fromdate"].disable();
    this.employeesponsorForm.controls["todate"].disable();
  //disable corporate dropdown
  this.employeesponsorForm.controls["corporate"].disable();
  
  }
  // employeesponsorform = new FormGroup({
  //   maxId: new FormControl(''),
  //   mobileNo: new FormControl(''),
  //   employeeCode: new FormControl(''),
  //   company:new FormControl(''),
  //   corporate:new FormControl(''),
  //   datecheckbox: new FormControl(''),
  //   fromDate: new FormControl(''),
  //   toDate: new FormControl(''),
  // });



  
  config1: any  = {
    actionItems: true,
    dateformat: 'dd/MM/yyyy',
    selectBox : true,
    displayedColumns: ['groupCompany', 'empCode', 'dob', 'employeeName', 'dependantName','maxid','gender','doj','age','relationship','remarks'],
    columnsInfo: {
      groupCompany : {
        title: 'Group Company',
        type: 'string'
      },
      empCode : {
        title: 'EMP Code',
        type: 'number'
      },
      dob : {
        title: 'DOB',
        type: 'date'
      },
      employeeName : {
        title: 'Employee Name',
        type: 'string'
      },
      dependantName : {
        title: 'Dependant Name',
        type: 'string'
      },
      maxid : {
        title: 'Max Id',
        type: 'string'
      },
      gender : {
        title: 'Gender',
        type: 'string'
      },
      doj : {
        title: 'DOJ',
        type: 'date'
      },
      age : {
        title: 'Age',
        type: 'number'
      },
      relationship : {
        title: 'Relationship',
        type: 'string'
      },
      remarks:{
        title:'Remarks',
        type: 'string'
      }
    }
 
    }
  config2:any={
    actionItems: true,
    dateformat: 'dd/MM/yyyy',
    selectBox : true,
     // dependantName : {
    displayedColumns: ['slno', 'companyname', 'dateandtime', 'addedby', 'updateddate','updatedby'],
    columnsInfo: {
      slno : {
        title: 'Sl.no',
        type: 'string'
      },
      companyname : {
        title: 'Company Name',
        type: 'number'
      },
      dateandtime : {
        title: 'Added Date & Time',
        type: 'date'
      },
      addedby : {
        title: 'Added By',
        type: 'string'
      },
      updateddate : {
        title: 'Updated Date',
        type: 'string'
      },
      updatedby : {
        title: 'Updated By',
        type: 'string'
      },
     
    }
  }

  hospitals=[
    {
      hospitalName:'Apollo',
      Location:'Chennai'
    },
    {
      hospitalName:'MIOT',
      Location:'Chennai'
    },
    {
      hospitalName:'Global',
      Location:'Chennai'
    }
  ]

  disabled(employeesponsorform:any){
    if(employeesponsorform.maxId){
      return true;
    }else{
      return false;

    }
    
    
    // if(this.employeesponsorform.maxId)
  }

  maxidApicall(employeesponsorform:any){
    console.log('insode method');
    employeesponsorform.fromDate=new Date();
    employeesponsorform.mobileNo=834738387;
    console.log(employeesponsorform.fromDate);
    console.log(employeesponsorform.mobileNo);
  }

  opendialog()
  {
    this.dialog.open(SavedialogComponent, {width: '30vw', height: '30vh', data: {
      id: 12334,
      name: 'name'
    }});
  }

  //delete popup
  deletebuttonclick(){
    this.dialog.open(DeletedialogComponent,  {width:'40vw',
      height:'30vh',panelClass:'custom-container'},)
  }

  oncheckboxClick(event:any){
    console.log(event);
    this.employeesponsorForm.controls["datecheckbox"].valueChanges.subscribe(value =>{
      console.log(value);
      if(value== true){
        this.employeesponsorForm.controls["fromdate"].enable();
        this.employeesponsorForm.controls["todate"].enable();
      }else{
        this.employeesponsorForm.controls["fromdate"].disable();
        this.employeesponsorForm.controls["todate"].disable();
      }
    })
  }


  iomClick(){
    this.dialog.open(CompanydialogComponent,{width:'20vw',height:'30vh'})
  }

  clearTabledata(){
    let todaydate=new Date();
    this.employeesponsorForm.controls["fromdate"].setValue(todaydate);
    this.employeesponsorForm.controls["fromdate"].setValue(todaydate);
  }

}
