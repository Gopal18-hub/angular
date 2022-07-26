import { Component, OnInit } from '@angular/core';
import { FormGroup} from '@angular/forms';
import { QuestionControlService } from '../../../shared/ui/dynamic-forms/service/question-control.service';
import { __values } from 'tslib';
import { DatePipe } from "@angular/common";
@Component({
  selector: 'out-patients-acd',
  templateUrl: './acd.component.html',
  styleUrls: ['./acd.component.scss']
})
export class AcdComponent implements OnInit {
  from: any;
  to: any;
  today = new Date();
  link1 = ["Investigation Orders", "Medical Orders"]; 
  activeLink1 = this.link1[0];
  isShowInvestigation :boolean = true;
  isShowMedical : boolean = false;
  isBtnDisable : boolean = true;
  isBtnDisableClear : boolean = true;
  orgList=["id","1","name","Max HealthCare"]
  investigationFormData={
    title: "",
    type: "object",
    properties:{
      fromdate:{
        type:"date",
      },
      todate:{
        type:"date",
      },
      organisation:{
        type: "dropdown",              
        options: this.orgList,  
        placeholder: "Select",   
      },     
      employeeCode:{
        type:"BLKH.",
      },
      employeeName:{
        type:"string",
      },
      status:{
        type:"string",
      },
      denyorder:{
        type:"dropdown",
      },
      remarks:{
        type:"string",
      },
      checkbox:{
        type:"checkbox",
        options:[{
          title:""
        }]
      }
    }
  }
  name:any;
  investigationForm!: FormGroup;
  questions: any;
  config1: any  = {
    actionItems: false,
    dateformat: 'dd/MM/yyyy',
    selectBox : false,
    displayedColumns: ['orderid','maxid', 'patientname', 'docname','dept','visitdate','mobile','amnt','channel','billno','status'],
    columnsInfo: {
      orderid: {
        title: 'Order Id',
        type: 'string'
      },
      maxid : {
        title: 'Max Id',
        type: 'string'
      },
      patientname : {
        title: 'Patient Name',
        type: 'string'
      },     
      docname : {
        title: 'Doctor Name',
        type: 'string'
      },     
      dept : {
        title: 'Department',
        type: 'string'
      },
      visitdate : {
        title: 'Visit Date',
        type: 'date'
      },
      mobile : {
        title: 'Mobile No.',
        type: 'string'
      },
      amnt : {
        title: 'Amount',
        type: 'string'
      },
      channel : {
        title: 'Channel',
        type: 'string'
      },
      billno : {
        title: 'Bill No.',
        type: 'string'
      },
      status : {
        title: 'Order Status',
        type: 'string'
      }
    
    }
 
    }
  config2: any  = {
    actionItems: false,
    dateformat: 'dd/MM/yyyy',
    selectBox : true,
    displayedColumns: ['testname', 'doctorname','priority','visitdatetime','specialization','remarks'],
    columnsInfo: {
      testname : {
        title: 'Test Name',
        type: 'string'
      },
      doctorname : {
        title: 'Doctor Name',
        type: 'string'
      },
      priority : {
        title: 'Priority',
        type: 'string'
      },
      visitdatetime : {
        title: 'Visit Date & Time',
        type: 'string'
      },
      specialization : {
        title: 'Specialization',
        type: 'string'
      },
      remarks : {
        title: 'ACD Remarks',
        type: 'string'
      },
     
    }
 
    }
    config3: any  = {
      actionItems: false,
      dateformat: 'dd/MM/yyyy',
      selectBox : true,
      displayedColumns: ['drugname', 'schedule','drugqty','days','dosagename','visitdate','acdremarks'],
      columnsInfo: {
        drugname : {
          title: 'Drug Name',
          type: 'string'
        },
        schedule : {
          title: 'Schedule',
          type: 'string'
        },
        drugqty : {
          title: 'Drug Qty',
          type: 'string'
        },
        days : {
          title: 'Days',
          type: 'string'
        },
        dosagename : {
          title: 'Dosage Name',
          type: 'string'
        },
        visitdate : {
          title: 'Visit Date',
          type: 'string'
        },
        acdremarks : {
          title: 'ACD Remarks',
          type: 'string'
        },
       
      }
   
      }
    data:any[]=[
      { 
        orderid:"7984778",
        maxid:"SKDO.523278",
        patientname:"ALPIKA SINGH",
        docname:"Saptarshi Bhattacharya",
        dept:"Endocrinology",
        visitdate:"05/11/2022 08.48 AM"  ,
        mobile:"9837866912",
        amnt:"1000.00",
        channel:"Cash",
        billno:"" , 
        status:"Unbilled"
      },
      { 
        orderid:"7984778",
        maxid:"SKDO.523278",
        patientname:"ALPIKA SINGH",
        docname:"Saptarshi Bhattacharya",
        dept:"Endocrinology",
        visitdate:"05/11/2022 08.48 AM"  ,
        mobile:"9837866912",
        amnt:"1000.00",
        channel:"Cash",
        billno:"" , 
        status:"Unbilled"
      },
      { 
        orderid:"7984778",
        maxid:"SKDO.523278",
        patientname:"ALPIKA SINGH",
        docname:"Saptarshi Bhattacharya",
        dept:"Endocrinology",
        visitdate:"05/11/2022 08.48 AM"  ,
        mobile:"9837866912",
        amnt:"1000.00",
        channel:"Cash",
        billno:"" , 
        status:"Unbilled"
      },
      { 
        orderid:"7984778",
        maxid:"SKDO.523278",
        patientname:"ALPIKA SINGH",
        docname:"Saptarshi Bhattacharya",
        dept:"Endocrinology",
        visitdate:"05/11/2022 08.48 AM"  ,
        mobile:"9837866912",
        amnt:"1000.00",
        channel:"Cash",
        billno:"" , 
        status:"Unbilled"
      },
      { 
        orderid:"7984778",
        maxid:"SKDO.523278",
        patientname:"ALPIKA SINGH",
        docname:"Saptarshi Bhattacharya",
        dept:"Endocrinology",
        visitdate:"05/11/2022 08.48 AM"  ,
        mobile:"9837866912",
        amnt:"1000.00",
        channel:"Cash",
        billno:"" , 
        status:"Unbilled"
      }
     
    ]
    data1:any[]=[
      {
        testname:"Glycosylated Hemoglobin (HBA1C)",
        doctorname:"Saptarshi Bhattacharya",
        priority:"Routine",
        visitdatetime:"05/11/2022 08.48 AM",
        specialization:"Internal Medicine" ,
        remarks:""   
      },   
      {
        testname:"Glycosylated Hemoglobin (HBA1C)",
        doctorname:"Saptarshi Bhattacharya",
        priority:"Routine",
        visitdatetime:"05/11/2022 08.48 AM",
        specialization:"Internal Medicine" ,
        remarks:""   
      },   
      {
        testname:"Glycosylated Hemoglobin (HBA1C)",
        doctorname:"Saptarshi Bhattacharya",
        priority:"Routine",
        visitdatetime:"05/11/2022 08.48 AM",
        specialization:"Internal Medicine" ,
        remarks:""   
      },   
      {
        testname:"Glycosylated Hemoglobin (HBA1C)",
        doctorname:"Saptarshi Bhattacharya",
        priority:"Routine",
        visitdatetime:"05/11/2022 08.48 AM",
        specialization:"Internal Medicine" ,
        remarks:""   
      },   
      {
        testname:"Glycosylated Hemoglobin (HBA1C)",
        doctorname:"Saptarshi Bhattacharya",
        priority:"Routine",
        visitdatetime:"05/11/2022 08.48 AM",
        specialization:"Internal Medicine" ,
        remarks:""   
      }  
    ]
    data2:any[]=[
      {
        drugname:"FEBUTA2 ACMG TAB",
        schedule:"Once in a day",
        drugqty:"0",
        days:"60",
        dosagename:"Dosage Name" ,
        visitdate:"05/11/2022 08.32.42AM"   ,
        acdremarks:""
      }, 
      {
        drugname:"FEBUTA2 ACMG TAB",
        schedule:"Once in a day",
        drugqty:"0",
        days:"60",
        dosagename:"Dosage Name" ,
        visitdate:"05/11/2022 08.32.42AM"   ,
        acdremarks:""
      }, 
      {
        drugname:"FEBUTA2 ACMG TAB",
        schedule:"Once in a day",
        drugqty:"0",
        days:"60",
        dosagename:"Dosage Name" ,
        visitdate:"05/11/2022 08.32.42AM"   ,
        acdremarks:""
      }, 
      {
        drugname:"FEBUTA2 ACMG TAB",
        schedule:"Once in a day",
        drugqty:"0",
        days:"60",
        dosagename:"Dosage Name" ,
        visitdate:"05/11/2022 08.32.42AM"   ,
        acdremarks:""
      }, 
      {
        drugname:"FEBUTA2 ACMG TAB",
        schedule:"Once in a day",
        drugqty:"0",
        days:"60",
        dosagename:"Dosage Name" ,
        visitdate:"05/11/2022 08.32.42AM"   ,
        acdremarks:""
      }    
    ] 
  constructor(private formService: QuestionControlService,public datepipe: DatePipe) { }

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.investigationFormData.properties,
      {}
    );
    this.investigationForm = formResult.form;
    this.questions = formResult.questions;
    let todaydate=new Date();
    this.investigationForm.controls["fromdate"].setValue(todaydate);
    
    this.investigationForm.controls["todate"].setValue(todaydate);
   

    if (this.from == undefined && this.to == undefined) {
      this.from = this.datepipe.transform(
        new Date().setMonth(new Date().getMonth() - 2),
        "yyyy-MM-dd"
      );
      this.to = this.datepipe.transform(new Date(), "yyyy-MM-dd");
    }
  }
  showmain(link:any)
  {
    if(link == "Investigation Orders")
    {
    this.activeLink1 = this.link1[0]
    this.isShowInvestigation= true;
    this.isShowMedical= false;
    this.isBtnDisableClear = true;
    }
    else if(link == "Medical Orders")
    {
      this.isShowInvestigation= false;
      this.isShowMedical= true;
      this.isBtnDisableClear = false;
      this.activeLink1 = this.link1[1]
    }
  }
  tabChanged(event:any)
  {
  if(event=="Investigation Orders")
  {
    this.isShowInvestigation= true;
    this.isShowMedical= false;
  }
  else if(event == "Medical Orders")
  {
    this.isShowInvestigation= false;
    this.isShowMedical= true;
  }
}

}
