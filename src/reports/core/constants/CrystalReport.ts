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

  export const DailyCollectionReport = `${environment.ReportsSampleUrl}/MIS/DailyCollectionReport`;

  export const OnlinePaymentDetailReport = (params: any) => {
    return environment.ReportsSampleUrl + `/MIS/OnlinePaymentDetailReport`;
  };

  export const CreateOPVisitSlipReport = (params: any) => {
    return (
      environment.ReportsSampleUrl + `/CreateOPVisitSlip?${params.VisitNo}`
    );
  };

  export const ConsumabaleEntryDetailsReport = (params: any) => {
    return (
      environment.ReportsSampleUrl +
      `/Billing/OTBilling/ConsumabaleEntryDetails?${params.billno}${params.locationID}${params.MAXID}`
    );
  };
  export const ConsumabaleEntryDetails6inchReport = (params: any) => {
    return (
      environment.ReportsSampleUrl +
      `/Billing/OTBilling/ConsumabaleEntryDetails?${params.billno}${params.locationID}${params.MAXID}`
    );
  };

  export const HappyFamilyPlanAllocationReport = (params: any) => {
    return (
      environment.ReportsSampleUrl +
      `/Out_Patient/HappyFamilyPlanAllocation?${params.MemberShipNo}${params.FLG}${params.planID}`
    );
  };

  export const HappyFamilyPlanUtilizationReport = (params: any) => {
    return (
      environment.ReportsSampleUrl +
      `/Out_Patient/HappyFamilyPlanUtilizationReport?${params.MemberShipNo}`
    );
  };

  export const VisitingOTBillingReport = (params: any) => {
    return (
      environment.ReportsSampleUrl +
      `/Billing/VisitingOTBilling?${params.Opbillid}${params.LocationId}${params.flag}`
    );
  };

  export const PlanLedgerReport = (params: any) => {
    return (
      environment.ReportsSampleUrl +
      `/Marketing/PlanLedger?${params.MaxID}${params.planid}${params.tempbalance}${params.CmbPlan}`
    );
  };
  export const PlanSummaryReport = (params: any) => {
    return (
      environment.ReportsSampleUrl +
      `/Marketing/PlanSummary?${params.FromDate}${params.TodDate}`
    );
  };
  export const DoctorSheduleReport = (params: any) => {
    return (
      environment.ReportsSampleUrl +
      `/FrontOfficeReports/DoctorShedule?${params.dtpStartDate}${params.dtpEndDate}${params.datetype}${params.datetype}${params.rd_Doctor}${params.DocID}${params.location}`
    );
  };
  export const DoctorSheduleReportBySp = (params: any) => {
    return (
      environment.ReportsSampleUrl +
      `/FrontOfficeReports/DoctorShedule?${params.dtpStartDate}${params.dtpEndDate}${params.datetype}${params.datetype}${params.rd_Doctor}${params.Rd_Special}${params.Cmb_Special}${params.specialisationID}`
    );
  };

  export const CRPExpiredPatientDetailReport = (params: any) => {
    return (
      environment.ReportsSampleUrl +
      `/FrontOfficeReports/CRPExpiredPatientDetail?${params.fromdate}${params.todate}${params.locationid}${params.user}`
    );
  };

  export const CROPItemPriceModifiedReport = (params: any) => {
    return (
      environment.ReportsSampleUrl +
      `/MIS/CROPItemPriceModified?${params.fromdate}${params.todate}${params.locationid}`
    );
  };

  export const OpenScrollReport = (params: any) => {
    return (
      environment.ReportsSampleUrl +
      `/MIS/OpenScrollReport?${params.cmbopenscrolltype}${params.cmbLocation}${params.fromdate}${params.todate}${params.user}`
    );
  };

  export const OpenScrollNanavathi = (params: any) => {
    return (
      environment.ReportsSampleUrl +
      `/MIS/OpenScrollReport?${params.cmbopenscrolltype}${params.cmbLocation}${params.fromdate}${params.todate}${params.user}`
    );
  };
  export const ServiceTaxReportDataReports = (params: any) => {
    return (
      environment.ReportsSampleUrl +
      `/MIS/ServiceTaxReportData?${params.fromdate}${params.todate}${params.CmbLocation}${params.user}`
    );
  };
  export const refundReport = (params: any) => {
    return (
      environment.ReportsSampleUrl +
      `/Billing/refundreport?refundBill=${params.refundBill}&locationID=${params.locationID}`
    );
  };

  export const rptRefund = (params: any) => {
    return (
      environment.ReportsSampleUrl +
      `/Refund/rpt_refund?receiptno=${params.receiptno}&locationID=${params.locationID}`
    );
  };

  export const depositReport = (params: any) => {
    return (
      environment.ReportsSampleUrl +
      `/Deposits/rpt_deposit?receiptnumber=${params.receiptnumber}&locationID=${params.locationID}`
    );
  };

  export const surgeryDetailsReport = (params: any) => {
    return (
      environment.ReportsSampleUrl +
      `/SurgeryDetails/rptSurgeryDetails?refundBill=${params.refundBill}&locationID=${params.locationID}`
    );
  };

  export const equipmentReport = (params: any) => {
    return (
      environment.ReportsSampleUrl +
      `/EquipmentSchedule/Equipment_Shedule_Report?EquipFromDate=${params.EquipFromDate}&EquipToDate=${params.EquipToDate}&locationID=${params.locationID}`
    );
  };

  export const freeOutPatientReport = (params: any) => {
    return (
      environment.ReportsSampleUrl +
      `/FreeOutPatientReport/FreeOutPatientReport?FromDate=${params.FromDate}&ToDate=${params.ToDate}&locationID=${params.locationID}`
    );
  };

  export const miscellaneousBillReport = (params: any) => {
    return (
      environment.ReportsSampleUrl +
      `/MiscellaneousBillReport/MiscellaneousBillReport?FromDate=${params.FromDate}&ToDate=${params.ToDate}&locationID=${params.locationID}`
    );
  };

  export const opBillRegisterReport = (params: any) => {
    return (
      environment.ReportsSampleUrl +
      `/OP%20Bill%20Register/OPBillRegister?FromDate=${params.FromDate}&ToDate=${params.ToDate}&sortBy=${params.sortBy}&locationID=${params.locationID}`
    );
  };
}
