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
        options:[{title:"",value:""}]
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
        placeholder:"Select",
        options: [
          {title: "Others",value:"others"  },
          {title: "Price Issue",value:"price"  },
          {title: "PSU Patient",value:"psu"  },
          {title: "After Medication",value:"aftermed"  },
          {title: "Before next review",value:"befreview"  },
          {title: "Show Future Date",value:"future"  },
          {title: "At the time of admission",value:"timeofadmission"  },
          {title: "Machine not functional",value:"machine"  },
        ], 
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
    displayedColumns: ['orderId','maxid', 'ptnName', 'docName','deptName','visitDate','mobileNo','amnt','channel','billNo','status'],
    rowLayout:{dynamic:{rowClass:"row['status']"}},
    clickedRows:true,
    clickSelection : "single",
    columnsInfo: {
      orderId: {
        title: 'Order Id',
        type: 'string'
      },
      maxid : {
        title: 'Max Id',
        type: 'string'
      },
      ptnName : {
        title: 'Patient Name',
        type: 'string'
      },     
      docName : {
        title: 'Doctor Name',
        type: 'string'
      },     
      deptName : {
        title: 'Department',
        type: 'string'
      },
      visitDate : {
        title: 'Visit Date',
        type: 'date'
      },
      mobileNo : {
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
      billNo : {
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
    //Deny order lists
    this.http.get(ApiConstants.getediganosticacd("2020-12-11","2020-12-11",0,0,799041,"SKDD",7)) 
    //this.http.get(ApiConstants.getediganosticacd(this.investigationForm.value.fromdate,this.investigationForm.value.todate,this.investigationForm.value.status,this.investigationForm.value.orderid,0,"",0))    
      .pipe(takeUntil(this._destroying$))
      .subscribe((res :any)=>
      {  
        console.log(res,"getediganosticacd")
        this.investigationDetails = res.objACDDenialReasons;
  } )  
      //Main Grid
  //     this.http.get(ApiConstants.geteprescriptdrugorders("2020-12-11","2020-12-11",7,0)) 
  //   //this.http.get(ApiConstants.getediganosticacd(this.investigationForm.value.fromdate,this.investigationForm.value.todate,this.investigationForm.value.status,this.investigationForm.value.orderid,0,"",0))    
  //     .pipe(takeUntil(this._destroying$))
  //     .subscribe((res :any)=>
  //     {  
  //       console.log(res,"geteprescriptdrugorders")
        
  // } ) 
  //
//   this.http.get(ApiConstants.getphysicianorderdetailep(123123,"SKDD",7,0)) 
//   //this.http.get(ApiConstants.getediganosticacd(this.investigationForm.value.fromdate,this.investigationForm.value.todate,this.investigationForm.value.status,this.investigationForm.value.orderid,0,"",0))    
//     .pipe(takeUntil(this._destroying$))
//     .subscribe((res :any)=>
//     {  
//       console.log(res,"GetPhysicianOrderDetailEP")
      
// } )   
} 

}
