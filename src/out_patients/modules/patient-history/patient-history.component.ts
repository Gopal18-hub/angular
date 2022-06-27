import { Placeholder } from '@angular/compiler/src/i18n/i18n_ast';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { QuestionControlService } from '../../../shared/ui/dynamic-forms/service/question-control.service';
import { MessageDialogService } from '../../../shared/ui/message-dialog/message-dialog.service';
@Component({
  selector: 'out-patients-patient-history',
  templateUrl: './patient-history.component.html',
  styleUrls: ['./patient-history.component.scss']
})
export class PatientHistoryComponent implements OnInit {

  patienthistoryFormData = {
    title: "",
    type: "object",
    properties: {
      maxid: {
        type: "string",
      },
      mobile: {
        type: "string"
      },
      fromdate: {
        type: "date"
      },
      todate: {
        type: "date",
      }
    },
  };
  patienthistoryform!: FormGroup;
  questions: any;

  config: any = {
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
      "printhistory"
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
      },
      operatorname: {
        title: "Operator Name",
        type: "string",
      },
      printhistory: {
        title: "Print History",
        type: "image",
        width: 34,
      },
    },
  };
  data: any[] = [
    { billno: 'BLDP24923', type: 'Deposit', billdate: '05/11/2022', ipno: '1234', admdischargedate: '05/11/2022', billamt: '150.00', discountamt: '0.00', receiptamt: '1000.00',
    refundamt: '0.0', balanceamt: '10000.00', company: 'DGEHS-NABH (BLK)', operatorname: 'Sanjeev Singh (EMP001)', printhistory: 'cross'
  }
  ]
  patientname:any;
  age:any;
  gender:any;
  dob:any;
  nationality:any;
  ssn:any;
  constructor( private formService: QuestionControlService, private msgdialog: MessageDialogService) { }

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.patienthistoryFormData.properties,
      {}
    );
    this.patienthistoryform = formResult.form;
    this.questions = formResult.questions;
  }
  patienthistorysearch()
  {
    console.log(this.patienthistoryform.value);
  }
  printdialog()
  {
    console.log("print successfully");
    this.msgdialog.success("Printing Successfull");
  }
  clear()
  {
    this.patienthistoryform.reset();
  }
}
