import { Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";
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
  disableSaveButtonStatus = new Subject<boolean>();
  disableSavebutton: boolean = false;
  disablesaveOndoctorreq: boolean = false;
  disablesaveOndoctorreqStatus = new Subject<boolean>();
  investigationFormGroup: any = { form: "", questions: [] };
  procedureFormGroup: any = { form: "", questions: [] };
  totalCost: any;
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
  changeSaveButtonStatus(value: boolean) {
    this.disableSavebutton = value;
    this.disableSaveButtonStatus.next(value);
  }
  getSaveButtonStatus() {
    return this.disableSavebutton;
  }
  docRequiredStatusvalue(value: boolean) {
    this.disablesaveOndoctorreq = value;
    this.disablesaveOndoctorreqStatus.next(value);
  }
  getSaveButtonondocrequiredStatus() {
    return this.disablesaveOndoctorreq;
  }
  calculateTotalAmount() {
    this.totalCost = 0;
    if (
      this.investigationItems.length > 0 &&
      this.investigationItems != undefined
    ) {
      this.investigationItems.forEach((item: any) => {
        this.totalCost = Number(this.totalCost) + Number(item.price);
      });
    }
    if (this.procedureItems.length > 0 && this.procedureItems != undefined) {
      this.procedureItems.forEach((item: any) => {
        this.totalCost = Number(this.totalCost) + Number(item.price);
      });
    }
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
    this.totalCost = 0;
    console.log(this.investigationFormGroup);
  }
}
