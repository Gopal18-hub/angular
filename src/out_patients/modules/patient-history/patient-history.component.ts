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
import { ReportService } from '@shared/services/report.service';
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
    clickedRows: false,
    // clickSelection: "single",
    actionItems: false,
    dateformat: "dd/MM/yyyy",
    selectBox: false,
    displayedColumns: [
      "billNo",
      "billType",
      "billDate",
      "ipNo",
      "admDateTime",
      "billAmount",
      "discountAmount",
      "receiptAmt",
      "refundAmount",
      "balanceAmt",
      "companyName",
      "operatorName",
      "printIcon",
    ],
    columnsInfo: {
      billNo: {
        title: "Bill.No",
        type: "string",
        tooltipColumn: "billNo",
        style: {
          width: '7rem'
        }
      },
      billType: {
        title: "Type",
        type: "string",
        tooltipColumn: "billType",
        style: {
          width: '6rem'
        }
      },
      billDate: {
        title: "Bill Date",
        type: "string",
        tooltipColumn: "billDate",
        style: {
          width: '5rem'
        }
      },
      ipNo: {
        title: "IP No.",
        type: "number",
        style: {
          width: '4rem'
        }
      },
      admDateTime: {
        title: "Adm/Discharge Date",
        type: "date",
        style: {
          width: '10rem'
        }
      },
      billAmount: {
        title: "Bill Amt",
        type: "number",
        style: {
          width: '4rem'
        }
      },
      discountAmount: {
        title: "Discount Amt",
        type: "number",
        style: {
          width: '7rem'
        }
      },
      receiptAmt: {
        title: "Receipt Amt",
        type: "number",
        style: {
          width: '6rem'
        }
      },
      refundAmount: {
        title: "Refund Amt",
        type: "number",
        style: {
          width: '6rem'
        }
      },
      balanceAmt: {
        title: "Balance Amt",
        type: "number",
        style: {
          width: '6.5rem'
        }
      },
      companyName: {
        title: "Company",
        type: "string",
        tooltipColumn: "companyName",
        style: {
          width: '5rem'
        }
      },
      operatorName: {
        title: "Operator Name",
        type: "string",
        tooltipColumn: "operatorName"
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
    { billno: 'BLDP24926', type: 'Deposit Refund', billdate: '05/11/2022', ipno: '1234', admdischargedate: '05/11/2022', billamt: '150.00', discountamt: '0.00', receiptamt: '1000.00',
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

  billno: any;

  searchbtn: boolean = true;
  hsplocationId:any = Number(this.cookie.get("HSPLocationId"));
  StationId:any = Number(this.cookie.get("StationId"));
  @ViewChild("table") tableRows: any;
  private readonly _destroying$ = new Subject<void>();
  constructor( 
    private formService: QuestionControlService, 
    private msgdialog: MessageDialogService, 
    private http: HttpService, 
    private datepipe: DatePipe,
    private cookie: CookieService,
    private reportService:ReportService) { }
  today: any;
  fromdate: any;
  ngOnInit(): void {
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
              // this.patienthistoryform.controls["maxid"].setErrors({incorrect: true});
              // this.questions[0].customErrorMessage = "Registration number does not exist";
              this.msgdialog.info("Registration number does not exist");
            }
            else
            {
              this.patientDetails = resultData;
              this.pname = this.patientDetails[0].firstName +" "+ this.patientDetails[0].middleName +" "+this.patientDetails[0].lastName;
              this.age = this.patientDetails[0].age +" "+this.patientDetails[0].ageTypeName;
              this.gender = this.patientDetails[0].genderName;
              this.dob = this.datepipe.transform(this.patientDetails[0].dateOfBirth, "dd-MM-YYYY");
              this.nationality = this.patientDetails[0].nationality;
              this.ssn = this.patientDetails[0].ssn;
              this.patienthistoryform.controls["mobile"].setValue(this.patientDetails[0].mobileNo);
              this.questions[0].readonly = true;
              this.searchbtn = false;
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
    if(this.patientDetails.length == 1)
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
          this.StationId,
          this.patienthistoryform.value.transactiontype
        ))
        .pipe(takeUntil(this._destroying$))
        .subscribe((resultdata:any)=>{
          console.log(resultdata);
          if(resultdata.length > 0)
          {
            console.log('data');
            this.patienthistorylist = resultdata;
            this.patienthistorylist = this.setimage(this.patienthistorylist);
            console.log(this.patienthistorylist);
          }
          else{
            console.log("empty");
            this.patienthistorylist = [];
          }
        },
        (error)=>{
          console.log(error);
        }
        )
      }
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
    this.patienthistoryform.controls["maxid"].setValue(this.cookie.get("LocationIACode") + ".");
    this.patientDetails = [];
    this.searchbtn = true;
    this.patienthistorylist = [];
  }
  

  printrow(event:any){
    console.log(event);
    if(event.column == "printIcon"){
      console.log(event.row.billType);
      this.billno = event.row.billNo;
      if(event.row.billType == 'Deposit')
      {
        this.openReportModal('depositReport');
      }
      else if(event.row.billType == 'Deposit')
      {
        this.openReportModal('rptRefund');
      }
      else if(event.row.billType == 'OPD')
      {
        this.openReportModal('billingreport');
      } 
      // this.msgdialog.success("Printing Successfull");
    }
  }

  openReportModal(btnname: string) {
    this.reportService.openWindow(btnname, btnname, {
      receiptnumber: this.billno,
      locationID: this.hsplocationId
    });
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
