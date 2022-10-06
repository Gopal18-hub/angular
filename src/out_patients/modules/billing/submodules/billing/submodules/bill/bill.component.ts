import {
  Component,
  OnInit,
  ViewChild,
  ɵsetCurrentInjector,
} from "@angular/core";
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
export class BillComponent implements OnInit {
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
        type: "number",
        required: false,
        defaultValue: 0.0,
        readonly: true,
      },
      availDiscCheck: {
        type: "checkbox",
        required: false,
        options: [{ title: "Avail Plan Disc ( - )" }],
      },
      availDisc: {
        type: "number",
        required: false,
        defaultValue: 0.0,
        readonly: true,
      },
      discAmtCheck: {
        type: "checkbox",
        required: false,
        options: [{ title: " Discount  Amount  (  -  ) " }],
        disabled: false,
      },
      discAmt: {
        type: "number",
        required: false,
        defaultValue: 0,
        readonly: true,
        disabled: false,
      },
      dipositAmtcheck: {
        type: "checkbox",
        required: false,
        options: [{ title: "Deposit Amount ( - )" }],
      },
      dipositAmt: {
        type: "number",
        required: false,
        defaultValue: 0.0,
        readonly: true,
      },
      patientDisc: {
        type: "number",
        required: false,
        defaultValue: 0.0,
        readonly: true,
      },
      compDisc: {
        type: "number",
        required: false,
        defaultValue: 0.0,
        readonly: true,
      },
      planAmt: {
        type: "number",
        required: false,
        defaultValue: 0.0,
        readonly: true,
      },
      coupon: {
        type: "string",
        required: false,
      },
      coPay: {
        type: "number",
        required: false,
        defaultValue: 0.0,
        readonly: true,
      },
      credLimit: {
        type: "number",
        required: false,
        defaultValue: 0.0,
        readonly: true,
      },
      gstTax: {
        type: "number",
        required: false,
        defaultValue: 0.0,
        readonly: true,
      },
      amtPayByPatient: {
        type: "number",
        required: false,
        defaultValue: 0.0,
        readonly: true,
      },
      amtPayByComp: {
        type: "number",
        required: false,
        defaultValue: 0.0,
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
        type: "number",
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
          width: "80px",
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
          width: "100px",
        },
      },
      procedureDoctor: {
        title: "Procedure Doctor",
        type: "string",
        style: {
          width: "130px",
        },
      },
      qty: {
        title: "Qty / Type",
        type: "string",
        style: {
          width: "120px",
        },
      },
      credit: {
        title: "Credit",
        type: "string",
        style: {
          width: "100px",
        },
      },
      cash: {
        title: "Cash",
        type: "string",
        style: {
          width: "100px",
        },
      },
      disc: {
        title: "Disc %",
        type: "string",
        style: {
          width: "80px",
        },
      },
      discAmount: {
        title: "Disc Amount",
        type: "number",
        style: {
          width: "120px",
        },
      },
      totalAmount: {
        title: "Total Amount",
        type: "number",
        style: {
          width: "130px",
        },
      },
      gst: {
        title: "GST%",
        type: "number",
        style: {
          width: "80px",
        },
      },
      gstValue: {
        title: "GST Value",
        type: "number",
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
    let formResult: any = this.formService.createForm(
      this.billDataForm.properties,
      {}
    );
    this.formGroup = formResult.form;
    this.question = formResult.questions;
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
    if (
      this.billingservice.referralDoctor &&
      this.billingservice.referralDoctor.id == 2015
    ) {
      this.formGroup.controls["self"].setValue(true);
    }
    this.billingservice.calculateBill();
    this.data = this.billingservice.billItems;
    this.billingservice.clearAllItems.subscribe((clearItems) => {
      if (clearItems) {
        this.data = [];
      }
    });

    this.calculateBillService.billTabActiveLogics(this.formGroup, this);
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
  }

  refreshTable() {
    this.data = [...this.billingservice.billItems];
    this.billingservice.calculateTotalAmount();
    this.billingservice.billItems.forEach((item: any, index: number) => {
      this.billingservice.makeBillPayload.ds_insert_bill.tab_d_opbillList[
        index
      ].discountamount = item.discAmount;
      this.billingservice.makeBillPayload.ds_insert_bill.tab_d_opbillList[
        index
      ].discountType = 0;
      this.billingservice.makeBillPayload.ds_insert_bill.tab_d_opbillList[
        index
      ].oldOPBillId = 0;
    });
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
      });
    this.formGroup.controls["billAmt"].setValue(this.billingservice.totalCost);
    this.formGroup.controls["amtPayByPatient"].setValue(
      this.billingservice.totalCost
    );
    this.formGroup.controls["discAmtCheck"].valueChanges
      .pipe(takeUntil(this._destroying$))
      .subscribe((value: any) => {
        if (value == true) {
          this.calculateBillService.discountreason(this.formGroup, this);
        } else {
          this.calculateBillService.setDiscountSelectedItems([]);
          this.calculateBillService.calculateDiscount();
          this.formGroup.controls["discAmt"].setValue(
            this.calculateBillService.totalDiscountAmt
          );
          this.formGroup.controls["amtPayByPatient"].setValue(
            this.getAmountPayByPatient()
          );
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

    this.question[20].elementRef.addEventListener(
      "change",
      this.onModifyDepositAmt.bind(this)
    );

    this.question[12].elementRef.addEventListener(
      "blur",
      this.validateCoupon.bind(this)
    );
  }

  discountreason() {
    this.calculateBillService.discountreason(this.formGroup, this);
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
        if ("type" in result) {
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
              const res = await this.billingservice.makeBill();
              if (res.length > 0) {
                if (res[0].billNo) {
                  this.processBillNo(res[0]);
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

    const RefundDialog = this.matDialog.open(BillPaymentDialogComponent, {
      width: "65vw",
      height: "96vh",
      data: {
        totalBillAmount: this.billingservice.totalCost,
        totalDiscount: this.formGroup.value.discAmt,
        totalDeposit: this.formGroup.value.dipositAmtEdit,
        totalRefund: 0,
        ceditLimit: 0,
        settlementAmountRefund: 0,
        settlementAmountReceived: 0,
        toPaidAmount: this.formGroup.value.amtPayByPatient,
      },
    });

    RefundDialog.afterClosed()
      .pipe(takeUntil(this._destroying$))
      .subscribe((result: any) => {
        if (result && "billNo" in result && result.billNo) {
          this.processBillNo(result);
        }
      });
  }

  processBillNo(result: any) {
    this.billingservice.billNoGenerated.next(true);
    this.billNo = result.billNo;
    this.billId = result.billId;
    this.config.removeRow = false;
    this.config = { ...this.config };
    const successInfo = this.messageDialogService.info(
      `Bill saved with the Bill No ${result.billNo} and Amount ${this.billingservice.totalCost}`
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
    return (
      this.billingservice.totalCost -
      (this.formGroup.value.discAmt || 0) -
      (this.formGroup.value.dipositAmtEdit || 0)
    );
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

  validateCoupon() {
    if (this.formGroup.value.coupon) {
      if (this.billingservice.company > 0) {
        // popup to show MECP only for CASH
      } else {
        if (this.formGroup.value.paymentMode == 1) {
          this.billingservice.getServicesForCoupon(
            this.formGroup.value.coupon,
            Number(this.cookie.get("HSPLocationId"))
          );
        } else {
          //popup to show validation only for CASH
        }
      }
    } else {
      // validation to show coupon required
    }
  }
}
