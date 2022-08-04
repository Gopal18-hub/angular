import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class BillingService {
  billItems: any = [];
  consultationItems: any = [];
  InvestigationItems: any = [];
  HealthCheckupItems: any = [];
  ProcedureItems: any = [];
  OrderSetItems: any = [];
  ConsumableItems: any = [];
  billItemsTrigger = new Subject<any>();

  addToBill(data: any) {
    this.billItems.push(data);
    this.billItemsTrigger.next({ data: this.billItems });
  }

  removeFromBill(data: any) {}

  addToConsultation() {}
  removeFromConsultation() {}
  addToInvestigations() {}
  removeFromInvestigations() {}
  addToHealthCheckup() {}
  removeFromHealthCheckup() {}
  addToProcedure() {}
  removeFromProcedure() {}
  addToOrderSet() {}
  removeFromORderSet() {}
  addToConsumables() {}
  removeFromConsumables() {}
}
