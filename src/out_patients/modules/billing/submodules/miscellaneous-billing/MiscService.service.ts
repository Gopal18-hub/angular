import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class MiscService {
  subject = new Subject<any>();

  transactionamount: any = 0.0;
  MOP: string = "Cash";
  data: any = [];
  patientDetail: any;
  company: any;
  billDetail: any
  cashLimit: any = 0;
  miscFormData: any = [];

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
}
