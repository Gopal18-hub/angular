import { environment } from "@environments/environment";

export namespace CrystalReport {
  export const test =
    "https://MaxHIS-Reports-sit.maxhealthcare.in/PrintOrganDonorForm?BHTN.230538";

  export const printOrganDonorForm = (params: any) => {
    return `https://MaxHIS-Reports-sit.maxhealthcare.in/PrintOrganDonorForm?${params.maxId}`;
  };

  export const billingreport = (params: any) => {
    return (
      environment.ReportsSampleUrl +
      `/Billing/OpBillingReport?opbillid=${params.opbillid}&locationID=${params.locationID}`
    );
  };

  export const DispatchReport = (params: any) => {
    return environment.ReportsSampleUrl + `/Dispatch_Report/DispatchReport`;
  };

  export const DiabeticPlanMainReport = (params: any) => {
    return environment.ReportsSampleUrl + `DiabeticPlanMain/DiabeticPlanMain`;
  };
  // from_date=08/19/2021&to_date=03/31/2023&name1=Quit%20Alcohol%20program%20(PPG)&department=Tobbaco%20Cessation%20Program&planTypeName=Others%20Plan&planAmount=18500
  export const DiabeticPlanModifyreport = (params: any) => {
    return (
      environment.ReportsSampleUrl +
      `/DiabeticPlanModify/DiabeticPlanModify?from_date=${params.from_date}&to_date=${params.to_date}&name1=${params.name1}&department=${params.department}&planTypeName=${params.planTypeName}&planAmount=${params.planAmount}`
    );
  };

  export const DiabeticPlanNewreport = (params: any) => {
    return (
      environment.ReportsSampleUrl +
      `/DiabeticPlanNew/DiabeticPlanNew?from_date=08/19/2021&to_date=03/31/2023&name1=Quit%20Alcohol%20program%20(PPG)&department=Tobbaco%20Cessation%20Program&planTypeName=Others%20Plan&planAmount=18500`
    );
  };

  export const DailyCollectionReport = (params: any) => {
    return environment.ReportsSampleUrl + `/MIS/DailyCollectionReport`;
  };

  export const OnlinePaymentDetailReport = (params: any) => {
    return environment.ReportsSampleUrl + `/MIS/OnlinePaymentDetailReport`;
  };



 export const planSummary = (dtpStartDate: Date, dtpEndDate: Date) => {
 return "environment.ReportsSampleurl + /Marketing/PlanSummary?${dtpStartDate}=dtpStartDate${dtpEndDate}=dtpEndDate";
};

export const refundreport= (refundBill:String, locationID:number) =>{

return environment.ReportsSampleurl + "/Billing/refundreport?${refundBill}=refundBill${locationID}=locationID";
// this.BaseUrl ='http://localhost:55746/MAXHIS/Billing/refundreport.aspx?refundBill='+ this.refundBill + '&locationID=' +this.locationID

}
 
export const rptrefund= (receiptno:string, locationID:number) =>{
  return "environment.ReportsSampleurl + /Refund/rpt_refund?${receiptno}=receiptno${locationID}=locationID";
}
export const depositreport=(receiptnumber:string, locationID:number) =>{
  return "environment.ReportsSampleurl + /Deposits/rpt_deposit?${receiptnumber}=receiptnumber${locationID}=locationID";
}
}