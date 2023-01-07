import { Injectable } from "@angular/core";
import { getmergepatientsearch } from "../models/getmergepatientsearch";
import { PatientDetails } from "../models/patientDetailsModel.Model";
import { PatientSearchModel } from "../models/patientSearchModel";
import { FormDialogueComponent } from "@shared/ui/form-dialogue/form-dialogue.component";
import { MatDialog } from "@angular/material/dialog";
import { dmgMappingDataDTInterface } from "../types/dmgMapping/patientDetailsDmg.Interface";
import { GetExpiredPatientDetailInterface } from "../types/expiredPatient/getExpiredpatient.Interface";

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
    Cash: "Cash_Icon.svg",
    "PSU/Govt": "PSU_icon.svg",
    "Corporate/Insurance": "Ins_icon.svg",
    ins: "Ins_icon.svg",
    ews: "EWS.svg",
    cash: "Cash_Icon.svg",
    "psu/govt": "PSU_icon.svg",
  };
  categoryIconsActions: any = {
    cghs: {},
    isCghsverified: {},
    mergeLinked: "",
    vip: {
      action: "dialog",
      component: FormDialogueComponent,
      properties: {
        width: "28vw",
        data: {
          title: "VIP Remarks",
          form: {
            title: "",
            type: "object",
            properties: {
              notes: {
                type: "textarea",
                title: "",
                readonly: true,
                defaultValue: "",
              },
            },
          },
          layout: "single",
          buttonLabel: "",
        },
      },
    },
    note: {
      action: "dialog",
      component: FormDialogueComponent,
      properties: {
        width: "28vw",
        data: {
          title: "Note Remarks",
          form: {
            title: "",
            type: "object",
            properties: {
              notes: {
                type: "textarea",
                title: "",
                readonly: true,
                defaultValue: "",
              },
            },
          },
          layout: "single",
          buttonLabel: "",
        },
      },
    },
    hotlist: {
      action: "dialog",
      component: FormDialogueComponent,
      properties: {
        width: "30vw",
        data: {
          title: "Hot Listing",
          form: {
            title: "",
            type: "object",
            properties: {
              hotlistTitle: {
                type: "autocomplete",
                title: "Hot Listing",
                readonly: true,
                defaultValue: "",
              },
              reason: {
                type: "textarea",
                title: "Remark",
                readonly: true,
                defaultValue: "",
              },
            },
          },
          layout: "single",
          buttonLabel: "",
        },
      },
    },
    hotList: {
      action: "dialog",
      component: FormDialogueComponent,
      properties: {
        width: "30vw",
        data: {
          title: "Hot Listing",
          form: {
            title: "",
            type: "object",
            properties: {
              hotlistTitle: {
                type: "autocomplete",
                title: "Hot Listing",
                readonly: true,
                defaultValue: "",
              },
              reason: {
                type: "textarea",
                title: "Remark",
                readonly: true,
                defaultValue: "",
              },
            },
          },
          layout: "single",
          buttonLabel: "",
        },
      },
    },
    cash: "",
    psu: "",
    ppagerNumber: {
      action: "dialog",
      component: FormDialogueComponent,
      properties: {
        width: "28vw",
        data: {
          title: "EWS Details",
          form: {
            title: "",
            type: "object",
            properties: {
              bplCardNo: {
                type: "string",
                title: "BPL Card No.",
                readonly: true,
                defaultValue: "",
              },
              BPLAddress: {
                type: "textarea",
                title: "Address on card",
                readonly: true,
                defaultValue: "",
              },
            },
          },
          layout: "single",
          buttonLabel: "",
        },
      },
    },
    ins: "",
    hwc: {
      action: "dialog",
      component: FormDialogueComponent,
      properties: {
        width: "28vw",
        data: {
          title: "HWC Remarks",
          form: {
            title: "",
            type: "object",
            properties: {
              notes: {
                type: "textarea",
                title: "",
                readonly: true,
                defaultValue: "",
              },
            },
          },
          layout: "single",
          buttonLabel: "",
        },
      },
    },
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
      value: "notereason",
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
      type: "dynamic",
      value: "hwcRemarks",
    },
  };

  pageNumberIconsTooltip: any = {
    Cash: {
      type: "static",
      value: "CASH",
    },
    "PSU/Govt": {
      type: "static",
      value: "PSU",
    },
    "Corporate/Insurance": {
      type: "static",
      value: "INS",
    },
    ins: {
      type: "static",
      value: "INS",
    },
    ews: {
      type: "static",
      value: "EWS",
    },
    cash: {
      type: "static",
      value: "CASH",
    },
    "psu/govt": {
      type: "static",
      value: "PSU",
    },
  };

  constructor(private dialog: MatDialog) {}

  getAllCategoryIcons(
    patientSearchModel: PatientSearchModel[] | getmergepatientsearch[],
    model: any = PatientSearchModel
  ) {
    patientSearchModel.forEach((e) => {
      e.categoryIcons = this.getCategoryIcons(e);
    });
    return patientSearchModel as typeof model;
  }

  getCategoryIcons(
    patient:
      | PatientSearchModel
      | getmergepatientsearch
      | dmgMappingDataDTInterface
      | GetExpiredPatientDetailInterface
  ) {
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
        patient[
          e as keyof (
            | PatientSearchModel
            | getmergepatientsearch
            | dmgMappingDataDTInterface
            | GetExpiredPatientDetailInterface
          )
        ]
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
                  | dmgMappingDataDTInterface
                  | GetExpiredPatientDetailInterface
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
          type: e,
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
          type: e,
        };
        if (this.categoryIconsTooltip[e]) {
          if (this.categoryIconsTooltip[e]["type"] == "static") {
            temp["tooltip"] = this.categoryIconsTooltip[e]["value"];
          }
          if (this.categoryIconsTooltip[e]["type"] == "dynamic") {
            temp["tooltip"] =
              patient[
                this.categoryIconsTooltip[e]["value"] as keyof PatientDetails
              ];
          }
        }
        returnIcons.push(temp);
      }
    });

    return returnIcons;
  }

  getCategoryIconsForPatientAny(patient: any) {
    let returnIcons: any = [];
    Object.keys(patient).forEach((e) => {
      if (
        e == "pPagerNumber" &&
        this.pageNumberIcons[patient["pPagerNumber"]]
      ) {
        console.log(patient["ppagerNumber"]);
        let tempPager: any = {
          src:
            "assets/patient-categories/" +
            this.pageNumberIcons[patient["pPagerNumber"]],
          type: e,
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
      } else if (this.categoryIcons[e] && patient[e as keyof PatientDetails]) {
        let temp: any = {
          src: "assets/patient-categories/" + this.categoryIcons[e],
          type: e,
        };
        if (this.categoryIconsTooltip[e]) {
          if (this.categoryIconsTooltip[e]["type"] == "static") {
            temp["tooltip"] = this.categoryIconsTooltip[e]["value"];
          }
          if (this.categoryIconsTooltip[e]["type"] == "dynamic") {
            temp["tooltip"] =
              patient[
                this.categoryIconsTooltip[e]["value"] as keyof PatientDetails
              ];
          }
        }
        returnIcons.push(temp);
      }
    });

    return returnIcons;
  }

  doAction(type: string, data: any) {
    if (this.categoryIconsActions[type]) {
      if (this.categoryIconsActions[type].action == "dialog") {
        if (data) {
          Object.keys(data).forEach((ele) => {
            this.categoryIconsActions[type].properties.data.form.properties[
              ele
            ].defaultValue = data[ele];
          });
        }
        this.dialog.open(
          this.categoryIconsActions[type].component,
          this.categoryIconsActions[type].properties
        );
      }
    }
  }
}
