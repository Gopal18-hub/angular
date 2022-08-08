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
}
