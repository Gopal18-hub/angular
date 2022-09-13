import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { QuestionControlService } from '@shared/ui/dynamic-forms/service/question-control.service';
import {  depositStatusModel} from '@core/types/depositStatusModel.Interface'
import { HttpService } from '@shared/services/http.service';
import { ApiConstants } from '@core/constants/ApiConstants';
import { Subject, takeUntil } from 'rxjs';
import {onlinedeposit} from "@core/types/getOnlineDepositModel.Interface";
import { DatePipe } from '@angular/common';

@Component({
  selector: 'out-patients-online-deposit-report',
  templateUrl: './online-deposit-report.component.html',
  styleUrls: ['./online-deposit-report.component.scss']
})
export class OnlineDepositReportComponent implements OnInit {

  public depositstatus: depositStatusModel[] = [];
  public onlinedepositlist: onlinedeposit[] = [];
  private readonly _destroying$ = new Subject<void>();

 

  constructor( private formService:QuestionControlService, private http: HttpService, private datepipe: DatePipe) { }
  // @ViewChild("onlinedeposittable") onlinedeposittable: any;
  onlineDepositformdata = {
    type:"object",
    title:"",
    properties:{
      startdate:{
        type:"date",
      },
      enddate:{
        type:"date",
      },
      selecttype:{
        type:"dropdown",  
        options: this.depositstatus,      
      },
    }
  }
  config1:any = {
    clickedRows: true,
    actionItems: false,
    dateformat: "dd/MM/yyyy",
    selectBox: false,
    displayedColumns: [
      "maxId",
      "eMailID",
      "mobileNo",
      "depositType",
      "amount",
      "stationName",
      "statusCode",
      "statusDesc",

    ],
    columnsInfo: {
      maxId: {
        title: "Max ID",
        type: "string",
        
      },
      eMailID: {
        title: "Email ID",
        type: "string",
      },
      mobileNo:{
        title:"Mobile No",
        type:"number",
      },
      depositType: {
        title: "Deposit Type",
        type: "string",
        
      },
      amount: {
        title: "Amount",
        type: "number",
      },
      stationName:{
        title: "Station Name",
        type: "string",
      },
      statusCode:{
        title: "Deposit Status",
        type: "string",
        
      },
      statusDesc:{
        
      }
      
    },
  }

  config:any = {
      clickedRows: true,
      actionItems: false,
      dateformat: "dd/MM/yyyy",
      selectBox: false,
      displayedColumns: [
        "maxid",
        "eMailID",
        "mobileNo",
        "depositType",
        "amount",
        "stationName",
        "statusCode",
        "statusDesc",
        "createDate",
        "depositSource",
        "initDep_DateTime",
        "initDep_Response_ID",
        "pay_Or_PayCheck_Date",
        "pay_reference_no",    
        "pay_bank_ref_no",
        "hiS_UpdateDateTime",
        "hiS_DepositID",
        "receiptNo",
        "initDep_OtherDetail"

      ],
      columnsInfo: {
        maxid: {
          title: "Max ID",
          type: "string",
          
        },
        eMailID: {
          title: "Email ID",
          type: "string",
        },
        mobileNo: {
          title: "Mobile No",
          type: "number",
        },
        depositType: {
          title: "Deposit Type",
          type: "string",
          
        },
        amount: {
          title: "Amount",
          type: "number",
        },
        stationName: {
          title: "Station Name",
          type: "string",
        },
        statusCode: {
          title: "Deposit Status",
          type: "string",
          
        },
        statusDesc:{
          title: "Deposit Status Description",
          type: "string",

        },
        createDate: {
          title: "Date",
          type: "date",
        },
        depositSource:{
          title: "Deposit Source",
          type: "string",
        },
        
        initDep_DateTime: {
          title: "Init Dep Date Time",
          type: "date",
        },
        initDep_Response_ID: {
          title: "Init Deposit Response Time",
          type: "date",
        },
        pay_Or_PayCheck_Date: {
          title: "Pay Or Pay Check Date",
          type: "string",
        },
        pay_reference_no: {
          title: "Pay Reference No",
          type: "number",
        },
        pay_bank_ref_no: {
          title: "Pay Bank Reference No",
          type: "number",
        },
        hiS_UpdateDateTime: {
          title: "HIS Update Date Time",
          type: "date",
        },
        hiS_DepositID: {
          title: "HIS Deposit ID",
          type: "string",
        },
        receiptNo: {
          title: "Receipt No",
          type: "number",
        },
        initDep_OtherDetail: {
          title: "Initial Deposit Other Detail",
          type: "string",
        },
      },
    }

  onlinedepositForm !: FormGroup;
  questions:any;
 data = [
   {'maxId':'298382','emailId':'ram@gmail.com','mobileNo':'1234567890','depositType':'OP','amount':'455','stationName':'BLKH','depositStatus':'OP','date':'23/6/2022','depositSource':'BLKH','initdepdatetime':'23/4/2022','initdepResponsetime':'23/4/2022','payOrpayCheck':'PAY','payRefNo':'456','payBankRefNo':'34','HisUpdateDatetime':'23/4/2022','HisDepositID':'344','receiptNo':'566'}
 ]
  // ngOnInit(): void {
  //   let formResult = this.formService.createForm(
  //     this.onlineDepositformdata.properties,{}
  //   );
  //   this.onlinedepositForm=formResult.form;
  //   this.questions=formResult.questions;
  // }

  today: any;
  fromdate: any;

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.onlineDepositformdata.properties,
      {}
    );
    this.onlinedepositForm = formResult.form;
    this.questions = formResult.questions;
    this.today = new Date();
    this.onlinedepositForm.controls["enddate"].setValue(this.today);
    // this.onlinedepositForm = new Date(this.today);
    // this.fromdate.setDate(this.fromdate.getDate() - 20);
    this.onlinedepositForm.controls["startdate"].setValue(this.fromdate);
    this.questions[1].maximum = this.onlinedepositForm.controls["enddate"].value;
    this.questions[0].minimum = this.onlinedepositForm.controls["startdate"].value;
    this.getdepositstatus();

}

getdepositstatus()
  {
    this.http.get(ApiConstants.getdepositstatus)
    .pipe(takeUntil(this._destroying$))
    .subscribe((resultdata: any)=>{
      this.depositstatus = resultdata;
      console.log(this.depositstatus);
      this.onlinedepositForm.controls["selecttype"].setValue(this.depositstatus[0].statusDesc);
      this.questions[2].options = this.depositstatus.map((l)=>{
        return { title: l.statusDesc, value: l.id}
      })
    })
  }

  onlinedepositsearch(){
    console.log(this.onlinedepositForm);
    this.http.get(ApiConstants.getonlinedepositreportdata(
      'S',
      'hdfc',
      this.onlinedepositForm.controls["selecttype"].value,
      this.datepipe.transform(this.onlinedepositForm.value.startdate, 'YYYY-MM-dd'),
      this.datepipe.transform(this.onlinedepositForm.value.enddate, "YYYY-MM-dd"),
      67
    
    ))
    .pipe(takeUntil(this._destroying$))
    .subscribe((resultdata:any)=>{
      console.log(resultdata);
      if(resultdata.length > 0)
      {
        console.log('data');
        this.onlinedepositlist = resultdata;
        this.onlinedepositlist.forEach(item => {
          item.maxid = item.iaCode +'.'+ item.registrationno
        })
        console.log(this.onlinedepositlist);
  }; })
}

clear()
  {
    this.onlinedepositForm.reset();
    this.onlinedepositlist = [];
    this.today = new Date();
    this.onlinedepositForm.controls["startdate"].setValue(this.today);
    this.fromdate = new Date(this.today);
    this.fromdate.setDate(this.fromdate.getDate() - 20);
    this.onlinedepositForm.controls["startdate"].setValue(this.fromdate);
    this.onlinedepositForm.controls["selecttype"].setValue(this.depositstatus[2]);

    
   
    console.log(this.onlinedepositlist = []);
  }

}

