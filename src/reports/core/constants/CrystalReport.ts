import { environment } from "@environments/environment";

export namespace CrystalReport {
  export const printOrganDonorForm = (maxId: string) => {
    return `https://MaxHIS-Reports-sit.maxhealthcare.in/PrintOrganDonorForm?${maxId}`;
  };
  export const createOPVisitSlip = (VisitNo: string) => {
    return (
      environment.ReportsSampleurl + "CreateOPVisitSlip?VisitNo=${VisitNo}"
    );
  };
  export const consumabaleEntryDetails = (
    MAXID: string,
    locationID: number,
    billno: string
  ) => {
    return (
      environment.ReportsSampleurl +
      "Billing/OTBilling/ConsumabaleEntryDetails?MAXID=${MAXID}&locationID=${locationID}&billno=${billno}"
    );
  };
  export const planLedger = (
    tempbalance: number,
    planid: number,
    MaxID: string,
    CmbPlan: string
  ) => {
    return (
      environment.ReportsSampleurl +
      "Marketing/PlanLedger?$tempbalance={tempbalance}&planid=${planid}&MaxID=${MaxID}&CmbPlan=${CmbPlan}"
    );
  };
  export const planSummary = (dtpStartDate: string, dtpEndDate: string) => {
    return (
      environment.ReportsSampleurl +
      "/Marketing/PlanSummary?dtpStartDate=${dtpStartDate}&dtpEndDate=${dtpEndDate}"
    );
  };
  export const doctorSchedule = (
    dtpStartDate: string,
    dtpEndDate: string,
    rd_Doctor: boolean,
    datetype: number,
    location: number,
    DocID: number
  ) => {
    return (
      environment.ReportsSampleurl +
      "/FrontOfficeReports/DoctorShedule?dtpStartDate=${dtpStartDate}&dtpEndDate=${dtpEndDate}&rd_Doctor=${rd_Doctor}&location=${location}&DocID=${DocID}"
    );
  };
  export const cRPExpiredPatientDetail = (
    fromdate: string,
    todate: string,
    locationid: number,
    LocationName: string,
    user: string
  ) => {
    return (
      environment.ReportsSampleurl +
      "/FrontOfficeReports/CRPExpiredPatientDetail?fromdate=${fromdate}&todate=${todate}&locationid=${locationid}&Locationname=${Locationname}&user=&{user}"
    );
  };

  export const cROPItemPriceModified = (
    fromdate: string,
    todate: string,
    locationid: number,
    user: string,
    LocationName: string
  ) => {
    return (
      environment.ReportsSampleurl +
      "MIS/CROPItemPriceModified?fromdate=${fromdate}&todate=${todate}&locationid=${locationid}&user=${user}LocationName=${LocationName}"
    );
  };
  export const openScrollReport = (
    fromdate: string,
    todate: string,
    flag: number,
    cmbLocation: number,
    user: string,
    LocationName: string,
    openscroll: string
  ) => {
    return (
      environment.ReportsSampleurl +
      "MIS/OpenScrollReport?fromdate=${fromdate}&todate=${todate}&user=${user}&flag=${flag}&cmbLocation=${cmbLocation}&openscroll=${openscroll}"
    );
  };
  export const ServiceTaxReportData = (
    fromdate: string,
    todate: string,
    cmbLocation: number,
    inttype: number,
    rbIP: boolean,
    LocationName: string,
    user: string
  ) => {
    return (
      environment.ReportsSampleurl +
      "MIS/ServiceTaxReportData?fromdate=${fromdate}&todat=e${todate}&cmbLocation=${cmbLocation}&inttype=${inttype}&LocationName=${LocationName}&rbIP=${rbIP}&user=${user}"
    );
  };
}
