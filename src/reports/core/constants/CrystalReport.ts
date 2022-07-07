import { environment } from "@environments/environment";

export namespace CrystalReport {
  export const test =
    "https://MaxHIS-Reports-sit.maxhealthcare.in/PrintOrganDonorForm?BHTN.230538";

  export const printOrganDonorForm = (maxId: string) => {
    return `https://MaxHIS-Reports-sit.maxhealthcare.in/PrintOrganDonorForm?${maxId}`;
  };

  export const billingreport=(opbillid:string, locationID:number)=>{
    return environment.ReportsSampleUrl +`/Billing/OpBillingReport?opbillid=${opbillid}&locationID=${locationID}`;
  };
  
  export const DispatchReport=()=>{
    return environment.ReportsSampleUrl +`/Dispatch_Report/DispatchReport`
  }

  export const DiabeticPlanMainReport=()=>{
    return environment.ReportsSampleUrl +`DiabeticPlanMain/DiabeticPlanMain`
  }
  // from_date=08/19/2021&to_date=03/31/2023&name1=Quit%20Alcohol%20program%20(PPG)&department=Tobbaco%20Cessation%20Program&planTypeName=Others%20Plan&planAmount=18500
 export const DiabeticPlanModifyreport=(from_date:string,to_date:string,name1:string,department:string,planTypeName:string,planAmount:string)=>{
    return environment.ReportsSampleUrl +`/DiabeticPlanModify/DiabeticPlanModify?from_date=${from_date}&to_date=${to_date}&name1=${name1}&department=${department}&planTypeName=${planTypeName}&planAmount=${planAmount}`;
  }

  export const DiabeticPlanNewreport=()=>{
    return environment.ReportsSampleUrl +`/DiabeticPlanNew/DiabeticPlanNew?from_date=08/19/2021&to_date=03/31/2023&name1=Quit%20Alcohol%20program%20(PPG)&department=Tobbaco%20Cessation%20Program&planTypeName=Others%20Plan&planAmount=18500`;
  }

  export const DailyCollectionReport=()=>{
    return environment.ReportsSampleUrl +`/MIS/DailyCollectionReport`
  };

  export const OnlinePaymentDetailReport=()=>{
    return environment.ReportsSampleUrl +`/MIS/OnlinePaymentDetailReport`
  }
}
