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

  serviceBasedListItems: any = [];

  blockActions = new Subject<boolean>();

  otherPlanSelectedItems: any = [];

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
    const checkResult = await this.http
      .post(
        BillingApiConstants.checkoutsourcetest(this.billingServiceRef.company),
        [{ id: item.itemId }]
      )
      .toPromise();
    console.log(checkResult);
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

  refreshDiscount() {
    this.discountSelectedItems.forEach((disIt: any) => {
      if ([1, 4, 5, 6].includes(disIt.discTypeId)) {
        disIt.price = this.billingServiceRef.totalCost;
        disIt.discAmt = (disIt.price * disIt.disc) / 100;
        disIt.totalAmt = disIt.price - disIt.discAmt;
      } else if (disIt.discTypeId == 2) {
        const serviceItem = this.serviceBasedListItems.find(
          (sbli: any) => sbli.name == disIt.service
        );
        let price = 0;
        serviceItem.items.forEach((item: any) => {
          price += item.price * item.qty;
        });
        const discAmt = (price * disIt.disc) / 100;
        disIt.price = price;
        disIt.discAmt = discAmt;
        disIt.totalAmt = price - discAmt;
      } else if (disIt.discTypeId == 3) {
        const billItem = this.billingServiceRef.billItems.find(
          (it: any) => it.itemId == disIt.itemId
        );
        disIt.price = billItem.price * billItem.qty;
        disIt.discAmt = (disIt.price * disIt.disc) / 100;
        disIt.totalAmt = disIt.price - disIt.discAmt;
      }
    });
  }

  applyDiscount(from: string, formGroup: any) {
    if (
      this.discountSelectedItems.length == 1 &&
      [1, 4, 5, 6].includes(this.discountSelectedItems[0].discTypeId)
    ) {
      const discItem = this.discountSelectedItems[0];
      this.billingServiceRef.billItems.forEach((item: any) => {
        item.disc = discItem.disc;
        item.discAmount = (item.price * item.qty * discItem.disc) / 100;
        item.totalAmount = item.price * item.qty - item.discAmount;
        item.discountType = this.discountSelectedItems[0].discTypeId;
        item.discountReason = discItem.reason;
      });
      if (this.discountSelectedItems[0].discTypeId == 5) {
        formGroup.controls["compDisc"].setValue(discItem.discAmt);
      } else if (this.discountSelectedItems[0].discTypeId == 4) {
        formGroup.controls["patientDisc"].setValue(discItem.discAmt);
      }
    } else {
      this.discountSelectedItems.forEach((ditem: any) => {
        if (ditem.discTypeId == 3) {
          const item = this.billingServiceRef.billItems.find(
            (it: any) => it.itemId == ditem.itemId
          );
          if (item) {
            item.disc = ditem.disc;
            item.discAmount = (item.price * item.qty * ditem.disc) / 100;
            item.totalAmount = item.price * item.qty - item.discAmount;
            item.discountType = 3;
            item.discountReason = ditem.reason;
          }
        } else if (ditem.discTypeId == 2) {
          const items = this.billingServiceRef.billItems.filter(
            (it: any) => it.serviceName == ditem.service
          );
          if (items) {
            items.forEach((item: any) => {
              item.disc = ditem.disc;
              item.discAmount = (item.price * item.qty * ditem.disc) / 100;
              item.totalAmount = item.price * item.qty - item.discAmount;
              item.discountType = 2;
              item.discountReason = ditem.reason;
            });
          }
        }
      });
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
        discounttypes: [
          { title: "On Bill", value: "On-Bill" },
          { title: "On Service", value: "On-Service" },
          { title: "On Item", value: "On-Item" },
          { title: "On Patient", value: "On-Patient" },
          { title: "On Company", value: "On-Company" },
          { title: "On Campaign", value: "On-Campaign" },
        ],
      };
    }
    const discountReasonPopup = this.matDialog.open(DisountReasonComponent, {
      width: "80vw",
      minWidth: "90vw",
      height: "68vh",
      data: data,
    });
    discountReasonPopup.afterClosed().subscribe((res) => {
      if (res && "applyDiscount" in res && res.applyDiscount) {
        this.processDiscountLogics(formGroup, componentRef, from);
      }
    });
  }

  processDiscountLogics(formGroup: any, componentRef: any, from: string) {
    this.billingServiceRef.makeBillPayload.tab_o_opDiscount = [];
    this.applyDiscount(from, formGroup);
    componentRef.billTypeChange(formGroup.value.paymentMode);
    this.discountSelectedItems.forEach((discItem: any) => {
      this.billingServiceRef.makeBillPayload.tab_o_opDiscount.push({
        discOn: discItem.discType,
        disType: discItem.discTypeId.toString(),
        disPer: discItem.disc,
        disReason: discItem.reasonTitle,
        disAmt: discItem.discAmt,
      });
    });
    formGroup.controls["discAmt"].setValue(this.totalDiscountAmt);
    componentRef.applyCreditLimit();
    if (this.totalDiscountAmt > 0) {
      formGroup.controls["discAmtCheck"].setValue(true, {
        emitEvent: false,
      });
      componentRef.refreshTable();
    }
    formGroup.controls["amtPayByPatient"].setValue(
      componentRef.getAmountPayByPatient()
    );
  }

  async billTabActiveLogics(formGroup: any, componentRef: any) {
    if (!this.billingServiceRef.company) {
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
      if ((res[0].id = 0)) {
        //coupon already used message
        const CouponErrorRef = this.messageDialogService.error(
          "Coupon already used"
        );
        await CouponErrorRef.afterClosed().toPromise();
        formGroup.controls["coupon"].setValue("", {
          emitEvent: false,
        });
        return;
      } else {
        const CouponConfirmationRef = this.messageDialogService.confirm(
          "",
          "Coupon Accepted, Do you want to proceed with MECP discount ?"
        );

        CouponConfirmationRef.afterClosed()
          .pipe(takeUntil(this._destroying$))
          .subscribe(async (result) => {
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

  async checkTaxableBill() {
    let cstype = await this.getServiceTypeByCode(1356);
    let countProc = 0;
    if (this.billingServiceRef.ProcedureItems.length > 0) {
      this.billingServiceRef.ProcedureItems.forEach((item: any) => {});
    }
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

  //#endregion TaxableBill

  //GAV-530 Paid Online appointment
  async checkForOnlineBIllPaymentSTatus(): Promise<string>{
     let res="";
    if(this.billingServiceRef.billingFormGroup.form.value.bookingId){
      res = await this.http
      .get(ApiConstants.checkonlinepaymentstaus(
        this.billingServiceRef.billingFormGroup.form.value.bookingId
        ))
      .toPromise();
    }  
    return res;
  }
}
