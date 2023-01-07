import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { QuestionControlService } from '@shared/ui/dynamic-forms/service/question-control.service';
import {  depositStatusModel} from '@core/types/depositStatusModel.Interface'
import { HttpService } from '@shared/services/http.service';
import { ApiConstants } from '@core/constants/ApiConstants';
import { Subject, takeUntil } from 'rxjs';
import {onlinedeposit} from "@core/types/getOnlineDepositModel.Interface";
import { DatePipe } from '@angular/common';
import { CookieService } from '@shared/services/cookie.service';

@Component({
  selector: 'out-patients-online-deposit-report',
  templateUrl: './online-deposit-report.component.html',
  styleUrls: ['./online-deposit-report.component.scss']
})
export class OnlineDepositReportComponent implements OnInit {

  public depositstatus: depositStatusModel[] = [];
  public onlinedepositlist: onlinedeposit[] = [];
  private readonly _destroying$ = new Subject<void>();

 

  constructor( 
    private formService:QuestionControlService, 
    private http: HttpService, 
    private datepipe: DatePipe,
    private cookie: CookieService) { }
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
        type: "dropdown",
        // type:"dropdown",
        //placeholder: '--All--',  
        options: this.depositstatus,
        value:0,     
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
         "statusDesc",
        // "statusCode",
        // "statusDesc",
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
        // "initDep_OtherDetail"

      ],
      columnsInfo: {
        maxid: {
          title: "Max ID",
          type: "string",
          style: {
            width: "5rem"
          }
        },
        eMailID: {
          title: "Email ID",
          type: "string",
          style: {
            width: "8rem"
          }
        },
        mobileNo: {
          title: "Mobile No",
          type: "number",
          style: {
            width: "6rem"
          }
        },
        depositType: {
          title: "Deposit Type",
          type: "string",
          style: {
            width: "7rem"
          }
          
        },
        amount: {
          title: "Amount",
          type: "number",
          style: {
            width: "4rem"
          }
        },
        stationName: {
          title: "Station Name",
          type: "string",
          style: {
            width: "12rem"
          }
        },
        statusDesc:{
          title: "Deposit Status ",
          type: "string",
          style: {
            width: "7rem"
          }

        },
        // statusDesc: {
        //   title: "Deposit Statu",
        //   type: "string",
        //   style: {
        //     width: "6rem"
        //   } 
        // },
       
        createDate: {
          title: "Date",
          type: "date",
          style: {
            width: "7rem"
          }
        },
        depositSource:{
          title: "Deposit Source",
          type: "string",
          style: {
            width: "8rem"
          }
        },
        
        initDep_DateTime: {
          title: "Init Dep Date Time",
          type: "date",
          style: {
            width: "10rem"
          }
        },
        initDep_Response_ID: {
          title: "Init Deposit Response Time",
          type: "date",
          style: {
            width: "13rem"
          }
        },
        pay_Or_PayCheck_Date: {
          title: "Pay Or Pay Check Date",
          type: "string",
          style: {
            width: "10rem"
          }
        },
        pay_reference_no: {
          title: "Pay Reference No",
          type: "number",
          style: {
            width: "10rem"
          }
        },
        pay_bank_ref_no: {
          title: "Pay Bank Reference No",
          type: "number",
          style: {
            width: "10rem"
          }
        },
        hiS_UpdateDateTime: {
          title: "HIS Update Date Time",
          type: "date",
          style: {
            width: "10rem"
          }
        },
        hiS_DepositID: {
          title: "HIS Deposit ID",
          type: "string",
          style: {
            width: "10rem"
          }
        },
        receiptNo: {
          title: "Receipt No",
          type: "number",
          style: {
            width: "6rem"
          }
        },
        // initDep_OtherDetail: {
        //   title: "Initial Deposit Other Detail",
        //   type: "string",
        //   style: {
        //     width: "8rem"
        //   }
        // },
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
    this.fromdate = new Date(this.today);
    this.fromdate.setDate(this.fromdate.getDate() - 20);
    this.onlinedepositForm.controls["startdate"].setValue(this.fromdate);
    this.questions[0].maximum =
      this.onlinedepositForm.controls["enddate"].value;
    this.questions[1].minimum =
      this.onlinedepositForm.controls["startdate"].value;
      this.getdepositstatus();
      setTimeout(() => {
        this.onlinedepositsearch();
      }, 1000);
      





    // this.onlinedepositForm = formResult.form;
    // this.questions = formResult.questions;
    // this.today = new Date();
    // this.onlinedepositForm.controls["enddate"].setValue(this.today);
    
    // this.onlinedepositForm.controls["startdate"].setValue(this.fromdate);
    // this.questions[1].maximum = this.onlinedepositForm.controls["enddate"].value;
    // this.questions[0].minimum = this.onlinedepositForm.controls["startdate"].value;
    // this.getdepositstatus();

}
ngAfterViewInit(){
  this.onlinedepositForm.controls['startdate'].valueChanges.subscribe(value => {
    this.questions[1].minimum = value;
  })
  this.onlinedepositForm.controls['enddate'].valueChanges.subscribe(value => {
    this.questions[0].maximum = value;
  })
}
getdepositstatus()
  {
    this.http.get(ApiConstants.getdepositstatus)
    .pipe(takeUntil(this._destroying$))
    .subscribe((resultdata: any)=>{
      this.depositstatus = resultdata;
      console.log(this.depositstatus);
      
      this.questions[2].options = this.depositstatus.map((l)=>{
        return { title: l.statusDesc, value: l.id.toString()}
      })
      this.questions[2] = {...this.questions[2]}
      console.log(this.depositstatus[0].id);
      setTimeout(()=> {
        this.onlinedepositForm.controls["selecttype"].setValue(this.depositstatus[0].id.toString());
      },50);
     // console.log()
      console.log(this.onlinedepositForm.value.selecttype)
    })
  }

  onlinedepositsearch(){
    console.log(this.onlinedepositForm);
    this.onlinedepositlist = [];
    this.http.get(ApiConstants.getonlinedepositreportdata(
      'S',
      'hdfc',
      this.onlinedepositForm.controls["selecttype"].value,
      this.datepipe.transform(this.onlinedepositForm.value.startdate, 'YYYY-MM-dd'),
      this.datepipe.transform(this.onlinedepositForm.value.enddate, "YYYY-MM-dd"),
      Number(this.cookie.get('HSPLocationId'))
    
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
    this.onlinedepositForm.controls["enddate"].setValue(this.today);
    this.fromdate = new Date(this.today);
    this.fromdate.setDate(this.fromdate.getDate() - 20);
    this.onlinedepositForm.controls["startdate"].setValue(this.fromdate);
    this.onlinedepositForm.controls["selecttype"].setValue(this.depositstatus[0].id.toString());
    
   
    console.log(this.onlinedepositlist = []);
  }

}

