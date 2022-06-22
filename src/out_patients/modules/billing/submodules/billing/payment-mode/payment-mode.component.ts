import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { QuestionControlService } from '../../../../../../shared/ui/dynamic-forms/service/question-control.service';
@Component({
  selector: 'out-patients-payment-mode',
  templateUrl: './payment-mode.component.html',
  styleUrls: ['./payment-mode.component.scss']
})
export class PaymentModeComponent implements OnInit {
  //Cash
  cashForm!: FormGroup;
  cashFormData = {
    title: "",
    type: "object",
    properties: {
      amount: {
        type: "number",
        title: "Amount",
        required: true,
      }
    },
  };
  isShowCash: boolean = true;
  questions: any;
  //cheque
  chequeForm!: FormGroup;
  chequeFormData = {
    title: "",
    type: "object",
    properties: {
      amount: {
        type: "number",
        title: "Amount",
        required: true,
      },
      neft: {
        type: "number",
        title: "Cheque/NEFT No.",
        required: true,
      },
      issueDate: {
        type: "date",
        title: "Issue Date",
        required: true,
      },
      validity: {
        type: "date",
        title: "Validity",
        required: true,
      },
      bank: {
        type: "string",
        title: "Bank Name",
        required: true,
      },
      branch: {
        type: "string",
        title: "Branch Name",
        required: true,
      },
    },
  };
  isShowCheque: boolean = false;
  chequeQuestions: any;
  //Credit Card
  cCardForm!: FormGroup;
  cCardFormData = {
    title: "",
    type: "object",
    properties: {
      amount: {
        type: "number",
        title: "Amount",
        required: true,
      },
      no: {
        type: "number",
        title: "Card No.",
        required: true,
      },
      holder: {
        type: "string",
        title: "Card Holder Name",
        required: true,
      },
      bank: {
        type: "string",
        title: "Bank Name",
        required: true,
      },
      branch: {
        type: "string",
        title: "Branch Name",
        required: true,
      },
      approvalCode: {
        type: "string",
        title: "Approval Code",
        required: true,
      },
      terminalId: {
        type: "string",
        title: "Terminal ID",
        required: true,
      },
      acqBank: {
        type: "string",
        title: "Acquiring Bank",
        required: true,
      },
    },
  };
  isShowcCard: boolean = false;
  cCardQuestions: any;
  //Draft
  draftForm!: FormGroup;
  draftFormData = {
    title: "",
    type: "object",
    properties: {
      amount: {
        type: "number",
        title: "Amount",
        required: true,
      },
      neft: {
        type: "number",
        title: "Cheque/NEFT No.",
        required: true,
      },
      issueDate: {
        type: "date",
        title: "Issue Date",
        required: true,
      },
      validity: {
        type: "date",
        title: "Validity",
        required: true,
      },
      bank: {
        type: "string",
        title: "Bank Name",
        required: true,
      },
      branch: {
        type: "string",
        title: "Branch Name",
        required: true,
      },
    },
  };
  isShowDraft: boolean = false;
  draftQuestions: any;
  //Mobile
  mobileForm!: FormGroup;
  mobileFormData = {
    title: "",
    type: "object",
    properties: {
      amount: {
        type: "number",
        title: "Amount",
        required: true,
      },
      wallet: {
        type: "number",
        title: "Wallet",
        required: true,
      },
      mobile: {
        type: "string",
        title: "Sender Mobile No.",
        required: true,
      },
      otp: {
        type: "string",
        title: "OTP",
        required: true,
      },
      transRef: {
        type: "string",
        title: "Transaction Reference",
        required: true,
      },
      orderId: {
        type: "string",
        title: "Order ID",
        required: true,
      },
    },
  };
  isShowMobile: boolean = false;
  mobileQuestions: any;
  //Online
  onlineForm!: FormGroup;
  onlineFormData = {
    title: "",
    type: "object",
    properties: {
      transId: {
        type: "number",
        title: "Transaction ID",
        required: true,
      },
      bookId: {
        type: "number",
        title: "Booking ID",
        required: true,
      },
      valid: {
        type: "string",
        title: "Card Validation",
        required: true,
      },
      contact: {
        type: "string",
        title: "Contact No.",
        required: true,
      },
      amount: {
        type: "string",
        title: "Online Paid Amount",
        required: true,
      },     
    },
  };
  isShowOnline: boolean = false;
  onlineQuestions: any;
  //UPI
  upiForm!: FormGroup;
  upiFormData = {
    title: "",
    type: "object",
    properties: {
      amount: {
        type: "number",
        title: "Amount",
        required: true,
      },
      cardNo: {
        type: "number",
        title: "Card No.",
        required: true,
      },
      transId: {
        type: "string",
        title: "Transaction ID",
        required: true,
      },
      bank: {
        type: "string",
        title: "Bank Name",
        required: true,
      },
      batch: {
        type: "string",
        title: "Batch No.",
        required: true,
      },
      appCode: {
        type: "string",
        title: "Approval Code",
        required: true,
      },
      terminalId: {
        type: "string",
        title: "Terminal ID",
        required: true,
      },
      acqBank: {
        type: "string",
        title: "Acquiring Bank",
        required: true,
      },
    },
  };
  isShowUpi: boolean = false;
  upiQuestions: any;
  //Due
  dueForm!: FormGroup;
  dueFormData = {
    title: "",
    type: "object",
    properties: {
      amount: {
        type: "number",
        title: "Amount",
        required: true,
      },
      authorise: {
        type: "number",
        title: "Authorised By",
        required: true,
      },
      remarks: {
        type: "string",
        title: "Due Bill Remarks",
        required: true,
      },
      
    },
  };
  isShowDue: boolean = false;
  dueQuestions: any;
  constructor(private formService: QuestionControlService,) { }

  ngOnInit(): void {
    let cashformResult: any = this.formService.createForm(
      this.cashFormData.properties,
      {}
    );
    this.cashForm = cashformResult.form;
    this.questions = cashformResult.questions;
    //Cheque
    let chequeformResult: any = this.formService.createForm(
      this.chequeFormData.properties,
      {}
    );
    this.chequeForm = chequeformResult.form;
    this.chequeQuestions = chequeformResult.questions;
    //Credit Card
    let cCardformResult: any = this.formService.createForm(
      this.cCardFormData.properties,
      {}
    );
    this.cCardForm = cCardformResult.form;
    this.cCardQuestions = cCardformResult.questions;
    //Draft
    let draftformResult: any = this.formService.createForm(
      this.draftFormData.properties,
      {}
    );
    this.draftForm = draftformResult.form;
    this.draftQuestions = draftformResult.questions;
    //Mobile
    let mobileformResult: any = this.formService.createForm(
      this.mobileFormData.properties,
      {}
    );
    this.mobileForm = mobileformResult.form;
    this.mobileQuestions = mobileformResult.questions;
    //Online
    let onlineformResult: any = this.formService.createForm(
      this.onlineFormData.properties,
      {}
    );
    this.onlineForm = onlineformResult.form;
    this.onlineQuestions = onlineformResult.questions;
    //UPI
    let upiformResult: any = this.formService.createForm(
      this.upiFormData.properties,
      {}
    );
    this.upiForm = upiformResult.form;
    this.upiQuestions = upiformResult.questions;
    //Due
    let dueformResult: any = this.formService.createForm(
      this.dueFormData.properties,
      {}
    );
    this.dueForm = dueformResult.form;
    this.dueQuestions = dueformResult.questions;

  }
 
  tabChanged(tabChangeEvent: MatTabChangeEvent):void {
    this.isShowCash = false;
    this.isShowCheque = false;
    this.isShowcCard = false;
    this.isShowDraft = false;
    this.isShowMobile = false;
    this.isShowOnline = false;
    this.isShowUpi = false;
    this.isShowDue = false;


    if (tabChangeEvent.tab.textLabel === 'Cash') {
      this.isShowCash = true;
    }
    else if (tabChangeEvent.tab.textLabel === 'Cheque') {
      this.isShowCheque = true;
    }
    else if (tabChangeEvent.tab.textLabel === 'Credit Card') {
      this.isShowcCard = true;
    }
    else if (tabChangeEvent.tab.textLabel === 'Demand Draft') {
      this.isShowDraft = true;
    }
    else if (tabChangeEvent.tab.textLabel === 'Mobile Payment') {
      this.isShowMobile = true;
    }
    else if (tabChangeEvent.tab.textLabel === 'Online Payment') {
      this.isShowOnline = true;
    }
    else if (tabChangeEvent.tab.textLabel === 'UPI') {
      this.isShowUpi = true;
    }
    else if (tabChangeEvent.tab.textLabel === 'Due Amount') {
      this.isShowDue = true;
    }

  }
}
