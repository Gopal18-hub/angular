import { Placeholder } from '@angular/compiler/src/i18n/i18n_ast';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { QuestionControlService } from '../../../shared/ui/dynamic-forms/service/question-control.service';
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
    actionItems: true,
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
        type: "number",
      },
      type: {
        title: "Type",
        type: "number",
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
        type: "number",
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

  patientname:any;
  age:any;
  gender:any;
  dob:any;
  nationality:any;
  ssn:any;
  constructor( private formService: QuestionControlService) { }

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.patienthistoryFormData.properties,
      {}
    );
    this.patienthistoryform = formResult.form;
    this.questions = formResult.questions;
  }

}
