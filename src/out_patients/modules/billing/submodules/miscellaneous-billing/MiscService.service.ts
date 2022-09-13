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
    return this.company;;
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
}
