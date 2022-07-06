import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { DynamicFormsModule } from "../../../../../../shared/ui/dynamic-forms";
import { QuestionControlService } from "../../../../../../shared/ui/dynamic-forms/service/question-control.service";
import { MatTabGroup } from "@angular/material/tabs";

@Component({
  selector: "out-patients-deposit-dialog",
  templateUrl: "./deposit-dialog.component.html",
  styleUrls: ["./deposit-dialog.component.scss"],
})
export class DepositDialogComponent implements OnInit {
  depositformData = {
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

  depositForm!: FormGroup;
  servicedepositForm!: FormGroup;
  paymentForm!: FormGroup;
  questions: any;
  onDepositpage: boolean = true;
  selectedTabvalue!: string;
  constructor( private formService: QuestionControlService) { }

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.depositformData.properties,
      {}
    );
    this.depositForm = formResult.form;
    this.questions = formResult.questions;
  }

  ngAfterViewInit() {
    this.paymentForm.controls["amount"].valueChanges.subscribe((value) => {
      console.log(value);
      if (value > 0) {
        this.disablechequecontrols();
        this.disablecreditcardControls();
        this.disabledemanddraftControls();
        this.disableinternetpaymentControls();
        this.disableupiControls();
      } else {
        this.enablechequecontrols();
        this.enablecreditcardControls();
        this.enabledemanddraftControls();
        this.enableinternetpaymentControls();
        this.enableupiControls();
      }
    });
  }

  getServiceDepositform(event: FormGroup) {
    console.log(event);
    this.servicedepositForm = event;
  }

  getpaymentForm(event: FormGroup) {
    console.log(event);
    this.paymentForm = event;
  }

  disablecashControls() {
    this.paymentForm.controls["amount"].disable();
  }

  disablechequecontrols() {
    this.paymentForm.controls["chequeno"].disable();
    this.paymentForm.controls["chequeissuedate"].disable();
    this.paymentForm.controls["chequebankname"].disable();
    this.paymentForm.controls["chequebranchname"].disable();
    this.paymentForm.controls["chequeamount"].disable();
    this.paymentForm.controls["chequeauth"].disable();
  }

  disablecreditcardControls() {
    this.paymentForm.controls["creditcardno"].disable();
    this.paymentForm.controls["creditholdername"].disable();
    this.paymentForm.controls["creditbankno"].disable();
    this.paymentForm.controls["creditbatchno"].disable();
    this.paymentForm.controls["creditamount"].disable();
    this.paymentForm.controls["creditapproval"].disable();
    this.paymentForm.controls["creditterminal"].disable();
    this.paymentForm.controls["creditacquiring"].disable();
  }

  disabledemanddraftControls() {
    this.paymentForm.controls["demandddno"].disable();
    this.paymentForm.controls["demandissuedate"].disable();
    this.paymentForm.controls["demandbankname"].disable();
    this.paymentForm.controls["demandbranch"].disable();
    this.paymentForm.controls["demandamount"].disable();
    this.paymentForm.controls["demandauth"].disable();
  }

  disableinternetpaymentControls() {}

  disableupiControls() {
    this.paymentForm.controls["upicardno"].disable();
    this.paymentForm.controls["upitransactionid"].disable();
    this.paymentForm.controls["upibankname"].disable();
    this.paymentForm.controls["upiamount"].disable();
    this.paymentForm.controls["upibatchno"].disable();
    this.paymentForm.controls["upiapproval"].disable();
    this.paymentForm.controls["upiterminal"].disable();
    this.paymentForm.controls["upiacquiring"].disable();
  }

  enablecashControls() {
    this.paymentForm.controls["amount"].enable();
  }

  enablechequecontrols() {
    this.paymentForm.controls["chequeno"].enable();
    this.paymentForm.controls["chequeissuedate"].enable();
    this.paymentForm.controls["chequebankname"].enable();
    this.paymentForm.controls["chequebranchname"].enable();
    this.paymentForm.controls["chequeamount"].enable();
    this.paymentForm.controls["chequeauth"].enable();
  }

  enablecreditcardControls() {
    this.paymentForm.controls["creditcardno"].enable();
    this.paymentForm.controls["creditholdername"].enable();
    this.paymentForm.controls["creditbankno"].enable();
    this.paymentForm.controls["creditbatchno"].enable();
    this.paymentForm.controls["creditamount"].enable();
    this.paymentForm.controls["creditapproval"].enable();
    this.paymentForm.controls["creditterminal"].enable();
    this.paymentForm.controls["creditacquiring"].enable();
  }

  enabledemanddraftControls() {
    this.paymentForm.controls["demandddno"].enable();
    this.paymentForm.controls["demandissuedate"].enable();
    this.paymentForm.controls["demandbankname"].enable();
    this.paymentForm.controls["demandbranch"].enable();
    this.paymentForm.controls["demandamount"].enable();
    this.paymentForm.controls["demandauth"].enable();
  }

  enableinternetpaymentControls() {}

  enableupiControls() {
    this.paymentForm.controls["upicardno"].enable();
    this.paymentForm.controls["upitransactionid"].enable();
    this.paymentForm.controls["upibankname"].enable();
    this.paymentForm.controls["upiamount"].enable();
    this.paymentForm.controls["upibatchno"].enable();
    this.paymentForm.controls["upiapproval"].enable();
    this.paymentForm.controls["upiterminal"].enable();
    this.paymentForm.controls["upiacquiring"].enable();
  }
}
