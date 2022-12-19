import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatTabChangeEvent } from "@angular/material/tabs";
import { PaymentMethods } from "@core/constants/PaymentMethods";
import { Subject, Observable } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";
import { DepositService } from "@core/services/deposit.service";
import { MessageDialogService } from "@shared/ui/message-dialog/message-dialog.service";
import { HttpService } from "@shared/services/http.service";
import { BillingApiConstants } from "../../../BillingApiConstant";
import { PaymentService } from "@core/services/payment.service";
import { CalculateBillService } from "@core/services/calculate-bill.service";
import { MatDialog } from "@angular/material/dialog";
import { OnlinePaymentPaidPatientComponent } from "../../online-payment-paid-patient/online-payment-paid-patient.component";
import { AppointmentSearchComponent } from "../../appointment-search/appointment-search.component";
import { BillingService } from "../../../billing.service";
import { MaxHealthStorage } from "@shared/services/storage";
import { CookieService } from "@shared/services/cookie.service";
import { PaytmRedirectionService } from "@core/services/paytm-redirection.service";

@Component({
  selector: "billing-payment-methods",
  templateUrl: "./payment-methods.component.html",
  styleUrls: ["./payment-methods.component.scss"],
})
export class BillingPaymentMethodsComponent implements OnInit {
  @Input() config: any;
  @Input() Refundavalaiblemaount: any;

  paymentForm: any = {};
  questions: any = {};
  today: any;

  totalAmount: any = 0;
  // //GAV-530 Paid Online appointment
  onlinePaidAmount = 0;
  isOnlinePaidAppointment = false;
  paidAppointments: any = {};

  remainingAmount = 0;

  tabPrices: number[] = [];

  tabs: any = [];

  activeTab: any;

  bankList: any = [];

  constructor(
    private formService: QuestionControlService,
    private depositservice: DepositService,
    private messageDialogService: MessageDialogService,
    private http: HttpService,
    private paymentService: PaymentService,
    private calculateBillService: CalculateBillService,
    private matdialog: MatDialog,
    private BillingService: BillingService,
    private cookie: CookieService,
    private paytmRedirectionService: PaytmRedirectionService
  ) {}

  private readonly _destroying$ = new Subject<void>();

  async ngOnInit() {
    if (this.config.totalAmount) {
      this.totalAmount = this.config.totalAmount;
    }
    // //GAV-530 Paid Online appointment
    if (this.config.isonlinepaidappointment) {
      this.isOnlinePaidAppointment = this.config.isonlinepaidappointment;
    }
    const bankNames = await this.http
      .get(BillingApiConstants.getbanknames)
      .toPromise();
    this.bankList = bankNames.map((bn: any) => {
      return {
        title: bn.name,
        value: bn.id,
      };
    });
    const formOptions = {
      bankList: this.bankList,
    };
    this.config.paymentmethods.forEach((method: string, index: number) => {
      const form: any =
        PaymentMethods[
          PaymentMethods.methods[method].form as keyof typeof PaymentMethods
        ](formOptions);
      const temp: any = {
        key: method,
        form: form,
        method: PaymentMethods.methods[method],
      };
      this.tabs.push(temp);
      let formResult: any = this.formService.createForm(form.properties, {});
      this.paymentForm[method] = formResult.form;
      this.questions[method] = formResult.questions;
      if (index == 0) {
        // // //GAV-530 Paid Online appointment
        if (this.isOnlinePaidAppointment) {
          if (this.config.formData) {
            this.paymentForm[method].patchValue(this.config.formData[method]);
            this.tabPrices.push(this.config.formData[method].price);
            this.remainingAmount = 0;
            this.questions.onlinepayment[1].readonly = true;
          } else {
            this.paymentForm[method].controls["price"].setValue(
              this.totalAmount
            );
            this.tabPrices.push(this.totalAmount);
            this.remainingAmount = 0;
          }
        } else {
          this.paymentForm[method].controls["price"].setValue(this.totalAmount);
          this.tabPrices.push(this.totalAmount);
          this.remainingAmount = 0;
        }
        this.questions[method][0].maximum = this.totalAmount;
        this.activeTab = this.tabs[0];
      }
      this.tabPrices.push(0);
      if (this.paymentForm[method].controls["price"]) {
        this.paymentForm[method].controls["price"].valueChanges.subscribe(
          (res: any) => {
            if (Number(res) < 0) {
              this.messageDialogService.warning("Amount Cannot be Negative");
              this.paymentForm[method].controls["price"].setValue(
                // Math.abs(res).toFixed(2)
                "0.00"
              );
            } else {
              this.tabPrices[index] = Number(res);
              const sum = this.tabPrices.reduce(
                (partialSum, a) => partialSum + a,
                0
              );
              this.remainingAmount = parseFloat(this.totalAmount) - sum;
              if (this.remainingAmount < 0) {
                this.messageDialogService.warning(
                  "Total of Receipt Amount Cannot be Greater than Bill Amount."
                );
                this.paymentForm[method].controls["price"].setValue("0.00");
                this.paymentForm[method].controls["price"].setValue(
                  this.remainingAmount
                );
              }
            }
          }
        );
      }
    });
    console.log(this.tabs);

    this.today = new Date();
  }

  tabChanged(event: MatTabChangeEvent) {
    this.activeTab = this.tabs[event.index];
    //PayTm Integration
    if (this.activeTab.key == "mobilepayment") {
      //this.paytmRedirectionService.redirectToPayTmDownloadHomeScreen();
      this.paytmRedirectionService.redirectToPayTmHomeScreen();
    }

    //auto populate for 'No' select in online appointment popup
    if(this.activeTab.key == 'onlinepayment' && this.config.formData['onlinepayment'].price > 0)
    {
      this.tabs.forEach((i: any) => {
        this.paymentForm[i.key].controls["price"].setValue("0.00");
      });
      this.paymentForm['onlinepayment'].patchValue(this.config.formData['onlinepayment']);
      this.questions.onlinepayment[1].readonly = true;
    }

    if (this.remainingAmount > 0) {
      if (Number(this.paymentForm[this.activeTab.key].value.price) > 0) {
        if (this.activeTab.key != "onlinepayment") {
          this.paymentForm[this.activeTab.key].controls["price"].setValue(
            Number(this.paymentForm[this.activeTab.key].value.price) +
              this.remainingAmount
          );
        }
      } else {
        if (this.activeTab.key == "onlinepayment") {
          if (this.config.formData && this.config.formData.bookingId) {
            this.paymentForm[this.activeTab.key].patchValue(
              this.config.formData[this.activeTab.key]
            );
          } else {
            this.paymentForm[this.activeTab.key].controls["price"].setValue(
              this.remainingAmount
            );
          }
        } else {
          if (this.activeTab.key == "credit" || this.activeTab.key == "upi") {
            this.paymentForm[this.activeTab.key].controls["posimei"].setValue(
              MaxHealthStorage.getCookie("MAXMachineName")
            );
          }
          this.paymentForm[this.activeTab.key].controls["price"].setValue(
            this.remainingAmount
          );
        }
      }
    }
  }

  PaymentMethodvalidation() {}

  ngAfterViewInit(): void {}

  clearTabForm(tab: any) {
    console.log(tab);
    console.log(this.paymentForm[tab.key]);
    let hiddenmode: any = PaymentMethods.modeofpaymentHiddenValue.properties;

    this.paymentForm[tab.key].reset();
    this.paymentForm[tab.key].controls["price"].setValue("0.00");

    //added for setting hidden control Mode of Payment
    this.paymentForm[tab.key].controls["modeOfPayment"].setValue(
      hiddenmode[tab.key].value
    );
    console.log(this.paymentForm[tab.key]);
    let existingPrice: any = 0;
    this.tabs.forEach((tabValue: any, tabIndex: any) => {
      if (
        this.paymentForm[tabValue.key].controls.price.value &&
        this.paymentForm[tabValue.key].controls.price.value > 0 &&
        tabValue.key != this.activeTab.key
      ) {
        existingPrice =
          parseFloat(existingPrice) +
          parseFloat(this.paymentForm[tabValue.key].controls.price.value);
      }
    });
    this.remainingAmount =
      parseFloat(this.totalAmount) - parseFloat(existingPrice);

    if (this.remainingAmount > 0) {
      this.paymentForm[this.activeTab.key].controls["price"].setValue(
        this.remainingAmount
      );
    }
  }

  onlinePaymentAutoFill(res: any)
  {
    console.log(res);
    this.tabs.forEach((i: any) => {
      this.paymentForm[i.key].controls["price"].setValue("0.00");
    });
    this.paymentForm.onlinepayment.controls["transactionId"].setValue(
      res.transactionNo || res.transactionId 
    );
    this.paymentForm.onlinepayment.controls["bookingId"].setValue(
      res.bookingNo || res.bookingId
    );
    this.questions.onlinepayment[1].readonly = true;
    this.paymentForm.onlinepayment.controls["price"].setValue(
      res.price || res.bookingAmount
    );
    this.paymentForm.onlinepayment.controls["onlineContact"].setValue(
      res.mobile || res.onlineContact
    );
    this.paymentForm.onlinepayment.controls["cardValidation"].setValue(
      "yes"
    );
  }
  async paymentButtonAction(button: any) {
    console.log(button);
    if (button.type == "onlinePaymentSearch") {
      const onlinedialog = this.matdialog.open(
        OnlinePaymentPaidPatientComponent,
        {
          maxWidth: "90vw",
          height: "70vh",
          data: {
            maxid: this.BillingService.activeMaxId.maxId,
            status: "Y",
          },
        }
      );
      onlinedialog.afterClosed().subscribe((res) => {
        console.log(res);
        if (res) {
          this.onlinePaymentAutoFill(res);
        }
      });
    }

    if (button.type == "onlinePaymentClear") {
      this.paymentForm.onlinepayment.reset();
      this.questions.onlinepayment[1].readonly = false;
      this.paymentForm.onlinepayment.controls["price"].setValue("0.00");
      this.paymentForm.onlinepayment.controls["modeOfPayment"].setValue(
        "Online Payment"
      );
    }

    const payloadData = this.paymentForm[button.paymentKey].value;
    let module = "OPD_Billing";
    if (button.type == "uploadBillTransaction") {
      if (payloadData.price > 0) {
        //  this.calculateBillService.blockActions.next(true);
        let res = await this.paymentService.uploadBillTransaction(
          payloadData,
          module,
          this.BillingService.activeMaxId.maxId
        );
        await this.processPaymentApiResponse(button, res);
      } else {
        const errorDialogRef = this.messageDialogService.warning(
          "Please Give Proper Amount."
        );
        await errorDialogRef.afterClosed().toPromise();
        return;
      }
    } else if (button.type == "getBillTransactionStatus") {
      if (payloadData.price > 0) {
        // this.calculateBillService.blockActions.next(true);
        let res = await this.paymentService.getBillTransactionStatus(
          payloadData,
          module,
          this.BillingService.activeMaxId.maxId
        );
        await this.processPaymentApiResponse(button, res);
      } else {
        const errorDialogRef = this.messageDialogService.warning(
          "Please Give Proper Amount."
        );
        await errorDialogRef.afterClosed().toPromise();
        return;
      }
    } else if (button.type == "paytmPaymentInit") {
      if (payloadData.price > 0) {
        let res = await this.paymentService.paytmPaymentInit(
          payloadData,
          module,
          this.BillingService.activeMaxId.maxId
        );

        if (res && res.order_id) {
          this.paytmRedirectionService.redirectToPayTmDisplayTxn(
            res.order_id,
            res.order_amount,
            res.qrData
          );
        }
      }
    } else if (button.type == "paytmPaymentTxnValidate") {
      if (payloadData.price > 0) {
        let res = await this.paymentService.paytmPaymentTxnValidate(
          payloadData,
          module,
          this.BillingService.activeMaxId.maxId
        );

        if (res && res.order_id) {
          this.paymentForm[button.paymentKey].controls[
            "paytmorderid"
          ].patchValue(res.order_id);

          this.paytmRedirectionService.redirectToPayTmSuccessScreen(
            res.order_id,
            res.order_amount
          );
        }
      }
    }
  }

  async processPaymentApiResponse(button: any, res: any) {
    // this.calculateBillService.blockActions.next(false);
    if (res && res.success) {
      if (res.responseMessage && res.responseMessage != "") {
        if (res.responseMessage == "APPROVED") {
          if (button.paymentKey == "credit") {
            if (res.transactionRefId) {
              this.paymentForm[button.paymentKey].controls[
                "transactionid"
              ].patchValue(res.transactionRefId);
            }
          } else if (button.paymentKey == "upi") {
            if (res.transactionRefId) {
              this.paymentForm[button.paymentKey].controls[
                "approvalno_UPI"
              ].patchValue(res.transactionRefId);
            }
          }
          const infoDialogRef = this.messageDialogService.info(
            "Kindly Pay Using Machine"
          );
          await infoDialogRef.afterClosed().toPromise();
          return;
        } else if (res.responseMessage == "TXN APPROVED") {
          if (res.pineLabReturnResponse) {
            let bankId = 0;

            let bank = this.bankList.filter((r: any) =>
              r.title.includes(res.pineLabReturnResponse.ccResAcquirerName)
            );
            // if (bank && bank.length > 0) {
            //   bankId = bank[0].value;
            // }
            if (button.paymentKey == "credit") {
              this.paymentForm[button.paymentKey].controls[
                "ccNumber"
              ].patchValue(res.pineLabReturnResponse.ccResCardNo);
              this.paymentForm[button.paymentKey].controls[
                "creditholdername"
              ].patchValue(res.cardHolderName);
              this.paymentForm[button.paymentKey].controls[
                "bankName"
              ].patchValue(bank[0]);
              this.paymentForm[button.paymentKey].controls[
                "approvalno"
              ].patchValue(res.pineLabReturnResponse.ccResBatchNumber);
              this.paymentForm[button.paymentKey].controls[
                "approvalcode"
              ].patchValue(res.pineLabReturnResponse.ccResApprovalCode);
              this.paymentForm[button.paymentKey].controls[
                "terminalID"
              ].patchValue(res.terminalId);
              this.paymentForm[button.paymentKey].controls[
                "acquirer"
              ].patchValue(res.pineLabReturnResponse.ccResAcquirerName);
              this.paymentForm[button.paymentKey].controls[
                "banktid"
              ].patchValue(res.pineLabReturnResponse.ccResBankTID);
              this.paymentForm[button.paymentKey].controls[
                "transactionid"
              ].patchValue(res.transactionRefId);
              this.paymentForm[button.paymentKey].controls[
                "cCvalidity"
              ].patchValue(new Date());
            } else if (button.paymentKey == "upi") {
              this.paymentForm[button.paymentKey].controls[
                "ccNumber_UPI"
              ].patchValue(res.pineLabReturnResponse.ccResCardNo);
              this.paymentForm[button.paymentKey].controls[
                "cardholdername_UPI"
              ].patchValue(res.cardHolderName);
              this.paymentForm[button.paymentKey].controls[
                "bankname_UPI"
              ].patchValue(bank[0]);
              this.paymentForm[button.paymentKey].controls[
                "flagman_UPI"
              ].patchValue(res.pineLabReturnResponse.ccResBatchNumber);
              this.paymentForm[button.paymentKey].controls[
                "approvalcode_UPI"
              ].patchValue(res.pineLabReturnResponse.ccResApprovalCode);
              this.paymentForm[button.paymentKey].controls[
                "terminalID_UPI"
              ].patchValue(res.terminalId);
              this.paymentForm[button.paymentKey].controls[
                "acquirer_UPI"
              ].patchValue(res.pineLabReturnResponse.ccResAcquirerName);
              this.paymentForm[button.paymentKey].controls[
                "banktid"
              ].patchValue(res.pineLabReturnResponse.ccResBankTID);
              this.paymentForm[button.paymentKey].controls[
                "transactionid"
              ].patchValue(res.transactionRefId);
              this.paymentForm[button.paymentKey].controls[
                "cCvalidity_UPI"
              ].patchValue(new Date());
            }
          }
        } else {
          const infoDialogRef = this.messageDialogService.info(
            res.responseMessage
          );
          await infoDialogRef.afterClosed().toPromise();
          return;
        }
      }
    } else if (res && !res.success) {
      if (res.errorMessage && res.errorMessage != "") {
        const errorDialogRef = this.messageDialogService.error(
          res.errorMessage
        );
        await errorDialogRef.afterClosed().toPromise();
        return;
      } else if (res.responseMessage && res.responseMessage != "") {
        const errorDialogRef = this.messageDialogService.error(
          res.responseMessage
        );
        await errorDialogRef.afterClosed().toPromise();
        return;
      }
    }
  }
}
