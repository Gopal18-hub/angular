import { environment } from "@environments/environment";
import { MaxHealthStorage } from "@shared/services/storage";
import * as moment from "moment";

export namespace CrystalReport {
  export const test =
    "https://MaxHIS-Reports-sit.maxhealthcare.in/PrintOrganDonorForm?BHTN.230538";

  export const PrintOrganDonorForm = (params: any) => {
    return `${environment.ReportsSampleUrl}MAXHIS/Opd_Registration/PrintOrganDonorForm?MAXID=${params.maxId}`;
  };
  export const PrintLabel = (params: any) => {
    return `${environment.ReportsSampleUrl}MAXHIS/Opd_Registration/PrintLabel?${params.maxId}`;
  };
  export const PrintFormReport = (params: any) => {
    return `${environment.ReportsSampleUrl}MAXHIS/Opd_Registration/PrintFormReport?MAXID=${params.maxId}`;
  };
  export const billingreport = (params: any) => {
    return `${environment.ReportsSampleUrl}MAXHIS/Billing/OpBillingReport?opbillid=${params.opbillid}&locationID=${params.locationID}&enableexport=${params.enableexport ? 1 : 0}`;
  };
  export const billdetailsreport = (params: any) => {
    return `${environment.ReportsSampleUrl}MAXHIS/Billing/BilldetailsOPbillreport?opbillid=${params.opbillid}&locationID=${params.locationID}&enableexport=${params.enableexport ? 1 : 0}`;
  };
  export const billingreportPDF = (params: any) => {
    return `${environment.ReportsSampleUrl}MAXHIS/Billing/OpBillingReportPDF?opbillid=${params.opbillid}&locationID=${params.locationID}`;
  };
  export const DispatchReport = (params: any) => {
    return `${environment.ReportsSampleUrl}MAXHIS/Dispatch_Report/DispatchReport?fromdate=${params.fromdate}&todate=${params.todate}&locationid=${params.locationid}&RepType=${params.RepType}`;
  };

  export const DiabeticPlanMainReport = (params: any) => {
    return `${environment.ReportsSampleUrl}MAXHIS/DiabeticPlanMain/DiabeticPlanMain`;
  };
  // from_date=08/19/2021&to_date=03/31/2023&name1=Quit%20Alcohol%20program%20(PPG)&department=Tobbaco%20Cessation%20Program&planTypeName=Others%20Plan&planAmount=18500
  export const DiabeticPlanModifyreport = (params: any) => {
    return `${environment.ReportsSampleUrl}MAXHIS/DiabeticPlanModify/DiabeticPlanModify?from_date=${params.from_date}&to_date=${params.to_date}&name1=${params.name1}&department=${params.department}&planTypeName=${params.planTypeName}&planAmount=${params.planAmount}`;
  };

  export const DiabeticPlanNewreport = (params: any) => {
    return `${environment.ReportsSampleUrl}MAXHIS/DiabeticPlanNew/DiabeticPlanNew?from_date=08/19/2021&to_date=03/31/2023&name1=Quit%20Alcohol%20program%20(PPG)&department=Tobbaco%20Cessation%20Program&planTypeName=Others%20Plan&planAmount=18500`;
  };

  export const DailyCollectionReport = (params: any) => {
    return `${
      environment.ReportsSampleUrl
    }MAXHIS/MIS/DailyCollectionReport?FromDate=${params.FromDate}&ToDate=${
      params.FromDate
    }&LocationName=${MaxHealthStorage.getCookie(
      "Location"
    )}&User=${MaxHealthStorage.getCookie("UserName")}&locationid=${
      params.locationID
    }&exportflag=${params.exportflag}`;
    // &exportflag=${
    //   params.exportflag
    // }
  };
  export const OnlinePaymentDetailReport = (params: any) => {
    return `${
      environment.ReportsSampleUrl
    }MAXHIS/MIS/OnlinePaymentDetailReport?radiovalue=${
      params.RepType
    }&FromDate=${params.fromdate}&ToDate=${params.todate}&locationid=${
      params.locationid
    }&Locationname=${params.organisationName}&User=${MaxHealthStorage.getCookie(
      "UserName"
    )}&exportflag=${params.exportflag}`;
  };

  export const CreateOPVisitSlipReport = (params: any) => {
    return `${environment.ReportsSampleUrl}MAXHIS/CreateOPVisitSlip?VisitNo=${params.VisitNo}`;
  };

  export const ConsumabaleEntryDetailsReport = (params: any) => {
    return `${environment.ReportsSampleUrl}MAXHIS/Billing/OTBilling/ConsumabaleEntryDetails?billno=${params.billno}&locationID=${MaxHealthStorage.getCookie("HSPLocationId")}&MAXID=${params.MAXID}&exportflagEnable=${params.exportflagEnable?1:0}`;
  };

  export const HappyFamilyPlanAllocationReport = (params: any) => {
    return `${environment.ReportsSampleUrl}MAXHIS/Out_Patient/HappyFamilyPlanAllocation?MemberShipNo=${params.MemberShipNo}&Flag=${params.Flag}&planID=${params.planID}`;
  };

  export const HappyFamilyPlanUtilizationReport = (params: any) => {
    return `${environment.ReportsSampleUrl}MAXHIS/Out_Patient/HappyFamilyPlanUtilizationReport?MembershipNo=${params.MemberShipNo}`;
  };

  export const GeneralOPDReport = (params: any) => {
    return `${
      environment.ReportsSampleUrl
    }MAXHIS/Out_Patient/GeneralOPDReport?ValueFromDate=${
      params.ValueFromDate
    }&ValueToDate=${params.ValueToDate}&locationID=${MaxHealthStorage.getCookie(
      "HSPLocationId"
    )}`;
  };

  export const VisitingOTBillingReport = (params: any) => {
    return `${environment.ReportsSampleUrl}MAXHIS/Billing/VisitingOTBilling?Opbillid=${params.Opbillid}&LocationId=${params.LocationId}&flag=${params.flag}`;
  };

  export const PlanLedgerReport = (params: any) => {
    return `${environment.ReportsSampleUrl}MAXHIS/Marketing/PlanLedger?MaxID=${params.MaxID}&planid=${params.planid}&tempbalance=${params.tempbalance}&CmbPlan=${params.CmbPlan}`;
  };
  export const PlanSummaryReport = (params: any) => {
    return `${environment.ReportsSampleUrl}MAXHIS/Marketing/PlanSummary?FromDate=${params.FromDate}&TodDate=${params.TodDate}`;
  };

  export const DoctorSheduleReport = (params: any) => {
    return `${
      environment.ReportsSampleUrl
    }MAXHIS/FrontOfficeReports/DoctorShedule?dtpStartDate=${
      params.dtpStartDate
    }&dtpEndDate=${params.dtpEndDate}&datetype=${params.datetype}&DocID=${
      params.DocID
    }&DocID1=true&location=${MaxHealthStorage.getCookie(
      "HSPLocationId"
    )}&Rd_Special=false&LocationName=${MaxHealthStorage.getCookie("Location")}`;
  };
  export const DoctorSheduleReportBySpecilialisation = (params: any) => {
    return `${
      environment.ReportsSampleUrl
    }MAXHIS/FrontOfficeReports/DoctorShedule?dtpStartDate=${
      params.dtpStartDate
    }&dtpEndDate=${params.dtpEndDate}&datetype=${params.datetype}&rd_Doctor=${
      params.rd_Doctor
    }&DocID1=false&location=${MaxHealthStorage.getCookie(
      "HSPLocationId"
    )}&Rd_Special=${params.Rd_Special}&Cmb_Special=${
      params.specilizationName
    }&specialisationID=${
      params.Cmb_Special
    }&specialisationID1=true&LocationName=${MaxHealthStorage.getCookie(
      "Location"
    )}&hsplocationid=${MaxHealthStorage.getCookie("HSPLocationId")}`;
  };
  export const CRPExpiredPatientDetailReport = (params: any) => {
    return `${
      environment.ReportsSampleUrl
    }MAXHIS/FrontOfficeReports/CRPExpiredPatientDetail?dtpfromdate=${
      params.dtpfromdate
    }&dtptodate=${params.dtptodate}&locationid=${
      params.locationid
    }&LocationName=${params.LocationName}&user=${MaxHealthStorage.getCookie(
      "UserName"
    )}`;
  };

  export const CROPItemPriceModifiedReport = (params: any) => {
    return `${
      environment.ReportsSampleUrl
    }MAXHIS/MIS/CROPItemPriceModified?dtpfrom=${params.dtpfrom}&dtpto=${
      params.dtpto
    }&locationid=${params.locationid}&LocationName=${
      params.LocationName
    }&user=${MaxHealthStorage.getCookie("UserName")}&exportflag=${
      params.exportflag
    }`;
  };

  export const OpenScrollReport = (params: any) => {
    return `${
      environment.ReportsSampleUrl
    }MAXHIS/MIS/OpenScrollReport?cmbopenscrolltype=${
      params.cmbopenscrolltype
    }&cmbLocation=${params.cmbLocation}&dtpFromDate=${
      params.dtpFromDate
    }&dtpToDate=${params.dtpToDate}&openscrolltypename=${
      params.openscrolltypename
    }&user=${MaxHealthStorage.getCookie("UserName")}&LocationName=${
      params.LocationName
    }&exportflag=${params.exportflag}`;
  };

  export const ServiceTaxReportData = (params: any) => {
    return `${
      environment.ReportsSampleUrl
    }MAXHIS/MIS/ServiceTaxReportData?dtpFromDate=${
      params.dtpFromDate
    }&dtpToDate=${params.dtpToDate}&rbIP=${params.rbIP}&locationid=${
      params.locationid
    }&LocationName=${params.LocationName}&user=${MaxHealthStorage.getCookie(
      "UserName"
    )}&exportflag=${params.exportflag}`;
  };
  export const refundReport = (params: any) => {
    return `${environment.ReportsSampleUrl}MAXHIS/Billing/refundreport?refundBill=${params.refundBill}&locationID=${params.locationID}`;
  };

  export const rptRefund = (params: any) => {
    return `${environment.ReportsSampleUrl}MAXHIS/Refund/rpt_refund?receiptno=${
      params.receiptno
    }&locationID=${params.locationID}&exportflagEnable=${
      params.exportflagEnable ? 1 : 0
    }`;
  };

  export const DepositReport = (params: any) => {
    return `${
      environment.ReportsSampleUrl
    }MAXHIS/Deposits/rpt_deposit?receiptnumber=${
      params.receiptnumber
    }&locationID=${params.locationID}&exportflagEnable=${
      params.exportflagEnable ? 1 : 0
    }`;
  };

  export const surgeryDetailsReport = (params: any) => {
    return `${environment.ReportsSampleUrl}MAXHIS/SurgeryDetails/rptSurgeryDetails?refundBill=${params.refundBill}&locationID=${params.locationID}`;
  };

  export const equipmentReport = (params: any) => {
    return `${
      environment.ReportsSampleUrl
    }MAXHIS/EquipmentSchedule/Equipment_Shedule_Report?EquipFromDate=${
      params.EquipFromDate
    }&EquipToDate=${params.EquipToDate}&Cmb_Equip=${
      params.Cmb_Equip
    }&equipmentName=${
      params.equipmentName
    }&locationID=${MaxHealthStorage.getCookie(
      "HSPLocationId"
    )}&LocationName=${MaxHealthStorage.getCookie("Location")}`;
  };

  export const freeOutPatientReport = (params: any) => {
    return `${
      environment.ReportsSampleUrl
    }MAXHIS/FreeOutPatientReport/FreeOutPatientReport?FromDate=${
      params.FromDate
    }&ToDate=${params.ToDate}&locationID=${
      params.locationID
    }&LocationName=${MaxHealthStorage.getCookie("Location")}`;
  };

  export const miscellaneousBillReport = (params: any) => {
    return `${
      environment.ReportsSampleUrl
    }MAXHIS/MiscellaneousBillReport/MiscellaneousBillReport?FromDate=${
      params.FromDate
    }&ToDate=${params.ToDate}&locationID=${
      params.locationID
    }&LocationName=${MaxHealthStorage.getCookie(
      "Location"
    )}&User=${MaxHealthStorage.getCookie("UserName")}`;
  };

  export const opBillRegisterReport = (params: any) => {
    return `${
      environment.ReportsSampleUrl
    }MAXHIS/OP%20Bill%20Register/OPBillRegister?FromDate=${
      params.FromDate
    }&ToDate=${params.ToDate}&sortBy=${params.sortBy}&locationID=${
      params.locationID
    }&exportflag=${params.exportflag}&LocationName=${MaxHealthStorage.getCookie(
      "Location"
    )}&User=${MaxHealthStorage.getCookie("UserName")}`;
  };
  export const CashScrollReport = (params: any) => {
    return `${environment.ReportsSampleUrl}MAXHIS/Opd_Billing/CashScrollReport?Fromdate=${params.Fromdate}&Todate=${params.Todate}&Operatorid=${params.Operatorid}&LocationID=${params.LocationID}&EmployeeName=${params.EmployeeName}&TimeTakenAt=${params.TimeTakenAt}&ack=${params.ack}&IsAckByOperator=${params.IsAckByOperator}&ScrollNo=${params.ScrollNo}`;
  };
  export const SummaryReportForUtilisationReport = (params: any) => {
    return `${environment.ReportsSampleUrl}MAXHIS/Out_Patient/SummaryReportForUtilisation?MembershipNo=${params.membershipno}`;
  };
  export const PHPTracksheet = (params: any) => {
    return `${environment.ReportsSampleUrl}MAXHIS/Opd_Registration/PHPTrackSheet?BillNo=${params.BillNo}`;
  };
  export const ScrollSummaryReport = (params: any) => {
    return `${
      environment.ReportsSampleUrl
    }MAXHIS/MISReports/ScrollSummaryReport?ValueFromDate=${
      params.ValueFromDate
    }&ValueToDate=${params.ValueToDate}&SelectedLocationsId=${
      params.SelectedLocationsId
    }&user=${MaxHealthStorage.getCookie(
      "UserName"
    )}&locationID=${MaxHealthStorage.getCookie("HSPLocationId")}&exportflag=${
      params.exportflag
    }`;
  };

  export const PrintOPPrescriptionReport = (params: any) => {
    return `${environment.ReportsSampleUrl}MAXHIS/Billing/PrintOPPrescription?opbillid=${params.opbillid}&locationID=${params.locationID}`;
  };
  export const DueReceiptReport = (params: any) => {
    return `${environment.ReportsSampleUrl}MAXHIS/Billing/DueReceiptForOTBilling?receiptnumber=${params.receiptnumber}&locationID=${params.locationID}`;
  };
  export const OPDiscountReport = (params: any) => {
    return `${
      environment.ReportsSampleUrl
    }MAXHIS/MISReports/OPDiscountReport?ReportChecked=${
      params.ReportChecked
    }&ValueFromDate=${params.ValueFromDate}&ValueToDate=${
      params.ValueToDate
    }&locationID=${MaxHealthStorage.getCookie(
      "HSPLocationId"
    )}&SelectedLocationsId=${params.SelectedLocationsId}&exportflag=${
      params.exportflag
    }&User=${MaxHealthStorage.getCookie("UserName")}`;
  };
  export const OPRefundReport = (params: any) => {
    return `${
      environment.ReportsSampleUrl
    }MAXHIS/MISReports/OPRefundReport?ValueFromDate=${
      params.ValueFromDate
    }&ValueToDate=${params.ValueToDate}&SelectedLocationsId=${
      params.SelectedLocationsId
    }&exportflag=${params.exportflag}&locationID=${MaxHealthStorage.getCookie(
      "HSPLocationId"
    )}&User=${MaxHealthStorage.getCookie("UserName")}`;
  };
  export const FormSixty = (params: any) => {
    return `${environment.ReportsSampleUrl}MAXHIS/Opd_Registration/FormSixty?LocationId=${params.LocationId}&Iacode=${params.Iacode}&RegistrationNo=${params.RegistrationNo}&BillNo=${params.BillNo}`;
  };
  export const InvestigationInstruction = (params: any) => {
    return `${environment.ReportsSampleUrl}MAXHIS/Opd_Registration/InvestigationPrint?ItemName=${params.ItemName}&description=${params.description}`;
  };
  export const PostDischargeFollowUpReport = (params: any) => {
    return `${
      environment.ReportsSampleUrl
    }MAXHIS/Billing/VisitingOTBilling?Opbillid=${
      params.opbillid
    }&locationID=${MaxHealthStorage.getCookie("HSPLocationId")}&flag=${
      params.flag
    }`;
  };
  export const DetailedReport = (params: any) => {
    return `${
      environment.ReportsSampleUrl
    }MAXHIS/Opd_Registration/VisitReport?LocationId=${MaxHealthStorage.getCookie(
      "HSPLocationId"
    )}&dtpfrmdate=${params.frmdate}&dtpToDate=${params.ToDate}&txtSSN=${
      params.SSN
    }&rbDetail=${params.IsDetailReport}&cmbClinicId=${
      params.ClinicId
    }&cmbDoctorId=${params.DoctorId}&cmbReferalDocId=${
      params.ReferalDocId
    }&cmbSortOrder_Enabled=${params.SortOrderEnabled}&cmbSortOrderId=${
      params.SortOrderId
    }`;
  };
  export const SummaryReport = (params: any) => {
    return `${
      environment.ReportsSampleUrl
    }MAXHIS/Opd_Registration/VisitReport?LocationId=${MaxHealthStorage.getCookie(
      "HSPLocationId"
    )}&dtpfrmdate=${params.frmdate}&dtpToDate=${params.ToDate}&txtSSN=${
      params.SSN
    }&cmbClinicId=${params.ClinicId}&cmbDoctorId=${
      params.DoctorId
    }&cmbReferalDocId=${params.ReferalDocId}&cmbSortOrder_Enabled=${
      params.SortOrderEnabled
    }&cmbSortOrderId=${params.SortOrderId}`;
  };
  export const MiscellaneousReportMIS = (params: any) => {
    return `${
      environment.ReportsSampleUrl
    }MAXHIS/MISReports/MiscellaneousReportMIS/MiscellaneousReportMIS?FromDate=${
      params.FromDate
    }&ToDate=${params.ToDate}&ChkAllLocation=${
      params.ChkAllLocation ? 1 : 0
    }&CmbLocation=${MaxHealthStorage.getCookie(
      "HSPLocationId"
    )}&User=${MaxHealthStorage.getCookie("UserName")}`;
  };

  export const ComplexCareReport=(params:any)=>{

    return `${
      environment.ReportsSampleUrl
    }MAXHIS/Billing/ComplexcareReport/ComplexCareReport?maxid=${
      params.maxid
    }&locationID=${
      params.locationID
    }&firstname=${
      params.firstName
    }&lastname=${
      params.lastName
    }&age=${
      params.age
    }&cmbyear=${
      params.cmbyear
    }&cmbsex=${
      params.cmbsex
    }&txtregid=${
      params.regid
    }`

  }
}
