import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { DatePipe } from "@angular/common";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { IomCompanyBillingComponent } from "../billing/prompts/iom-company-billing/iom-company-billing.component";
import { HttpService } from "@shared/services/http.service";
import { CookieService } from "@shared/services/cookie.service";
import { BillingApiConstants } from "../billing/BillingApiConstant";
import { ApiConstants } from "@core/constants/ApiConstants";
import { PaymentMethods } from "@core/constants/PaymentMethods";
import { ReasonForDueBillComponent } from "../billing/prompts/reason-for-due-bill/reason-for-due-bill.component";
import { MessageDialogService } from "@shared/ui/message-dialog/message-dialog.service";
import { BillingStaticConstants } from "../billing/BillingStaticConstant";

@Injectable({
  providedIn: "root",
})
export class MiscService {
  subject = new Subject<any>();
  billType = 0;
  serviceItemsList = [];
  selectedCompanyVal = 0;
  makeBillLoad = false;
  billNoGenerated = new Subject<boolean>();

  makeBillPayload: any = JSON.parse(
    JSON.stringify(BillingStaticConstants.makeBillPayload)
  );

  transactionamount: any = 0.0;
  clearAllItems = new Subject<boolean>();
  MOP: string = "Cash";
  data: any = [];
  patientDetail: any = [];
  company: any;
  billDetail: any;
  cashLimit: any = 0;
  miscFormData: any = [];
  clearForm = false;
  calcItems: any = [];
  calculatedBill: any = [];
  companyList: any = [];
  cacheServitem: any = [];
  cacheCreditTabdata: any = [];
  cacheBillTabdata: any = [];
  misccompanyChangeEvent = new Subject<any>();
  misccorporateChangeEvent = new Subject<any>();
  miscdepositdetailsEvent = new Subject<any>();
  miscdepositDetailsData: any = [];
  disablecorporatedropdown: boolean = false;
  creditLimit: number = 0;
  copay: number = 0;

  companyData: any = [];
  corporateData: any = [];
  selectedcompanydetails: any = [];
  selectedcorporatedetails: any = [];
  iomMessage: string = "";
  referralDoctor: any;
  interactionDetails: any = [];

  constructor(
    private http: HttpService,
    public matDialog: MatDialog,
    private datepipe: DatePipe,
    public cookie: CookieService,
    private messageDialogService: MessageDialogService
  ) {}

  setPatientDetail(dataList: any) {
    this.patientDetail = dataList;
  }

  getFormLsit() {
    return this.patientDetail;
  }

  getPriority(serviceName: string): number {
    let type = "consultation";
    return serviceName.toLocaleLowerCase().includes(type) ? 57 : 1;
  }

  setBillType(data: any) {
    this.billType = data;
  }
  getBillType() {
    return this.billType;
  }
  setCalculateBillItems(data: any) {
    this.calcItems = data;
    // this.companyChangeMiscEvent.next(this.calcItems);
  }
  getCalculateBillItems() {
    return this.calcItems;
  }
  calculateBill() {
    this.calcItems = this.getCalculateBillItems();

    if (this.calcItems.depositInput) {
      // if (
      //   this.calcItems.depositInput >= this.calcItems.totalAmount ||
      //   this.calcItems.depositInput > this.calcItems.totalDeposit
      // ) {
      //   this.calculatedBill.depositInput = this.calcItems.totalDeposit;
      //   // this.calculatedBill.amntPaidBythePatient = 0.00;
      // } else if (this.calcItems.depositInput < this.calcItems.totalAmount) {
      //   //this.calculatedBill.amntPaidBythePatient = this.calcItems.totalAmount - this.calcItems.depositInput;
      //   this.calculatedBill.depositInput = this.calcItems.depositInput;
      // }

      if (
        this.calcItems.depositInput > this.calcItems.totalAmount &&
        this.calcItems.totalDeposit >= this.calcItems.totalAmount
      ) {
        this.calculatedBill.depositInput = this.calcItems.totalAmount;
      } else if (
        this.calcItems.depositInput > this.calcItems.totalDeposit &&
        this.calcItems.totalDeposit > this.calcItems.totalAmount
      ) {
        this.calculatedBill.depositInput = this.calcItems.totalAmount;
      } else if (
        this.calcItems.depositInput > this.calcItems.totalAmount &&
        this.calcItems.totalDeposit < this.calcItems.totalAmount
      ) {
        this.calculatedBill.depositInput = this.calcItems.totalDeposit;
      } else if (
        this.calcItems.totalDeposit < this.calcItems.totalAmount &&
        this.calcItems.depositInput > this.calcItems.totalDeposit
      ) {
        this.calculatedBill.depositInput = this.calcItems.totalDeposit;
      } else {
        this.calculatedBill.depositInput = this.calcItems.depositInput;
      }
    } else {
      this.calculatedBill.depositInput = 0;
    }

    if (this.cacheBillTabdata.cacheDiscount >= 0) {
      this.calculatedBill.totalDiscount = this.cacheBillTabdata.cacheDiscount;
    }
    if (this.cacheBillTabdata.cacheDepositInput >= 0) {
      this.calculatedBill.depositInput = this.calculatedBill.depositInput;
    }

    if (!this.calcItems.totalDeposit) {
      this.calcItems.totalDeposit = 0;
    }
    if (!this.calcItems.totalGst) {
      this.calcItems.totalGst = 0;
    }
    if (!this.calcItems.totalGst) {
      this.calcItems.totalGst = 0;
    }
    if (!this.calcItems.companyId) {
      this.calcItems.companyId = 0;
    }
    if (!this.calcItems.corporateId) {
      this.calcItems.corporateId = 0;
    }
    if (
      !this.calcItems.depositSelectedrows ||
      this.calcItems.depositSelectedrows.length === 0
    ) {
      this.calcItems.depositSelectedrows = [];
    }
    this.calculatedBill.totalBillAmount =
      this.calcItems.totalAmount -
      (this.calculatedBill.depositInput || 0) -
      (this.calculatedBill.totalDiscount || 0);
    this.calculatedBill.amntPaidBythePatient =
      this.calculatedBill.totalBillAmount + this.calcItems.totalGst;
    this.calculatedBill.txtgsttaxamt =
      (this.calculatedBill.totalBillAmount * this.calculatedBill.totalGst) /
      100;

    if (this.calcItems.totalAmount - this.calcItems.depositInput === 0) {
      this.calculatedBill.totalBillAmount = 0;
      this.calculatedBill.amntPaidBythePatient = 0;
    }
    this.calculatedBill.selectedDepositRows =
      this.calcItems.depositSelectedrows;
    this.calculatedBill.companyId = this.calcItems.companyId;
    this.calculatedBill.corporateId = this.calcItems.corporateId;
    return this.calculatedBill;
  }
  cacheService(data: any) {
    this.cacheServitem = data;
  }
  clearMiscBlling() {
    this.clearAllItems.next(true);
    this.billNoGenerated.next(false);
    this.companyData = [];
    this.corporateData = [];
    this.selectedcompanydetails = [];
    this.selectedcorporatedetails = [];
    this.serviceItemsList = [];
    this.referralDoctor = null;
    this.cacheServitem = [];
    this.creditLimit = 0;
    this.calcItems = [];
    this.calculatedBill = [];
    this.companyList = [];
    this.cacheServitem = [];
    this.cacheCreditTabdata = [];
    this.cacheBillTabdata = [];
  }
  cacheCreditTab(data: any) {
    this.cacheCreditTabdata = data;
  }
  cacheBillTab(data: any) {
    this.cacheBillTabdata = data;
  }
  setCreditLimit(data: any) {
    this.creditLimit = data;
  }
  setCoPay(data: any) {
    this.copay = data;
  }

  setCompnay(
    companyid: number,
    res: any,
    formGroup: any,
    from: string = "header"
  ) {
    if (res === "" || res == null) {
      this.misccompanyChangeEvent.next({ company: null, from });
      this.selectedcorporatedetails = [];
      this.selectedcompanydetails = [];
      this.iomMessage = "";
    } else if (res.title) {
      let iscompanyprocess = true;
      //fix for Staff company validation
      if (res.company.isStaffcompany && from != "companyexists") {
        if (this.patientDetail.companyid > 0) {
          if (res.value != this.patientDetail.companyid) {
            iscompanyprocess = false;
            this.resetCompany(res, formGroup, from);
          }
        } else {
          iscompanyprocess = false;
          this.resetCompany(res, formGroup, from);
        }
      }
      if (iscompanyprocess) {
        this.selectedcompanydetails = res;
        this.selectedcorporatedetails = [];
        this.misccompanyChangeEvent.next({ company: res, from });
        this.calcItems.companyId = res.value;
        this.iomMessage =
          "IOM Validity till : " +
          (("iomValidity" in res.company && res.company.iomValidity != "") ||
          res.company.iomValidity != undefined
            ? this.datepipe.transform(res.company.iomValidity, "dd-MMM-yyyy")
            : "");
        if (res.company.isTPA == 1) {
          const iomcompanycorporate = this.matDialog.open(
            IomCompanyBillingComponent,
            {
              width: "25%",
              height: "28%",
            }
          );

          iomcompanycorporate.afterClosed().subscribe((result) => {
            if (result.data == "corporate") {
              this.cacheCreditTabdata.isCorporateChannel = 1;
              this.cacheCreditTab(this.cacheCreditTabdata);
              formGroup.controls["corporate"].enable();
              formGroup.controls["corporate"].setValue(null);
              this.misccorporateChangeEvent.next({ corporate: null, from });
              this.disablecorporatedropdown = true;
            } else {
              this.cacheCreditTabdata.isCorporateChannel = 0;
              this.cacheCreditTab(this.cacheCreditTabdata);
              formGroup.controls["corporate"].setValue(null);
              formGroup.controls["corporate"].disable();
              this.misccorporateChangeEvent.next({
                corporate: null,
                from: "disable",
              });
            }
          });
        } else {
          this.misccorporateChangeEvent.next({
            corporate: null,
            from: "disable",
          });
          // if(from == "credit"){
          formGroup.controls["corporate"].setValue(null);
          formGroup.controls["corporate"].disable();
          // }
          // else{
          //   this.corporateChangeEvent.next({ corporate: 0, from });
          // }
        }
      }
    }
  }
  //fix for Staff company validation
  async resetCompany(res: any, formGroup: any, from: string = "header") {
    const ERNanavatiMiscCompany = await this.messageDialogService.info(
      "Selected Patient is not entitled for " +
        res.title +
        " company.Please Contact HR Dept."
    );
    ERNanavatiMiscCompany.afterClosed().toPromise();
    formGroup.controls["company"].setValue(null);
  }
  setCorporate(
    corporateid: number,
    res: any,
    formGroup: any,
    from: string = "header"
  ) {
    if (res === "" || res == null) {
      this.misccorporateChangeEvent.next({ corporate: null, from });
      this.selectedcorporatedetails = [];
    } else {
      this.selectedcorporatedetails = res;
      this.misccorporateChangeEvent.next({ corporate: res, from });
      this.calcItems.corporateId = res.value;
    }
  }

  setCompanyData(data: any) {
    this.companyData = data;
    this.misccompanyChangeEvent.next({ company: null, from: "header" });
  }

  setCorporateData(data: any) {
    this.corporateData = data;
  }

  setReferralDoctor(doctor: any) {
    this.referralDoctor = doctor;
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

  // depositDetails(iacode: string, regNumber: number) {
  //   this.http
  //     .get(
  //       ApiConstants.getDipositedAmountByMaxID(
  //         iacode,
  //         regNumber,
  //         Number(this.cookie.get("HSPLocationId"))
  //       )
  //     )
  //     .subscribe((resultData: any) => {
  //       this.miscdepositDetailsData = resultData;
  //       this.miscdepositdetailsEvent.next({ deposit: resultData });
  //     });
  // }

  async makeBill(paymentmethod: any = {}) {
    if ("tabs" in paymentmethod) {
      this.calculatedBill.toBePaid = this.calculatedBill.amntPaidBythePatient;
      this.calculatedBill.collectedAmount = paymentmethod.tabPrices.reduce(
        (partialSum: number, a: number) => partialSum + a,
        0
      );

      paymentmethod.tabs.forEach((payment: any) => {
        if (paymentmethod.paymentForm[payment.key].value.price > 0) {
          this.makeBillPayload.ds_paymode.tab_paymentList.push({
            slNo: this.makeBillPayload.ds_paymode.tab_paymentList.length + 1,
            modeOfPayment:
              paymentmethod.paymentForm[payment.key].value.modeOfPayment,
            amount: parseFloat(
              paymentmethod.paymentForm[payment.key].value.price
            ),
            flag: 1,
          });
          if ("payloadKey" in payment.method) {
            this.makeBillPayload.ds_paymode[payment.method.payloadKey] = [
              PaymentMethods[
                payment.method.payloadKey as keyof typeof PaymentMethods
              ](paymentmethod.paymentForm[payment.key].value),
            ];
          }
        }
        console.log(this.makeBillPayload.ds_paymode, "check");
      });

      // if (this.calculatedBill.toBePaid > this.calculatedBill.collectedAmount) {
      //   const lessAmountWarningDialog = this.messageDialogService.confirm(
      //     "",
      //     "Do You Want To Save Less Amount ?"
      //   );
      //   const lessAmountWarningResult = await lessAmountWarningDialog
      //     .afterClosed()
      //     .toPromise();
      //   if (lessAmountWarningResult) {
      //     if (lessAmountWarningResult.type == "yes") {
      //       const reasonInfoDialog = this.matDialog.open(
      //         ReasonForDueBillComponent,
      //         {
      //           width: "40vw",
      //           height: "50vh",
      //         }
      //       );
      //       const reasonInfoResult = await reasonInfoDialog
      //         .afterClosed()
      //         .toPromise();
      //       if (reasonInfoResult) {
      //         this.calculatedBill.balance =
      //           this.calculatedBill.toBePaid -
      //           this.calculatedBill.collectedAmount;
      //       }
      //     } else {
      //       return;
      //     }
      //   } else {
      //     return;
      //   }
      // } else {
      //   return;
      // }
      this.makeBillLoad = true;
    }
    return this.calculatedBill;
  }
}
