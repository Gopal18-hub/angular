import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { BillingPaymentMethodsComponent } from "./payment-methods/payment-methods.component";
import { CookieService } from "@shared/services/cookie.service";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";
import { Subject } from "rxjs";
import { BillingService } from "../../billing.service";
import { MiscService } from "@modules/billing/submodules/miscellaneous-billing/MiscService.service";
import { MessageDialogService } from "@shared/ui/message-dialog/message-dialog.service";
import { PaytmRedirectionService } from "@core/services/paytm-redirection.service";
import { DepositService } from "@core/services/deposit.service";
@Component({
  selector: "out-patients-payment-dialog",
  templateUrl: "./payment-dialog.component.html",
  styleUrls: ["./payment-dialog.component.scss"],
})
export class BillPaymentDialogComponent implements OnInit {
  //GAV-1010 do not remove this commented code
  // dueFormData = {
  //   title: "",
  //   type: "object",
  //   properties: {
  //     onlinepaymentreq: {
  //       type: "checkbox",
  //       options: [{ title: "Online Payment Request" }],
  //     },
  //     paymenttype: {
  //       type: "dropdown",
  //       placeholder: "Online Payment Type",
  //     },
  //   },
  // };
  // dueform!: FormGroup;
  // questions: any;

  hsplocationId: any = Number(this.cookie.get("HSPLocationId"));
  stationId: any = Number(this.cookie.get("StationId"));
  operatorID: any = Number(this.cookie.get("UserId"));

  // hsplocationId = 67;
  // stationId = 10475;
  // operatorID = 9923;

  depositcashlimitationdetails: any;

  patientInfo: any;

  private readonly _destroying$ = new Subject<void>();

  @ViewChild(BillingPaymentMethodsComponent)
  paymentmethod!: BillingPaymentMethodsComponent;
  @ViewChild("billpatientIdentityInfo") billingpatientidentity: any;

  paymentmethods = [
    "cash",
    "credit",
    "cheque",
    "demand",
    "mobilepayment",
    "onlinepayment",
    "upi",
  ];

  config = {
    paymentmethods: this.data.paymentmethods
      ? this.data.paymentmethods
      : this.paymentmethods, // //GAV-530 Paid Online appointment
    combopayment: true,
    totalAmount: this.data.toPaidAmount.toFixed(2),
    isonlinepaidappointment: this.data.isonlinepaidappointment, // //GAV-530 Paid Online appointment
    formData: this.data.formData,
  };
  duelabel: any;
  billamount: any = 0;
  prepaidamount: any = 0;
  depositamount: any = 0;
  discountamount: any = 0;
  due: any = 0;
  totaldue: any = 0;
  finalamount: number = 0;

  billpatientIdentityInfo: any = [];

  constructor(
    public matDialog: MatDialog,
    private formService: QuestionControlService,
    private messageDialogService: MessageDialogService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cookie: CookieService,
    private dialogRef: MatDialogRef<BillPaymentDialogComponent>,
    private billingService: BillingService,
    private miscService: MiscService,
    private paytmRedirectionService: PaytmRedirectionService,
    private depositservice: DepositService,
  ) {}

  ngOnInit(): void {
    //GAV-1010 do not remove this commented code
    // let formResult: any = this.formService.createForm(
    //   this.dueFormData.properties,
    //   {}
    // );
    // this.dueform = formResult.form;
    // this.questions = formResult.questions;
    this.totaldue = this.due;
    this.patientInfo = {
      patientinfo: {
        emailId:
          this.billingService.patientDetailsInfo.peMail == undefined
            ? this.miscService.patientDetail.peMail
            : this.billingService.patientDetailsInfo.peMail,
        mobileno:
          this.billingService.patientDetailsInfo.pCellNo == undefined
            ? this.miscService.patientDetail.pCellNo
            : this.billingService.patientDetailsInfo.pCellNo,
        panno:
          this.billingService.patientDetailsInfo.paNno == undefined
            ? this.miscService.patientDetail.paNno
            : this.billingService.patientDetailsInfo.paNno,
        screenname: "Billing",
        iacode:
          this.billingService.patientDetailsInfo.iacode == undefined
            ? this.miscService.patientDetail.iacode
            : this.billingService.patientDetailsInfo.iacode,
        registrationno:
          this.billingService.patientDetailsInfo.registrationno == undefined
            ? this.miscService.patientDetail.registrationno
            : this.billingService.patientDetailsInfo.registrationno,
        toPaidAmount: this.data.toPaidAmount,
      },
    };
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.paymentmethod.totalamtFlag == false) {
        this.paymentmethod.tabs.forEach((i: any) => {
          this.paymentmethod.questions[i.key][1].elementRef.addEventListener(
            "keypress",
            (event: any) => {
              if (event.keyCode == 46) {
                event.preventDefault();
              }
            }
          );
        });
      }
    }, 1000);
  }
  clear() {
    this._destroying$.next(undefined);
    this._destroying$.complete();
    // this.dueform.reset();
    this.paymentmethod.tabs.forEach((tab: any, index: number) => {
      this.paymentmethod.tabPrices[index] = 0;
      this.paymentmethod.paymentForm[tab.key].reset();
    });
    this.depositservice.clearformsixtydetails();
  }

  async makeBill() {
    //paytm redirect home service
    this.paymentmethod.tabs.forEach((tab: any, index: number) => {
      if (
        tab.key == "mobilepayment" &&
        this.paymentmethod.tabPrices[index] > 0
      ) {
        this.paytmRedirectionService.redirectToPayTmHomeScreen();
      }
    });

    //pan card and form 60
    this.billingService.makeBillPayload.panNo =
      this.billingpatientidentity.patientidentityform.value.panno || "";
    this.billpatientIdentityInfo =
      this.billingpatientidentity.patientidentityform.value;
    if (
      Number(this.data.toPaidAmount >= 200000) &&
      (this.billpatientIdentityInfo.length == 0 ||
        (this.billpatientIdentityInfo.mainradio == "pancardno" &&
          (this.billpatientIdentityInfo.panno == undefined ||
            this.billpatientIdentityInfo.panno == "")))
    ) {
      const pannovalidate = this.messageDialogService.info(
        "Please Enter a valid PAN Number"
      );
      await pannovalidate.afterClosed().toPromise();
      this.billingService.setpaymenthodpancardfocus();
      return;
    } else if (
      this.billpatientIdentityInfo.mainradio == "form60" &&
      this.depositservice.isform60exists == false
    ) {
      this.messageDialogService.error("Please fill the form60 ");
      return;
    }
   
    if (this.data.name == "Misc Billing") {
      this.miscService.makeBill(this.paymentmethod);
      this.dialogRef.close("MakeBill");
      return;
    }
    const res = await this.billingService.makeBill(this.paymentmethod);
    if (res.length > 0) {
      if (res[0].billNo) {
        this.dialogRef.close(res[0]);
      } else {
        this.dialogRef.close(res[0]);
      }
    }
  }

  breakupTotal() {
    if (this.paymentmethod) {
      const sum = this.paymentmethod.tabPrices.reduce(
        (partialSum, a) => partialSum + a,
        0
      );
      let total;
      total =
        this.config.totalAmount - Math.floor(this.config.totalAmount) !== 0;
      let totalSum;
      if (!total) {
        totalSum = Math.floor(sum);
      } else {
        totalSum = sum;
      }
      return totalSum;
    } else {
      return 0;
    }
  }

  checkToProceed() {
    let tabForms = true;
    if (this.paymentmethod) {
      this.paymentmethod.tabs.forEach((tab: any, index: number) => {
        // console.log(this.paymentmethod.paymentForm[tab.key]);

        ////GAV-1353 -  addded tab.key != cash condition
        if (
          this.paymentmethod.tabPrices[index] > 0 &&
          this.paymentmethod.paymentForm[tab.key].valid == false &&
          tab.key != "cash"
        ) {
          tabForms = false;
        }
      });

      if (!tabForms) {
        return false;
      }
    }

    const collectedAmount = this.breakupTotal();
    if (this.data.name == "Misc Billing") {
      if (Number(this.data.toPaidAmount) < collectedAmount) {
        return false;
      }
      return true;
    } else if (
      !(collectedAmount <= 0) &&
      Number(this.data.toPaidAmount) >= collectedAmount
    )
      return true;
    return true;
  }

  formsixtysubmit: boolean = false;
  billingformsixtysuccess(event: any) {
    console.log(event);
    this.formsixtysubmit = event;
  }

  checkForCash() {
    let tabForms = 0;
    if (this.paymentmethod) {
      this.paymentmethod.tabs.forEach((tab: any, index: number) => {
        // console.log(this.paymentmethod.paymentForm[tab.key]);
        if (this.paymentmethod.tabPrices[index] == 0) {
          tabForms++;
        }
      });
    }
    if (this.paymentmethod) {
      if (tabForms == this.paymentmethod.tabs.length) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
}
