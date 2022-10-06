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
import { Subject } from "rxjs";
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

  applyDiscount() {
    if (
      this.discountSelectedItems.length == 1 &&
      this.discountSelectedItems[0].discTypeId == 1
    ) {
      const discItem = this.discountSelectedItems[0];
      this.billingServiceRef.billItems.forEach((item: any) => {
        item.disc = discItem.disc;
        item.discAmount = (item.price * item.qty * discItem.disc) / 100;
        item.totalAmount = item.price * item.qty - item.discAmount;
        item.discountType = 1;
        item.discountReason = discItem.reason
      });
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
            item.discountType = 2;
            item.discountReason = ditem.reason
          }
        } else if (ditem.discTypeId == 2) {
          const items = this.billingServiceRef.billItems.find(
            (it: any) => it.serviceName == ditem.service
          );
          if (items) {
          items.forEach((item:any)=>{
              item.disc = ditem.disc;
              item.discAmount = (item.price * item.qty * ditem.disc) / 100;
              item.totalAmount = item.price * item.qty - item.discAmount;
              item.discountType = 2;
              item.discountReason = ditem.reason
            })
          }
        }
      });
    }
  }

  discountreason(formGroup: any, componentRef: any) {
    const discountReasonPopup = this.matDialog.open(DisountReasonComponent, {
      width: "80vw",
      minWidth: "90vw",
    });
    discountReasonPopup.afterClosed().subscribe((res) => {
      if (res && "applyDiscount" in res && res.applyDiscount) {
        this.billingServiceRef.makeBillPayload.tab_o_opDiscount = [];

        this.applyDiscount();
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
        formGroup.controls["amtPayByPatient"].setValue(
          componentRef.getAmountPayByPatient()
        );
        if (this.totalDiscountAmt > 0) {
          formGroup.controls["discAmtCheck"].setValue(true, {
            emitEvent: false,
          });
          componentRef.refreshTable();
        }
      }
    });
  }

  async billTabActiveLogics(formGroup: any, componentRef: any) {
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
}
