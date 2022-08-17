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

  totalCost = 0;

  clear() {
    this.billItems = [];
    this.consultationItems = [];
    this.InvestigationItems = [];
    this.HealthCheckupItems = [];
    this.ProcedureItems = [];
    this.OrderSetItems = [];
    this.ConsumableItems = [];
  }

  calculateTotalAmount() {
    this.totalCost = 0;
    this.consultationItems.forEach((item: any) => {
      this.totalCost += item.price;
    });
    this.InvestigationItems.forEach((item: any) => {
      this.totalCost += item.price;
    });
    this.ProcedureItems.forEach((item: any) => {
      this.totalCost += item.price;
    });
    this.OrderSetItems.forEach((item: any) => {
      this.totalCost += item.price;
    });
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
    this.calculateTotalAmount();
  }
  removeFromConsultation(index: number) {
    this.consultationItems.splice(index, 0);
    this.calculateTotalAmount();
  }
  addToInvestigations(data: any) {
    this.InvestigationItems.push(data);
    this.calculateTotalAmount();
  }
  removeFromInvestigations() {}
  addToHealthCheckup(data: any) {
    this.HealthCheckupItems.push(data);
    this.calculateTotalAmount();
  }
  removeFromHealthCheckup() {}
  addToProcedure(data: any) {
    this.ProcedureItems.push(data);
    this.calculateTotalAmount();
  }
  removeFromProcedure() {}
  addToOrderSet(data: any) {
    this.OrderSetItems.push(data);
    this.calculateTotalAmount();
  }
  removeFromORderSet() {}
  addToConsumables() {}
  removeFromConsumables() {}
}
