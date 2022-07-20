import { Placeholder } from '@angular/compiler/src/i18n/i18n_ast';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApiConstants } from '@core/constants/ApiConstants';
import { QuestionControlService } from '../../../shared/ui/dynamic-forms/service/question-control.service';
import { MessageDialogService } from '../../../shared/ui/message-dialog/message-dialog.service';
import { HttpService } from '@shared/services/http.service';
import { DatePipe } from '@angular/common';
import { CookieService } from '@shared/services/cookie.service';
import { getpatienthistorytransactiontypeModel } from '@core/models/getpatienthistorytransactiontypeModel.Model';
import { getRegisteredPatientDetailsModel } from '@core/models/getRegisteredPatientDetailsModel.Model';
import { getPatientHistoryModel } from '@core/models/getPatientHistoryModel.Model';
import { Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'out-patients-patient-history',
  templateUrl: './patient-history.component.html',
  styleUrls: ['./patient-history.component.scss']
})
export class PatientHistoryComponent implements OnInit {

  public patientDetails: getRegisteredPatientDetailsModel[] = [];
  public transactiontype: getpatienthistorytransactiontypeModel[] = [];
  public patienthistorylist: getPatientHistoryModel[] = [];
  patienthistoryFormData = {
    title: "",
    type: "object",
    properties: {
      maxid: {
        type: "string",
        defaultValue: this.cookie.get("LocationIACode") + ".",
      },
      mobile: {
        type: "number",
        readonly: true
      },
      fromdate: {
        type: "date",
        maximum: new Date(),
      },
      todate: {
        type: "date",
        maximum: new Date(),
      },
      transactiontype: {
        type: "dropdown",
        options: this.transactiontype,
      }
    },
  };
  patienthistoryform!: FormGroup;
  questions: any;

  config: any = {
    clickedRows: true,
    // clickSelection: "single",
    actionItems: false,
    dateformat: "dd/MM/yyyy",
    selectBox: true,
    displayedColumns: [
      "billno",
      "type",
      "billdate",
      "ipno",
      "admdischargedate",
      "billamt",
      "discountamt",
      "receiptamt",
      "refundamt",
      "balanceamt",
      "company",
      "operatorname",
      "printIcon",
    ],
    columnsInfo: {
      billno: {
        title: "Bill.No",
        type: "string",
      },
      type: {
        title: "Type",
        type: "string",
      },
      billdate: {
        title: "Bill Date",
        type: "date",
      },
      ipno: {
        title: "IP No.",
        type: "number",
      },
      admdischargedate: {
        title: "Adm/Discharge Date",
        type: "date",
      },
      billamt: {
        title: "Bill Amt",
        type: "number",
      },
      discountamt: {
        title: "Discount Amt",
        type: "number",
      },
      receiptamt: {
        title: "Receipt Amt",
        type: "number",
      },
      refundamt: {
        title: "Refund Amt",
        type: "number",
      },
      balanceamt: {
        title: "Balance Amt",
        type: "number",
      },
      company: {
        title: "Company",
        type: "string",
        tooltipColumn: "company"
      },
      operatorname: {
        title: "Operator Name",
        type: "string",
        tooltipColumn: "operatorname"
      },
      printIcon: {
        title: "Print History",
        type: "image",
        width: 25,
        style: {
          width: "100px",
        },
        disabledSort: true,
      },
    },
  };
  data: any[] = [
    { billno: 'BLDP24920', type: 'OP Refund', billdate: '05/11/2022', ipno: '1234', admdischargedate: '05/11/2022', billamt: '150.00', discountamt: '0.00', receiptamt: '1000.00',
    refundamt: '0.0', balanceamt: '10000.00', company: 'DGEHS-NABH (BLK)', operatorname: 'Sanjeev Singh (EMP001)', printhistory: ''
    },
    { billno: 'BLDP24921', type: 'IP Deposit', billdate: '05/11/2022', ipno: '1234', admdischargedate: '05/11/2022', billamt: '150.00', discountamt: '0.00', receiptamt: '1000.00',
      refundamt: '0.0', balanceamt: '10000.00', company: 'DGEHS-NABH (BLK)', operatorname: 'Sanjeev Singh (EMP001)', printhistory: ''
    },
    { billno: 'BLDP24922', type: 'IP Refund', billdate: '05/11/2022', ipno: '1234', admdischargedate: '05/11/2022', billamt: '150.00', discountamt: '0.00', receiptamt: '1000.00',
      refundamt: '0.0', balanceamt: '10000.00', company: 'DGEHS-NABH (BLK)', operatorname: 'Sanjeev Singh (EMP001)', printhistory: ''
    },
    { billno: 'BLDP24923', type: 'Er Bill', billdate: '05/11/2022', ipno: '1234', admdischargedate: '05/11/2022', billamt: '150.00', discountamt: '0.00', receiptamt: '1000.00',
      refundamt: '0.0', balanceamt: '10000.00', company: 'DGEHS-NABH (BLK)', operatorname: 'Sanjeev Singh (EMP001)', printhistory: ''
    },
    { billno: 'BLDP24924', type: 'Er Deposit', billdate: '05/11/2022', ipno: '1234', admdischargedate: '05/11/2022', billamt: '150.00', discountamt: '0.00', receiptamt: '1000.00',
      refundamt: '0.0', balanceamt: '10000.00', company: 'DGEHS-NABH (BLK)', operatorname: 'Sanjeev Singh (EMP001)', printhistory: ''
    },
    { billno: 'BLDP24925', type: 'Er Refund', billdate: '05/11/2022', ipno: '1234', admdischargedate: '05/11/2022', billamt: '150.00', discountamt: '0.00', receiptamt: '1000.00',
    refundamt: '0.0', balanceamt: '10000.00', company: 'DGEHS-NABH (BLK)', operatorname: 'Sanjeev Singh (EMP001)', printhistory: ''
    },
    { billno: 'BLDP24926', type: 'Deposit', billdate: '05/11/2022', ipno: '1234', admdischargedate: '05/11/2022', billamt: '150.00', discountamt: '0.00', receiptamt: '1000.00',
      refundamt: '0.0', balanceamt: '10000.00', company: 'DGEHS-NABH (BLK)', operatorname: 'Sanjeev Singh (EMP001)', printhistory: ''
    },
    { billno: 'BLDP24927', type: 'Deposit', billdate: '05/11/2022', ipno: '1234', admdischargedate: '05/11/2022', billamt: '150.00', discountamt: '0.00', receiptamt: '1000.00',
      refundamt: '0.0', balanceamt: '10000.00', company: 'DGEHS-NABH (BLK)', operatorname: 'Sanjeev Singh (EMP001)', printhistory: ''
    },
    { billno: 'BLDP24928', type: 'Deposit', billdate: '05/11/2022', ipno: '1234', admdischargedate: '05/11/2022', billamt: '150.00', discountamt: '0.00', receiptamt: '1000.00',
      refundamt: '0.0', balanceamt: '10000.00', company: 'DGEHS-NABH (BLK)', operatorname: 'Sanjeev Singh (EMP001)', printhistory: ''
    },
    { billno: 'BLDP24929', type: 'Deposit', billdate: '05/11/2022', ipno: '1234', admdischargedate: '05/11/2022', billamt: '150.00', discountamt: '0.00', receiptamt: '1000.00',
      refundamt: '0.0', balanceamt: '10000.00', company: 'DGEHS-NABH (BLK)', operatorname: 'Sanjeev Singh (EMP001)', printhistory: ''
    }
  ]

  pname:any;
  age:any;
  gender:any;
  dob:any;
  nationality:any;
  ssn:any;

  findpathisimage: string | undefined;
  findpathismessage: string | undefined;
  patienthistorytable: boolean = false;
  defaultUI: boolean = true;
  printbtn:boolean = true;

  hsplocationId:any = Number(this.cookie.get("HSPLocationId"));
  stationId:any = Number(this.cookie.get("stationId"));
  @ViewChild("table") tableRows: any;
  private readonly _destroying$ = new Subject<void>();
  constructor( 
    private formService: QuestionControlService, 
    private msgdialog: MessageDialogService, 
    private http: HttpService, 
    private datepipe: DatePipe,
    private cookie: CookieService) { }
  today: any;
  fromdate: any;
  ngOnInit(): void {
    this.patienthistorylist = this.data;
    this.findpathismessage = "Enter MAX ID";
    this.findpathisimage = "placeholder";
    let formResult: any = this.formService.createForm(
      this.patienthistoryFormData.properties,
      {}
    );
    this.patienthistoryform = formResult.form;
    this.questions = formResult.questions;
    this.today = new Date();
    this.patienthistoryform.controls["todate"].setValue(this.today);
    this.fromdate = new Date(this.today);
    this.fromdate.setDate(this.fromdate.getDate() - 20);
    this.patienthistoryform.controls["fromdate"].setValue(this.fromdate);
    this.gettransactiontype();
    console.log(this.data);
  }
  ngAfterViewInit(): void{
    this.questions[0].elementRef.addEventListener("keypress", (event: any) => {
      if (event.key === "Enter") {
        event.preventDefault();
        this.getPatientDetails();
      }
    });
  }
  gettransactiontype()
  {
    this.http.get(ApiConstants.gettransactiontype)
    .pipe(takeUntil(this._destroying$))
    .subscribe((resultdata: any)=>{
      this.transactiontype = resultdata;
      console.log(this.transactiontype);
      this.patienthistoryform.controls["transactiontype"].setValue(this.transactiontype[0].valueString);
      this.questions[4].options = this.transactiontype.map((l)=>{
        return { title: l.dispalyString, value: l.valueString}
      })
    })
  }
  getPatientDetails()
  {
    let regnumber = Number(this.patienthistoryform.value.maxid.split(".")[1]);
      let iacode = this.patienthistoryform.value.maxid.split(".")[0];
      this.http
        .get(ApiConstants.getregisteredpatientdetails(iacode, regnumber))
        .pipe(takeUntil(this._destroying$))
        .subscribe((resultData: getRegisteredPatientDetailsModel[]) => {
            console.log(resultData);
            if(resultData.length == 0)
            {
              this.msgdialog.info("Registration number does not exist");
            }
            else
            {
              this.patientDetails = resultData;
              this.pname = this.patientDetails[0].title +" "+ this.patientDetails[0].firstName +" "+this.patientDetails[0].lastName;
              this.age = this.patientDetails[0].age +" "+this.patientDetails[0].ageTypeName;
              this.gender = this.patientDetails[0].genderName;
              this.dob = this.datepipe.transform(this.patientDetails[0].dateOfBirth, "dd-MM-YYYY");
              this.nationality = this.patientDetails[0].nationality;
              this.ssn = this.patientDetails[0].ssn;
              this.patienthistoryform.controls["mobile"].setValue(this.patientDetails[0].mobileNo);
              this.questions[0].readonly = true;
              this.patienthistorysearch();
            }  
          },
          (error)=>{
            console.log(error);
            this.msgdialog.info("Registration number does not exist");
          }
        );
  }

  patienthistorysearch()
  {
    if(this.patienthistoryform.value.maxid == '' || this.patienthistoryform.value.maxid == undefined || this.patienthistoryform.value.maxid == this.cookie.get("LocationIACode") + "." || this.patientDetails.length == 0)
    {
      this.msgdialog.info("Please Enter SSN/MAX ID");
    }
    else if(this.patientDetails.length == 1)
    {
      console.log(this.patienthistoryform.value);
      let regnumber = Number(this.patienthistoryform.value.maxid.split(".")[1]);
      let iacode = this.patienthistoryform.value.maxid.split(".")[0];
      if(regnumber != 0){
        this.http.get(ApiConstants.getpatienthistory(
          this.datepipe.transform(this.patienthistoryform.value.fromdate, "YYYY-MM-dd"),
          this.datepipe.transform(this.patienthistoryform.value.todate, "YYYY-MM-dd"),
          iacode,
          regnumber,
          this.hsplocationId,
          this.stationId
        ))
        .pipe(takeUntil(this._destroying$))
        .subscribe((resultdata:any)=>{
          console.log(resultdata);
          if(resultdata.length == 0)
          {
            console.log("empty");
            this.defaultUI = false;
            this.patienthistorytable = true;
            this.patienthistorylist = this.data;
            this.patienthistorylist = this.setimage(this.patienthistorylist); 
            this.printbtn = false;
            // this.patienthistorytable = false;
            // this.defaultUI = true;
            // this.findpathismessage = "No records found";
            // this.findpathisimage = "norecordfound";
          }
          else{
            this.defaultUI = false;
            this.patienthistorytable = true;
            this.patienthistorylist = this.data;
            this.printbtn = false;
            // this.patienthistorylist = resultdata;
          }
        },
        (error)=>{
          console.log(error);
          // this.patienthistorytable = false;
          // this.defaultUI = true;
          // this.findpathismessage = "No records found";
          // this.findpathisimage = "norecordfound";
        }
        )
      }
    }
    
  }
  printdialog()
  {  
    console.log(this.tableRows.selection.selected);  
    if(this.tableRows.selection.selected.length > 0)
    {
      this.msgdialog.success("Printing Successfull");
    }
  }
  clear()
  {
    this.patienthistoryform.reset();
    this.pname = '';
    this.age = '';
    this.gender = '';
    this.dob = '';
    this.nationality = '';
    this.ssn = '';
    this.today = new Date();
    this.patienthistoryform.controls["todate"].setValue(this.today);
    this.fromdate = new Date(this.today);
    this.fromdate.setDate(this.fromdate.getDate() - 20);
    this.patienthistoryform.controls["fromdate"].setValue(this.fromdate);
    this.patienthistoryform.controls["transactiontype"].setValue(this.transactiontype[0].valueString);
    this.questions[0].readonly = false;
    this.patienthistorytable = false;
    this.defaultUI = true;
    this.patienthistoryform.controls["maxid"].setValue(this.cookie.get("LocationIACode") + ".");
    this.patientDetails = [];
    this.printbtn = true;
  }
  

  printrow(event:any){
    console.log(event);
    console.log(this.tableRows.selection.selected.length);
    if(event.column == "printIcon" || this.tableRows.selection.selected.length > 0){
      console.log(event.row.billno);
      this.msgdialog.success("Printing Successfull");
    }
  }

  setimage(patienthsitory: getPatientHistoryModel[],
    model: any = getPatientHistoryModel)
  {
    patienthsitory.forEach((e) => {
      e.printIcon = this.getimage();
    });
    return  patienthsitory as typeof model;
  }

  getimage()
  {
    let returnicon: any = [];
    var tempPager: any = {
      src:
        "assets/print_Icon.svg"
    };
    returnicon.push(tempPager);

    return returnicon;
  }
}
