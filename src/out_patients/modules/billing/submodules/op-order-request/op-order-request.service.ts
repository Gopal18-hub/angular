import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
@Injectable({
  providedIn: "root",
})
export class OpOrderRequestService {
  investigationItems: any = [];
  procedureItems: any = [];
  activeMaxId: any;
  patientDemographicdata: any = {};
  activeLink = new Subject<any>();
  clearAllItems = new Subject<boolean>();
  addToInvestigations(data: any) {
    this.investigationItems.push(data);
  }
  setActiveLink(value: boolean) {
    this.activeLink.next(value);
  }
  setActiveMaxId(
    maxId: string,
    iacode: string,
    regNumber: string,
    genderName: string = ""
  ) {
    this.activeMaxId = {
      maxId: maxId,
      iacode: iacode,
      regNumber: regNumber,
      gender: genderName,
    };
  }

  addToProcedure(data: any) {
    this.procedureItems.push(data);
  }
  clear() {
    this.clearAllItems.next(true);
    this.investigationItems = [];
    this.procedureItems = [];
    this.activeMaxId = null;
  }
}
