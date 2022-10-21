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
  disablesaveOndoctorreqStatus = new Subject<boolean>();
  disableSaveonPriority: boolean = false;
  disablesaveOndoctorreq: boolean = false;
  investigationFormGroup: any = { form: "", questions: [] };
  procedureFormGroup: any = { form: "", questions: [] };
  serviceTab = new Subject<boolean>();
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
  saveOnPriority(value: boolean) {
    this.disableSaveonPriority = value;
    this.disableSaveButtonStatus.next(value);
  }
  getSaveButtononPriority() {
    return this.disableSaveonPriority;
  }
  // docRequiredStatusvalue(value: boolean) {
  //   this.disablesaveOndoctorreq = value;
  //   this.disablesaveOndoctorreqStatus.next(value);
  // }
  docRequiredStatusvalue() {
    console.log(this.investigationItems);
    console.log(this.procedureItems);
    this.investigationItems.forEach((item: any) => {
      console.log(item);
      if (item.docRequired == 1 && item.doctorId == 0) {
        console.log("inisde inv item docr required loop");
        this.disablesaveOndoctorreq = true;
      } else {
        this.disablesaveOndoctorreq = false;
      }
    });
    this.procedureItems.forEach((item: any) => {
      if (item.docRequired == 1 && item.doctorId == 0) {
        this.disablesaveOndoctorreq = true;
      } else {
        this.disablesaveOndoctorreq = false;
      }
    });
    console.log(this.disablesaveOndoctorreq);
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
  onServiceTab(value: boolean) {
    console.log("inside service tab service");
    this.serviceTab.next(value);
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
    this.disablesaveOndoctorreq = false;
    this.disableSaveonPriority = false;
    console.log(this.investigationFormGroup);
  }
}
