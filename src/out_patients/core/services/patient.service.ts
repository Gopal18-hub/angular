import { Injectable } from "@angular/core";
import { getmergepatientsearch } from "../models/getmergepatientsearch";
import { PatientDetails } from "../models/patientDetailsModel.Model";
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
    isCghsverified: "CGHS_Icon.svg",
    hotlist: "Hot_listing_icon.svg",
  };
  pageNumberIcons: any = {
    "Cash": "Cash_Icon.svg",
    "PSU/Govt": "PSU_icon.svg",
    "Corporate/Insurance": "Ins_icon.svg",
    "ins": "Ins_icon.svg",
    "ews": "EWS.svg",
  };
  categoryIconsActions: any = {
    cghs: {
      action: "dialog",
      properties: {},
    },
    isCghsverified: {
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
    isCghsverified: {
      type: "static",
      value: "CGHS",
    },
    hotList: {
      type: "static",
      value: "HOTLIST",
    },
    hotlist: {
      type: "static",
      value: "HOTLIST",
    },
    mergeLinked: {
      type: "dynamic",
      value: "mergeLinked",
    },
    vip: {
      type: "static",
      value: "VIP",
    },
    note: {
      type: "dynamic",
      value: "noteReason",
    },
    cash: {
      type: "static",
      value: "Cash",
    },
    psu: {
      type: "static",
      value: "PSU",
    },
    ews: {
      type: "static",
      value: "EWS",
    },
    ins: {
      type: "static",
      value: "INS",
    },
    hwc: {
      type: "static ",
      value: "HWC",
    },
  };

  pageNumberIconsTooltip: any = {
    "Cash": {
      type: "static",
      value: "Cash",
    },
    "PSU/Govt": {
      type: "static",
      value: "PSU",
    },
    "Corporate/Insurance": {
      type: "static",
      value: "INS",
    },
    "ins": {
      type: "static",
      value: "INS",
    },
    "ews": {
      type: "static",
      value: "EWS",
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
        e == "pPagerNumber" &&
        this.pageNumberIcons[patient["pPagerNumber"]]
      ) {
        let tempPager: any = {
          src:
            "assets/patient-categories/" +
            this.pageNumberIcons[patient["pPagerNumber"]],
        };
        if (this.pageNumberIconsTooltip[patient["pPagerNumber"]]) {
          if (
            this.pageNumberIconsTooltip[patient["pPagerNumber"]]["type"] ==
            "static"
          ) {
            tempPager["tooltip"] =
              this.pageNumberIconsTooltip[patient["pPagerNumber"]]["value"];
          }
        }
        returnIcons.push(tempPager);
      } else if (
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
                  | PatientDetails
                )
              ];
          }
        }
        returnIcons.push(temp);
      }
    });

    return returnIcons;
  }

  getCategoryIconsForPatient(patient: PatientDetails) {
    let returnIcons: any = [];
    Object.keys(patient).forEach((e) => {
      if (
        e == "ppagerNumber" &&
        this.pageNumberIcons[patient["ppagerNumber"]]
      ) {
        console.log(patient["ppagerNumber"]);
        let tempPager: any = {
          src:
            "assets/patient-categories/" +
            this.pageNumberIcons[patient["ppagerNumber"]],
        };
        if (this.pageNumberIconsTooltip[patient["ppagerNumber"]]) {
          if (
            this.pageNumberIconsTooltip[patient["ppagerNumber"]]["type"] ==
            "static"
          ) {
            tempPager["tooltip"] =
              this.pageNumberIconsTooltip[patient["ppagerNumber"]]["value"];
          }
        }
        returnIcons.push(tempPager);
      } else if (this.categoryIcons[e] && patient[e as keyof PatientDetails]) {
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
                  | PatientDetails
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
