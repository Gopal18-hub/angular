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
  investigationFormGroup: any = { form: "", questions: [] };
  procedureFormGroup: any = { form: "", questions: [] };
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
  setInvestigationFormGroup(formgroup: any, questions: any) {
    this.investigationFormGroup.form = formgroup;
    this.investigationFormGroup.questions = questions;
  }
  setProcedureFormGroup(formgroup: any, questions: any) {
    this.procedureFormGroup.form = formgroup;
    this.procedureFormGroup.questions = questions;
  }
  clear() {
    console.log(this.investigationFormGroup);
    console.log(this.procedureFormGroup);
    this.clearAllItems.next(true);
    this.investigationItems = [];
    this.procedureItems = [];
    this.activeMaxId = null;
    this.patientDemographicdata = {};
    this.investigationFormGroup = { form: "", questions: [] };
    this.procedureFormGroup = { form: "", questions: [] };
  }
}
