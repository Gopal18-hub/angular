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

  checkOtherServicesForHealthCheckups() {
    if (
      this.consultationItems.length > 0 ||
      this.InvestigationItems.length > 0 ||
      this.ProcedureItems.length > 0 ||
      this.OrderSetItems.length > 0 ||
      this.ConsumableItems.length > 0
    ) {
      return true;
    }
    return false;
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
  addToInvestigations(data: any) {
    this.InvestigationItems.push(data);
  }
  removeFromInvestigations() {}
  addToHealthCheckup(data: any) {
    this.HealthCheckupItems.push(data);
  }
  removeFromHealthCheckup() {}
  addToProcedure() {}
  removeFromProcedure() {}
  addToOrderSet() {}
  removeFromORderSet() {}
  addToConsumables() {}
  removeFromConsumables() {}
}
