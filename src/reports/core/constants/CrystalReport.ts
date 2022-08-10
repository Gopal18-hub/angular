import { environment } from "@environments/environment";

export namespace CrystalReport {
  export const test =
    "https://MaxHIS-Reports-sit.maxhealthcare.in/PrintOrganDonorForm?BHTN.230538";

  export const PrintOrganDonorForm = (params: any) => {
    return (
      environment.crystalReportBaseUrl +
      `MAXHIS/Opd_Registration/PrintOrganDonorForm?${params.maxId}`
    );
  };
  export const PrintLabel = (params: any) => {
    return (
      environment.crystalReportBaseUrl +
      `MAXHIS/Opd_Registration/PrintLabel?${params.maxId}`
    );
  };
  export const PrintFormReport = (params: any) => {
    return (
      environment.crystalReportBaseUrl +
      `MAXHIS/Opd_Registration/PrintFormReport?${params.maxId}`
    );
  };
  export const billingreport = (params: any) => {
    return (
      environment.ReportsSampleUrl +
      `/Billing/OpBillingReport?opbillid=${params.opbillid}&locationID=${params.locationID}`
    );
  };

  export const DispatchReport = (params: any) => {
    return (
      environment.ReportsSampleUrl +
      `/Dispatch_Report/DispatchReport?fromdate=${params.fromdate}&todate=${params.todate}&locationid=${params.locationid}&RepType=${params.RepType}`
    );
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
    return `${environment.ReportsSampleUrl}/CreateOPVisitSlip?VisitNo=${params.VisitNo}`;
  };

  export const ConsumabaleEntryDetailsReport = (params: any) => {
    return `${environment.reportTenantUrl}/Billing/OTBilling/ConsumabaleEntryDetails?billno=${params.billno}&locationID=${params.locationID}&MAXID=${params.MAXID}`;
  };

  export const HappyFamilyPlanAllocationReport = (params: any) => {
    return `${environment.ReportsSampleUrl}/Out_Patient/HappyFamilyPlanAllocation?MemberShipNo=${params.MemberShipNo}&FLG=${params.FLG}&planID=${params.planID}`;
  };

  export const HappyFamilyPlanUtilizationReport = (params: any) => {
    return `${environment.ReportsSampleUrl}/Out_Patient/HappyFamilyPlanUtilizationReport?MemberShipNo=${params.MemberShipNo}`;
  };

  export const GeneralOPDReport = (params: any) => {
    return `${environment.ReportsSampleUrl}/Out_Patient/GeneralOPDReport?ValueFromDate=${params.ValueFromDate}&ValueToDate=${params.ValueToDate}&locationID=8`;
  };

  export const VisitingOTBillingReport = (params: any) => {
    return `${environment.ReportsSampleUrl}/Billing/VisitingOTBilling?Opbillid=${params.Opbillid}&LocationId=${params.LocationId}&flag=${params.flag}`;
  };

  export const PlanLedgerReport = (params: any) => {
    return `${environment.ReportsSampleUrl}/Marketing/PlanLedger?MaxID=${params.MaxID}&planid=${params.planid}&tempbalance=${params.tempbalance}&CmbPlan=${params.CmbPlan}`;
  };
  export const PlanSummaryReport = (params: any) => {
    return `${environment.ReportsSampleUrl}/Marketing/PlanSummary?FromDate=${params.FromDate}&TodDate=${params.TodDate}`;
  };
  export const DoctorSheduleReport = (params: any) => {
    return `${environment.ReportsSampleUrl}/FrontOfficeReports/DoctorShedule?dtpStartDate=${params.dtpStartDate}&dtpEndDate=${params.dtpEndDate}&datetype=${params.datetype}&rd_Doctor=${params.rd_Doctor}&DocID=${params.DocID}&location=${params.location}&Rd_Special=${params.Rd_Special}`;
  };
  export const DoctorSheduleReportBySpecilialisation = (params: any) => {
    return `${environment.ReportsSampleUrl}/FrontOfficeReports/DoctorShedule?dtpStartDate=${params.dtpStartDate}&dtpEndDate=${params.dtpEndDate}&datetype=${params.datetype}&rd_Doctor=${params.rd_Doctor}&DocID=${params.DocID}&location=${params.location}&Rd_Special=${params.Rd_Special}&Cmb_Special=${params.Cmb_Special}&specialisationID=${params.specialisationID}`;
  };
  export const CRPExpiredPatientDetailReport = (params: any) => {
    return `${environment.ReportsSampleUrl}/FrontOfficeReports/CRPExpiredPatientDetail?fromdate=${params.fromdate}&todate=${params.todate}&locationid=20&user=Mani`;
  };

  export const CROPItemPriceModifiedReport = (params: any) => {
    return `${environment.ReportsSampleUrl}/MIS/CROPItemPriceModified?fromdate=${params.fromdate}&todate=${params.todate}&locationid=${params.locationid}`;
  };

  export const OpenScrollReport = (params: any) => {
    return `${environment.ReportsSampleUrl}/MIS/OpenScrollReport?cmbopenscrolltype=${params.cmbopenscrolltype}&cmbLocation=${params.cmbLocation}&fromdate=${params.fromdate}&todate=${params.todate}&user=${params.user}`;
  };

  export const ServiceTaxReportDataReports = (params: any) => {
    return `${environment.ReportsSampleUrl}/MIS/ServiceTaxReportData?fromdate=${params.fromdate}&todate=${params.todate}&CmbLocation=${params.CmbLocation}&user=${params.user}`;
  };
  export const refundReport = (params: any) => {
    return `${environment.ReportsSampleUrl}/Billing/refundreport?refundBill=${params.refundBill}&locationID=${params.locationID}`;
  };

  export const rptRefund = (params: any) => {
    return `${environment.ReportsSampleUrl}/Refund/rpt_refund?receiptno=${params.receiptno}&locationID=${params.locationID}`;
  };

  export const depositReport = (params: any) => {
    return `${environment.ReportsSampleUrl}/Deposits/rpt_deposit?receiptnumber=${params.receiptnumber}&locationID=${params.locationID}`;
  };

  export const surgeryDetailsReport = (params: any) => {
    return `${environment.ReportsSampleUrl}/SurgeryDetails/rptSurgeryDetails?refundBill=${params.refundBill}&locationID=${params.locationID}`;
  };

  export const equipmentReport = (params: any) => {

    return `${environment.ReportsSampleUrl}/EquipmentSchedule/Equipment_Shedule_Report?EquipFromDate=${params.EquipFromDate}&EquipToDate=${params.EquipToDate}&Cmb_Equip=${params.Cmb_Equip}&locationID=${params.locationID}&LocationName=${params.LocationName}`;

  };

  export const freeOutPatientReport = (params: any) => {
    return `${environment.ReportsSampleUrl}/FreeOutPatientReport/FreeOutPatientReport?FromDate=${params.FromDate}&ToDate=${params.ToDate}&locationID=${params.locationID}`;
  };

  export const miscellaneousBillReport = (params: any) => {
    return `${environment.ReportsSampleUrl}/MiscellaneousBillReport/MiscellaneousBillReport?FromDate=${params.FromDate}&ToDate=${params.ToDate}&locationID=${params.locationID}`;
  };

  export const opBillRegisterReport = (params: any) => {
    return `${environment.ReportsSampleUrl}/OP%20Bill%20Register/OPBillRegister?FromDate=${params.FromDate}&ToDate=${params.ToDate}&sortBy=${params.sortBy}&locationID=${params.locationID}`;
  };
  export const CashScrollReport = (params: any) => {
    return `${environment.ReportsSampleUrl}/Opd_Billing/CashScrollReport?Fromdate=${params.Fromdate}&Todate=${params.Todate}&Operatorid=${params.Operatorid}&LocationID=${params.LocationID}&EmployeeName=${params.EmployeeName}&TimeTakenAt=${params.TimeTakenAt}`;
  };
  export const SummaryReportForUtilisationReport = (params: any) => {
    return `${environment.ReportsSampleUrl}/Out_Patient/SummaryReportForUtilisation?membershipno=${params.membershipno}`;
  };
}
