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
import { SendMailDialogComponent } from "../../prompts/send-mail-dialog/send-mail-dialog.component";
import { BillingStaticConstants } from "../../BillingStaticConstant";
import { Form60YesOrNoComponent } from "@modules/billing/submodules/deposit/form60-dialog/form60-yes-or-no.component";
import { timeStamp } from "console";
import { PermissionService } from "@shared/services/permission.service";
import { DepositService } from "@core/services/deposit.service";

@Component({
  selector: "out-patients-bill",
  templateUrl: "./bill.component.html",
  styleUrls: ["./bill.component.scss"],
})
export class BillComponent implements OnInit, OnDestroy {
  locationexclude: any = [67, 69];
  billDataForm = BillingStaticConstants.billTabFormConfig;
  @ViewChild("table") tableRows: any;
  data: any = [];
  config: any = JSON.parse(
    JSON.stringify(BillingStaticConstants.billTabTableConfig)
  );

  formGroup!: FormGroup;
  question: any;

  billNo = "";
  billId = "";
  depositDetails: any = [];
  totalDeposit = 0;
  gstBreakupDetails: any = [];
  finalgstDetails: any = {};
  hspLocationid: any = this.cookie.get("HSPLocationId");
  form60: any;
  precautionExcludeLocations = [69];

  private readonly _destroying$ = new Subject<void>();

  totalPlanDiscount = 0;
  IsValidateCoupon: boolean = false;

  constructor(
    private formService: QuestionControlService,
    public billingservice: BillingService,
    private matDialog: MatDialog,
    private messageDialogService: MessageDialogService,
    private reportService: ReportService,
    private cookie: CookieService,
    private http: HttpService,
    private snackbar: MaxHealthSnackBarService,
    public calculateBillService: CalculateBillService,
    private router: Router,
    private route: ActivatedRoute,
    private permissionservice: PermissionService,
    private depositservice: DepositService
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
    } else {
      this.billDataForm.properties.paymentMode.options = [
        { title: "Cash", value: 1, disabled: false },
        { title: "Credit", value: 3, disabled: false },
        { title: "Gen. OPD", value: 4, disabled: false },
      ];
    }
    if (this.billingservice.selectedHealthPlan) {
      this.billDataForm.properties.discAmtCheck.disabled = true;
      this.billDataForm.properties.discAmt.disabled = true;
      this.billDataForm.properties.paymentMode.options = [
        { title: "Cash", value: 1, disabled: false },
        { title: "Credit", value: 3, disabled: true },
        { title: "Gen. OPD", value: 4, disabled: true },
      ];
    } else {
      this.billDataForm.properties.availDiscCheck.disabled = true;
      this.billDataForm.properties.availDisc.disabled = true;
    }
    if (this.calculateBillService.otherPlanSelectedItems.length > 0) {
      this.billDataForm.properties.discAmtCheck.disabled = true;
      this.billDataForm.properties.discAmt.disabled = true;
      this.billDataForm.properties.dipositAmtcheck.disabled = true;
      this.billDataForm.properties.dipositAmt.disabled = true;
      this.billDataForm.properties.paymentMode.options = [
        { title: "Cash", value: 1, disabled: false },
        { title: "Credit", value: 3, disabled: true },
        { title: "Gen. OPD", value: 4, disabled: true },
      ];
    }

    ///GAV-1418
    if (
      this.billingservice.ConsumableItems &&
      this.billingservice.ConsumableItems.length > 0 &&
      this.billingservice.totalCostWithOutGst == 0
    ) {
      this.billDataForm.properties.discAmtCheck.disabled = true;
      this.billDataForm.properties.discAmt.disabled = true;
      this.billDataForm.properties.dipositAmtcheck.disabled = true;
      this.billDataForm.properties.dipositAmt.disabled = true;
      this.billDataForm.properties.coupon.readonly = true;
      this.billDataForm.properties.paymentMode.options = [
        { title: "Cash", value: 1, disabled: false },
        { title: "Credit", value: 3, disabled: true },
        { title: "Gen. OPD", value: 4, disabled: true },
      ];
    } else {
      this.billDataForm.properties.discAmtCheck.disabled = false;
      this.billDataForm.properties.discAmt.disabled = false;
      this.billDataForm.properties.dipositAmtcheck.disabled = false;
      this.billDataForm.properties.dipositAmt.disabled = false;
      this.billDataForm.properties.coupon.readonly = false;
      this.billDataForm.properties.paymentMode.options = [
        { title: "Cash", value: 1, disabled: false },
        { title: "Credit", value: 3, disabled: false },
        { title: "Gen. OPD", value: 4, disabled: false },
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

    await this.billingservice.calculateBill(this.formGroup, this.question);

    await this.calculateBillService.serviceBasedCheck();

    //GAV 1428
    let nonPricedItems = [];
    ///GAV-1418
    if (!this.billingservice.ConsumableItems) {
      nonPricedItems = this.billingservice.billItems.filter(
        (e: any) => e.price == 0
      );
      if (nonPricedItems.length > 0) {
        this.data = [];
        return;
      } else {
        this.data = this.billingservice.billItems;
      }
    } else {
      this.data = this.billingservice.billItems;
    }

    let planAmount = 0;
    if (this.calculateBillService.otherPlanSelectedItems.length > 0) {
      this.calculateBillService.otherPlanSelectedItems.forEach((oItem: any) => {
        planAmount += oItem.price;
      });
      this.formGroup.patchValue({ planAmt: planAmount });
      this.formGroup.controls["self"].setValue(true);
    }
    //this.billTypeChange(this.formGroup.value.paymentMode);

    // #region GAV-1053 - referal doctor as self autochck

    if (this.billingservice.PaidAppointments) {
      this.formGroup.controls["self"].setValue(true);
    }
    // #endregion
    this.billingservice.clearAllItems.subscribe((clearItems: any) => {
      if (clearItems) {
        this.data = [];
        this.resetDiscount();
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
        this.totalPlanDiscount += item.discAmount;
        if (item.popuptext) {
          popuptext.push({
            name: item.itemName,
            description: item.popuptext,
          });
        }
      });
      if (this.billingservice.selectedHealthPlan) {
        this.formGroup.patchValue({
          availDisc: this.totalPlanDiscount,
          availDiscCheck: true,
        });
      }
      if (popuptext.length > 0) {
        const popuptextDialogRef = this.matDialog.open(PopuptextComponent, {
          width: "80vw",
          data: {
            popuptext,
          },
        });
        await popuptextDialogRef.afterClosed().toPromise();
      }

      /////GAV-1418
      if (this.billingservice.totalCostWithOutGst > 0) {
        await this.calculateBillService.billTabActiveLogics(
          this.formGroup,
          this
        );
        this.billingservice.refreshBillTab
          .pipe(takeUntil(this._destroying$))
          .subscribe((event: boolean) => {
            if (event) {
              this.refreshForm();
              this.refreshTable();
            }
          });
      }

      this.billTypeChange(this.formGroup.value.paymentMode);
    }
    this.billingservice.cerditCompanyBilltypeEvent.subscribe((res: any) => {
      if (res) {
        this.formGroup.controls["paymentMode"].setValue(1);
      }
    });
  }
  clearCoPay() {
    ////GAV-1473
    if (this.formGroup.value.credLimit && this.formGroup.value.credLimit > 0) {
      if (this.formGroup.controls["coPay"].value == 0) {
        this.formGroup.controls["coPay"].setValue("");
      }
    } else {
      this.question[13].readonly = true;
    }
  }

  unClearCoPay() {
    if (this.formGroup.controls["coPay"].value == "") {
      this.formGroup.controls["coPay"].setValue("0");
    }
  }
  clearCredit() {
    if (this.formGroup.controls["credLimit"].value == 0) {
      this.formGroup.controls["credLimit"].setValue("");
    }
  }
  unClearCredit() {
    if (this.formGroup.controls["credLimit"].value == "") {
      this.formGroup.controls["credLimit"].setValue("0");
    }
  }
  clearDis() {
    if (this.formGroup.controls["dipositAmtEdit"].value == 0) {
      this.formGroup.controls["dipositAmtEdit"].setValue("");
    }
  }
  unClearDis() {
    if (this.formGroup.controls["dipositAmtEdit"].value == "") {
      this.formGroup.controls["dipositAmtEdit"].setValue("0");
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
    this.resetDiscount();
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
    if (this.billingservice.selectedHealthPlan) {
      this.formGroup.patchValue({
        availDisc: this.totalPlanDiscount,
      });
    }
  }

  refreshForm() {
    this.billingservice.calculateBill(this.formGroup, this.question);
    //resetting discount on removing all items from Bill tab
    if (this.billingservice.billItems.length == 0) {
      this.resetDiscount();
      this.formGroup.controls["discAmtCheck"].setValue(false);
      ////GAV-1473
      this.formGroup.reset();
      this.formGroup.controls["paymentMode"].setValue(1);
    } else {
      console.log("calling the referesh the discount");
      this.calculateBillService.refreshDiscount(this.formGroup);
      this.calculateBillService.calculateDiscount();

      this.formGroup.controls["billAmt"].setValue(
        this.billingservice.totalCostWithOutGst.toFixed(2)
      );
      this.formGroup.controls["discAmt"].setValue(
        this.calculateBillService.totalDiscountAmt.toFixed(2)
      );
    }

    this.billTypeChange(this.formGroup.value.paymentMode);
  }

  async billTypeChange(value: any) {
    if (value == 1) {
      this.data = this.data.map((dItem: any) => {
        let quantity = !isNaN(Number(dItem.qty)) ? dItem.qty : 1;
        dItem.cash = dItem.price * quantity;
        dItem.credit = 0;
        return dItem;
      });
      this.data = [...this.data];
    } else if (value == 3) {
      this.question[14].readonly = false;
      if (
        this.formGroup.value.credLimit &&
        this.formGroup.value.credLimit > 0
      ) {
        this.question[13].readonly = false;
      } else {
        this.question[13].readonly = true;
      }

      let exceptions = this.calculateBillService.companyNonCreditItems.map(
        (cnci: any) => cnci.itemId
      );
      this.data = this.data.map((dItem: any) => {
        let quantity = !isNaN(Number(dItem.qty)) ? dItem.qty : 1;
        if (exceptions.includes(dItem.itemId)) {
          dItem.cash = dItem.price * quantity;
          dItem.credit = 0;
        } else {
          dItem.cash = 0;
          dItem.credit = dItem.price * quantity;
        }

        return dItem;
      });
      this.data = [...this.data];
      /////GAV-1474
      this.applyCreditLimit();
    } else if (value == 4) {
      if (this.billingservice.billItems.length > 0) {
        if (
          !this.billingservice.billItems[0].serviceName.includes(
            "General OPD PPG"
          )
        ) {
          this.formGroup.controls["paymentMode"].setValue(1);
          this.messageDialogService.info(
            "Selected service(s) Does not come under Gen. OPD"
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
    this.billingservice.calculateTotalAmount();
  }

  ////validation check for GenOPD Bill type
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
    //added for uncheck coupon checkbox when uncheck the discount
    this.formGroup.controls["discAmtCheck"].valueChanges.subscribe(
      (value: any) => {
        console.log("discheck", value);
        if (value) {
          this.calculateBillService.discountSelectedItems = [];
        }
        if (value == false) {
          this.IsValidateCoupon = false;
        }
      }
    );

    //added for uncheck coupon when valuechange
    this.formGroup.controls["coupon"].valueChanges.subscribe(() => {
      this.IsValidateCoupon = false;
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
          if (
            this.formGroup.value.credLimit &&
            this.formGroup.value.credLimit > 0
          ) {
            this.question[13].readonly = false;
          } else {
            this.question[13].readonly = true;
          }

          this.billingservice.setCompnay(0, "", this.formGroup, "header");
          this.billingservice.setCompnay(0, "", this.formGroup, "credit");
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
        this.formGroup.controls["dipositAmtEdit"].setValue(""); // for ticket GAV -1432
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
          this.formGroup.controls["dipositAmtEdit"].setValue(""); // for ticket GAV -1432
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
        // if (
        //   this.formGroup.value.credLimit &&
        //   this.formGroup.value.credLimit > 0
        // ) {
        //   this.applyCreditLimit();
        // } else {
        //   this.formGroup.controls["credLimit"].setValue("0.00");
        //   this.applyCreditLimit();
        // }

        this.checkCreditLimit();
      }
    });

    /////UAT review
    this.question[14].elementRef.addEventListener(
      "blur",
      this.checkCreditLimit.bind(this)
    );

    ////GAV-1473 -
    this.question[13].elementRef.addEventListener(
      "blur",
      this.applyCopay.bind(this)
    );

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
      let quantity = !isNaN(Number(item.qty)) ? item.qty : 1;
      const price = item.price * quantity;
      item.gstValue = item.gst > 0 ? (item.gst * price) / 100 : 0;
      item.totalAmount = price + item.gstValue;
      item.discountType = 0;
      item.discountReason = 0;
    });
    this.calculateBillService.setDiscountSelectedItems([]);
    if (this.calculateBillService.discountForm)
      this.calculateBillService.discountForm.reset();
    this.calculateBillService.calculateDiscount();
    this.formGroup.controls["discAmt"].setValue(
      this.calculateBillService.totalDiscountAmt.toFixed(2)
    );
    /////GAV-1427
    this.billingservice.makeBillPayload.tab_o_opDiscount = [];
    this.billingservice.makeBillPayload.ds_insert_bill.tab_d_opbillList.forEach(
      (opbillItem: any, billIndex: any) => {
        this.billingservice.billItems.forEach((item: any, index: any) => {
          if (opbillItem.itemId == item.itemId) {
            this.billingservice.makeBillPayload.ds_insert_bill.tab_d_opbillList[
              billIndex
            ].amount = item.totalAmount;
          }
        });

        this.billingservice.makeBillPayload.ds_insert_bill.tab_d_opbillList[
          billIndex
        ].discountamount = 0;
        this.billingservice.makeBillPayload.ds_insert_bill.tab_d_opbillList[
          billIndex
        ].discountType = 0;
        this.billingservice.makeBillPayload.ds_insert_bill.tab_d_opbillList[
          billIndex
        ].oldOPBillId = 0;
      }
    );
    this.billTypeChange(this.formGroup.value.paymentMode);
    this.formGroup.controls["coupon"].setValue("");
    this.formGroup.controls["compDisc"].setValue("0.00");
    this.formGroup.controls["patientDisc"].setValue("0.00");
    this.formGroup.controls["discAmtCheck"].setValue(false, {
      emitEvent: false,
    });
    this.applyCreditLimit();
  }

  ///GAV-1473
  async applyCopay() {
    if (this.formGroup.value.paymentMode == 3) {
      if (
        this.formGroup.value.credLimit &&
        this.formGroup.value.credLimit > 0
      ) {
        if (
          this.formGroup.value.coPay <= 100 &&
          this.formGroup.value.coPay >= 0
        ) {
          this.checkCreditLimit();
        } else if (this.formGroup.value.coPay > 100) {
          ////GAV-1473
          this.formGroup.controls["coPay"].setValue(0);
          const copayStatus = await this.messageDialogService
            .warning("Copay cannot exceeds 100%")
            .afterClosed()
            .toPromise()
            .catch();
          if (!copayStatus) {
            return;
          }
        } else {
          ////GAV-1473
          this.formGroup.controls["coPay"].setValue(0);
        }
      } else {
        if (this.formGroup.value.credLimit <= 0) {
          this.formGroup.controls["coPay"].setValue(0);
          this.formGroup.controls["credLimit"].setValue("0.00");
          const credLimitStatus = await this.messageDialogService
            .warning("Enter Credit Limit")
            .afterClosed()
            .toPromise()
            .catch();
          if (!credLimitStatus) {
            return;
          }
        }
      }
    }
  }
  checkCreditLimit() {
    if (this.formGroup.value.credLimit && this.formGroup.value.credLimit > 0) {
      ////////GAV-1473
      this.question[13].readonly = false;
      this.resetDiscount();
      //this.applyCreditLimit();
    } else {
      this.formGroup.controls["credLimit"].setValue("0.00");
      this.formGroup.controls["coPay"].setValue(0);
      this.applyCreditLimit();
    }
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

    let tempAmount = parseFloat(this.formGroup.value.credLimit);
    this.billingservice.setCreditLimit(this.formGroup.value.credLimit);

    let tempFAmount = 0;
    if (tempAmount <= amtPayByComp) {
      tempFAmount = tempAmount;
    } else {
      tempFAmount = amtPayByComp;
    }
    if (this.formGroup.value.coPay > 0) {
      tempFAmount =
        tempFAmount - (tempFAmount * this.formGroup.value.coPay) / 100;
    }
    const companyDiscount =
      this.calculateBillService.discountSelectedItems.find(
        (dItem: any) => dItem.discTypeId == 5
      );
    if (companyDiscount) {
      companyDiscount.price = tempFAmount;
      companyDiscount.discAmt = (tempFAmount * companyDiscount.disc) / 100;
      companyDiscount.totalAmt =
        companyDiscount.price - companyDiscount.discAmt;
      console.log(companyDiscount);
      this.formGroup.controls["compDisc"].setValue(
        companyDiscount.discAmt.toFixed(2)
      );
      this.calculateBillService.calculateDiscount();
      this.formGroup.controls["discAmt"].setValue(
        this.calculateBillService.totalDiscountAmt.toFixed(2)
      );
      tempFAmount -= parseFloat(companyDiscount.discAmt);
    }
    if (this.formGroup.value.credLimit > 0) {
      this.formGroup.controls["amtPayByComp"].setValue(tempFAmount.toFixed(2));
    } else {
      this.formGroup.controls["amtPayByComp"].setValue("0.00");
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
    if (Number(this.formGroup.value.dipositAmtEdit) > 0) {
      let temp = 0;
      if (
        parseFloat(this.formGroup.value.patientDisc) > 0 ||
        parseFloat(this.formGroup.value.compDisc) > 0
      ) {
        temp =
          parseFloat(this.formGroup.value.billAmt) -
          (parseFloat(this.formGroup.value.patientDisc) || 0) -
          (parseFloat(this.formGroup.value.amtPayByComp) +
            parseFloat(this.formGroup.value.compDisc) || 0) +
          (parseFloat(this.formGroup.value.gstTax) || 0) -
          (parseFloat(this.formGroup.value.planAmt) || 0) -
          (parseFloat(this.formGroup.value.availDisc) || 0);
        console.log(temp);
      } else {
        temp =
          parseFloat(this.formGroup.value.billAmt) -
          (parseFloat(this.formGroup.value.discAmt) || 0) -
          (parseFloat(this.formGroup.value.amtPayByComp) || 0) +
          (parseFloat(this.formGroup.value.gstTax) || 0) -
          (parseFloat(this.formGroup.value.planAmt) || 0) -
          (parseFloat(this.formGroup.value.availDisc) || 0);
        console.log(temp);
      }

      if (
        parseFloat(this.formGroup.value.dipositAmtEdit) > temp &&
        parseFloat(this.formGroup.value.dipositAmt) >= temp
      ) {
        this.formGroup.controls["dipositAmtEdit"].setValue(temp.toFixed(2));
      } else if (
        parseFloat(this.formGroup.value.dipositAmtEdit) >
          parseFloat(this.formGroup.value.dipositAmt) &&
        parseFloat(this.formGroup.value.dipositAmt) > temp
      ) {
        this.formGroup.controls["dipositAmtEdit"].setValue(temp.toFixed(2));
      } else if (
        parseFloat(this.formGroup.value.dipositAmtEdit) > temp &&
        parseFloat(this.formGroup.value.dipositAmt) < temp
      ) {
        this.formGroup.controls["dipositAmtEdit"].setValue(
          parseFloat(this.formGroup.value.dipositAmt).toFixed(2)
        );
      } else if (
        parseFloat(this.formGroup.value.dipositAmt) < temp &&
        parseFloat(this.formGroup.value.dipositAmtEdit) >
          parseFloat(this.formGroup.value.dipositAmt)
      ) {
        this.formGroup.controls["dipositAmtEdit"].setValue(
          parseFloat(this.formGroup.value.dipositAmt).toFixed(2)
        );
      }
      this.formGroup.controls["amtPayByPatient"].setValue(
        this.getAmountPayByPatient()
      );
    } else if (this.formGroup.value.dipositAmtEdit <= 0) {
      this.formGroup.controls["dipositAmtEdit"].setValue(""); // for ticket GAV -1432
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

    //check For approval or SRF GAV-1355
    if (this.billingservice.checkApprovalSRF()) {
      await this.calculateBillService.serviceBasedCheck();
    } else {
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

      //CGHS Beneficiary check
      await this.calculateBillService.checkCGHSBeneficiary();

      ////GAV-910 - Domestic Tarrif check
      await this.calculateBillService.checkDoemsticTarrif();

      const consulatationStatus =
        await this.calculateBillService.checkForConsultation();
      if (!consulatationStatus) {
        return;
      }

      //Credit Limit check for Billtype Credit
      if (
        this.formGroup.value.paymentMode == 3 &&
        this.billingservice.company &&
        this.formGroup.value.credLimit <= 0
      ) {
        const credLimitStatus = await this.checkForCreditLimit();
        if (!credLimitStatus) {
          return;
        }
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
              if (Number(this.formGroup.value.amtPayByPatient) > 0) {
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

                this.billingservice.makeBillPayload.ds_insert_bill.tab_insertbill.planAmount =
                  parseFloat(this.formGroup.value.planAmt) || 0;

                this.billingservice.makeBillPayload.ds_insert_bill.tab_insertbill.planId =
                  this.billingservice.selectedOtherPlan
                    ? this.billingservice.selectedOtherPlan.planId
                    : 0;
                this.billingservice.makeBillPayload.ds_insert_bill.tab_insertbill.emailId =
                  this.billingservice.patientDetailsInfo
                    ? this.billingservice.patientDetailsInfo.peMail
                      ? this.billingservice.patientDetailsInfo.peMail
                      : "info@maxhealthcare.com"
                    : "info@maxhealthcare.com";

                this.billingservice.makeBillPayload.ds_insert_bill.tab_insertbill.BookingNo =
                  (this.billingservice.PaidAppointments
                    ? this.billingservice.PaidAppointments.bookingid
                    : this.billingservice.billingFormGroup.form.value
                        .bookingId) || "";
                
                if (
                          this.calculateBillService.discountSelectedItems.length > 0 &&
                          parseFloat(
                            this.billingservice.makeBillPayload.ds_insert_bill.tab_insertbill.discountAmount
                          ) > 0
                        ) {
                          this.billingservice.makeBillPayload.ds_insert_bill.tab_insertbill.disAuthorised =
                            this.calculateBillService.discountForm.value.authorise.title;
                          this.billingservice.makeBillPayload.ds_insert_bill.tab_insertbill.authorisedid =
                            this.calculateBillService.discountForm.value.authorise.value;
                        }

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

    this.billingservice.makeBillPayload.ds_insert_bill.tab_insertbill.planAmount =
      parseFloat(this.formGroup.value.planAmt) || 0;

    this.billingservice.makeBillPayload.ds_insert_bill.tab_insertbill.planId =
      this.billingservice.selectedOtherPlan
        ? this.billingservice.selectedOtherPlan.planId
        : 0;

    this.billingservice.makeBillPayload.ds_insert_bill.tab_insertbill.emailId =
      this.billingservice.patientDetailsInfo
        ? this.billingservice.patientDetailsInfo.peMail
          ? this.billingservice.patientDetailsInfo.peMail
          : "info@maxhealthcare.com"
        : "info@maxhealthcare.com";

    this.billingservice.makeBillPayload.ds_insert_bill.tab_insertbill.BookingNo =
      (this.billingservice.PaidAppointments
        ? this.billingservice.PaidAppointments.bookingid
        : this.billingservice.billingFormGroup.form.value.bookingId) || "";

    //GAV-530 Paid Online Appointment
    let amount = 0;
    if (this.billingservice.PaidAppointments) {
      if (this.billingservice.PaidAppointments.paymentstatus == "Yes") {
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
        width: "80vw",
        height: "96vh",
        data: {
          totalBillAmount:
            this.billingservice.totalCostWithOutGst +
            parseFloat(this.formGroup.value.gstTax), //this.billingservice.totalCost,
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
        width: "80vw",
        height: "96vh",
        data: {
          totalBillAmount:
            this.billingservice.totalCostWithOutGst +
            parseFloat(this.formGroup.value.gstTax), //this.billingservice.totalCost,
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
              transactionId: this.billingservice.PaidAppointments
                ? this.billingservice.PaidAppointments.transactionid
                : "",
              bookingId: this.billingservice.PaidAppointments
                ? this.billingservice.PaidAppointments.bookingid
                : "",
              cardValidation: "yes",
              onlineContact: this.billingservice.PaidAppointments
                ? this.billingservice.PaidAppointments.mobileno
                : "",
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
          this.calculateBillService.blockActions.next(false);
        } else {
          this.calculateBillService.blockActions.next(false);
        }
        this.depositservice.clearformsixtydetails();
      });
  }

  processBillNo(result: any) {
    this.calculateBillService.blockActions.next(false);
    this.billingservice.billNoGenerated.next(true);
    this.billNo = result.billNo;
    this.billingservice.setBillNumber(result.billNo);
    this.billId = result.billId;
    this.config.removeRow = false;
    this.config = { ...this.config };
    const successInfo = this.messageDialogService.info(
      `Bill saved with the Bill No ${result.billNo} and Amount ${this.billingservice.makeBillPayload.ds_insert_bill.tab_insertbill.collectedAmount}`
    );
    successInfo.afterClosed().subscribe(async () => {
      // var complexflag = 0;
      var res = await this.http
        .get(
          BillingApiConstants.fectchpatientiscomplexcare(
            this.billingservice.activeMaxId.iacode,
            Number(this.billingservice.activeMaxId.regNumber),
            Number(this.cookie.get("HSPLocationId"))
          )
        )
        .toPromise();
      let complexflag = 0;
      if (res) {
        if (res.complexCareTable1) {
          if (res.complexCareTable1.length > 0) {
            complexflag = res.complexCareTable1[0].flag;
          }
        }
      }
      console.log(complexflag);
      console.log(res);
      console.log(complexflag);
      if (
        complexflag == 1 &&
        [7, 11, 10].includes(Number(this.cookie.get("HSPLocationId")))
      ) {
        const complexdialog = this.messageDialogService.confirm(
          "",
          "Do You want to print Complex Care Patient Form?"
        );
        complexdialog.afterClosed().subscribe((res: any) => {
          if (res && res.type == "yes") {
            //report code
            this.reportService.openWindow(
              "Complex Care Patient Form - " + this.billNo,
              "ComplexCareReport",
              {
                maxid: this.billingservice.activeMaxId.maxId,
                locationID: Number(this.cookie.get("HSPLocationId")),
                firstName: this.billingservice.patientDetailsInfo.firstname,
                lastName: this.billingservice.patientDetailsInfo.lastname,
                age: this.billingservice.patientDetailsInfo.age,
                cmbyear: this.billingservice.patientDetailsInfo.ageTypeName,
                cmbsex: this.billingservice.patientDetailsInfo.genderName,
                regid: this.billingservice.patientDetailsInfo.registrationno,
              }
            );
            setTimeout(() => {
              this.consumablepopupinit();
            }, 500);
          } else {
            this.consumablepopupinit();
          }
        });
      } else {
        this.consumablepopupinit();
      }
    });
  }

  consumablepopupinit() {
    if (
      this.billingservice.ConsumableItems &&
      this.billingservice.ConsumableItems.length > 0
    ) {
      const consumablespopup = this.messageDialogService.confirm(
        "",
        "Do you want to view Consumable Entry details"
      );
      consumablespopup.afterClosed().subscribe(async (result: any) => {
        console.log(result);
        if (result.type == "yes") {
          this.reportService.openWindow(
            "Consumable Entry details Report - " + this.billNo,
            "ConsumabaleEntryDetailsReport",
            {
              billno: this.billingservice.billNo,
              locationID: this.cookie.get("HSPLocationId"),
              MAXID: this.billingservice.activeMaxId.maxId,
            }
          );
          this.mailapicheck();
          setTimeout(() => {
            if (this.mailflag == true) {
              this.maildialogopen();
            } else {
              this.dialogopen();
            }
          }, 500);
        } else {
          this.mailapicheck();
          setTimeout(() => {
            if (this.mailflag == true) {
              this.maildialogopen();
            } else {
              this.dialogopen();
            }
          }, 500);
        }
      });
    } else {
      this.mailapicheck();
      setTimeout(() => {
        if (this.mailflag == true) {
          this.maildialogopen();
        } else {
          this.dialogopen();
        }
      }, 500);
    }
  }

  mailflag: boolean = false;
  mailapicheck() {
    if (
      this.billingservice.makeBillPayload.ds_insert_bill.tab_insertbill
        .companyId == 0 &&
      Number(
        this.billingservice.makeBillPayload.ds_insert_bill.tab_insertbill
          .companyPaidAmt
      ) == 0
    ) {
      this.http
        .get(
          BillingApiConstants.isemailenablelocation(
            this.cookie.get("HSPLocationId")
          )
        )
        .pipe(takeUntil(this._destroying$))
        .subscribe((res) => {
          console.log(res);
          if (res == 1) {
            this.mailflag = true;
          } else {
            this.mailflag = false;
          }
        });
    } else {
      this.mailflag = false;
    }
  }
  maildialogopen() {
    const maildialog = this.messageDialogService.confirm(
      "",
      "Do you want to Email this bill?"
    );
    maildialog
      .afterClosed()
      .pipe(takeUntil(this._destroying$))
      .subscribe((result: any) => {
        console.log(result);
        if ("type" in result) {
          if (result.type == "yes") {
            const sendmaildialog = this.matDialog.open(
              SendMailDialogComponent,
              {
                width: "40vw",
                height: "50vh",
                data: {
                  mail: this.billingservice.makeBillPayload.ds_insert_bill
                    .tab_insertbill.emailId,
                  mobile:
                    this.billingservice.makeBillPayload.ds_insert_bill
                      .tab_insertbill.mobileNo,
                  billid: this.billId,
                },
              }
            );
            sendmaildialog
              .afterClosed()
              .pipe(takeUntil(this._destroying$))
              .subscribe(() => {
                this.dialogopen();
              });
          } else {
            this.dialogopen();
          }
        }
      });
  }
  dialogopen() {
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
          ) &&
          this.billingservice.consultationItems &&
          this.billingservice.consultationItems.length > 0
        ) {
          const dialogref = this.messageDialogService.confirm(
            "",
            `Do you want Print Blank Op Prescription?`
          );
          dialogref.afterClosed().subscribe((res: any) => {
            if (res.type == "yes") {
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
        //PHP Track Sheet -- Added by Abirami
        if (this.billingservice.billItems[0].serviceName == "Health Checkups") {
          const dialogref = this.messageDialogService.confirm(
            "",
            `Do you want Print Track sheet?`
          );
          dialogref.afterClosed().subscribe((res: any) => {
            if (res.type == "yes") {
              this.reportService.openWindow(
                "PHP Track Sheet - " + this.billNo,
                "PHPTracksheet",
                {
                  BillNo: this.billNo,
                }
              );
            }
          });
        }
        //Ends

        if ("type" in result) {
          if (result.type == "yes") {
            this.http
              .get(
                ApiConstants.getform60(
                  this.hspLocationid,
                  this.billNo,
                  this.billingservice.activeMaxId.iacode,
                  this.billingservice.activeMaxId.regNumber
                )
              )
              .pipe(takeUntil(this._destroying$))
              .subscribe((resultdata: any) => {
                console.log(resultdata);
                this.form60 = resultdata;
                console.log(this.form60);
                if (this.form60 == 1) {
                  const dialogref = this.matDialog.open(
                    Form60YesOrNoComponent,
                    {
                      width: "30vw",
                      height: "35vh",
                    }
                  );
                  dialogref.afterClosed().subscribe((res) => {
                    if (res == "yes") {
                      this.makePrint();
                      this.formreport();
                    } else if (res == "no") {
                      this.makePrint();
                    }
                  });
                } else {
                  this.makePrint();
                }
              });
          }
        }
      });
  }
  duplicateflag: boolean = true;
  makePrint() {
    const accessControls: any = this.permissionservice.getAccessControls();
    let exist: any = accessControls[2][7][534];
    if (exist == undefined) {
      exist = false;
    } else {
      exist = accessControls[2][7][534][1436];
      exist = exist == undefined ? false : exist;
    }
    //direct print for ppg
    if (Number(this.cookie.get("HSPLocationId")) == 8) {
      this.reportService.directPrint("billingreport", {
        opbillid: this.billId,
        locationID: this.cookie.get("HSPLocationId"),
        enableexport: exist == true ? 1 : 0,
      });
    } else {
      this.reportService.openWindow(
        this.billNo + " - Billing Report",
        "billingreport",
        {
          opbillid: this.billId,
          locationID: this.cookie.get("HSPLocationId"),
          enableexport: exist,
        }
      );
    }
  }
  formreport() {
    let regno = this.billingservice.activeMaxId.regNumber;
    let iacode = this.billingservice.activeMaxId.iacode;
    let billno = this.billNo;
    this.reportService.openWindow(
      "FormSixty",
      "FormSixty",
      {
        LocationId: Number(this.cookie.get("HSPLocationId")),
        Iacode: iacode,
        RegistrationNo: regno,
        BillNo: billno,
      },
      "right",
      "center"
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
    let temp = 0;
    if (
      parseFloat(this.formGroup.value.patientDisc) > 0 ||
      parseFloat(this.formGroup.value.compDisc) > 0
    ) {
      temp =
        cashAmount +
        creditAmount -
        (parseFloat(this.formGroup.value.dipositAmtEdit) || 0) -
        (parseFloat(this.formGroup.value.patientDisc) || 0) -
        (parseFloat(this.formGroup.value.amtPayByComp) +
          parseFloat(this.formGroup.value.compDisc) || 0) +
        (parseFloat(this.formGroup.value.gstTax) || 0) -
        (parseFloat(this.formGroup.value.planAmt) || 0) -
        (parseFloat(this.formGroup.value.availDisc) || 0);
    } else {
      temp =
        cashAmount +
        creditAmount -
        (parseFloat(this.formGroup.value.dipositAmtEdit) || 0) -
        (parseFloat(this.formGroup.value.discAmt) || 0) -
        (parseFloat(this.formGroup.value.amtPayByComp) || 0) +
        (parseFloat(this.formGroup.value.gstTax) || 0) -
        (parseFloat(this.formGroup.value.planAmt) || 0) -
        (parseFloat(this.formGroup.value.availDisc) || 0);
    }

    console.log("Amount Pay by Patinet: ", temp);
    this.billingservice.makeBillPayload.ds_insert_bill.tab_insertbill.patientDiscount =
      parseFloat(this.formGroup.value.patientDisc);
    this.billingservice.makeBillPayload.ds_insert_bill.tab_insertbill.companyDiscount =
      parseFloat(this.formGroup.value.compDisc);
    return temp > 0 ? temp.toFixed(2) : "0.00";
  }

  depositdetails() {
    let resultData = this.calculateBillService.depositDetailsData;
    this.totalDeposit = 0;
    this.billingservice.makeBillPayload.ds_insert_bill.tab_getdepositList = [];
    if (resultData) {
      resultData.forEach((element: any) => {
        if (element.isAdvanceTypeEnabled == false) {
          this.billingservice.makeBillPayload.ds_insert_bill.tab_getdepositList.push(
            {
              id: element.id,
              amount: element.amount,
              balanceamount: element.balanceamount,
            }
          );
          this.totalDeposit += element.balanceamount;
        }
      });
      this.depositDetails = resultData;

      if (this.totalDeposit > 0) {
        this.formGroup.controls["dipositAmt"].setValue(
          this.totalDeposit.toFixed(2)
        );
        this.formGroup.controls["dipositAmtcheck"].setValue(true, {
          emitEvent: false,
        });
        this.formGroup.controls["dipositAmtEdit"].setValue(""); // for ticket GAV -1432
        this.question[20].readonly = false;
        this.formGroup.controls["dipositAmtEdit"].enable();
        this.question[20].elementRef.focus();
        // this.question[20].disable = false;
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
            this.formGroup.controls["dipositAmtEdit"].setValue(""); // for ticket GAV -1432
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
          this.IsValidateCoupon = false;
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
            this.IsValidateCoupon = false;
            return;
          }
        }
      } else if (this.formGroup.value.coupon.length > 3) {
        // validation to show coupon required
        const CouponErrorRef = this.messageDialogService.error(
          "Please Enter Proper Coupon"
        );
        this.IsValidateCoupon = false;
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
    if (this.calculateBillService.dsTaxCode.codeId > 0) {
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
                  percentage: res[0].cgst.toFixed(2),
                  value: res[0].cgsT_Value.toFixed(2),
                });
                this.gstBreakupDetails.push({
                  service: "SGST",
                  percentage: res[0].sgst.toFixed(2),
                  value: res[0].sgsT_Value.toFixed(2),
                });
                this.gstBreakupDetails.push({
                  service: "UTGST",
                  percentage: res[0].utgst.toFixed(2),
                  value: res[0].utgsT_Value.toFixed(2),
                });
                this.gstBreakupDetails.push({
                  service: "IGST",
                  percentage: res[0].igst.toFixed(2),
                  value: res[0].igsT_Value.toFixed(2),
                });
                this.gstBreakupDetails.push({
                  service: "CESS",
                  percentage: res[0].cess.toFixed(2),
                  value: res[0].cesS_Value.toFixed(2),
                });
                this.gstBreakupDetails.push({
                  service: "TotalTax",
                  percentage: res[0].totaltaX_RATE.toFixed(2),
                  value: res[0].totaltaX_Value.toFixed(2),
                });
                this.formGroup.controls["gstTax"].setValue(
                  this.finalgstDetails.totaltaX_Value.toFixed(2)
                );
                this.calculateBillService.mapFinalGSTDetails(
                  this.finalgstDetails
                );
                // this.billingservice.makeBillPayload.finalDSGSTDetails =
                //   this.finalgstDetails;
                this.billingservice.makeBillPayload.sacCode = res[0].saccode;
                this.formGroup.controls["amtPayByPatient"].setValue(
                  this.getAmountPayByPatient()
                );
              }
            }
          }
        });
    } else {
      this.billingservice.makeBillPayload.finalDSGSTDetails =
        this.calculateBillService.dsTaxCode;
      this.billingservice.makeBillPayload.sacCode =
        this.calculateBillService.dsTaxCode.saccode;
    }
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

  async checkForCreditLimit() {
    const credLimitWarningPopup: any = this.messageDialogService.confirm(
      "",
      "Do you want to enter credit limit?"
    );
    const credLimitWarning = await credLimitWarningPopup
      .afterClosed()
      .toPromise();
    if (credLimitWarning) {
      if (credLimitWarning.type == "yes") {
        this.question[14].elementRef.focus();
        this.formGroup.controls["credLimit"].setValue("");
        return false;
      } else {
        this.formGroup.controls["paymentMode"].setValue(1);
        return true;
      }
    }
    return true;
  }
}
