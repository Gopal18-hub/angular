import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class BillingService {
  activeMaxId: any;
  billItems: any = [];
  consultationItems: any = [];
  InvestigationItems: any = [];
  HealthCheckupItems: any = [];
  ProcedureItems: any = [];
  OrderSetItems: any = [];
  ConsumableItems: any = [];
  billItemsTrigger = new Subject<any>();

  clear() {
    this.billItems = [];
    this.consultationItems = [];
    this.InvestigationItems = [];
    this.HealthCheckupItems = [];
    this.ProcedureItems = [];
    this.OrderSetItems = [];
    this.ConsumableItems = [];
  }

  setActiveMaxId(maxId: string, iacode: string, regNumber: string) {
    this.activeMaxId = {
      maxId: maxId,
      iacode: iacode,
      regNumber: regNumber,
    };
  }

  addToBill(data: any) {
    this.billItems.push(data);
    this.billItemsTrigger.next({ data: this.billItems });
  }

  removeFromBill(data: any) {}

  addToConsultation(data: any) {
    this.consultationItems.push(data);
  }
  removeFromConsultation(index: number) {
    this.consultationItems.splice(index, 0);
  }
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
