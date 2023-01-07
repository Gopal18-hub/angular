import { Injectable } from "@angular/core";
import { HttpService } from "@shared/services/http.service";
import { CookieService } from "@shared/services/cookie.service";
import { BillingService } from "./billing.service";
import { BillingApiConstants } from "./BillingApiConstant";
import { MessageDialogService } from "@shared/ui/message-dialog/message-dialog.service";
import { Subject, takeUntil } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CouponDiscountService {
  private readonly _destroying$ = new Subject<void>();
  constructor(
    private http: HttpService,
    private cookie: CookieService,
    private billing: BillingService,
    private messageDialogService: MessageDialogService
  ) {}

  async getServicesForCoupon(CouponNo: any, locationId: any) {
    const res = await this.http
      .get(BillingApiConstants.getServicesForCoupon(CouponNo, locationId))
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
                this.processDiscount(res);
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
      return;
    }
  }

  processDiscount(couponServices: any) {
    let discountper = 0;
    //array to populate all couponServices in discount popup
    let discountreasonCoupon = [];
    let Sno = 0;

    if (this.billing.billItems) {
      if (this.billing.billItems.length > 0) {
        //for each bill item
        for (var item of this.billing.billItems) {
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
            discountreasonCoupon.push(couponItem);
          }
        }
        console.log(discountreasonCoupon);
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
    let mainhead = {
      title: couponService[0].discountHead,
      value: couponService[0].mainhead,
    };
    let disReason = {
      title: couponService[0].name,
      value: couponService[0].id,
    };
    let disType = "On-Item";
    let valuebased = 0;

    let couponItem = {
      Sno,
      disType,
      serviceName,
      itemName,
      price,
      discountper,
      discAmt,
      totalAmt,
      mainhead,
      disReason,
      valuebased,
    };
    return couponItem;
  }
}
