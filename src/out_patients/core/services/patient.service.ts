import { Injectable } from "@angular/core";
import { getmergepatientsearch } from "../models/getmergepatientsearch";
import { PatientSearchModel } from "../models/patientSearchModel";

@Injectable({
  providedIn: "root",
})
export class PatientService {
  categoryIcons: any = {
    cghs: "CGHS_Icon.svg",
    hotList: "Hot_listing_icon.svg",
    mergeLinked: "merge.svg",
    vip: "vip_icon.svg",
    note: "Notes_icon.svg",
    cash: "Cash_Icon.svg",
    psu: "PSU_icon.svg",
    ews: "EWS.svg",
    ins: "Ins_icon.svg",
    hwc: "HWC_icon.svg",
  };

  categoryIconsActions: any = {
    cghs: {
      action: "dialog",
      properties: {},
    },
    hotList: "",
    mergeLinked: "",
    vip: "",
    note: "",
    cash: "",
    psu: "",
    ews: "",
    ins: "",
    hwc: "",
  };

  categoryIconsTooltip: any = {
    cghs: {
      type: "static",
      value: "CGHS",
    },
    hotList: {
      type: "dynamic",
      value: "",
    },
    mergeLinked: {
      type: "dynamic",
      value: "mergeLinked",
    },
    vip: {
      type: "dynamic",
      value: "",
    },
    note: {
      type: "dynamic",
      value: "",
    },
    cash: {
      type: "dynamic",
      value: "",
    },
    psu: {
      type: "dynamic",
      value: "",
    },
    ews: {
      type: "dynamic",
      value: "",
    },
    ins: {
      type: "dynamic",
      value: "",
    },
    hwc: {
      type: "dynamic",
      value: "",
    },
  };

  constructor() {}

  getAllCategoryIcons(
    patientSearchModel: PatientSearchModel[] | getmergepatientsearch[],
    model: any = PatientSearchModel
  ) {
    patientSearchModel.forEach((e) => {
      e.categoryIcons = this.getCategoryIcons(e);
    });
    return patientSearchModel as typeof model;
  }

  getCategoryIcons(patient: PatientSearchModel | getmergepatientsearch) {
    let returnIcons: any = [];
    Object.keys(patient).forEach((e) => {
      if (
        this.categoryIcons[e] &&
        patient[e as keyof (PatientSearchModel | getmergepatientsearch)]
      ) {
        let temp: any = {
          src: "assets/patient-categories/" + this.categoryIcons[e],
        };
        if (this.categoryIconsTooltip[e]) {
          if (this.categoryIconsTooltip[e]["type"] == "static") {
            temp["tooltip"] = this.categoryIconsTooltip[e]["value"];
          }
          if (this.categoryIconsTooltip[e]["type"] == "dynamic") {
            temp["tooltip"] =
              patient[
                this.categoryIconsTooltip[e]["value"] as keyof (
                  | PatientSearchModel
                  | getmergepatientsearch
                )
              ];
          }
        }
        returnIcons.push(temp);
      }
    });

    return returnIcons;
  }
}
