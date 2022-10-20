import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";
import { FormGroup } from "@angular/forms";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";
import { takeUntil } from "rxjs/operators";
import { BillingService } from "../../billing.service";
import { BillPaymentDialogComponent } from "../../prompts/payment-dialog/payment-dialog.component";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { MessageDialogService } from "@shared/ui/message-dialog/message-dialog.service";
import { ReportService } from "@shared/services/report.service";
import { CookieService } from "@shared/services/cookie.service";
import { DepositDetailsComponent } from "../../prompts/deposit-details/deposit-details.component";
import { GstTaxComponent } from "../../prompts/gst-tax-popup/gst-tax.component";
import { ApiConstants } from "@core/constants/ApiConstants";
import { HttpService } from "@shared/services/http.service";
import { MaxHealthSnackBarService } from "@shared/ui/snack-bar";
import { PopuptextComponent } from "../../prompts/popuptext/popuptext.component";
import { CalculateBillService } from "@core/services/calculate-bill.service";

@Component({
  selector: "out-patients-bill",
  templateUrl: "./bill.component.html",
  styleUrls: ["./bill.component.scss"],
})
export class BillComponent implements OnInit, OnDestroy {
  billDataForm = {
    type: "object",
    title: "",
    properties: {
      referralDoctor: {
        type: "dropdown",
        required: true,
        title: "Referral Doctor",
        placeholder: "--Select--",
      },
      interactionDetails: {
        type: "dropdown",
        required: false,
        title: "Interaction Details",
        placeholder: "--Select--",
      },
      billAmt: {
        type: "currency",
        required: false,
        defaultValue: "0.00",
        readonly: true,
      },
      availDiscCheck: {
        type: "checkbox",
        required: false,
        options: [{ title: "Avail Plan Disc ( - )" }],
      },
      availDisc: {
        type: "currency",
        required: false,
        defaultValue: "0.00",
        readonly: true,
      },
      discAmtCheck: {
        type: "checkbox",
        required: false,
        options: [{ title: " Discount  Amount  (  -  ) " }],
        disabled: false,
      },
      discAmt: {
        type: "currency",
        required: false,
        defaultValue: "0.00",
        readonly: true,
        disabled: false,
      },
      dipositAmtcheck: {
        type: "checkbox",
        required: false,
        options: [{ title: "Deposit Amount ( - )" }],
      },
      dipositAmt: {
        type: "currency",
        required: false,
        defaultValue: "0.00",
        readonly: true,
      },
      patientDisc: {
        type: "currency",
        required: false,
        defaultValue: "0.00",
        readonly: true,
      },
      compDisc: {
        type: "currency",
        required: false,
        defaultValue: "0.00",
        readonly: true,
      },
      planAmt: {
        type: "currency",
        required: false,
        defaultValue: "0.00",
        readonly: true,
      },
      coupon: {
        type: "string",
        required: false,
      },
      coPay: {
        type: "number",
        required: false,
        defaultValue: "0",
        readonly: true,
      },
      credLimit: {
        type: "currency",
        required: false,
        defaultValue: "0.00",
        readonly: true,
      },
      gstTax: {
        type: "number",
        required: false,
        defaultValue: "0.00",
        readonly: true,
      },
      amtPayByPatient: {
        type: "currency",
        required: false,
        defaultValue: "0.00",
        readonly: true,
      },
      amtPayByComp: {
        type: "currency",
        required: false,
        defaultValue: "0.00",
        readonly: true,
      },
      paymentMode: {
        type: "radio",
        required: true,
        options: [
          { title: "Cash", value: 1, disabled: false },
          { title: "Credit", value: 3, disabled: false },
          { title: "Gen. OPD", value: 4, disabled: false },
        ],
        defaultValue: 1,
      },
      self: {
        type: "checkbox",
        required: false,
        options: [{ title: "Self" }],
      },
      dipositAmtEdit: {
        type: "currency",
        required: false,
        defaultValue: "0.00",
        readonly: true,
      },
    },
  };
  @ViewChild("table") tableRows: any;
  data: any = [];
  config: any = {
    clickedRows: false,
    actionItems: false,
    dateformat: "dd/MM/yyyy",
    selectBox: false,
    removeRow: true,
    displayedColumns: [
      "sno",
      "serviceName",
      "itemName",
      "precaution",
      "procedureDoctor",
      "qty",
      "credit",
      "cash",
      "disc",
      "discAmount",
      "totalAmount",
      "gst",
      "gstValue",
    ],
    columnsInfo: {
      sno: {
        title: "S.No.",
        type: "number",
        style: {
          width: "65px",
        },
      },
      serviceName: {
        title: "Services Name",
        type: "string",
        style: {
          width: "150px",
        },
      },
      itemName: {
        title: "Item Name / Doctor Name",
        type: "string",
        style: {
          width: "200px",
        },
      },
      precaution: {
        title: "Precaution",
        type: "string_link",
        style: {
          width: "80px",
        },
      },
      procedureDoctor: {
        title: "Procedure Doctor",
        type: "string",
        style: {
          width: "150px",
        },
      },
      qty: {
        title: "Qty/Type",
        type: "string",
        style: {
          width: "80px",
        },
      },
      credit: {
        title: "Credit",
        type: "currency",
        style: {
          width: "100px",
        },
      },
      cash: {
        title: "Cash",
        type: "currency",
        style: {
          width: "100px",
        },
      },
      disc: {
        title: "Disc %",
        type: "string",
        style: {
          width: "60px",
        },
      },
      discAmount: {
        title: "Disc Amount",
        type: "currency",
        style: {
          width: "100px",
        },
      },
      totalAmount: {
        title: "Total Amount",
        type: "currency",
        style: {
          width: "130px",
        },
      },
      gst: {
        title: "GST%",
        type: "number",
        style: {
          width: "60px",
        },
      },
      gstValue: {
        title: "GST Value",
        type: "currency",
        style: {
          width: "130px",
        },
      },
    },
  };

  formGroup!: FormGroup;
  question: any;

  billNo = "";
  billId = "";
  depositDetails: any = [];
  totalDeposit = 0;

  private readonly _destroying$ = new Subject<void>();

  constructor(
    private formService: QuestionControlService,
    public billingservice: BillingService,
    private matDialog: MatDialog,
    private messageDialogService: MessageDialogService,
    private reportService: ReportService,
    private cookie: CookieService,
    private http: HttpService,
    private snackbar: MaxHealthSnackBarService,
    private calculateBillService: CalculateBillService
  ) {}

  ngOnDestroy(): void {
    this.billingservice.makeBillPayload.cmbInteraction =
      Number(this.formGroup.value.interactionDetails) || 0;
    this.billingservice.makeBillPayload.ds_insert_bill.tab_insertbill.billType =
      Number(this.formGroup.value.paymentMode);
  }

  async ngOnInit() {
    if (this.billingservice.patientDetailsInfo.pPagerNumber == "ews") {
      this.billDataForm.properties.paymentMode.options = [
        { title: "Cash", value: 1, disabled: false },
        { title: "Credit", value: 3, disabled: true },
        { title: "Gen. OPD", value: 4, disabled: true },
      ];
    }
    if (this.billingservice.selectedHealthPlan) {
      this.billDataForm.properties.discAmtCheck.disabled = true;
      this.billDataForm.properties.discAmt.disabled = true;
      this.billDataForm.properties.paymentMode.options = [
        { title: "Cash", value: 1, disabled: false },
        { title: "Credit", value: 3, disabled: false },
        { title: "Gen. OPD", value: 4, disabled: true },
      ];
    }
    if (this.calculateBillService.companyNonCreditItems.length > 0) {
      this.billDataForm.properties["credLimit"].readonly = false;
    }
    let formResult: any = this.formService.createForm(
      this.billDataForm.properties,
      {}
    );

    this.formGroup = formResult.form;
    this.question = formResult.questions;
    if (
      this.calculateBillService.billFormGroup &&
      this.calculateBillService.billFormGroup.form
    ) {
      this.formGroup.patchValue(
        this.calculateBillService.billFormGroup.form.value
      );
    }
    this.question[1].options = await this.calculateBillService.getinteraction();
    let popuptext: any = [];
    this.billingservice.billItems.forEach((item: any, index: number) => {
      item["sno"] = index + 1;
      if (item.popuptext) {
        popuptext.push({
          name: item.itemName,
          description: item.popuptext,
        });
      }
    });
    if (popuptext.length > 0) {
      const popuptextDialogRef = this.matDialog.open(PopuptextComponent, {
        width: "80vw",
        data: {
          popuptext,
        },
      });
      await popuptextDialogRef.afterClosed().toPromise();
    }
    this.billingservice.calculateBill(this.formGroup, this.question);
    this.data = this.billingservice.billItems;
    this.billTypeChange(this.formGroup.value.paymentMode);
    this.billingservice.clearAllItems.subscribe((clearItems) => {
      if (clearItems) {
        this.data = [];
      }
    });

    this.calculateBillService.billTabActiveLogics(this.formGroup, this);
    this.billingservice.refreshBillTab
      .pipe(takeUntil(this._destroying$))
      .subscribe((event: boolean) => {
        if (event) {
          this.refreshForm();
          this.refreshTable();
        }
      });
  }

  rowRwmove($event: any) {
    this.billingservice.deleteFromService(
      this.billingservice.billItems[$event.index]
    );
    this.billingservice.billItems.splice($event.index, 1);
    this.billingservice.makeBillPayload.ds_insert_bill.tab_d_opbillList.splice(
      $event.index,
      1
    );
    this.billingservice.billItems = this.billingservice.billItems.map(
      (item: any, index: number) => {
        item["sno"] = index + 1;
        return item;
      }
    );

    this.refreshTable();
    this.refreshForm();
  }

  refreshTable() {
    this.data = [...this.billingservice.billItems];
    this.billingservice.calculateTotalAmount();
    this.billingservice.billItems.forEach((item: any, index: number) => {
      this.billingservice.makeBillPayload.ds_insert_bill.tab_d_opbillList[
        index
      ].discountamount = parseFloat(item.discAmount);
      this.billingservice.makeBillPayload.ds_insert_bill.tab_d_opbillList[
        index
      ].discountType = item.discountType || 0;
      this.billingservice.makeBillPayload.ds_insert_bill.tab_d_opbillList[
        index
      ].oldOPBillId = item.discountReason || 0;
    });
  }

  refreshForm() {
    this.calculateBillService.refreshDiscount();
    this.calculateBillService.calculateDiscount();
    this.formGroup.controls["billAmt"].setValue(this.billingservice.totalCost);
    this.formGroup.controls["discAmt"].setValue(
      this.calculateBillService.totalDiscountAmt
    );
    this.billTypeChange(this.formGroup.value.paymentMode);
    // this.formGroup.controls["amtPayByPatient"].setValue(
    //   this.getAmountPayByPatient()
    // );
  }

  billTypeChange(value: any) {
    if (value == 1) {
      this.data = this.data.map((dItem: any) => {
        dItem.cash = dItem.totalAmount;
        dItem.credit = 0;
        return dItem;
      });
      this.data = [...this.data];
    } else if (value == 3) {
      this.question[14].readonly = false;
      this.question[13].readonly = false;
      let exceptions = this.calculateBillService.companyNonCreditItems.map(
        (cnci: any) => cnci.itemId
      );
      this.data = this.data.map((dItem: any) => {
        if (exceptions.includes(dItem.itemId)) {
          dItem.cash = dItem.totalAmount;
          dItem.credit = 0;
        } else {
          dItem.cash = 0;
          dItem.credit = dItem.totalAmount;
        }

        return dItem;
      });
      this.data = [...this.data];
    }
    this.formGroup.controls["amtPayByPatient"].setValue(
      this.getAmountPayByPatient()
    );
  }

  ngAfterViewInit() {
    this.tableRows.stringLinkOutput.subscribe((res: any) => {
      if (
        "patient_Instructions" in res.element &&
        res.element.patient_Instructions
      ) {
        this.messageDialogService.info(res.element.patient_Instructions);
      }
    });
    this.formGroup.controls["paymentMode"].valueChanges
      .pipe(takeUntil(this._destroying$))
      .subscribe((value: any) => {
        this.billingservice.setBilltype(value);
        if (value == 3) {
          this.question[14].readonly = false;
          this.question[13].readonly = false;
        } else {
          this.question[14].readonly = true;
          this.question[13].readonly = true;
        }
        this.billTypeChange(value);
        this.formGroup.controls["amtPayByComp"].setValue("0.00");
        this.formGroup.controls["credLimit"].setValue("0.00");
        this.formGroup.controls["coPay"].setValue(0);
        this.formGroup.controls["amtPayByPatient"].setValue(
          this.getAmountPayByPatient()
        );
      });
    this.refreshForm();
    this.formGroup.controls["discAmtCheck"].valueChanges
      .pipe(takeUntil(this._destroying$))
      .subscribe((value: any) => {
        if (value == true) {
          if (this.calculateBillService.validCoupon) {
            this.calculateBillService.discountreason(
              this.formGroup,
              this,
              "coupon"
            );
          } else {
            this.calculateBillService.discountreason(this.formGroup, this);
          }
        } else {
          this.calculateBillService.validCoupon = false;
          this.billingservice.billItems.forEach((item: any) => {
            item.disc = 0;
            item.discAmount = 0;
            item.totalAmount = item.price * item.qty;
            item.discountType = 0;
            item.discountReason = 0;
          });
          this.calculateBillService.setDiscountSelectedItems([]);
          this.calculateBillService.calculateDiscount();
          this.formGroup.controls["discAmt"].setValue(
            this.calculateBillService.totalDiscountAmt
          );
          this.billTypeChange(this.formGroup.value.paymentMode);
          this.applyCreditLimit();
          this.formGroup.controls["coupon"].setValue("");
          this.formGroup.controls["compDisc"].setValue("");
          this.formGroup.controls["patientDisc"].setValue("");
        }
      });

    this.formGroup.controls["dipositAmtcheck"].valueChanges
      .pipe(takeUntil(this._destroying$))
      .subscribe((value: any) => {
        if (value === true) {
          this.depositdetails();
        } else {
          this.totalDeposit = 0;
          this.formGroup.controls["dipositAmt"].setValue(this.totalDeposit);
          this.formGroup.controls["dipositAmtEdit"].setValue(0);
          this.formGroup.controls["dipositAmtEdit"].disable();
          this.formGroup.controls["amtPayByPatient"].setValue(
            this.getAmountPayByPatient()
          );
          this.formGroup.controls["dipositAmtcheck"].setValue(false, {
            emitEvent: false,
          });
        }
      });

    this.formGroup.controls["self"].valueChanges.subscribe((value: boolean) => {
      if (value) {
        this.billingservice.setReferralDoctor({
          id: 2015,
          name: "",
          specialisation: "",
        });
      }
    });

    this.question[14].elementRef.addEventListener("keypress", (event: any) => {
      if (event.key === "Enter") {
        event.preventDefault();
        if (
          this.formGroup.value.credLimit &&
          this.formGroup.value.credLimit > 0
        ) {
          this.applyCreditLimit();
        }
      }
    });

    this.question[20].elementRef.addEventListener(
      "change",
      this.onModifyDepositAmt.bind(this)
    );

    this.question[12].elementRef.addEventListener(
      "blur",
      this.validateCoupon.bind(this)
    );

    // this.question[12].elementRef.addEventListener("keypress", (event: any) => {
    //   if (event.key === "Enter") {
    //     event.preventDefault();
    //     this.validateCoupon();
    //   }
    // });
  }

  applyCreditLimit() {
    let cashAmount = 0;
    let cashDiscount = 0;
    let creditAmount = 0;
    let creditDiscount = 0;
    this.billingservice.billItems.forEach((bItem: any) => {
      if (parseFloat(bItem.cash) > 0) {
        cashAmount += parseFloat(bItem.cash);
        cashDiscount += parseFloat(bItem.discAmount);
      } else if (parseFloat(bItem.credit) > 0) {
        creditAmount += parseFloat(bItem.credit);
        creditDiscount += parseFloat(bItem.discAmount);
      }
    });
    const amtPayByComp = creditAmount;
    // const amountToBePaid =
    //   this.billingservice.totalCost -
    //   (this.formGroup.value.discAmt || 0) -
    //   (this.formGroup.value.dipositAmtEdit || 0);
    let tempAmount = this.formGroup.value.credLimit;
    this.billingservice.setCreditLimit(this.formGroup.value.credLimit);
    if (parseFloat(tempAmount) <= amtPayByComp) {
      this.formGroup.controls["amtPayByComp"].setValue(tempAmount);
    } else {
      this.formGroup.controls["amtPayByComp"].setValue(amtPayByComp);
    }
    if (this.formGroup.value.coPay > 0) {
      tempAmount =
        this.formGroup.value.amtPayByComp -
        (this.formGroup.value.amtPayByComp * this.formGroup.value.coPay) / 100;
      this.formGroup.controls["amtPayByComp"].setValue(tempAmount);
    }
    this.formGroup.controls["amtPayByPatient"].setValue(
      this.getAmountPayByPatient()
    );
  }

  discountreason() {
    if (this.calculateBillService.validCoupon) {
      this.calculateBillService.discountreason(this.formGroup, this, "coupon");
    } else {
      this.calculateBillService.discountreason(this.formGroup, this);
    }
  }

  onModifyDepositAmt() {
    if (this.formGroup.value.dipositAmtEdit > 0) {
      if (
        this.formGroup.value.dipositAmtEdit > this.formGroup.value.billAmt &&
        this.formGroup.value.dipositAmt >= this.formGroup.value.billAmt
      ) {
        this.formGroup.controls["dipositAmtEdit"].setValue(
          this.formGroup.value.billAmt
        );
      } else if (
        this.formGroup.value.dipositAmtEdit > this.formGroup.value.dipositAmt &&
        this.formGroup.value.dipositAmt > this.formGroup.value.billAmt
      ) {
        this.formGroup.controls["dipositAmtEdit"].setValue(
          this.formGroup.value.billAmt
        );
      } else if (
        this.formGroup.value.dipositAmtEdit > this.formGroup.value.billAmt &&
        this.formGroup.value.dipositAmt < this.formGroup.value.billAmt
      ) {
        this.formGroup.controls["dipositAmtEdit"].setValue(
          this.formGroup.value.dipositAmt
        );
      } else if (
        this.formGroup.value.dipositAmt < this.formGroup.value.billAmt &&
        this.formGroup.value.dipositAmtEdit > this.formGroup.value.dipositAmt
      ) {
        this.formGroup.controls["dipositAmtEdit"].setValue(
          this.formGroup.value.dipositAmt
        );
      }
      this.formGroup.controls["amtPayByPatient"].setValue(
        this.getAmountPayByPatient()
      );
    }
  }

  async makeBill() {
    if (this.formGroup.value.paymentMode == 3 && !this.billingservice.company) {
      const referralErrorRef = this.messageDialogService.error(
        "Please select Company Name"
      );
      await referralErrorRef.afterClosed().toPromise();
      return;
    }
    if (!this.billingservice.referralDoctor) {
      const referralErrorRef = this.messageDialogService.error(
        "Please select Referral Doctor"
      );
      await referralErrorRef.afterClosed().toPromise();
      return;
    }
    const consulatationStatus =
      await this.calculateBillService.checkForConsultation();
    if (!consulatationStatus) {
      return;
    }
    const dialogRef = this.messageDialogService.confirm(
      "",
      `Do you want to make the Bill?`
    );
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this._destroying$))
      .subscribe(async (result) => {
        if (result && "type" in result) {
          if (result.type == "yes") {
            if (this.formGroup.value.amtPayByPatient > 0) {
              if (
                this.calculateBillService.depositDetailsData.length > 0 &&
                this.totalDeposit == 0
              ) {
                const availDepositsPopup = this.messageDialogService.confirm(
                  "",
                  `Do you want to avail Deposits?`
                );
                const availDepositResult = await availDepositsPopup
                  .afterClosed()
                  .toPromise();
                if (availDepositResult) {
                  if (availDepositResult.type == "yes") {
                    this.depositdetails();
                  } else {
                    this.makereceipt();
                  }
                }
              } else {
                this.makereceipt();
              }
            } else {
              this.billingservice.makeBillPayload.ds_insert_bill.tab_insertbill.depositAmount =
              Number(this.formGroup.value.dipositAmtEdit) || 0;
            this.billingservice.makeBillPayload.ds_insert_bill.tab_insertbill.discountAmount =
              Number(this.formGroup.value.discAmt) || 0;
            this.billingservice.makeBillPayload.cmbInteraction =
              Number(this.formGroup.value.interactionDetails) || 0;
            this.billingservice.makeBillPayload.ds_insert_bill.tab_insertbill.billType =
              Number(this.formGroup.value.paymentMode);
        
            this.billingservice.makeBillPayload.ds_insert_bill.tab_insertbill.creditLimit =
              parseFloat(this.formGroup.value.credLimit) || 0;
            this.billingservice.makeBillPayload.ds_insert_bill.tab_insertbill.companyPaidAmt = 
              parseFloat(this.formGroup.value.amtPayByComp) || 0;

              const res = await this.billingservice.makeBill();
              if (res.length > 0) {
                if (res[0].billNo) {
                  this.processBillNo(res[0]);
                } else {
                  if (!res[0].successFlag) {
                    this.calculateBillService.blockActions.next(false);
                   const messageRef = this.messageDialogService.error(res[0].returnMessage);                   
                   await messageRef.afterClosed().toPromise();
                   return;
                  }
                }
              }
            }
          } else {
          }
        }
      });
  }

  makereceipt() {
    this.billingservice.makeBillPayload.ds_insert_bill.tab_insertbill.depositAmount =
      Number(this.formGroup.value.dipositAmtEdit) || 0;
    this.billingservice.makeBillPayload.ds_insert_bill.tab_insertbill.discountAmount =
      Number(this.formGroup.value.discAmt) || 0;
    this.billingservice.makeBillPayload.cmbInteraction =
      Number(this.formGroup.value.interactionDetails) || 0;
    this.billingservice.makeBillPayload.ds_insert_bill.tab_insertbill.billType =
      Number(this.formGroup.value.paymentMode);

    this.billingservice.makeBillPayload.ds_insert_bill.tab_insertbill.creditLimit =
      parseFloat(this.formGroup.value.credLimit) || 0;
    
    this.billingservice.makeBillPayload.ds_insert_bill.tab_insertbill.companyPaidAmt = 
              parseFloat(this.formGroup.value.amtPayByComp) || 0;

    const RefundDialog = this.matDialog.open(BillPaymentDialogComponent, {
      width: "65vw",
      height: "96vh",
      data: {
        totalBillAmount: this.billingservice.totalCost,
        totalDiscount: this.formGroup.value.discAmt,
        totalDeposit: this.formGroup.value.dipositAmtEdit,
        totalRefund: 0,
        ceditLimit: parseFloat(this.formGroup.value.amtPayByComp),
        settlementAmountRefund: 0,
        settlementAmountReceived: 0,
        toPaidAmount: parseFloat(this.formGroup.value.amtPayByPatient),
        amtPayByCompany: parseFloat(this.formGroup.value.amtPayByComp),
      },
    });

    RefundDialog.afterClosed()
      .pipe(takeUntil(this._destroying$))
      .subscribe(async (result: any) => {
        if (result && "billNo" in result && result.billNo) {
          this.processBillNo(result);
        } else if (result && "successFlag" in result && !result.successFlag) {
          if (result && "returnMessage" in result && result.returnMessage) {
            this.calculateBillService.blockActions.next(false);
            const messageRef = this.messageDialogService.error(result.returnMessage);                   
            await messageRef.afterClosed().toPromise();
            return;
          }
        }
      });
  }

  processBillNo(result: any) {
    this.calculateBillService.blockActions.next(false);
    this.billingservice.billNoGenerated.next(true);
    this.billNo = result.billNo;
    this.billId = result.billId;
    this.config.removeRow = false;
    this.config = { ...this.config };
    const successInfo = this.messageDialogService.info(
      `Bill saved with the Bill No ${result.billNo} and Amount ${this.billingservice.makeBillPayload.ds_insert_bill.tab_insertbill.collectedAmount}`
    );
    successInfo
      .afterClosed()
      .pipe(takeUntil(this._destroying$))
      .subscribe((result: any) => {
        const printDialog = this.messageDialogService.confirm(
          "",
          `Do you want to print bill?`
        );
        printDialog
          .afterClosed()
          .pipe(takeUntil(this._destroying$))
          .subscribe((result: any) => {
            if ("type" in result) {
              if (result.type == "yes") {
                this.makePrint();
              } else {
              }
            }
          });
      });
  }

  makePrint() {
    this.reportService.openWindow(
      this.billNo + " - Billing Report",
      "billingreport",
      {
        opbillid: this.billId,

        locationID: this.cookie.get("HSPLocationId"),
      }
    );
  }

  getAmountPayByPatient() {
    let cashAmount = 0;
    let cashDiscount = 0;
    let creditAmount = 0;
    let creditDiscount = 0;
    this.data.forEach((bItem: any) => {
      if (parseFloat(bItem.cash) > 0) {
        cashAmount += parseFloat(bItem.cash);
        cashDiscount += parseFloat(bItem.discAmount);
      } else if (parseFloat(bItem.credit) > 0) {
        creditAmount += parseFloat(bItem.credit);
        creditDiscount += parseFloat(bItem.discAmount);
      }
    });
    const temp =
      cashAmount +
      creditAmount -
      (this.formGroup.value.dipositAmtEdit || 0) -
      (this.formGroup.value.amtPayByComp || 0);

    return temp;
  }

  depositdetails() {
    let resultData = this.calculateBillService.depositDetailsData;
    if (resultData) {
      resultData.forEach((element: any) => {
        if (element.isAdvanceTypeEnabled == false) {
          this.totalDeposit += element.balanceamount;
        }
      });
      this.depositDetails = resultData;

      if (this.totalDeposit > 0) {
        this.formGroup.controls["dipositAmt"].setValue(this.totalDeposit);
        this.formGroup.controls["dipositAmtEdit"].setValue(0.0);
      } else {
        this.depositDetails = this.depositDetails.filter(
          (e: any) =>
            e.isAdvanceTypeEnabled == true && e.isSecurityDeposit == false
        );

        const dialogref = this.matDialog.open(DepositDetailsComponent, {
          width: "60vw",
          height: "50vh",
          data: { data: this.depositDetails },
        });

        dialogref.afterClosed().subscribe((res: any) => {
          this.billingservice.makeBillPayload.ds_insert_bill.tab_getdepositList =
            [];
          if (res && res.data) {
            res.data.forEach((dItem: any) => {
              this.billingservice.makeBillPayload.ds_insert_bill.tab_getdepositList.push(
                {
                  id: dItem.id,
                  amount: dItem.amount,
                  balanceamount: dItem.balanceamount,
                }
              );
            });
            this.totalDeposit = res.data
              .map((r: any) => r.balanceamount)
              .reduce(function (r: any, s: any) {
                return r + s;
              });
            this.formGroup.controls["dipositAmt"].setValue(this.totalDeposit);
            this.formGroup.controls["dipositAmtEdit"].setValue(0.0);
            this.formGroup.controls["dipositAmtEdit"].enable();
            this.question[20].readonly = false;
            this.question[20].disable = false;
            this.question[20] = { ...this.question[20] };
            this.question[20].elementRef.focus();
            this.formGroup.controls["dipositAmtcheck"].setValue(true, {
              emitEvent: false,
            });
          } else {
            this.formGroup.controls["dipositAmtcheck"].setValue(false, {
              emitEvent: false,
            });
          }

          // if (res.data)
          //   this.snackbar.open("Deposit Amount availed successfully!");
        });
      }
    }
  }

  gsttaxdialog() {
    this.matDialog.open(GstTaxComponent, {
      width: "30vw",
      height: "50vh",
    });
  }

  selectedReferralDoctor(data: any) {
    if (data.docotr) {
      console.log(data.docotr);
      this.formGroup.controls["self"].setValue(false);
      this.formGroup.controls["self"].disable();
      this.billingservice.setReferralDoctor(data.docotr);
    }
  }

  async validateCoupon() {
    if (this.formGroup.value.coupon) {
      if (this.formGroup.value.coupon.length > 4) {
        if (this.billingservice.company > 0) {
          // popup to show MECP only for CASH
          const CouponErrorRef = this.messageDialogService.error(
            "MECP discount applicable on CASH Patient only"
          );
          await CouponErrorRef.afterClosed().toPromise();
          this.formGroup.controls["coupon"].setValue("");
          return;
        } else {
          if (this.formGroup.value.paymentMode == 1) {
            this.calculateBillService.getServicesForCoupon(
              this.formGroup,
              Number(this.cookie.get("HSPLocationId")),
              this
            );
          } else {
            //popup to show validation only for CASH
            const CouponErrorRef = this.messageDialogService.error(
              "MECP discount applicable on CASH Patient only"
            );
            await CouponErrorRef.afterClosed().toPromise();
            this.formGroup.controls["coupon"].setValue("");
            return;
          }
        }
      } else if (this.formGroup.value.coupon.length > 3) {
        // validation to show coupon required
        const CouponErrorRef = this.messageDialogService.error(
          "Please Enter Proper Coupon"
        );
        await CouponErrorRef.afterClosed().toPromise();
        return;
      }
    } else {
      // // validation to show coupon required
      // const CouponErrorRef = this.messageDialogService.error(
      //   "Please Enter Coupon"
      // );
      // await CouponErrorRef.afterClosed().toPromise();
      // return;
    }
  }
}
