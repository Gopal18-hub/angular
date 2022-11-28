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
import { OnlinePaymentPaidPatientComponent } from '../../online-payment-paid-patient/online-payment-paid-patient.component';
import { AppointmentSearchComponent } from "../../appointment-search/appointment-search.component";
import { BillingService } from "../../../billing.service";
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

  totalAmount = 0;
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
    private BillingService: BillingService
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
            this.tabPrices[index] = Number(res);
            const sum = this.tabPrices.reduce(
              (partialSum, a) => partialSum + a,
              0
            );
            this.remainingAmount = this.totalAmount - sum;
          }
        );
      }
    });
    console.log(this.tabs);

    this.today = new Date();
  }

  tabChanged(event: MatTabChangeEvent) {
    this.activeTab = this.tabs[event.index];
    if (this.remainingAmount > 0) {
      if (Number(this.paymentForm[this.activeTab.key].value.price) > 0) {
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
    this.paymentForm[tab.key].reset();
  }

  async paymentButtonAction(button: any) {
    console.log(button);
    if(button.label == 'Search')
    {
      const onlinedialog = this.matdialog.open(OnlinePaymentPaidPatientComponent, {
        maxWidth: "90vw",
        height: "70vh"
      })
      onlinedialog.afterClosed().subscribe((res) => {
        console.log(res);
        this.paymentForm.onlinepayment.controls["transactionId"].setValue(res.transactionNo);
        this.paymentForm.onlinepayment.controls["bookingId"].setValue(res.bookingNo);
        this.paymentForm.onlinepayment.controls["price"].setValue(res.bookingAmount.toFixed(2));
        this.paymentForm.onlinepayment.controls["onlineContact"].setValue(res.mobile);
        this.paymentForm.onlinepayment.controls['cardValidation'].setValue("yes");
        console.log(this.paymentForm);
      })
      // const appointmentSearch = this.matdialog.open(AppointmentSearchComponent, {
      //   maxWidth: "100vw",
      //   width: "98vw",
      //   data: {
      //     phoneNumber: '',
      //     maxid: this.BillingService.activeMaxId,
      //     onlinepayment: true
      //   },
      // });
    }
    const payloadData = this.paymentForm[button.paymentKey].value;
    let module = "OPD_Billing";
    if (button.type == "uploadBillTransaction") {
      if (payloadData.price > 0) {
        //  this.calculateBillService.blockActions.next(true);
        let res = await this.paymentService.uploadBillTransaction(
          payloadData,
          module
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
          module
        );
        await this.processPaymentApiResponse(button, res);
      } else {
        const errorDialogRef = this.messageDialogService.warning(
          "Please Give Proper Amount."
        );
        await errorDialogRef.afterClosed().toPromise();
        return;
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
              this.paymentForm["transactionid"].patchValue(
                res.transactionRefId
              );
            }
          } else if (button.paymentKey == "upi") {
            if (res.transactionRefId) {
              this.paymentForm["approvalno_UPI"].patchValue(
                res.transactionRefId
              );
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
            let bank = this.bankList.filter(
              (r: any) => r.title == res.pineLabReturnResponse.ccResAcquirerName
            );
            if (bank && bank.length > 0) {
              bankId = bank[0].value;
            }
            if (button.payloadKey == "credit") {
              this.paymentForm["ccNumber"].patchValue(
                res.pineLabReturnResponse.ccResCardNo
              );
              this.paymentForm["creditholdername"].patchValue(
                res.cardHolderName
              );
              this.paymentForm["bankName"].patchValue(bankId);
              this.paymentForm["approvalno"].patchValue(
                res.pineLabReturnResponse.ccResBatchNumber
              );
              this.paymentForm["approvalcode"].patchValue(
                res.pineLabReturnResponse.ccResApprovalCode
              );
              this.paymentForm["terminalID"].patchValue(res.terminalId);
              this.paymentForm["acquirer"].patchValue(
                res.pineLabReturnResponse.ccResAcquirerName
              );
              this.paymentForm["banktid"].patchValue(
                res.pineLabReturnResponse.ccResBankTID
              );
            } else if (button.payloadKey == "upi") {
              this.paymentForm["ccNumber_UPI"].patchValue(
                res.pineLabReturnResponse.ccResCardNo
              );
              this.paymentForm["cardholdername_UPI"].patchValue(
                res.cardHolderName
              );
              this.paymentForm["bankname_UPI"].patchValue(bankId);
              this.paymentForm["flagman_UPI"].patchValue(
                res.pineLabReturnResponse.ccResBatchNumber
              );
              this.paymentForm["approvalcode_UPI"].patchValue(
                res.pineLabReturnResponse.ccResApprovalCode
              );
              this.paymentForm["terminalID_UPI"].patchValue(res.terminalId);
              this.paymentForm["acquirer_UPI"].patchValue(
                res.pineLabReturnResponse.ccResAcquirerName
              );
              this.paymentForm["banktid"].patchValue(
                res.pineLabReturnResponse.ccResBankTID
              );
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
