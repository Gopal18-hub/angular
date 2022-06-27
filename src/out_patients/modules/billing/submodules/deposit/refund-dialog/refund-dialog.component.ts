import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { QuestionControlService } from "../../../../../../shared/ui/dynamic-forms/service/question-control.service";


@Component({
  selector: 'out-patients-refund-dialog',
  templateUrl: './refund-dialog.component.html',
  styleUrls: ['./refund-dialog.component.scss']
})
export class RefundDialogComponent implements OnInit {

  refundFormData = {
    title: "",
    type: "object",
    properties: {
      servicetype: {
        type: "autocomplete",
      },
      text: {
        type: "string"
      },
      form60: {
        type: "checkbox",
        options: [{
          title: ''
        }]
      },
       payable_name: {
         type: "string",
         title: "Payable Name"
       },
       remarks: {
         type: "textarea",
         title: "Remarks"
       },
       amount: {
         type: "string"
       },
       cardvalidate: {
        type: "radio",
        required: false,
        options: [
          { title: "Yes", value: "yes" },
          { title: "No", value: "no" }
        ]
      },
      deposithead: {
        type: "autocomplete",
      },
      refunddeposit: {
        type: "string",
      },
      otpmobile: {
        type: "string"
      },
      mobielno: {
        type: "string"
      },
      mail: {
        type: "string"
      },
      pancheck: {
        type: "checkbox",
        options: [{
          title: ''
        }]
      },
      panno: {
        type: "string"
      },
      chequeno: {
        type: "string"
      },
      chequeissuedate: {
        type: "string"
      },
      chequebankname: {
        type: "string"
      },
      chequebranchname: {
        tpe: "string"
      },
      chequeamount: {
        type: "string"
      },
      chequeauth: {
        type: "string"
      },
      creditcardno: {
        type: "string"
      },
      creditholdername: {
        type: "string"
      },
      creditbankno:{
        type: "string"
      },
      creditbranchno:{
        type: "string"
      },
      creditamount: {
        type: "string"
      },
      creditapproval: {
        type: "string"
      },
      creditterminal: {
        type: "string"
      },
      creditacquiring: {
        type: "string"
      },
      demandddno: {
        type: "string"
      },
      demandissuedate: {
        type: "string"
      },
      demandbankname: {
        type: "string"
      },
      demandbranch: {
        type: "string"
      },
      demandamount: {
        type: "string"
      },
      demandauth: {
        type: "string"
      },
      mobilesendermobile: {
        type: "string"
      },
      mobilesendermmid: {
        type: "string"
      },
      mobilesendername: {
        type: "string"
      },
      mobilebankname: {
        type: "string"
      },
      mobilebranchname: {
        type: "string"
      },
      mobilebeneficary: {
        type: "string"
      },
      mobiletransactionamt: {
        type: "string"
      },
      mobiletransactionref: {
        type: "string"
      },
      onlinetransacid: {
        type: "string"
      },
      onlinebookingid: {
        type: "string"
      },
      onlinecontactno: {
        type: "string"
      },
      onlineamount: {
        type: "string"
      },
      paytmamount: {
        type: "string"
      },
      paytmwallet: {
        type: "string"
      },
      paytmsendermobile: {
        type: "string"
      },
      paytmsenername: {
        type: "string"
      },
      paytmotp: {
        type: "string"
      },
      paytmtransacref: {
        type: "string"
      },
      paytmorderid: {
        type: "string"
      },
      upicardno: {
        type: "string"
      },
      upitransactionid: {
        type: "string"
      },
      upibankname: {
        type: "string"
      },
      upiamount : {
        type: "string"
      },
      upibatchno: {
        type: "string"
      },
      upiapproval: {
        type: "string"
      },
      upiterminal: {
        type: "string"
      },
      upiacquiring: {
        type: "string"
      }
    },
  };
  refundform!: FormGroup;
  questions: any;
  constructor( private formService: QuestionControlService) { }

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.refundFormData.properties,
      {}
    );
    this.refundform = formResult.form;
    this.questions = formResult.questions;
  }

}
