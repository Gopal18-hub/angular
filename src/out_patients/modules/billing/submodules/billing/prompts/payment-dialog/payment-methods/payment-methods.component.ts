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

  remainingAmount = 0;

  tabPrices: number[] = [];

  tabs: any = [];

  activeTab: any;

  constructor(
    private formService: QuestionControlService,
    private depositservice: DepositService,
    private messageDialogService: MessageDialogService
  ) {}

  private readonly _destroying$ = new Subject<void>();

  ngOnInit(): void {
    if (this.config.totalAmount) {
      this.totalAmount = this.config.totalAmount;
    }
    this.config.paymentmethods.forEach((method: string, index: number) => {
      const form: any =
        PaymentMethods[
          PaymentMethods.methods[method].form as keyof typeof PaymentMethods
        ];
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
        this.paymentForm[method].controls["price"].setValue(this.totalAmount);
        this.tabPrices.push(this.totalAmount);
        this.remainingAmount = 0;
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
    this.activeTab = this.tabs[1];
    if (this.remainingAmount > 0) {
      if (Number(this.paymentForm[this.activeTab.key].value.price) > 0) {
      } else {
        this.paymentForm[this.activeTab.key].controls["price"].setValue(
          this.remainingAmount
        );
      }
    }
  }

  PaymentMethodvalidation() {}

  ngAfterViewInit(): void {}
}
