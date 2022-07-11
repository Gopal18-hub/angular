import { Injectable } from "@angular/core";
import { opRegHotlistModel } from "../../../out_patients/core/models/opreghotlistapprovalModel.Model";

@Injectable({
  providedIn: "root",
})
export class HotListingService {
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
  pageNumberIcons: any = {
    Cash: "Cash_Icon.svg",
    "PSU/Govt": "PSU_icon.svg",
    "Corporate/Insurance": "Ins_icon.svg",
    ins: "Ins_icon.svg",
    ews: "EWS.svg",
    cash: "Cash_Icon.svg",
    "psu/govt": "PSU_icon.svg",
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

  constructor() {}

  getAllCategoryIcons(hotlisting: opRegHotlistModel[]) {
    hotlisting.forEach((e) => {
      e.categoryIcons = this.getCategoryIcons(e);
    });
    return hotlisting;
  }

  getCategoryIcons(patient: opRegHotlistModel) {
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
        patient[e as keyof opRegHotlistModel]
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
                this.categoryIconsTooltip[e]["value"] as keyof opRegHotlistModel
              ];
          }
        }
        returnIcons.push(temp);
      }
    });

    return returnIcons;
  }
}
