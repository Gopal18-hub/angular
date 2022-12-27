import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { DepositPatientDetailInterface } from "@core/types/PatientPersonalDetail.Interface";
import { FormDialogueComponent } from "@shared/ui/form-dialogue/form-dialogue.component";
import { MatDialog } from "@angular/material/dialog";
import { savepatientform60detailsModel } from "@core/models/form60PatientDetailsModel.Model";

@Injectable({ 
    providedIn: 'root' 
})

export class DepositService {
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
      
 clearAllItems = new Subject<boolean>();
 formsixtytobefill = new Subject<boolean>();

 transactionamount:any = 0.00;
 MOP:string = "Cash";
 data:any[] = [];
 depositformsixtydetails: any = [];

    setFormList(dataList: any) {
        if(dataList.cashamount > 0)
        {
            this.transactionamount = Number(dataList.cashamount).toFixed(2);
            this.MOP = "Cash";
        }
        else if(dataList.chequeamount > 0){
            this.transactionamount = Number(dataList.chequeamount).toFixed(2);
            this.MOP = "Cheque";
        }
        else if(dataList.creditamount > 0){
            this.transactionamount = Number(dataList.creditamount).toFixed(2);
            this.MOP = "Credit Card";
        }
        else if(dataList.demandamount > 0){
            this.transactionamount = Number(dataList.demandamount).toFixed(2);
            this.MOP = "Demand Draft";
        }
        else if(dataList.onlineamount > 0){
            this.transactionamount = Number(dataList.onlineamount).toFixed(2);
            this.MOP = "Online";
        }
        else if(dataList.paytmamount > 0){
            this.transactionamount = Number(dataList.paytmamount).toFixed(2);
            this.MOP = "PayTM";
        }
        else if(dataList.upiamount > 0)
        {
            this.transactionamount = Number(dataList.upiamount).toFixed(2);
            this.MOP = "UPI";
        }
        else if(dataList.internetamount > 0)
        {
            this.transactionamount = Number(dataList.internetamount).toFixed(2);
            this.MOP = "Internet Banking";
        }
        this.data = [];
        this.data.push({           
                transactionamount :  this.transactionamount, MOP: this.MOP
            
        });
    }
  
    getCategoryIconsForDeposit(deposit:DepositPatientDetailInterface) {
        let returnIcons: any = [];
        Object.keys(deposit).forEach((e) => {
          if (
            e == "pPagerNumber" &&
            this.pageNumberIcons[deposit["pPagerNumber"]]
          ) {
            console.log(deposit["pPagerNumber"]);
            let tempPager: any = {
              src:
                "assets/patient-categories/" +
                this.pageNumberIcons[deposit["pPagerNumber"]],
              type: e,
            };
            if (this.pageNumberIconsTooltip[deposit["pPagerNumber"]]) {
              if (
                this.pageNumberIconsTooltip[deposit["pPagerNumber"]]["type"] ==
                "static"
              ) {
                tempPager["tooltip"] =
                  this.pageNumberIconsTooltip[deposit["pPagerNumber"]]["value"];
              }
            }
            returnIcons.push(tempPager);
          } else if (this.categoryIcons[e] && deposit[e as keyof DepositPatientDetailInterface]) {
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
                  deposit[
                    this.categoryIconsTooltip[e]["value"] as keyof DepositPatientDetailInterface
                  ];
              }
            }
            returnIcons.push(temp);
          }
        });
    
        return returnIcons;
      }

    clearsibllingcomponent(){
      this.clearAllItems.next(true);
      this.clearformsixtydetails();
    }

    refundcashlimit:any=[];
    setcashlimitation(cashlimitlist:any){
       this.refundcashlimit = cashlimitlist;
    }
    isform60exists:boolean = false;
    setdepositformsixtydata(items: any) {
      this.depositformsixtydetails = items;
      this.isform60exists = true;
    }

    clearformsixtydetails(){
      this.depositformsixtydetails = [];
      this.isform60exists = false;
    }
}