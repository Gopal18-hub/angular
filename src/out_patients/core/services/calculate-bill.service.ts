import { Injectable } from "@angular/core";
import { MessageDialogService } from "@shared/ui/message-dialog/message-dialog.service";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { BillingService } from "../../modules/billing/submodules/billing/billing.service";
import { HttpService } from "@shared/services/http.service";
import { CookieService } from "@shared/services/cookie.service";
import { BillingApiConstants } from "../../modules/billing/submodules/billing/BillingApiConstant";
import { Subject, takeUntil } from "rxjs";
import { DisountReasonComponent } from "../../modules/billing/submodules/billing/prompts/discount-reason/disount-reason.component";
import { ApiConstants } from "@core/constants/ApiConstants";
import { BillingStaticConstants } from "@modules/billing/submodules/billing/BillingStaticConstant";
import { FormDialogueComponent } from "@shared/ui/form-dialogue/form-dialogue.component";
import { SrfReasonComponent } from "@modules/billing/submodules/billing/prompts/srf-reason/srf-reason.component";

@Injectable({
  providedIn: "root",
})
export class CalculateBillService {
  billingServiceRef: any;

  discountSelectedItems: any = [];

  totalDiscountAmt: number = 0;

  interactionDetails: any = [];

  bookingIdWarningFlag: boolean = false;

  seniorCitizen: boolean = false;

  depositDetailsData: any = [];

  discountForm: any;

  validCoupon: boolean = false;

  companyNonCreditItems: any = [];

  billFormGroup: any;

  private readonly _destroying$ = new Subject<void>();

  serviceBasedListItems: any = {};

  blockActions = new Subject<boolean>();

  otherPlanSelectedItems: any = [];

  consumablesUnselectedItems: any = {};

  constructor(
    public matDialog: MatDialog,
    private http: HttpService,
    public cookie: CookieService,
    public messageDialogService: MessageDialogService
  ) {}

  setCompanyNonCreditItems(items: any) {
    this.companyNonCreditItems = items;
  }

  initProcess(
    billItems: any,
    billingServiceRef: any,
    formGroup?: any,
    question?: any
  ) {
    if (formGroup && question) {
      this.billFormGroup = {
        form: formGroup,
        questions: question,
      };
    }
    this.serviceBasedListItems = [];
    this.billingServiceRef = billingServiceRef;
    this.billingServiceRef.billItems.forEach((item: any) => {
      if (!this.serviceBasedListItems[item.serviceName.toString()]) {
        this.serviceBasedListItems[item.serviceName.toString()] = {
          id: item.serviceId,
          name: item.serviceName,
          items: [],
        };
      }
      this.serviceBasedListItems[item.serviceName.toString()].items.push(item);
    });
    billItems.forEach(async (item: any) => {
      await this.serviceBasedCheck(item);
    });
  }

  setDiscountForm(form: any) {
    this.discountForm = form;
  }

  depositDetails(iacode: string, regNumber: number) {
    this.http
      .get(
        ApiConstants.getDipositedAmountByMaxID(
          iacode,
          regNumber,
          Number(this.cookie.get("HSPLocationId"))
        )
      )
      .subscribe((resultData: any) => {
        this.depositDetailsData = resultData;
      });
  }

  clear() {
    this.totalDiscountAmt = 0;
    this.discountSelectedItems = [];
    this.bookingIdWarningFlag = false;
    this.depositDetailsData = [];
    this.seniorCitizen = false;
    this.billFormGroup = null;
    this.otherPlanSelectedItems = [];
  }

  setDiscountSelectedItems(items: any) {
    this.discountSelectedItems = items;
  }

  calculateDiscount() {
    this.totalDiscountAmt = 0;
    this.discountSelectedItems.forEach((item: any) => {
      this.totalDiscountAmt += item.discAmt;
    });
  }

  async serviceBasedCheck(item: any) {
    switch (item.serviceId) {
      case 41:
        if (this.billingServiceRef.company > 0) {
          await this.CheckOutSourceTest(item);
        }
        break;
      case 65:
      case 66:
        break;
      case 46:
      case 109:
        break;

      default:
        console.log("default");
    }
  }

  async CheckOutSourceTest(item: any) {
    ////GAV-1355  -SRF
    if (
      !this.billingServiceRef.makeBillPayload.ds_insert_bill.tab_insertbill
        .srfID ||
      this.billingServiceRef.makeBillPayload.ds_insert_bill.tab_insertbill
        .srfID == 0
    ) {
      const checkResult = await this.http
        .post(
          BillingApiConstants.checkoutsourcetest(
            this.billingServiceRef.company
          ),
          [{ id: item.itemId }]
        )
        .toPromise()
        .catch((error: any) => {
          if (error.status == 200) {
            return error.error.text;
          }
        });

      console.log(checkResult);
      if (checkResult && checkResult.length > 0) {
        const infoDialog = await this.messageDialogService.confirm(
          "",
          "To perform below Investigations, need special approval or SRF. DO you want to proceed?"
        );

        const infoDialogRes = await infoDialog.afterClosed().toPromise();
        if (
          infoDialogRes &&
          "type" in infoDialogRes &&
          infoDialogRes.type == "yes"
        ) {
          const srfDialogref = this.matDialog.open(SrfReasonComponent, {
            width: "28vw",
            height: "25vh",
            disableClose: true,
          });

          let res = await srfDialogref
            .afterClosed()
            .pipe(takeUntil(this._destroying$))
            .toPromise();

          if (res && res.data && res.data.reason) {
            this.billingServiceRef.makeBillPayload.ds_insert_bill.tab_insertbill.srfID =
              res.data.reason;
          }
        }
      }
    }
  }

  async getinteraction() {
    if (this.interactionDetails.length > 0) {
      return this.interactionDetails;
    }
    const res = await this.http
      .get(BillingApiConstants.getinteraction)
      .toPromise();
    this.interactionDetails = res.map((it: any) => {
      return { value: it.id, title: it.name };
    });
    return this.interactionDetails;
  }

  refreshDiscount(formGroup: any) {
    if (this.discountSelectedItems.length > 0) {
      this.discountSelectedItems.forEach((disIt: any) => {
        if ([1, 6].includes(disIt.discTypeId)) {
          disIt.price = this.billingServiceRef.totalCost;
          disIt.discAmt = (disIt.price * disIt.disc) / 100;
          disIt.totalAmt = disIt.price - disIt.discAmt;
        } else if (disIt.discTypeId == 2) {
          console.log(this.serviceBasedListItems);
          const serviceItem: any = Object.values(
            this.serviceBasedListItems
          ).find((sbli: any) => sbli.name == disIt.service);
          console.log(serviceItem);
          let price = 0;
          serviceItem.items.forEach((item: any) => {
            let quanity = !isNaN(Number(item.qty)) ? item.qty : 1;
            price += item.price * quanity;
          });
          const discAmt = (price * disIt.disc) / 100;
          disIt.price = price;
          disIt.discAmt = discAmt;
          disIt.totalAmt = price - discAmt;
        } else if (disIt.discTypeId == 3) {
          const billItem = this.billingServiceRef.billItems.find(
            (bItem: any) => bItem.itemId == disIt.itemId
          );
          let quanity = !isNaN(Number(billItem.qty)) ? billItem.qty : 1;
          let price = billItem.price * quanity;
          const discAmt = (price * disIt.disc) / 100;
          disIt.price = price;
          disIt.discAmt = discAmt;
          disIt.totalAmt = price - discAmt;
        }
      });
      this.applyDiscount("biilTab", formGroup);
    }
  }

  applyDiscount(from: string, formGroup: any) {
    this.billingServiceRef.billItems.forEach((item: any) => {
      item.disc = 0;
      item.discAmount = 0;
      let quanity = !isNaN(Number(item.qty)) ? item.qty : 1;
      const price = item.price * quanity;
      item.gstValue = item.gst > 0 ? (item.gst * price) / 100 : 0;
      item.totalAmount = item.price * quanity + item.gstValue;
      item.discountType = 0;
      item.discountReason = 0;
    });
    if (this.discountSelectedItems.length == 0) {
    } else {
      if (
        this.discountSelectedItems.length == 1 &&
        [1, 6].includes(this.discountSelectedItems[0].discTypeId)
      ) {
        const discItem = this.discountSelectedItems[0];
        this.billingServiceRef.billItems.forEach((item: any) => {
          let quanity = !isNaN(Number(item.qty)) ? item.qty : 1;
          item.disc = discItem.disc;
          item.discAmount = (item.price * quanity * discItem.disc) / 100;
          const itemPrice = item.price * quanity - item.discAmount;
          item.gstValue = item.gst > 0 ? (item.gst * itemPrice) / 100 : 0;
          item.totalAmount = itemPrice + item.gstValue;
          item.discountType = this.discountSelectedItems[0].discTypeId;
          item.discountReason = discItem.reason;
        });
      } else {
        this.discountSelectedItems.forEach((ditem: any) => {
          if (ditem.discTypeId == 3) {
            const item = this.billingServiceRef.billItems.find(
              (it: any) => it.itemId == ditem.itemId
            );
            if (item) {
              let quanity = !isNaN(Number(item.qty)) ? item.qty : 1;
              item.disc = ditem.disc;
              item.discAmount = (item.price * quanity * ditem.disc) / 100;
              const itemPrice = item.price * quanity - item.discAmount;
              item.gstValue = item.gst > 0 ? (item.gst * itemPrice) / 100 : 0;
              item.totalAmount = itemPrice + item.gstValue;
              item.discountType = 3;
              item.discountReason = ditem.reason;
            }
          } else if (ditem.discTypeId == 2) {
            const items = this.billingServiceRef.billItems.filter(
              (it: any) => it.serviceName == ditem.service
            );
            if (items) {
              items.forEach((item: any) => {
                let quanity = !isNaN(Number(item.qty)) ? item.qty : 1;
                item.disc = ditem.disc;
                item.discAmount = (item.price * quanity * ditem.disc) / 100;
                const itemPrice = item.price * quanity - item.discAmount;
                item.gstValue = item.gst > 0 ? (item.gst * itemPrice) / 100 : 0;
                item.totalAmount = itemPrice + item.gstValue;
                item.discountType = 2;
                item.discountReason = ditem.reason;
              });
            }
          } else if (ditem.discTypeId == 4) {
            formGroup.controls["patientDisc"].setValue(ditem.discAmt);
          } else if (ditem.discTypeId == 5) {
            formGroup.controls["compDisc"].setValue(ditem.discAmt);
            formGroup.controls["amtPayByComp"].setValue(ditem.totalAmt);
          }
        });
      }
    }
  }

  discountreason(formGroup: any, componentRef: any, from: string = "discount") {
    let data = {};
    if (from == "coupon") {
      data = {
        removeRow: false,
        disabledRowControls: true,
        disableAdd: true,
        disableClear: true,
        disableHeaderControls: true,
        formData: {
          authorise: { title: "As Per Policy", value: 4 },
        },
        discounttypes: [
          { title: "On Bill", value: "On-Bill" },
          { title: "On Service", value: "On-Service" },
          { title: "On Item", value: "On-Item" },
          { title: "On Patient", value: "On-Patient" },
          { title: "On Company", value: "On-Company" },
          { title: "On Campaign", value: "On-Campaign" },
        ],
      };
    } else {
      data = {
        formData: this.discountForm ? this.discountForm.value : {},
        discounttypes: [
          { title: "On Bill", value: "On-Bill", disabled: false },
          { title: "On Service", value: "On-Service", disabled: false },
          { title: "On Item", value: "On-Item", disabled: false },
          {
            title: "On Patient",
            value: "On-Patient",
            disabled:
              formGroup.value.paymentMode == 3 &&
              parseFloat(formGroup.value.amtPayByPatient) > 0
                ? false
                : true,
          },
          {
            title: "On Company",
            value: "On-Company",
            disabled:
              parseFloat(formGroup.value.amtPayByComp) > 0 ? false : true,
          },
          { title: "On Campaign", value: "On-Campaign", disabled: false },
        ],
      };
    }
    const discountReasonPopup = this.matDialog.open(DisountReasonComponent, {
      width: "80vw",
      minWidth: "90vw",
      height: "69vh",
      data: data,
    });
    discountReasonPopup.afterClosed().subscribe((res: any) => {
      if (res && "applyDiscount" in res && res.applyDiscount) {
        this.processDiscountLogics(formGroup, componentRef, from);
      } else if (this.totalDiscountAmt == 0) {
        this.processDiscountLogics(formGroup, componentRef, from);
        ////GAV-1144 - coupon discount
        if (from != "coupon") {
          formGroup.controls["discAmtCheck"].setValue(false, {
            emitEvent: false,
          });
        }
      }
    });
  }

  processDiscountLogics(formGroup: any, componentRef: any, from: string) {
    this.billingServiceRef.makeBillPayload.tab_o_opDiscount = [];
    this.applyDiscount(from, formGroup);
    componentRef.billTypeChange(formGroup.value.paymentMode);
    if (this.discountSelectedItems.length > 0) {
      this.discountSelectedItems.forEach((discItem: any) => {
        this.billingServiceRef.makeBillPayload.tab_o_opDiscount.push({
          discOn: discItem.discType,
          disType: discItem.discTypeId.toString(),
          disPer: discItem.disc,
          disReason: discItem.reasonTitle,
          disAmt: discItem.discAmt,
        });
      });
    } else {
      this.billingServiceRef.makeBillPayload.tab_o_opDiscount = [];
    }

    ////GAV-1144 - coupon discount
    if (from == "coupon") {
      this.calculateDiscount();
    }

    formGroup.controls["discAmt"].setValue(this.totalDiscountAmt);
    componentRef.applyCreditLimit();
    if (this.totalDiscountAmt > 0) {
      formGroup.controls["discAmtCheck"].setValue(true, {
        emitEvent: false,
      });
    }
    componentRef.refreshTable();
    formGroup.controls["amtPayByPatient"].setValue(
      componentRef.getAmountPayByPatient()
    );
  }

  async billTabActiveLogics(formGroup: any, componentRef: any) {
    if (
      formGroup.value.paymentMode == 1 &&
      this.otherPlanSelectedItems.length == 0
    ) {
      if (this.billingServiceRef.todayPatientBirthday) {
        const birthdayDialogRef = this.messageDialogService.confirm(
          "",
          "Today is Patient Birthday, Do you want to Give Discount...?"
        );
        const birthdayDialogResult = await birthdayDialogRef
          .afterClosed()
          .toPromise();
        if (birthdayDialogResult) {
          if (birthdayDialogResult.type == "yes") {
            this.discountreason(formGroup, componentRef);
          }
        }
      } else if (this.seniorCitizen) {
        const birthdayDialogRef = this.messageDialogService.confirm(
          "",
          "Patient is senior citizen, Do you want to Give Discount...?"
        );
        const birthdayDialogResult = await birthdayDialogRef
          .afterClosed()
          .toPromise();
        if (birthdayDialogResult) {
          if (birthdayDialogResult.type == "yes") {
            this.discountreason(formGroup, componentRef);
          }
        }
      }
    }
  }

  async checkForConsultation() {
    if (this.billingServiceRef.consultationItems.length > 0) {
      if (
        !this.billingServiceRef.billingFormGroup.form.value.bookingId &&
        !this.bookingIdWarningFlag
      ) {
        const bookingIdWarningPopup: any = this.messageDialogService.confirm(
          "",
          "Do you have bookingId for this consultation?"
        );
        const bookingIdWarning = await bookingIdWarningPopup
          .afterClosed()
          .toPromise();
        if (bookingIdWarning) {
          this.bookingIdWarningFlag = true;
          if (bookingIdWarning.type == "yes") {
            this.billingServiceRef.billingFormGroup.questions[2].elementRef.focus();
            return false;
          }
        }
      }
    }
    return true;
  }

  //#region Coupon discount
  async getServicesForCoupon(
    formGroup: any,
    locationId: any,
    componentRef: any
  ) {
    const res = await this.http
      .get(
        BillingApiConstants.getServicesForCoupon(
          formGroup.value.coupon,
          locationId
        )
      )
      .toPromise();
    console.log(res);
    if (res.length > 0) {
      console.log(res[0].id);
      if (res[0].id == 0) {
        //coupon already used message
        const CouponErrorRef = this.messageDialogService.error(
          "Coupon already used"
        );
        await CouponErrorRef.afterClosed().toPromise();
        formGroup.controls["coupon"].setValue("", {
          emitEvent: false,
        });
        componentRef.IsValidateCoupon = false;
        return;
      } else {
        componentRef.IsValidateCoupon = true;
        const CouponConfirmationRef = this.messageDialogService.confirm(
          "",
          "Coupon Accepted, Do you want to proceed with MECP discount ?"
        );

        CouponConfirmationRef.afterClosed()
          .pipe(takeUntil(this._destroying$))
          .subscribe(async (result: any) => {
            if ("type" in result) {
              if (result.type == "yes") {
                this.discountSelectedItems = this.processDiscount(res);
                if (this.discountSelectedItems) {
                  if (this.discountSelectedItems.length > 0) {
                    this.validCoupon = true;
                    this.discountreason(formGroup, componentRef, "coupon");
                  } else {
                    const CouponErrorRef = this.messageDialogService.error(
                      "Coupon cannot be applied on selected Services or Items"
                    );
                    await CouponErrorRef.afterClosed().toPromise();
                    formGroup.controls["coupon"].setValue("", {
                      emitEvent: false,
                    });
                    componentRef.IsValidateCoupon = false;
                    return;
                  }
                } else {
                  const CouponErrorRef = this.messageDialogService.error(
                    "Coupon cannot be applied on selected Services or Items"
                  );
                  await CouponErrorRef.afterClosed().toPromise();
                  formGroup.controls["coupon"].setValue("", {
                    emitEvent: false,
                  });
                  componentRef.IsValidateCoupon = false;
                  return;
                }
              } else {
              }
            }
          });
      }
    } else {
      //Invalid Coupon
      const CouponErrorRef =
        this.messageDialogService.error("Invalid Coupon !");
      await CouponErrorRef.afterClosed().toPromise();
      formGroup.controls["coupon"].setValue("", {
        emitEvent: false,
      });
      return;
    }
  }

  processDiscount(couponServices: any): any {
    let discountper = 0;
    let Sno = 0;
    let discountReasonItems = [];

    if (this.billingServiceRef.billItems) {
      if (this.billingServiceRef.billItems.length > 0) {
        //for each bill item
        for (var item of this.billingServiceRef.billItems) {
          //get discount on basis of service Id, itemId and discounper
          let couponService = this.getDiscounts(
            item,
            couponServices,
            discountper
          );
          //got discount then add row to discount rrason list
          if (couponService && couponService.length > 0) {
            //preparing a array for service/item based CouponService
            let couponItem = this.setCouponItem(
              item,
              couponService,
              discountper,
              Sno
            );
            //array to populate all couponServices in discount popup
            discountReasonItems.push(couponItem);
          }
        }
        console.log(discountReasonItems);
        return discountReasonItems;
      }
    }
  }

  getDiscounts(billItem: any, couponServices: any, discountper = 0): any {
    //get discount on basis of service Id, itemId and discounper
    let itemdiscount = couponServices.filter(
      (x: any) =>
        x.serviceID === billItem.serviceId &&
        x.itemID === billItem.itemId &&
        x.discountper > discountper
    );
    if (!itemdiscount || itemdiscount.length <= 0) {
      //get discount  for consultations
      if (billItem.serviceId == 15 || billItem.serviceId == 25) {
        if (billItem.specialisationID == 0) {
          itemdiscount = couponServices.filter(
            (x: any) =>
              x.serviceID === billItem.serviceId &&
              (x.specialisationID === billItem.specialisationID ||
                x.specialisationID === 0 ||
                x.specialisationID == null)
          );
        } else {
          itemdiscount = couponServices.filter(
            (x: any) =>
              x.serviceID === billItem.serviceId &&
              x.specialisationID === billItem.specialisationID
          );
        }
        //get discount  for consultations for service Id
        if (!itemdiscount || itemdiscount.length <= 0) {
          itemdiscount = couponServices.filter(
            (x: any) =>
              x.serviceID === billItem.serviceId &&
              (x.itemID === 0 || x.itemID == null)
          );
        }
      } else {
        //get discount for other services that consultation
        itemdiscount = couponServices.filter(
          (x: any) =>
            x.serviceID === billItem.serviceId &&
            (x.itemID === 0 || x.itemID == null)
        );
      }
    } else if (itemdiscount[0].discountper <= 0) {
      if (billItem.serviceId == 15 || billItem.serviceId == 25) {
        if (billItem.specialisationID == 0) {
          itemdiscount = couponServices.filter(
            (x: any) =>
              x.serviceID === billItem.serviceId &&
              (x.specialisationID === billItem.specialisationID ||
                x.specialisationID === 0 ||
                x.specialisationID == null)
          );
        } else {
          itemdiscount = couponServices.filter(
            (x: any) =>
              x.serviceID === billItem.serviceId &&
              x.specialisationID === billItem.specialisationID
          );
        }

        if (!itemdiscount || itemdiscount.length <= 0) {
          itemdiscount = couponServices.filter(
            (x: any) =>
              x.serviceID === billItem.serviceId &&
              (x.itemID === 0 || x.itemID == null)
          );
        }
      } else {
        itemdiscount = couponServices.filter(
          (x: any) =>
            x.serviceID === billItem.serviceId &&
            (x.itemID === 0 || x.itemID == null)
        );
      }
    }
    return itemdiscount;
  }

  setCouponItem(
    billItem: any,
    couponService: any,
    discountper = 0,
    Sno = 0
  ): any {
    Sno += 1;
    discountper = couponService[0].discountper;
    let discAmt = (billItem.price * discountper) / 100;
    let totalAmt = billItem.price - discAmt;
    let serviceName = billItem.serviceName;
    let itemName = billItem.itemName;
    let price = billItem.price;

    let disType = "On-Item";
    let valuebased = 0;

    let couponItem = {
      sno: Sno,
      discType: "On Item",
      discTypeId: 3,
      service: serviceName,
      itemId: billItem.itemId,
      doctor: itemName,
      price: price,
      disc: discountper,
      discAmt: discAmt,
      totalAmt: totalAmt,
      head: couponService[0].mainhead,
      reason: couponService[0].id,
      value: "0",
      discTypeValue: disType,
      reasonTitle: couponService[0].name,
    };
    return couponItem;
  }
  //#endregion

  //#region TaxableBill
  dsTaxCode: any;
  async checkTaxableBill(): Promise<boolean> {
    let cstype = await this.getServiceTypeByCode(1356);
    let countProc = 0;
    let Countindx = 0;
    let taxapplicable = false;
    let GSTTaxPer = 0;
    let STax = 0;
    let SNonTax = 0;
    let citem = 0;
    let ncitem = 0;
    let cosflag = false;
    let TaxNontaxFlag = false;
    let CosmeticFlag = false;
    let HomeCareFlag = false;
    let SACCode = "";
    let BillFlag_ForGST = false;
    let flg = 0;
    let strErrormsg = "";
    if (this.billingServiceRef.ProcedureItems.length > 0) {
      this.billingServiceRef.ProcedureItems.forEach((item: any) => {
        countProc = countProc + 1;

        if (item.gstCode.tax > 0) {
          taxapplicable = true;
          GSTTaxPer = item.gstCode.tax;
          STax = STax + 1;
        } else {
          taxapplicable = false;
          GSTTaxPer = 0;
          SNonTax = SNonTax + 1;
        }

        if (cstype > 0 && item.gstCode.codeId == cstype) {
          citem = citem + 1;
        } else {
          ncitem = ncitem + 1;
        }

        if (STax > 0 && SNonTax > 0) {
          cosflag = true;
          TaxNontaxFlag = true;
          if (item.billItem.serviceId == 83) {
            CosmeticFlag = true;
          }
        }

        if (citem > 0 && ncitem > 0) {
          cosflag = true;
          TaxNontaxFlag = true;
          if (item.billItem.serviceId == 83) {
            CosmeticFlag = true;
          }
        }

        if (SACCode == "") {
          SACCode = item.gstDetail.saccode;
        } else if (SACCode != item.gstDetail.saccode) {
          BillFlag_ForGST = true;
        }

        if (Countindx == 0 && taxapplicable) {
          flg = 1;
        } else {
          if (flg == 1 && !taxapplicable) {
            strErrormsg += item.billItem.itemName + ",";
          }
          if (flg == 0 && taxapplicable) {
            strErrormsg += item.billItem.itemName + ",";
          }
        }

        if (item.billItem.serviceId != 92) {
          if (item.gstCode.tax == 0) {
            this.dsTaxCode = item.gstDetail;
          } else if (item.gstCode.tax > 0) {
            this.dsTaxCode = item.gstDetail;
          }
        } else {
          this.dsTaxCode = item.gstDetail;
        }
        Countindx = Countindx + 1;
      });
    }
    Countindx = 0;
    if (this.billingServiceRef.consultationItems.length > 0) {
      this.billingServiceRef.consultationItems.forEach((item: any) => {
        countProc = countProc + 1;

        if (item.gstCode.tax > 0) {
          taxapplicable = true;
          GSTTaxPer = item.gstCode.tax;
          STax = STax + 1;
        } else {
          taxapplicable = false;
          GSTTaxPer = 0;
          SNonTax = SNonTax + 1;
        }

        if (cstype > 0 && item.gstCode.codeId == cstype) {
          citem = citem + 1;
        } else {
          ncitem = ncitem + 1;
        }

        if (STax > 0 && SNonTax > 0) {
          cosflag = true;
          TaxNontaxFlag = true;
        }

        if (citem > 0 && ncitem > 0) {
          cosflag = true;
          TaxNontaxFlag = true;
        }

        if (SACCode == "") {
          SACCode = item.gstDetail.saccode;
          this.dsTaxCode = item.gstDetail;
        } else if (SACCode != item.gstDetail.saccode) {
          BillFlag_ForGST = true;
        }

        if (Countindx == 0 && taxapplicable) {
          flg = 1;
        } else {
          if (flg == 1 && !taxapplicable) {
            strErrormsg += item.billItem.serviceName + ",";
          }
          if (flg == 0 && taxapplicable) {
            strErrormsg += item.billItem.serviceName + ",";
          }
        }
        Countindx = Countindx + 1;
      });
    }
    Countindx = 0;
    if (this.billingServiceRef.HealthCheckupItems.length > 0) {
      this.billingServiceRef.HealthCheckupItems.forEach((item: any) => {
        countProc = countProc + 1;

        if (item.gstCode.tax > 0) {
          taxapplicable = true;
          GSTTaxPer = item.gstCode.tax;
          STax = STax + 1;
        } else {
          taxapplicable = false;
          GSTTaxPer = 0;
          SNonTax = SNonTax + 1;
        }

        if (cstype > 0 && item.gstCode.codeId == cstype) {
          citem = citem + 1;
        } else {
          ncitem = ncitem + 1;
        }

        if (STax > 0 && SNonTax > 0) {
          cosflag = true;
          TaxNontaxFlag = true;
        }

        if (citem > 0 && ncitem > 0) {
          cosflag = true;
          TaxNontaxFlag = true;
        }

        if (SACCode == "") {
          SACCode = item.gstDetail.saccode;
          this.dsTaxCode = item.gstDetail;
        } else if (SACCode != item.gstDetail.saccode) {
          BillFlag_ForGST = true;
        }

        if (Countindx == 0 && taxapplicable) {
          flg = 1;
        } else {
          if (flg == 1 && !taxapplicable) {
            strErrormsg += item.billItem.itemName + ",";
          }
          if (flg == 0 && taxapplicable) {
            strErrormsg += item.billItem.itemName + ",";
          }
        }
        Countindx = Countindx + 1;
      });
    }
    Countindx = 0;
    if (this.billingServiceRef.InvestigationItems.length > 0) {
      this.billingServiceRef.InvestigationItems.forEach((item: any) => {
        countProc = countProc + 1;

        if (item.gstCode.tax > 0) {
          taxapplicable = true;
          GSTTaxPer = item.gstCode.tax;
          STax = STax + 1;
        } else {
          taxapplicable = false;
          GSTTaxPer = 0;
          SNonTax = SNonTax + 1;
        }

        if (cstype > 0 && item.gstCode.codeId == cstype) {
          citem = citem + 1;
        } else {
          ncitem = ncitem + 1;
        }

        if (STax > 0 && SNonTax > 0) {
          cosflag = true;
          TaxNontaxFlag = true;
          if (item.billItem.serviceId == 83) {
            CosmeticFlag = true;
          }
        }

        if (citem > 0 && ncitem > 0) {
          cosflag = true;
          TaxNontaxFlag = true;
          if (item.billItem.serviceId == 83) {
            CosmeticFlag = true;
          }
        }

        if (SACCode == "") {
          SACCode = item.gstDetail.saccode;
        } else if (SACCode != item.gstDetail.saccode) {
          BillFlag_ForGST = true;
        }

        if (Countindx == 0 && taxapplicable) {
          flg = 1;
        } else {
          if (flg == 1 && !taxapplicable) {
            strErrormsg += item.billItem.itemName + ",";
          }
          if (flg == 0 && taxapplicable) {
            strErrormsg += item.billItem.itemName + ",";
          }
        }

        if (item.billItem.serviceId != 92) {
          if (item.gstCode.tax == 0) {
            this.dsTaxCode = item.gstDetail;
          } else if (item.gstCode.tax > 0) {
            this.dsTaxCode = item.gstDetail;
          }
        } else {
          this.dsTaxCode = item.gstDetail;
        }
        Countindx = Countindx + 1;
      });
    }
    Countindx = 0;
    if (this.billingServiceRef.OrderSetItems.length > 0) {
      this.billingServiceRef.OrderSetItems.forEach((item: any) => {
        countProc = countProc + 1;

        if (item.gstCode.tax > 0) {
          taxapplicable = true;
          GSTTaxPer = item.gstCode.tax;
          STax = STax + 1;
        } else {
          taxapplicable = false;
          GSTTaxPer = 0;
          SNonTax = SNonTax + 1;
        }

        if (cstype > 0 && item.gstCode.codeId == cstype) {
          citem = citem + 1;
        } else {
          ncitem = ncitem + 1;
        }

        if (STax > 0 && SNonTax > 0) {
          cosflag = true;
          TaxNontaxFlag = true;
          if (item.billItem.serviceId == 83) {
            CosmeticFlag = true;
          }
        }

        if (citem > 0 && ncitem > 0) {
          cosflag = true;
          TaxNontaxFlag = true;
          if (item.billItem.serviceId == 83) {
            CosmeticFlag = true;
          }
        }

        if (SACCode == "") {
          SACCode = item.gstDetail.saccode;
        } else if (SACCode != item.gstDetail.saccode) {
          BillFlag_ForGST = true;
        }

        if (Countindx == 0 && taxapplicable) {
          flg = 1;
        } else {
          if (flg == 1 && !taxapplicable) {
            strErrormsg += item.billItem.itemName + ",";
          }
          if (flg == 0 && taxapplicable) {
            strErrormsg += item.billItem.itemName + ",";
          }
        }

        if (item.billItem.serviceId != 92) {
          if (item.gstCode.tax == 0) {
            this.dsTaxCode = item.gstDetail;
          } else if (item.gstCode.tax > 0) {
            this.dsTaxCode = item.gstDetail;
          }
        } else {
          this.dsTaxCode = item.gstDetail;
        }
        Countindx = Countindx + 1;
      });
    }
    // Countindx = 0;
    //  if (this.billingServiceRef.ConsumableItems.length > 0) {
    //   this.billingServiceRef.ConsumableItems.forEach((item: any) => {
    //     countProc= countProc+1;

    //     if(item.gstCode.tax > 0){
    //       taxapplicable= true;
    //       GSTTaxPer = item.gstCode.tax;
    //       STax= STax+1;
    //     }
    //     else{
    //       taxapplicable= false;
    //       GSTTaxPer = 0;
    //       SNonTax= SNonTax+1;
    //     }

    //     if(cstype > 0 && item.gstCode.codeId==cstype){
    //        citem = citem + 1;
    //     }
    //     else{
    //       ncitem= ncitem + 1;
    //     }

    //     if(STax > 0  && SNonTax > 0){
    //       cosflag = true;
    //       TaxNontaxFlag = true;
    //       if(item.billItem.serviceId == 83){
    //         CosmeticFlag = true;
    //       }
    //     }

    //     if(citem >0 && ncitem > 0){
    //       cosflag = true;
    //       TaxNontaxFlag = true;
    //       if(item.billItem.serviceId == 83){
    //         CosmeticFlag = true;
    //       }
    //     }

    //     if(SACCode == ""){
    //       SACCode = item.gstDetail.saccode;
    //     }
    //     else if(SACCode != item.gstDetail.saccode){
    //       BillFlag_ForGST=  true;
    //     }

    //     if(Countindx == 0 && taxapplicable){
    //       flg = 1;
    //     }
    //     else {
    //       if(flg== 1 && !taxapplicable){
    //         strErrormsg += item.billItem.itemName+",";
    //       }
    //       if(flg==0 &&taxapplicable){
    //         strErrormsg += item.billItem.itemName+",";
    //       }
    //     }

    //     if(item.billItem.serviceId != 92){
    //       if(item.gstCode.tax == 0){
    //         this.dsTaxCode = item.gstDetail;
    //       }
    //       else if(item.gstCode.tax > 0){
    //         this.dsTaxCode = item.gstDetail;
    //       }
    //     }
    //     else{
    //      this.dsTaxCode = item.gstDetail;
    //     }
    //     Countindx = Countindx + 1;
    //   });
    // }
    Countindx = 0;
    citem = 0;
    ncitem = 0;
    STax = 0;
    SNonTax = 0;
    if (TaxNontaxFlag && !CosmeticFlag) {
      const infoRef = this.messageDialogService.info(
        "Kindly Prepare Separate Bill For Taxable and Non Taxable services " +
          strErrormsg
      );
      await infoRef.afterClosed().toPromise();
      TaxNontaxFlag = false;
      CosmeticFlag = false;
      return false;
    }
    if (CosmeticFlag) {
      const infoRef = this.messageDialogService.info(
        "Kindly Prepare Separate Bill For Cosmetic services"
      );
      await infoRef.afterClosed().toPromise();
      TaxNontaxFlag = false;
      CosmeticFlag = false;
      return false;
    }
    TaxNontaxFlag = false;
    CosmeticFlag = false;
    return true;
  }

  async getServiceTypeByCode(codeId = 1356): Promise<Number> {
    let cstype = 0;
    const res = await this.http
      .get(ApiConstants.getservicestypebycodeid(codeId))
      .toPromise();

    if (res) {
      if (res.length > 0) {
        cstype = res[0].value;
      }
    }
    return cstype;
  }

  async mapFinalGSTDetails(details: any) {
    this.billingServiceRef.makeBillPayload.finalDSGSTDetails.gsT_value =
      details.totaltaX_Value;
    this.billingServiceRef.makeBillPayload.finalDSGSTDetails.gsT_percent =
      details.gst;
    this.billingServiceRef.makeBillPayload.finalDSGSTDetails.cgsT_Value =
      details.cgsT_Value;
    this.billingServiceRef.makeBillPayload.finalDSGSTDetails.cgsT_Percent =
      details.cgst;
    this.billingServiceRef.makeBillPayload.finalDSGSTDetails.sgsT_value =
      details.sgsT_Value;
    this.billingServiceRef.makeBillPayload.finalDSGSTDetails.sgsT_percent =
      details.sgst;
    this.billingServiceRef.makeBillPayload.finalDSGSTDetails.utgsT_value =
      details.utgsT_Value;
    this.billingServiceRef.makeBillPayload.finalDSGSTDetails.utgsT_percent =
      details.utgst;
    this.billingServiceRef.makeBillPayload.finalDSGSTDetails.igsT_Value =
      details.igsT_Value;
    this.billingServiceRef.makeBillPayload.finalDSGSTDetails.igsT_percent =
      details.igst;
    this.billingServiceRef.makeBillPayload.finalDSGSTDetails.cesS_value =
      details.cesS_Value;
    this.billingServiceRef.makeBillPayload.finalDSGSTDetails.cesS_percent =
      details.cess;
    this.billingServiceRef.makeBillPayload.finalDSGSTDetails.taxratE1_Value =
      details.taxratE1_Value;
    this.billingServiceRef.makeBillPayload.finalDSGSTDetails.taxratE1_Percent =
      details.taxratE1;
    this.billingServiceRef.makeBillPayload.finalDSGSTDetails.taxratE2_Value =
      details.taxratE2_Value;
    this.billingServiceRef.makeBillPayload.finalDSGSTDetails.taxratE2_Percent =
      details.taxratE2;
    this.billingServiceRef.makeBillPayload.finalDSGSTDetails.taxratE3_Value =
      details.taxratE3_Value;
    this.billingServiceRef.makeBillPayload.finalDSGSTDetails.taxratE3_Percent =
      details.taxratE3;
    this.billingServiceRef.makeBillPayload.finalDSGSTDetails.taxratE4_Value =
      details.taxratE4_Value;
    this.billingServiceRef.makeBillPayload.finalDSGSTDetails.taxratE4_Percent =
      details.taxratE4;
    this.billingServiceRef.makeBillPayload.finalDSGSTDetails.taxratE5_Value =
      details.taxratE5_Value;
    this.billingServiceRef.makeBillPayload.finalDSGSTDetails.taxratE5_Percent =
      details.taxratE5;
    this.billingServiceRef.makeBillPayload.finalDSGSTDetails.totaltaX_RATE =
      details.totaltaX_RATE;
    this.billingServiceRef.makeBillPayload.finalDSGSTDetails.totaltaX_RATE_VALUE =
      details.totaltaX_Value;
    this.billingServiceRef.makeBillPayload.finalDSGSTDetails.saccode =
      details.saccode;
    this.billingServiceRef.makeBillPayload.finalDSGSTDetails.taxgrpid =
      details.taxgrpid;
  }

  //#endregion TaxableBill

  //#region  CGHS Beneficiary
  async checkCGHSBeneficiary() {
    if (this.billingServiceRef.patientDetailsInfo) {
      let cghsBeneficiary = await this.http
        .get(
          BillingApiConstants.checkCGHSBeneficiary(
            this.billingServiceRef.activeMaxId.iacode,
            this.billingServiceRef.activeMaxId.regNumber,
            this.billingServiceRef.company,
            this.billingServiceRef.patientDetailsInfo.adhaarID || ""
          )
        )
        .toPromise();

      if (cghsBeneficiary) {
        if (
          cghsBeneficiary.cghsResult &&
          cghsBeneficiary.cghsResult.length > 0
        ) {
          if (cghsBeneficiary.cghsResult[0].result == 1) {
            const infoRef = this.messageDialogService.info(
              "Patient belongs to Panel CGHS beneficiary, but you have not selected that company, Please select appropriate reason."
            );
            await infoRef.afterClosed().toPromise();
            await this.openCGHSChangeReason();
          }
        }

        if (
          cghsBeneficiary.cghS_ECHSFlag &&
          cghsBeneficiary.cghS_ECHSFlag.length > 0
        ) {
          if (cghsBeneficiary.cghS_ECHSFlag[0].echs == 1) {
            if (
              this.billingServiceRef.patientDetailsInfo.agetype == 1 &&
              this.billingServiceRef.patientDetailsInfo.age >= 18 &&
              this.billingServiceRef.patientDetailsInfo.age <= 25
            ) {
              const infoECHSRef = this.messageDialogService.info(
                "If Patient is ECHS Dependent & age is between 18-25 Years, Please collect dependent list."
              );
              await infoECHSRef.afterClosed().toPromise();
            }
          }
        }
      }
    }
  }

  async openCGHSChangeReason() {
    const chgsChangeDialogref = this.matDialog.open(FormDialogueComponent, {
      width: "28vw",
      // height: "42vh",
      data: {
        title: "CGHS Beneficiary Change",
        form: {
          title: "",
          type: "object",
          properties: {
            reason: {
              type: "dropdown",
              title: "Reason",
              required: true,
              options: BillingStaticConstants.cghsBeneficiaryReasons,
            },
          },
        },
        layout: "single",
        buttonLabel: "Save",
      },
    });
    let res = await chgsChangeDialogref
      .afterClosed()
      .pipe(takeUntil(this._destroying$))
      .toPromise();
    if (res && res.data) {
      let reason = BillingStaticConstants.cghsBeneficiaryReasons.filter(
        (r: any) => r.value === res.data.reason
      );
      if (reason && reason.length > 0) {
        this.billingServiceRef.makeBillPayload.cghsBeneficiaryChangeReason =
          reason[0].title;
      }
      console.log(
        this.billingServiceRef.makeBillPayload.cghsBeneficiaryChangeReason
      );
    }
  }
  //#endregion

  //#region Domestic Tarrif for international patient
  async checkDoemsticTarrif() {
    if (
      this.billingServiceRef.company &&
      this.billingServiceRef.patientDetailsInfo &&
      this.billingServiceRef.patientDetailsInfo.nationality != 149
    ) {
      if (
        this.billingServiceRef.companyData &&
        this.billingServiceRef.companyData.length > 0
      ) {
        const tpacompanyExist: any = this.billingServiceRef.companyData.filter(
          (c: any) => c.id === this.billingServiceRef.company
        );
        if (tpacompanyExist && tpacompanyExist.length > 0) {
          if (tpacompanyExist[0].isTPA != 5) {
            const tarrifRef = this.messageDialogService.confirm(
              "",
              "Are you sure of domestic tariff?"
            );
            const result = await tarrifRef.afterClosed().toPromise();
            if (result && "type" in result) {
              if (result.type == "yes") {
                await this.openDomesticTarrifReasonDialog();
              } else {
              }
            }
          }
        }
      }
    }
  }

  async openDomesticTarrifReasonDialog() {
    const domesticTarrifDialogref = this.matDialog.open(FormDialogueComponent, {
      width: "28vw",
      // height: "42vh",
      data: {
        title: "Domestic Tarrif",
        form: {
          title: "",
          type: "object",
          properties: {
            reason: {
              type: "textarea",
              title: "Reason",
              required: true,
            },
          },
        },
        layout: "single",
        buttonLabel: "Save",
      },
    });
    let res = await domesticTarrifDialogref
      .afterClosed()
      .pipe(takeUntil(this._destroying$))
      .toPromise();
    if (res && res.data) {
      console.log(res.data.reason);
      this.billingServiceRef.makeBillPayload.ds_insert_bill.tab_insertbill.markupnot =
        res.data.reason;
    }
  }
  //#endregion
}
