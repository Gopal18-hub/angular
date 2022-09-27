import { DatePipe } from "@angular/common";
import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { ApiConstants } from "@core/constants/ApiConstants";
import { sendotpforpatientrefund } from "@core/models/patientsaveotprefunddetailModel.Model";
import { savepatientRefunddetailModel } from "@core/models/savepatientRefundDetailModel.Model";
import { PatientDepositCashLimitLocationDetail } from "@core/types/depositcashlimitlocation.Interface";
import { BillingPaymentMethodsComponent } from "./payment-methods/payment-methods.component";
import { CookieService } from "@shared/services/cookie.service";
import { HttpService } from "@shared/services/http.service";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";
import { MessageDialogService } from "@shared/ui/message-dialog/message-dialog.service";
import { Subject, takeUntil } from "rxjs";
import { BillingService } from "../../billing.service";
@Component({
  selector: "out-patients-payment-dialog",
  templateUrl: "./payment-dialog.component.html",
  styleUrls: ["./payment-dialog.component.scss"],
})
export class BillPaymentDialogComponent implements OnInit {
  dueFormData = {
    title: "",
    type: "object",
    properties: {
      onlinepaymentreq: {
        type: "checkbox",
        options: [{ title: "Online Payment Request" }],
      },
      paymenttype: {
        type: "dropdown",
        placeholder: "Online Payment Type",
      },
    },
  };
  dueform!: FormGroup;
  questions: any;

  hsplocationId: any = Number(this.cookie.get("HSPLocationId"));
  stationId: any = Number(this.cookie.get("StationId"));
  operatorID: any = Number(this.cookie.get("UserId"));
  depositcashlimitationdetails: any;

  patientInfo: any;

  private readonly _destroying$ = new Subject<void>();

  @ViewChild(BillingPaymentMethodsComponent)
  paymentmethod!: BillingPaymentMethodsComponent;

  config = {
    paymentmethods: [
      "cash",
      "cheque",
      "credit",
      "demand",
      "mobilepayment",
      "onlinepayment",
      "upi",
    ],
    combopayment: true,
    totalAmount: this.data.billAmount,
  };
  duelabel: any;
  billamount: any = 0;
  prepaidamount: any = 0;
  depositamount: any = 0;
  discountamount: any = 0;
  due: any = 0;
  totaldue: any = 0;
  finalamount: number = 0;

  constructor(
    public matDialog: MatDialog,
    private formService: QuestionControlService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private messageDialogService: MessageDialogService,
    private cookie: CookieService,
    private dialogRef: MatDialogRef<BillPaymentDialogComponent>,
    private http: HttpService,
    private datepipe: DatePipe,
    private billingService: BillingService
  ) { }

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.dueFormData.properties,
      {}
    );
    console.log(this.data);

    this.dueform = formResult.form;
    this.questions = formResult.questions;
    this.getdepositcashlimit();
    // this.patientIdentityInfo = { type: "Refund", patientinfo: this.data.patientinfo };
    this.totaldue = this.due;
    this.patientInfo = {
      patientinfo: {
        emailId: this.billingService.patientDetailsInfo.peMail,
        mobileno: this.billingService.patientDetailsInfo.pCellNo,
      },
    };
  }
  ngAfterViewInit(): void { }

  clear() {
    this._destroying$.next(undefined);
    this._destroying$.complete();
    this.dueform.reset();
    this.paymentmethod.tabs.forEach((tab: any, index: number) => {
      this.paymentmethod.tabPrices[index] = 0;
      this.paymentmethod.paymentForm[tab.key].reset();
    });
  }

  makeBill() {
    this.billingService.makeBill().subscribe((res) => {
      if (res.length > 0) {
        if (res[0].billNo) {
          this.dialogRef.close(res[0]);
        }
      }
    });
    if (this.data.name = "MiscBilling") {
      this.dialogRef.close("MakeBill");
    }
  }

  breakupTotal() {
    if (this.paymentmethod) {
      return this.paymentmethod.tabPrices.reduce(
        (partialSum, a) => partialSum + a,
        0
      );
    } else {
      return 0;
    }
  }

  getdepositcashlimit() {
    this.http
      .get(
        ApiConstants.getcashlimitwithlocationsmsdetailsoflocation(
          this.hsplocationId
        )
      )
      .pipe(takeUntil(this._destroying$))
      .subscribe((resultData: PatientDepositCashLimitLocationDetail) => {
        this.depositcashlimitationdetails = resultData.cashLimitOfLocation;
        console.log(resultData);
      });
  }
}
