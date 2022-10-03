import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class MiscService {
  subject = new Subject<any>();
  billType = 0;
  serviceItemsList = [];

  transactionamount: any = 0.0;
  clearAllItems = new Subject<boolean>();
  MOP: string = "Cash";
  data: any = [];
  patientDetail: any;
  company: any;
  billDetail: any
  cashLimit: any = 0;
  miscFormData: any = [];
  clearForm = false;
  calcItems: any = [];
  calculatedBill: any = [];
  companyList: any = [];
  setPatientDetail(dataList: any) {
    this.patientDetail = dataList;
  }

  getFormLsit() {
    return this.patientDetail;
  }
  setCompany(data: any) {
    this.company = data;
  }
  getCompany() {
    //this.billtoCompany(this.company);
    return this.company;
  }
  getPriority(serviceName: string): number {
    let type = "consultation";
    return serviceName.toLocaleLowerCase().includes(type) ? 57 : 1;
  }
  setBillDetail(data: any) {
    this.billDetail = data;
  }
  getBillData() {
    return this.billDetail;
  }
  setCashLimit(data: any) {
    this.cashLimit = data;
  }
  getCashLimit() {
    return this.cashLimit
  }
  setMiscBillFormData(data: any) {
    this.miscFormData = data;
  }
  getMiscBillFormData() {

    return this.miscFormData;
  }
  setBillType(data: any) {
    this.billType = data
  }
  getBillType() {
    return this.billType
  }
  setServiceItemsList(data: any) {
    this.serviceItemsList = data;
  }
  getServiceItemsList() {
    return this.serviceItemsList
  }

  setCalculateBillItems(data: any) {
    this.calcItems = data;
  }
  getCalculateBillItems() {
    return this.calcItems;
  }
  calculateBill() {
    console.log(this.calcItems, "inserve")
    this.calcItems = this.getCalculateBillItems();

    if (this.calcItems.depositInput) {
      if ((this.calcItems.depositInput >= this.calcItems.totalAmount) || ((this.calcItems.depositInput) > this.calcItems.totalDeposit)) {
        this.calculatedBill.depositInput = this.calcItems.totalAmount;
        // this.calculatedBill.amntPaidBythePatient = 0.00;

      }
      else if (this.calcItems.depositInput < this.calcItems.totalAmount) {
        //this.calculatedBill.amntPaidBythePatient = this.calcItems.totalAmount - this.calcItems.depositInput;
        this.calculatedBill.depositInput = this.calcItems.depositInput;

      }
    }
    if (!this.calcItems.depositInput) {
      this.calcItems.depositInput = 0;
    }
    if (!this.calcItems.totalDeposit) {
      this.calcItems.totalDeposit = 0
    }
    if (!this.calcItems.totalDiscount) {
      this.calcItems.totalDiscount = 0
    }
    if (!this.calcItems.totalGst) {
      this.calcItems.totalGst = 0
    }
    if (!this.calcItems.totalGst) {
      this.calcItems.totalGst = 0
    }
    if (!this.calcItems.companyId) {
      this.calcItems.companyId = 0
    }
    if (!this.calcItems.corporateId) {
      this.calcItems.corporateId = 0
    }
    if (!this.calcItems.depositSelectedrows || this.calcItems.depositSelectedrows.length === 0) {
      this.calcItems.depositSelectedrows = []
    }
    this.calculatedBill.totalBillAmount = this.calcItems.totalAmount - this.calcItems.depositInput - this.calcItems.totalDiscount;
    this.calculatedBill.amntPaidBythePatient = this.calculatedBill.totalBillAmount + this.calcItems.totalGst;
    this.calculatedBill.txtgsttaxamt = (this.calculatedBill.totalBillAmount * this.calculatedBill.totalGst) / 100;

    if (this.calcItems.totalAmount - this.calcItems.depositInput === 0) {
      this.calculatedBill.totalBillAmount = 0;
      this.calculatedBill.amntPaidBythePatient = 0;
    }
    this.calculatedBill.selectedDepositRows = this.calcItems.depositSelectedrows;
    this.calculatedBill.companyId = this.calcItems.companyId;
    this.calculatedBill.corporateId = this.calcItems.corporateId;
    return this.calculatedBill;
  }

  clearMiscBlling() {
    this.clearAllItems.next(true);
  }

}
