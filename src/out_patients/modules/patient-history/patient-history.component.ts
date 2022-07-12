import { Placeholder } from '@angular/compiler/src/i18n/i18n_ast';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PatientDetails } from '@core/models/patientDetailsModel.Model';
import { ApiConstants } from '@core/constants/ApiConstants';
import { QuestionControlService } from '../../../shared/ui/dynamic-forms/service/question-control.service';
import { MessageDialogService } from '../../../shared/ui/message-dialog/message-dialog.service';
import { HttpService } from '@shared/services/http.service';
import { DatePipe } from '@angular/common';
import { getpatienthistorytransactiontypeModel } from '@core/models/getpatienthistorytransactiontypeModel.Model';
import { getRegisteredPatientDetailsModel } from '@core/models/getRegisteredPatientDetailsModel.Model';
@Component({
  selector: 'out-patients-patient-history',
  templateUrl: './patient-history.component.html',
  styleUrls: ['./patient-history.component.scss']
})
export class PatientHistoryComponent implements OnInit {

  public patientDetails: getRegisteredPatientDetailsModel[] = [];
  public transactiontype: getpatienthistorytransactiontypeModel[] = [];
  patienthistoryFormData = {
    title: "",
    type: "object",
    properties: {
      maxid: {
        type: "string",
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
      "printhistory",
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
      printhistory: {
        title: "Print History",
        type: "image",
        width: 34,
        style:{
          width: "100px",
          height: "100px",
          src: "assets/roundtick",
        },
        disabledSort:true,
      },
    },
  };
  data: any[] = [
    { billno: 'BLDP24923', type: 'Deposit', billdate: '05/11/2022', ipno: '1234', admdischargedate: '05/11/2022', billamt: '150.00', discountamt: '0.00', receiptamt: '1000.00',
    refundamt: '0.0', balanceamt: '10000.00', company: 'DGEHS-NABH (BLK)', operatorname: 'Sanjeev Singh (EMP001)', printhistory: ''
    },
    { billno: 'BLDP24923', type: 'Deposit', billdate: '05/11/2022', ipno: '1234', admdischargedate: '05/11/2022', billamt: '150.00', discountamt: '0.00', receiptamt: '1000.00',
      refundamt: '0.0', balanceamt: '10000.00', company: 'DGEHS-NABH (BLK)', operatorname: 'Sanjeev Singh (EMP001)', printhistory: ''
    },
    { billno: 'BLDP24923', type: 'Deposit', billdate: '05/11/2022', ipno: '1234', admdischargedate: '05/11/2022', billamt: '150.00', discountamt: '0.00', receiptamt: '1000.00',
      refundamt: '0.0', balanceamt: '10000.00', company: 'DGEHS-NABH (BLK)', operatorname: 'Sanjeev Singh (EMP001)', printhistory: ''
    },
    { billno: 'BLDP24923', type: 'Deposit', billdate: '05/11/2022', ipno: '1234', admdischargedate: '05/11/2022', billamt: '150.00', discountamt: '0.00', receiptamt: '1000.00',
      refundamt: '0.0', balanceamt: '10000.00', company: 'DGEHS-NABH (BLK)', operatorname: 'Sanjeev Singh (EMP001)', printhistory: ''
    },
    { billno: 'BLDP24923', type: 'Deposit', billdate: '05/11/2022', ipno: '1234', admdischargedate: '05/11/2022', billamt: '150.00', discountamt: '0.00', receiptamt: '1000.00',
      refundamt: '0.0', balanceamt: '10000.00', company: 'DGEHS-NABH (BLK)', operatorname: 'Sanjeev Singh (EMP001)', printhistory: ''
    },
    { billno: 'BLDP24923', type: 'Deposit', billdate: '05/11/2022', ipno: '1234', admdischargedate: '05/11/2022', billamt: '150.00', discountamt: '0.00', receiptamt: '1000.00',
    refundamt: '0.0', balanceamt: '10000.00', company: 'DGEHS-NABH (BLK)', operatorname: 'Sanjeev Singh (EMP001)', printhistory: ''
    },
    { billno: 'BLDP24923', type: 'Deposit', billdate: '05/11/2022', ipno: '1234', admdischargedate: '05/11/2022', billamt: '150.00', discountamt: '0.00', receiptamt: '1000.00',
      refundamt: '0.0', balanceamt: '10000.00', company: 'DGEHS-NABH (BLK)', operatorname: 'Sanjeev Singh (EMP001)', printhistory: ''
    },
    { billno: 'BLDP24923', type: 'Deposit', billdate: '05/11/2022', ipno: '1234', admdischargedate: '05/11/2022', billamt: '150.00', discountamt: '0.00', receiptamt: '1000.00',
      refundamt: '0.0', balanceamt: '10000.00', company: 'DGEHS-NABH (BLK)', operatorname: 'Sanjeev Singh (EMP001)', printhistory: ''
    },
    { billno: 'BLDP24923', type: 'Deposit', billdate: '05/11/2022', ipno: '1234', admdischargedate: '05/11/2022', billamt: '150.00', discountamt: '0.00', receiptamt: '1000.00',
      refundamt: '0.0', balanceamt: '10000.00', company: 'DGEHS-NABH (BLK)', operatorname: 'Sanjeev Singh (EMP001)', printhistory: ''
    },
    { billno: 'BLDP24923', type: 'Deposit', billdate: '05/11/2022', ipno: '1234', admdischargedate: '05/11/2022', billamt: '150.00', discountamt: '0.00', receiptamt: '1000.00',
      refundamt: '0.0', balanceamt: '10000.00', company: 'DGEHS-NABH (BLK)', operatorname: 'Sanjeev Singh (EMP001)', printhistory: ''
    }
  ]
  pname:any;
  age:any;
  gender:any;
  dob:any;
  nationality:any;
  ssn:any;
  @ViewChild("table") tableRows: any;
  constructor( private formService: QuestionControlService, private msgdialog: MessageDialogService, private http: HttpService, private datepipe: DatePipe) { }
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
    console.log(this.data);
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
    this.http.get(ApiConstants.gettransactiontype).subscribe((resultdata: any)=>{
      console.log(resultdata);
      this.transactiontype = resultdata;
      console.log(this.transactiontype[0].dispalyString);
      this.patienthistoryform.controls["transactiontype"].setValue(this.transactiontype[0].valueString);
      this.questions[4].options = this.transactiontype.map((l)=>{
        return { title: l.dispalyString, value: l.valueString}
      })
    })
  }
  patienthistorysearch()
  {
    console.log(this.patienthistoryform.value);
  }
  printdialog()
  {  
    console.log(this.tableRows.selection.selected);  
    this.msgdialog.success("Printing Successfull");
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
  }
  getPatientDetails()
  {
    let regnumber = Number(this.patienthistoryform.value.maxid.split(".")[1]);
    if(regnumber != 0)
    {
      let iacode = this.patienthistoryform.value.maxid.split(".")[0];
      this.http
        .get(ApiConstants.getregisteredpatientdetails(iacode, regnumber))
        .subscribe((resultData: getRegisteredPatientDetailsModel[]) => {
            this.patientDetails = resultData;
            console.log(this.patientDetails[0]);
            this.pname = this.patientDetails[0].firstName +" "+this.patientDetails[0].lastName;
            this.age = this.patientDetails[0].age +" "+this.patientDetails[0].ageTypeName;
            this.gender = this.patientDetails[0].genderName;
            this.dob = this.datepipe.transform(this.patientDetails[0].dateOfBirth, "dd-MM-YYYY");
            this.nationality = this.patientDetails[0].lastName;
            this.ssn = this.patientDetails[0].ssn;
            this.patienthistoryform.controls["mobile"].setValue(this.patientDetails[0].mobileNo);
            this.questions[0].readonly = true;
          },
          (error)=>{
            console.log(error);
            this.clear();
          }
          )
    }
  }

  printrow(event:any){
    if(event.column == "printhistory"){
      console.log(event.row);
      this.printdialog();
    }
  }
}
