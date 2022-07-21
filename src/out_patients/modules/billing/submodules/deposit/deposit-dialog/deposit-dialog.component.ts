import { Component, OnInit,Inject } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { DynamicFormsModule } from "../../../../../../shared/ui/dynamic-forms";
import { QuestionControlService } from "../../../../../../shared/ui/dynamic-forms/service/question-control.service";
import { MatTabGroup } from "@angular/material/tabs";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: "out-patients-deposit-dialog",
  templateUrl: "./deposit-dialog.component.html",
  styleUrls: ["./deposit-dialog.component.scss"],
})
export class DepositDialogComponent implements OnInit {

  makedepositdialogformData = {
    type: "object",
    title: "",
    properties: {
      servicetype: {
        type: "autocomplete",        
      },
      deposithead: {
        type: "autocomplete",
      },
      amountcash: {
        type: "string",
      },
      chequeno: {
        type: "string",
      },
      issuedatecheque: {
        type: "string",
      },
      banknamecheque: {
        type: "string",
      },
      branchnamecheque: {
        type: "string",
      },
      amountcheque: {
        type: "string",
      },
      authorisedbycheque: {
        type: "string",
      },
      cardnocredit: {
        type: "string",
      },
      cardholdernamecredit: {
        type: "string",
      },
      banknamecredit: {
        type: "string",
      },
      batchnocredit: {
        type: "string",
      },
      amountcredit: {
        type: "string",
      },
      approvalcodecredit: {
        type: "string",
      },
      terminalidcredit: {
        type: "string",
      },
      acquiringbankcredit: {
        type: "string",
      },
      ddnodemanddraft: {
        type: "string",
      },
      issuedatedemanddraft: {
        type: "string",
      },
      banknamedemanddraft: {
        type: "string",
      },
      branchnamedemanddraft: {
        type: "string",
      },
      amountdemanddraft: {
        type: "string",
      },
      authorisedbydemanddraft: {
        type: "string",
      },
      sendermobile: {
        type: "string",
      },
      sendermmidno: {
        type: "string",
      },
      sendernamemobile: {
        type: "string",
      },
      banknamemobile: {
        type: "string",
      },
      branchnamemobile: {
        type: "string",
      },
      beneficiarymobno: {
        type: "string",
      },
      transactionamountmobile: {
        type: "string",
      },
      transactionreferencemobile: {
        type: "string",
      },
      transactionidonline: {
        type: "string",
      },
      bookingidonline: {
        type: "string",
      },
      radioonline: {
        type: "radio",
        options: [
          { title: "Yes", value: "yes" },
          { title: "No", value: "no" },
        ],
      },
      contactnoonline: {
        type: "string",
      },
      amountonline: {
        type: "string",
      },
      amountpaytm: {
        type: "string",
      },
      walletpaytm: {
        type: "string",
      },
      sendermobilenopaytm: {
        type: "string",
      },
      transactionreferencepaytm: {
        type: "string",
      },
      orderidpaytm: {
        type: "string",
      },
      cardnoupi: {
        type: "string",
      },
      transactionidupi: {
        type: "string",
      },
      banknameupi: {
        type: "string",
      },
      amountupi: {
        type: "string",
      },
      batchnoupi: {
        type: "string",
      },
      approvalcodeupi: {
        type: "string",
      },
      terminalidupi: {
        type: "string",
      },
      acquiringbankupi: {
        type: "string",
      },
      remarksText: {
        type: "textarea",
      },
      mobileno: {
        type: "number",
      },
      emailid: {
        type: "string",
      },
      radio: {
        type: "radio",
        options: [
          { title: "Form 60", value: "form60" },
          { title: "Pan Card No", value: "pancardno" },
        ],
      },
      pancardinput: {
        type: "string",
      },
    },
  };
  
  depositdialogtypeList:any=[];
  patientIdentityInfo:any=[];

  makedepositdialogForm!: FormGroup;
  questions: any;
  onDepositpage: boolean = true;
  selectedTabvalue!: string;
  config = {
    paymentmethod: {
      cash: true,
      cheque: true,
      credit: true,
      demand: true,
      upi: true,
      internetpayment: true,
    },
    combopayment: false
  }
  constructor( private formService: QuestionControlService, 
    @Inject(MAT_DIALOG_DATA) public data : {servicetype:any, deposittype:any, patientinfo: any},
    private dialogRef: MatDialogRef<DepositDialogComponent>,
    public matDialog: MatDialog) { }

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.makedepositdialogformData.properties,
      {}
    );
    this.makedepositdialogForm = formResult.form;
    this.questions = formResult.questions;
    this.depositdialogtypeList = {
          servicetypeList : this.data.servicetype,
          deposittypeList : this.data.deposittype
        };
    this.patientIdentityInfo = this.data.patientinfo;
  }

  ngAfterViewInit() {
  } 
  addNewDepositItem(event:any){

  }
  savedeposit(){

  }
}
