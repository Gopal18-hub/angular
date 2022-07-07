import { environment } from "@environments/environment";

export namespace CrystalReport {
  export const test =
    "https://MaxHIS-Reports-sit.maxhealthcare.in/PrintOrganDonorForm?BHTN.230538";

  export const printOrganDonorForm = (maxId: string) => {
    return `https://MaxHIS-Reports-sit.maxhealthcare.in/PrintOrganDonorForm?${maxId}`;
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