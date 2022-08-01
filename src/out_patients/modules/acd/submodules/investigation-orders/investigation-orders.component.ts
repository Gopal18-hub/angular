import { Component, OnInit } from '@angular/core';
import { FormGroup} from '@angular/forms';
import { QuestionControlService } from '../../../../../shared/ui/dynamic-forms/service/question-control.service';
import { __values } from 'tslib';
import { DatePipe } from "@angular/common";
import { HttpService } from '@shared/services/http.service';
import { ApiConstants } from '../../../../../out_patients/core/constants/ApiConstants';
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";

@Component({
  selector: 'out-patients-investigation-orders',
  templateUrl: './investigation-orders.component.html',
  styleUrls: ['./investigation-orders.component.scss']
})
export class InvestigationOrdersComponent implements OnInit {
  investigationForm!: FormGroup;
  from: any;
  to: any;
  today = new Date();
  isShowInvestigation :boolean = true;
  isShowMedical : boolean = false;
  isBtnDisable : boolean = true;
  isBtnDisableClear : boolean = true;
  name:any;  
  questions: any;
  private readonly _destroying$ = new Subject<void>();

  investigationDetails : any ;
  
  
  investigationFormData={
    title: "",
    type: "object",
    properties:{
      datecheckbox: {
        type: "checkbox",
        options: [
          {
            title: "",
          },
        ],
      },
      fromdate:{
        type:"date",
      },
      todate:{
        type:"date",
      },
      maxid:{
        type: "dropdown",                       
        placeholder: "Select",  
        options: [
          {title: "MaxId",value:"maxId"  },
          {title: "Patient Name",value:"patientName"  },
          {title: "Doctor Name",value:"doctorName"  },
          {title: "Mobile Number",value:"mobile"  }
        ], 
       
      },     
      input:{
        type:"string",
        placehokder:"BLKH.",
      },
     
      status:{
        type:"dropdown",
        placeholder:"Select",
        options: [
          {title: "All",value:"all"  },
          {title: "Billed",value:"billed"  },
          {title: "Unbilled",value:"unbilled"  },
          {title: "Partially billed",value:"partial"  },
          {title: "Denied",value:"denied"  },
        ], 
      },
      denyorder:{
        type:"dropdown",
      },
      remarks:{
        type:"string",
      }
    
    }
  }
  investigationConfig: any  = {
    actionItems: false,
    dateformat: 'dd/MM/yyyy',
    selectBox : false,
    displayedColumns: ['orderid','maxid', 'patientname', 'docname','dept','visitdate','mobile','amnt','channel','billno','status'],
    rowLayout:{dynamic:{rowClass:"row['status']"}},
    clickedRows:true,
    clickSelection : "single",
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
        type: 'input'
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
        status:"Billed"
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
        status:"Billed"
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
        status:"Partial"
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
        status:"Denied"
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
  constructor(private formService: QuestionControlService,public datepipe: DatePipe,private http: HttpService,) { 
   
  }

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

  search()
  {
    this.http.get(ApiConstants.geteprescriptdrugorders("2020-01-01","2020-04-04",7,0))    
      .pipe(takeUntil(this._destroying$))
      .subscribe((res :any)=>
      {  
        console.log(res,"resACD")
        this.investigationDetails = res;
  } )  
} 

}
