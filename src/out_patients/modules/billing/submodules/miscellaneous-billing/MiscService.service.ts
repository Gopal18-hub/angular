import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { DatePipe } from "@angular/common";import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { IomCompanyBillingComponent } from "../billing/prompts/iom-company-billing/iom-company-billing.component";
import { HttpService } from "@shared/services/http.service";
import { CookieService } from "@shared/services/cookie.service";
import { BillingApiConstants } from "../billing/BillingApiConstant";
import { ApiConstants } from "@core/constants/ApiConstants";

@Injectable({
  providedIn: "root",
})
export class MiscService {
  subject = new Subject<any>();
  billType = 0;
  serviceItemsList = [];
  selectedCompanyVal = 0;

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
        this.calculatedBill.depositInput =  this.calcItems.totalAmount;
      } else if (
        this.calcItems.depositInput > this.calcItems.totalDeposit &&
        this.calcItems.totalDeposit > this.calcItems.totalAmount
      ) {
        this.calculatedBill.depositInput = this.calcItems.totalAmount
      } else if (
        this.calcItems.depositInput > this.calcItems.totalAmount &&
        this.calcItems.totalDeposit < this.calcItems.totalAmount
      ) {
        this.calculatedBill.depositInput =   this.calcItems.totalDeposit;
      } else if (
        this.calcItems.totalDeposit < this.calcItems.totalAmount &&
        this.calcItems.depositInput > this.calcItems.totalDeposit
      ) {
        this.calculatedBill.depositInput =   this.calcItems.totalDeposit;
      }else{
        this.calculatedBill.depositInput =   this.calcItems.depositInput;
      }


    }
    if (!this.calcItems.depositInput) {
      this.calcItems.depositInput = 0;
    }
    if (!this.calcItems.totalDeposit) {
      this.calcItems.totalDeposit = 0;
    }
    if (!this.calcItems.totalDiscount) {
      this.calcItems.totalDiscount = 0;
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
    this.calculatedBill.totalBillAmount =  this.calcItems.totalAmount -  this.calcItems.depositInput -  this.calcItems.totalDiscount;
    this.calculatedBill.amntPaidBythePatient = this.calculatedBill.totalBillAmount + this.calcItems.totalGst;
    this.calculatedBill.txtgsttaxamt =  (this.calculatedBill.totalBillAmount * this.calculatedBill.totalGst) /
      100;

    if (this.calcItems.totalAmount - this.calcItems.depositInput === 0) {
      this.calculatedBill.totalBillAmount = 0;
      this.calculatedBill.amntPaidBythePatient = 0;
    }
    this.calculatedBill.selectedDepositRows =  this.calcItems.depositSelectedrows;
    this.calculatedBill.companyId = this.calcItems.companyId;
    this.calculatedBill.corporateId = this.calcItems.corporateId;
    return this.calculatedBill;
  }
  cacheService(data: any) {
    this.cacheServitem = data;
  }
  clearMiscBlling() {
    this.clearAllItems.next(true);
    this.companyData = [];
    this.corporateData = [];
    this.selectedcompanydetails = [];
    this.selectedcorporatedetails = [];
    this.referralDoctor = null;
  }
  cacheCreditTab(data: any) {
    this.cacheCreditTabdata = data;
  }
  cacheBillTab(data: any) {
    this.cacheBillTabdata = data;
  }

  setCompnay(
    companyid: number,
    res: any,
    formGroup: any,
    from: string = "header"
  ) {
    if(res === "" || res == null){
      this.misccompanyChangeEvent.next({ company: null, from });
      this.selectedcorporatedetails = [];
    }else{   
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
        } else {
          this.cacheCreditTabdata.isCorporateChannel = 0;
          this.cacheCreditTab(this.cacheCreditTabdata);  
          formGroup.controls["corporate"].setValue(0);
          formGroup.controls["corporate"].disable();
          this.misccorporateChangeEvent.next({ corporate: 0, from });
        }
      });
    } else {
      this.misccorporateChangeEvent.next({ corporate: 0, from });
      // if(from == "credit"){
        formGroup.controls["corporate"].setValue(0);
        formGroup.controls["corporate"].disable();
      // }
      // else{
      //   this.corporateChangeEvent.next({ corporate: 0, from });
      // }
    }       
   }
  }

  setCorporate(
    corporateid: number,
    res: any,
    formGroup: any,
    from: string = "header"
  ) {
    if(res === ""){
      this.misccorporateChangeEvent.next({ corporate: null, from });
      this.selectedcorporatedetails = [];
    }else{ 
    this.selectedcorporatedetails = res;
    this.misccorporateChangeEvent.next({ corporate: res, from });
    this.calcItems.corporateId = res.value
    }
  }

  setCompanyData(data: any) {
    this.companyData = data;
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
        this.miscdepositDetailsData = resultData;
        this.miscdepositdetailsEvent.next({ deposit: resultData});
      });
  }
}
