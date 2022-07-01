import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { QuestionControlService } from '../../../../../../shared/ui/dynamic-forms/service/question-control.service';
@Component({
  selector: 'payment-methods',
  templateUrl: './payment-methods.component.html',
  styleUrls: ['./payment-methods.component.scss']
})
export class PaymentMethodsComponent implements OnInit {

  refundFormData = {
    title: "",
    type: "object",
    properties: {
      amount: {
         type: "number"
       },
      chequeno: {
        type: "number"
      },
      chequeissuedate: {
        type: "date"
      },
      chequebankname: {
        type: "string"
      },
      chequebranchname: {
        type: "string"
      },
      chequeamount: {
        type: "number"
      },
      chequeauth: {
        type: "string"
      },
      creditcardno: {
        type: "number"
      },
      creditholdername: {
        type: "string"
      },
      creditbankno:{
        type: "number"
      },
      creditbatchno:{
        type: "string"
      },
      creditamount: {
        type: "number"
      },
      creditapproval: {
        type: "number"
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
        type: "date"
      },
      demandbankname: {
        type: "string"
      },
      demandbranch: {
        type: "string"
      },
      demandamount: {
        type: "number"
      },
      demandauth: {
        type: "string"
      },
      mobilesendermobile: {
        type: "number"
      },
      mobilesendermmid: {
        type: "number"
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
        type: "number"
      },
      mobiletransactionamt: {
        type: "number"
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
      onlinecardvalidate: {
        type: "radio",
        required: false,
        options: [
          { title: "Yes", value: "yes" },
          { title: "No", value: "no" }
        ]
      },
      onlinecontactno: {
        type: "number"
      },
      onlineamount: {
        type: "number"
      },
      paytmamount: {
        type: "number"
      },
      paytmwallet: {
        type: "string"
      },
      paytmsendermobile: {
        type: "number"
      },
      paytmsenername: {
        type: "string"
      },
      paytmotp: {
        type: "number"
      },
      paytmtransacref: {
        type: "string"
      },
      paytmorderid: {
        type: "string"
      },
      upicardno: {
        type: "number"
      },
      upitransactionid: {
        type: "string"
      },
      upibankname: {
        type: "string"
      },
      upiamount : {
        type: "number"
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
      },
      mainradio: {
        type: "radio",
        required: false,
        options: [
          { title: "Form 60", value: "form60" },
          { title: "Pan card No.", value: "pancardno" },
        ]
      }
    },
  };
  refundform!: FormGroup;
  questions: any;
  constructor( private formService: QuestionControlService ) { }

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.refundFormData.properties,
      {}
    );
    this.refundform = formResult.form;
    this.questions = formResult.questions;
  }

}
