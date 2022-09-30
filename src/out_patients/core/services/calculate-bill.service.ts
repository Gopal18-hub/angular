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

@Injectable({
  providedIn: "root",
})
export class CalculateBillService {
  billingServiceRef: any;

  discountSelectedItems: any = [];

  totalDiscountAmt: number = 0;

  interactionDetails: any = [];

  constructor(
    public matDialog: MatDialog,
    private http: HttpService,
    public cookie: CookieService,
    public messageDialogService: MessageDialogService
  ) {}

  initProcess(billItems: any, billingServiceRef: any) {
    this.billingServiceRef = billingServiceRef;
    billItems.forEach(async (item: any) => {
      await this.serviceBasedCheck(item);
    });
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
}
