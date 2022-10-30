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
import { OpPrescriptionDialogComponent } from "@modules/billing/submodules/details/op-prescription-dialog/op-prescription-dialog.component";
import { BillingApiConstants } from "../../BillingApiConstant";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "out-patients-bill",
  templateUrl: "./bill.component.html",
  styleUrls: ["./bill.component.scss"],
})
export class BillComponent implements OnInit, OnDestroy {
  locationexclude: any = [67, 69];
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
        type: "currency",
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
      "gst",
      "gstValue",
      "totalAmount",
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
  gstBreakupDetails: any = [];
  finalgstDetails: any = {};

  precautionExcludeLocations = [69];

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
    private calculateBillService: CalculateBillService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnDestroy(): void {
    this.billingservice.makeBillPayload.cmbInteraction =
      Number(this.formGroup.value.interactionDetails) || 0;
    this.billingservice.makeBillPayload.ds_insert_bill.tab_insertbill.billType =
      Number(this.formGroup.value.paymentMode);
  }

  async ngOnInit() {
    if (
      this.precautionExcludeLocations.includes(
        Number(this.cookie.get("HSPLocationId"))
      )
    ) {
      this.config.displayedColumns.splice(3, 1);
    }
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

    this.billingservice.calculateBill(this.formGroup, this.question);
    this.data = this.billingservice.billItems;
    if (this.calculateBillService.otherPlanSelectedItems.length > 0) {
      let planAmount = 0;
      this.calculateBillService.otherPlanSelectedItems.forEach((oItem: any) => {
        planAmount += oItem.price;
      });
      this.formGroup.patchValue({ planAmt: planAmount });
    }
    this.billTypeChange(this.formGroup.value.paymentMode);
    this.billingservice.clearAllItems.subscribe((clearItems: any) => {
      if (clearItems) {
        this.data = [];
      }
    });

    const res = await this.calculateBillService.checkTaxableBill();
    if (!res) {
      this.router.navigate(["../services"], {
        queryParamsHandling: "merge",
        relativeTo: this.route,
      });
    } else {
      if (this.calculateBillService.dsTaxCode) {
        await this.getGSTBreakUpDetails(
          this.billingservice.totalCostWithOutGst -
            parseFloat(this.formGroup.value.discAmt),
          Number(this.cookie.get("HSPLocationId")),
          this.billingservice.company
        );
      }
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
      await this.calculateBillService.billTabActiveLogics(this.formGroup, this);
      this.billingservice.refreshBillTab
        .pipe(takeUntil(this._destroying$))
        .subscribe((event: boolean) => {
          if (event) {
            this.refreshForm();
            this.refreshTable();
          }
        });
    }
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

  async refreshTable() {
    this.data = [...this.billingservice.billItems];
    this.billingservice.calculateTotalAmount();
    this.billingservice.billItems.forEach((item: any, index: number) => {
      this.billingservice.makeBillPayload.ds_insert_bill.tab_d_opbillList[
        index
      ].amount = item.totalAmount;
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
    if (this.calculateBillService.dsTaxCode) {
      await this.getGSTBreakUpDetails(
        this.billingservice.totalCostWithOutGst -
          parseFloat(this.formGroup.value.discAmt),
        Number(this.cookie.get("HSPLocationId")),
        this.billingservice.company
      );
    }
  }

  async refreshForm() {
    this.calculateBillService.refreshDiscount(this.formGroup);
    this.calculateBillService.calculateDiscount();

    this.formGroup.controls["billAmt"].setValue(
      this.billingservice.totalCostWithOutGst.toFixed(2)
    );
    this.formGroup.controls["discAmt"].setValue(
      this.calculateBillService.totalDiscountAmt.toFixed(2)
    );
    this.billTypeChange(this.formGroup.value.paymentMode);
    // this.formGroup.controls["amtPayByPatient"].setValue(
    //   this.getAmountPayByPatient()
    // );
  }

  async billTypeChange(value: any) {
    if (value == 1) {
      this.data = this.data.map((dItem: any) => {
        dItem.cash = dItem.price * dItem.qty;
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
          dItem.cash = dItem.price * dItem.qty;
          dItem.credit = 0;
        } else {
          dItem.cash = 0;
          dItem.credit = dItem.price * dItem.qty;
        }

        return dItem;
      });
      this.data = [...this.data];
    } else if (value == 4) {
      if (this.billingservice.billItems.length > 0) {
        if (
          !this.billingservice.billItems[0].serviceName.includes(
            "General OPD PPG"
          )
        ) {
          this.formGroup.controls["paymentMode"].setValue(1);
          this.messageDialogService.info(
            "You have Selected services(s) Doesn't come Under Free OPD"
          );
        } else {
          await this.checkFreeOPD(this.billingservice.billItems[0].itemId);
        }
      } else {
        const errorRef = this.messageDialogService.error(
          "There is No Item Selected"
        );
        await errorRef.afterClosed().toPromise();
        return;
      }
    }
    this.formGroup.controls["amtPayByPatient"].setValue(
      this.getAmountPayByPatient()
    );
  }

  async checkFreeOPD(itemId: any) {
    const res = await this.http
      .get(
        BillingApiConstants.checkfreeopdflag(
          this.billingservice.activeMaxId.regNumber,
          this.billingservice.activeMaxId.iaCode,
          itemId
        )
      )
      .toPromise();
    if (res) {
      if (res[0].expfreeopdflag == 1) {
        const expfreeopdRef = this.messageDialogService.info(
          "Registration For Free OPD Expired"
        );
        await expfreeopdRef.afterClosed().toPromise();
      }
      if (res[0].betweenfreeopflag == 1) {
        const expfreeopdRef = this.messageDialogService.info(
          "Patient already have Free OPD Registration"
        );
        await expfreeopdRef.afterClosed().toPromise();
        return;
      }
    }
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
        this.formGroup.controls["discAmtCheck"].setValue(false, {
          emitEvent: false,
        });
        this.resetDiscount();
        this.billingservice.setBilltype(value);
        if (value == 3) {
          this.question[14].readonly = false;
          this.question[13].readonly = false;
        } else {
          this.question[14].readonly = true;
          this.question[13].readonly = true;
        }
        this.refreshTable();
        //this.billTypeChange(value);
        this.billingservice.calculateTotalAmount();
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
          this.resetDiscount();
        }
      });

    this.formGroup.controls["dipositAmtcheck"].valueChanges
      .pipe(takeUntil(this._destroying$))
      .subscribe((value: any) => {
        if (value === true) {
          this.depositdetails();
        } else {
          this.totalDeposit = 0;
          this.formGroup.controls["dipositAmt"].setValue(
            this.totalDeposit.toFixed(2)
          );
          this.formGroup.controls["dipositAmtEdit"].setValue(0.0);
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
      } else {
        this.billingservice.setReferralDoctor({
          id: 0,
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
        } else {
          this.formGroup.controls["credLimit"].setValue("0.00");
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

  resetDiscount() {
    this.calculateBillService.validCoupon = false;
    this.billingservice.billItems.forEach((item: any) => {
      item.disc = 0;
      item.discAmount = 0;
      const price = item.price * item.qty;
      item.gstValue = item.gst > 0 ? (item.gst * price) / 100 : 0;
      item.totalAmount = price + item.gstValue;
      item.discountType = 0;
      item.discountReason = 0;
    });
    this.calculateBillService.setDiscountSelectedItems([]);
    this.calculateBillService.calculateDiscount();
    this.formGroup.controls["discAmt"].setValue(
      this.calculateBillService.totalDiscountAmt.toFixed(2)
    );
    this.billTypeChange(this.formGroup.value.paymentMode);
    this.applyCreditLimit();
    this.formGroup.controls["coupon"].setValue("");
    this.formGroup.controls["compDisc"].setValue("0.00");
    this.formGroup.controls["patientDisc"].setValue("0.00");
  }

  applyCreditLimit() {
    let cashAmount = 0;
    let cashDiscount = 0;
    let creditAmount = 0;
    let creditDiscount = 0;
    this.billingservice.billItems.forEach((bItem: any) => {
      if (parseFloat(bItem.cash) > 0) {
        cashAmount += parseFloat(bItem.totalAmount);
        cashDiscount += parseFloat(bItem.discAmount);
      } else if (parseFloat(bItem.credit) > 0) {
        creditAmount += parseFloat(bItem.totalAmount);
        creditDiscount += parseFloat(bItem.discAmount);
      }
    });
    const amtPayByComp = creditAmount;
    // const amountToBePaid =
    //   this.billingservice.totalCost -
    //   (this.formGroup.value.discAmt || 0) -
    //   (this.formGroup.value.dipositAmtEdit || 0);
    let tempAmount = parseFloat(this.formGroup.value.credLimit);
    this.billingservice.setCreditLimit(this.formGroup.value.credLimit);
    if (tempAmount <= amtPayByComp) {
      this.formGroup.controls["amtPayByComp"].setValue(tempAmount.toFixed(2));
    } else {
      this.formGroup.controls["amtPayByComp"].setValue(amtPayByComp.toFixed(2));
    }
    if (this.formGroup.value.coPay > 0) {
      tempAmount =
        this.formGroup.value.amtPayByComp -
        (this.formGroup.value.amtPayByComp * this.formGroup.value.coPay) / 100;
      this.formGroup.controls["amtPayByComp"].setValue(tempAmount.toFixed(2));
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
          this.formGroup.value.billAmt.toFixed(2)
        );
      } else if (
        this.formGroup.value.dipositAmtEdit > this.formGroup.value.dipositAmt &&
        this.formGroup.value.dipositAmt > this.formGroup.value.billAmt
      ) {
        this.formGroup.controls["dipositAmtEdit"].setValue(
          this.formGroup.value.billAmt.toFixed(2)
        );
      } else if (
        this.formGroup.value.dipositAmtEdit > this.formGroup.value.billAmt &&
        this.formGroup.value.dipositAmt < this.formGroup.value.billAmt
      ) {
        this.formGroup.controls["dipositAmtEdit"].setValue(
          this.formGroup.value.dipositAmt.toFixed(2)
        );
      } else if (
        this.formGroup.value.dipositAmt < this.formGroup.value.billAmt &&
        this.formGroup.value.dipositAmtEdit > this.formGroup.value.dipositAmt
      ) {
        this.formGroup.controls["dipositAmtEdit"].setValue(
          this.formGroup.value.dipositAmt.toFixed(2)
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
    if (
      !this.billingservice.referralDoctor ||
      this.billingservice.referralDoctor.id === 0
    ) {
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
      .subscribe(async (result: any) => {
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
                    //GAV-1053 Paid Online appointment
                    this.onlinePaymentConfirmation();
                  }
                }
              } else {
                //GAV-530 Paid Online appointment
                this.onlinePaymentConfirmation();
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
                    const messageRef = this.messageDialogService.error(
                      res[0].returnMessage
                    );
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

  makereceipt(ispaid = false) {
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

    //GAV-530 Paid Online Appointment
    let amount = 0;
    if (this.billingservice.PaidAppointments) {
      if (this.billingservice.PaidAppointments.paymentStatus == "Yes") {
        if (
          this.billingservice.PaidAppointments.onlinepaidamount >
          this.billingservice.totalCost
        ) {
          amount = this.billingservice.totalCost;
        } else {
          amount = this.billingservice.PaidAppointments.onlinepaidamount;
        }
      }
    }

    var RefundDialog;
    // //GAV-530 Paid Online appointment
    if (ispaid) {
      RefundDialog = this.matDialog.open(BillPaymentDialogComponent, {
        width: "70vw",
        height: "99vh",
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
          paymentmethods: ["onlinepayment"],
          isonlinepaidappointment: true,
          formData: {
            onlinepayment: {
              price: amount,
              transactionId: this.billingservice.PaidAppointments.transactionid,
              bookingId: this.billingservice.PaidAppointments.bookingid,
              cardValidation: "yes",
              onlineContact: this.billingservice.PaidAppointments.mobileno,
            },
          },
        },
      });
    } // //GAV-530 Paid Online appointment
    else {
      RefundDialog = this.matDialog.open(BillPaymentDialogComponent, {
        width: "70vw",
        height: "99vh",
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
          isonlinepaidappointment: false,
          formData: {
            onlinepayment: {
              price: amount,
              transactionId:
                this.billingservice.PaidAppointments.transactionid || "",
              bookingId: this.billingservice.PaidAppointments.bookingid || "",
              cardValidation: "yes",
              onlineContact:
                this.billingservice.PaidAppointments.mobileno || "",
            },
          },
        },
      });
    }

    RefundDialog.afterClosed()
      .pipe(takeUntil(this._destroying$))
      .subscribe(async (result: any) => {
        if (result && "billNo" in result && result.billNo) {
          this.processBillNo(result);
        } else if (result && "successFlag" in result && !result.successFlag) {
          if (result && "returnMessage" in result && result.returnMessage) {
            this.calculateBillService.blockActions.next(false);
            const messageRef = this.messageDialogService.error(
              result.returnMessage
            );
            await messageRef.afterClosed().toPromise();
            return;
          }
        } else {
          this.calculateBillService.blockActions.next(false);
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
            if (
              this.locationexclude.includes(
                Number(this.cookie.get("HSPLocationId"))
              )
            ) {
              const dialogref = this.messageDialogService.confirm(
                "",
                `Do you want Print Blank Op Prescription?`
              );
              dialogref.afterClosed().subscribe((res: any) => {
                if (res == "yes") {
                  this.reportService.openWindow(
                    "OP Prescription Report - " + this.billNo,
                    "PrintOPPrescriptionReport",
                    {
                      opbillid: this.billId,
                      locationID: this.cookie.get("HSPLocationId"),
                    }
                  );
                }
              });
            }

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
    let creditAmount = 0;
    this.data.forEach((bItem: any) => {
      if (parseFloat(bItem.cash) > 0) {
        cashAmount += parseFloat(bItem.cash);
      } else if (parseFloat(bItem.credit) > 0) {
        creditAmount += parseFloat(bItem.credit);
      }
    });
    const temp =
      cashAmount +
      creditAmount -
      (this.formGroup.value.dipositAmtEdit || 0) -
      (this.formGroup.value.discAmt || 0) -
      (this.formGroup.value.amtPayByComp || 0) +
      (parseFloat(this.formGroup.value.gstTax) || 0) -
      (parseFloat(this.formGroup.value.planAmt) || 0);

    return temp.toFixed(2);
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
        this.formGroup.controls["dipositAmt"].setValue(
          this.totalDeposit.toFixed(2)
        );
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
            this.formGroup.controls["dipositAmt"].setValue(
              this.totalDeposit.toFixed(2)
            );
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
      data: {
        gstdetail: this.gstBreakupDetails,
        saccode: this.finalgstDetails.saccode,
      },
    });
  }

  selectedReferralDoctor(data: any) {
    if (data.docotr) {
      console.log(data.docotr);
      this.formGroup.controls["self"].setValue(false);
      // this.formGroup.controls["self"].disable();
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

  async getGSTBreakUpDetails(
    amount: any,
    locationId: number,
    companyId: number
  ) {
    this.gstBreakupDetails = [];
    this.finalgstDetails = {};
    this.http
      .get(
        ApiConstants.getgstdata(
          this.calculateBillService.dsTaxCode.codeId,
          companyId,
          locationId,
          amount
        )
      )
      .subscribe((res: any) => {
        if (res) {
          if (res.length > 0) {
            this.finalgstDetails = res[0];
            if (this.gstBreakupDetails.length <= 0) {
              this.gstBreakupDetails.push({
                service: "CGST",
                percentage: res[0].cgst,
                value: res[0].cgsT_Value,
              });
              this.gstBreakupDetails.push({
                service: "SGST",
                percentage: res[0].sgst,
                value: res[0].sgsT_Value,
              });
              this.gstBreakupDetails.push({
                service: "UTGST",
                percentage: res[0].utgst,
                value: res[0].utgsT_Value,
              });
              this.gstBreakupDetails.push({
                service: "IGST",
                percentage: res[0].igst,
                value: res[0].igsT_Value,
              });
              this.gstBreakupDetails.push({
                service: "CESS",
                percentage: res[0].cess,
                value: res[0].cesS_Value,
              });
              this.gstBreakupDetails.push({
                service: "TotalTax",
                percentage: res[0].totaltaX_RATE,
                value: res[0].totaltaX_Value,
              });
              this.formGroup.controls["gstTax"].setValue(
                this.finalgstDetails.totaltaX_Value.toFixed(2)
              );
              this.billingservice.makeBillPayload.finalDSGSTDetails =
                this.finalgstDetails;
              this.billingservice.makeBillPayload.sacCode = res[0].saccode;
              this.formGroup.controls["amtPayByPatient"].setValue(
                this.getAmountPayByPatient()
              );
            }
          }
        }
      });
  }

  onlinePaymentConfirmation() {
    if (this.billingservice.billingFormGroup.form.value.bookingId) {
      if (this.billingservice.PaidAppointments) {
        if (this.billingservice.PaidAppointments.paymentstatus == "Yes") {
          const onlineconfirmationRef = this.messageDialogService.confirm(
            "",
            "This is online paid appointment billing using online payment Mode"
          );

          onlineconfirmationRef
            .afterClosed()
            .pipe(takeUntil(this._destroying$))
            .subscribe((result: any) => {
              if (result && "type" in result) {
                if (result.type == "yes") {
                  //GAV-530 Paid Online appointment
                  //need to open payment receipt
                  //with auto population of online payment method
                  this.makereceipt(true);
                } else {
                  //GAV-530 Paid Online appointment
                  this.makereceipt(false);
                }
              }
            });
        }
        ////  GAV-530 Paid Online appointment
        else {
          this.makereceipt(false);
        }
      } else {
        this.makereceipt(false);
      }
    } else {
      this.makereceipt(false);
    }
  }
}
