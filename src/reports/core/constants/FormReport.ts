import { environment } from "@environments/environment";
import { MaxHealthStorage } from "@shared/services/storage";

export namespace FormReport {
  export const equipmentSchedule = {
    reportName: "Equipment Schedule",
    filterForm: {
      title: "",
      type: "object",
      format: "MM/dd/YYYY",
      properties: {
        Cmb_Equip: {
          type: "dropdown",
          placeholder: "---Equipment---",
          title: "Equipment Name",
          defaultValue: "0",
          optionsModelConfig: {
            uri: `${environment.CommonApiUrl}api/lookup/getequipmentmaster`,
            fields: {
              title: "name",

              value: "id",
            },
          },
        },
        EquipFromDate: {
          type: "date",
          title: "From Date",
        },
        EquipToDate: {
          type: "date",
          title: "To Date",
        },
      },
    },
    form: {
      layout: {
        Cmb_Equip: "w-full",
      },
      actionItems: [
        {
          label: "Preview",
          type: "crystalReport",
          reportConfig: {
            reportName: "Equipment Schedule",
            reportEntity: "equipmentReport",
          },
        },
        {
          label: "Clear",
          type: "clear",
        },
      ],
    },

    layout: "single",
    resultType: "table",
    // resultActionItems: [
    //   {
    //     title: "Print",
    //   },
    //   {
    //     title: "Export",
    //   },
    // ],
  };

  export const opConsultationReport = {
    reportName: "Selection Criteria",
    filterForm: {
      title: "",
      type: "object",
      properties: {
        fromDate: {
          type: "date",
          title: "From Date",
        },
        toDate: {
          type: "date",
          title: "To Date",
        },
        location: {
          type: "dropdown",
          placeholder: "---All Location---",
          title: "Location",
        },
      },
    },
    form: {
      layout: {
        equipmentName: "w-full",
      },
      actionItems: [
        {
          label: "Perform Query",
        },
        {
          label: "Clear",
        },
      ],
    },
  };
  export const OnlinePaymentDetailReport = {
    reportName: "Online Payment Detail Report",
    filterForm: {
      title: "",
      type: "object",
      format: "MM/dd/YYYY",
      properties: {
        fromdate: {
          type: "date",
          title: "From Date",
        },
        todate: {
          type: "date",
          title: "To Date",
        },
        locationid: {
          type: "dropdown",
          placeholder: "---Location---",
          title: "Location",
          defaultValue: MaxHealthStorage.getCookie("HSPLocationId"),
          optionsModelConfig: {
            uri: `${environment.CommonApiUrl}api/lookup/getlocationmaster`,
            fields: {
              title: "name",
              value: "id",
            },
          },
        },
        RepType: {
          type: "radio",
          options: [
            { title: "OP", value: "OP" },
            { title: "PreAdmission", value: "PreAdmission" },
            { title: "Emergency", value: "Emergency" },
            { title: "IP", value: "IP" },
          ],
        },
      },
    },
    form: {
      layout: {
        locationid: "w-full",
        openScrollFor: "w-full",
      },
      actionItems: [
        {
          label: "Preview",
          type: "crystalReport",
          reportConfig: {
            reportName: "Online Payment Detail Report",
            reportEntity: "OnlinePaymentDetailReport",
          },
        },
        {
          label: "Export",
        },
        {
          label: "Clear",
          type: "clear",
        },
      ],
    },
    layout: "single",
    resultType: "table",
    resultActionItems: [
      {
        title: "Print",
      },
    ],
  };
  export const DailyCollectionReport = {
    reportName: "DailyCollectionReport",
    filterForm: {
      format: "dd/MM/YYYY",
      title: "",
      type: "object",
      properties: {
        todate: {
          type: "date",
          title: "Date",
        },
        locationID: {
          type: "dropdown",
          placeholder: "---Location---",
          title: "Location",
          questionClasses: "max-hide",
          defaultValue: MaxHealthStorage.getCookie("HSPLocationId"),
          optionsModelConfig: {
            uri: `${environment.CommonApiUrl}api/lookup/getlocationmaster`,
            fields: {
              title: "name",
              value: "id",
            },
          },
        },
      },
    },
    form: {
      layout: {
        LocationName: "w-screen",
      },
      actionItems: [
        {
          label: "Preview",
          type: "crystalReport",
          reportConfig: {
            reportName: "Daily Collection Report",
            reportEntity: "DailyCollectionReport",
          },
        },
        {
          label: "Excel",
          type: "",
        },
        {
          label: "Clear",
          type: "clear",
        },
      ],
    },

    layout: "single",
    resultType: "table",
  };
  export const DoctorSheduleReport = {
    reportName: "Doctors",
    filterForm: {
      title: "",
      type: "object",
      format: "YYYY/MM/dd",
      properties: {
        DocID: {
          type: "dropdown",
          placeholder: "---All Doctors---",
          title: "",
          defaultValue: "0",
          optionsModelConfig: {
            uri: `${
              environment.CommonApiUrl
            }api/lookup/getalldoctorname/${MaxHealthStorage.getCookie(
              "HSPLocationId"
            )}`,
            fields: {
              title: "doctorname",
              value: "doctorid",
            },
          },
        },
        datetype: {
          type: "radio",
          options: [
            { title: "Transaction Date", value: 0 },
            { title: "Appoinment Date", value: 1 },
          ],
          defaultValue: "0",
        },
        dtpStartDate: {
          type: "date",
          title: "From Date",
        },
        dtpEndDate: {
          type: "date",
          title: "To Date",
        },
      },
    },
    form: {
      layout: {
        DocID: "w-full",
        datetype: "w-full",
      },
      actionItems: [
        {
          label: "Preview",
          type: "crystalReport",
          reportConfig: {
            reportName: "Doctor Shedule",
            reportEntity: "DoctorSheduleReport",
          },
        },
        {
          label: "Clear",
          type: "clear",
        },
      ],
    },

    layout: "single",
    resultType: "table",
  };

  export const DoctorSheduleReportBySpecilialisation = {
    reportName: "Specilialisation",
    filterForm: {
      title: "",
      type: "object",
      format: "YYYY/MM/dd",
      properties: {
        Cmb_Special: {
          type: "dropdown",
          placeholder: "---Specilialisation---",
          title: "",
          defaultValue: "0",
          optionsModelConfig: {
            uri: `${environment.CommonApiUrl}api/lookup/getallspecialisationname`,
            fields: {
              value: "id",
              title: "name",
            },
          },
        },

        datetype: {
          type: "radio",
          options: [
            { title: "Transaction Date", value: "0" },
            { title: "Appoinment Date", value: "1" },
          ],
          defaultValue: "0",
        },
        dtpStartDate: {
          type: "date",
          title: "From Date",
        },
        dtpEndDate: {
          type: "date",
          title: "To Date",
        },
      },
    },
    form: {
      layout: {
        Cmb_Special: "w-full",
        datetype: "w-full",
      },
      actionItems: [
        {
          label: "Preview",
          type: "crystalReport",
          reportConfig: {
            reportName: "Doctor Shedule BySpecilialisation",
            reportEntity: "DoctorSheduleReportBySpecilialisation",
          },
        },
        {
          label: "Clear",
          type: "clear",
        },
      ],
    },

    layout: "single",
    resultType: "table",
  };

  export const doctorSchedule = {
    layout: "tabs",
    reportName: "Doctor Schedule",
    childrens: [
      { ...DoctorSheduleReport },
      { ...DoctorSheduleReportBySpecilialisation },
    ],
  };

  export const GeneralOPDReport = {
    reportName: "General OPD Scroll Report",
    filterForm: {
      title: "",
      type: "object",
      format: "MM/dd/YYYY",
      properties: {
        ValueFromDate: {
          type: "date",
          title: "From Date",
        },
        ValueToDate: {
          type: "date",
          title: "To Date",
        },
      },
    },
    form: {
      layout: {
        equipmentName: "w-full",
      },
      actionItems: [
        {
          label: "Preview",
          type: "crystalReport",
          reportConfig: {
            reportName: "General OPD Scroll Report",
            reportEntity: "GeneralOPDReport",
          },
        },
        {
          label: "Clear",
          type: "clear",
        },
      ],
    },
    layout: "single",
    resultType: "table",
  };
  export const HappyFamilyPlanAllocationReport = {
    reportName: "Happy Family Plan",
    filterForm: {
      title: "",
      type: "object",
      properties: {
        Flag: {
          type: "radio",
          options: [
            { title: "PlanName", value: "PlanName" },
            { title: "Membership", value: "Membership" },
          ],
          //defaultValue: "Transaction Date",
          conditions: [
            {
              expression: "self == 'PlanName'",
              controlKey: "planID",
              type: "show",
            },
            {
              expression: "self == 'PlanName'",
              controlKey: "Location",
              type: "hide",
            },
            {
              expression: "self == 'PlanName'",
              controlKey: "MemberShipNo",
              type: "hide",
            },
            {
              expression: "self == 'Membership'",
              controlKey: "MemberShipNo",
              type: "show",
            },
            {
              expression: "self == 'Membership'",
              controlKey: "planID",
              type: "hide",
            },
            {
              expression: "self == 'Membership'",
              controlKey: "Location",
              type: "show",
            },
          ],
        },
        planID: {
          type: "dropdown",
          placeholder: "---PlanName---",
          title: "",
          questionClasses: "max-hide",
          optionsModelConfig: {
            uri: `${environment.CommonApiUrl}api/lookup/getfamilyplanname`,
            fields: {
              title: "planname",
              value: "id",
            },
          },
        },

        Location: {
          type: "dropdown",
          placeholder: "---Location---",
          title: "Location",
          questionClasses: "max-hide",
          defaultValue: MaxHealthStorage.getCookie("HSPLocationId"),
          optionsModelConfig: {
            uri: `${environment.CommonApiUrl}api/lookup/getlocationmaster`,
            fields: {
              title: "name",
              value: "id",
            },
          },
        },
        MemberShipNo: {
          type: "dropdown",
          placeholder: "---Membership---",
          title: "",
          questionClasses: "max-hide",
          optionsModelConfig: {
            uri: `${
              environment.CommonApiUrl
            }api/lookup/getmembershipnumberforreport/${MaxHealthStorage.getCookie(
              "HSPLocationId"
            )}`,
            fields: {
              title: "membershipno",
              value: "membershipno",
            },
          },
        },
      },
    },
    form: {
      layout: {
        Flag: "w-full",
        planID: "w-full",
        Location: "w-full",
        MemberShipNo: "w-full",
      },
      actionItems: [
        {
          label: "Preview",
          type: "crystalReport",
          reportConfig: {
            reportName: "Happy FamilyPlan Allocation Report",
            reportEntity: "HappyFamilyPlanAllocationReport",
          },
        },
        {
          label: "Clear",
          type: "clear",
        },
      ],
    },

    layout: "single",
    resultType: "table",
  };
  export const HappyFamilyPlanUtilizationReport = {
    reportName: "Happy Family Utilization Report Summary",
    filterForm: {
      title: "",
      type: "object",
      properties: {
        MemberShipNo: {
          type: "dropdown",
          placeholder: "---Membership---",
          title: "Membership",
          optionsModelConfig: {
            uri: `${
              environment.CommonApiUrl
            }api/lookup/getmembershipnumberforreport/${7}`,
            fields: {
              title: "membershipno",
              value: "membershipno",
            },
          },
        },
      },
    },
    form: {
      layout: {
        MemberShipNo: "w-screen",
      },
      actionItems: [
        {
          label: "Preview",
          type: "crystalReport",
          reportConfig: {
            reportName: "Happy Family Plan Utilisation",
            reportEntity: "HappyFamilyPlanUtilizationReport",
          },
        },
        {
          label: "Clear",
          type: "clear",
        },
      ],
    },

    layout: "single",
    resultType: "table",
  };

  export const SummaryReportForUtilisationReport = {
    reportName: "Detailed Happy Family Utilization Report Summary",
    filterForm: {
      title: "",
      type: "object",
      properties: {
        membershipno: {
          type: "dropdown",
          placeholder: "---Membership---",
          title: "Membership",
          optionsModelConfig: {
            uri: `${
              environment.CommonApiUrl
            }api/lookup/getmembershipnumberforreport/${7}`,
            fields: {
              title: "membershipno",
              value: "membershipno",
            },
          },
        },
      },
    },
    form: {
      layout: {
        membershipno: "w-screen",
      },
      actionItems: [
        {
          label: "Preview",
          type: "crystalReport",
          reportConfig: {
            reportName: "Detailed Happy Family Utilization Report Summary",
            reportEntity: "SummaryReportForUtilisationReport",
          },
        },
        {
          label: "Clear",
          type: "clear",
        },
      ],
    },
    layout: "single",
    resultType: "table",
  };

  export const CRPExpiredPatientDetailReport = {
    reportName: "Expired Deposits",
    filterForm: {
      title: "",
      type: "object",
      format: "MM/dd/YYYY",
      properties: {
        fromdate: {
          type: "date",
          title: "From Date",
        },
        todate: {
          type: "date",
          title: "To Date",
        },
        // location: {
        //   type: "dropdown",
        //   placeholder: "---Location---",
        //   title: "Location",
        // },
        locationid: {
          type: "dropdown",
          placeholder: "---Location---",
          title: "Location",
          optionsModelConfig: {
            uri: `${environment.CommonApiUrl}api/lookup/getlocationmaster`,
            fields: {
              title: "name",
              value: "id",
            },
          },
        },
      },
    },
    form: {
      layout: {
        location: "w-full",
        locationid: "w-full",
      },
      actionItems: [
        {
          label: "Preview",
          type: "crystalReport",
          reportConfig: {
            reportName: "Expired Patient Report",
            reportEntity: "CRPExpiredPatientDetailReport",
          },
        },
        {
          label: "Clear",
          type: "clear",
        },
      ],
    },
    layout: "single",
    resultType: "table",
    resultActionItems: [
      {
        title: "Print",
      },
      {
        title: "Export",
      },
    ],
  };
  export const OpenScrollReport = {
    reportName: "Open Scroll Report",
    filterForm: {
      title: "",
      type: "object",
      format: "MM/dd/YYYY",
      properties: {
        dtpFromDate: {
          type: "date",
          title: "From Date",
        },
        dtpToDate: {
          type: "date",
          title: "To Date",
        },
        cmbLocation: {
          type: "dropdown",
          placeholder: "---Location---",
          title: "Location",
          defaultValue: MaxHealthStorage.getCookie("HSPLocationId"),
          optionsModelConfig: {
            uri: `${environment.CommonApiUrl}api/lookup/getlocationmaster`,
            fields: {
              title: "name",
              value: "id",
            },
          },
        },
        cmbopenscrolltype: {
          type: "dropdown",
          placeholder: "---Open Scroll---",
          title: "Open Scroll For",
          defaultValue: "0",
          optionsModelConfig: {
            uri: `${environment.CommonApiUrl}api/lookup/getopenscrolldata/0`,
            fields: {
              title: "scrollName",
              value: "flag",
            },
          },
        },
      },
    },
    form: {
      layout: {
        cmbLocation: "w-full",
        cmbopenscrolltype: "w-full",
      },
      actionItems: [
        {
          label: "Preview",
          type: "crystalReport",
          reportConfig: {
            reportName: "Open Scroll Report",
            reportEntity: "OpenScrollReport",
          },
        },
        {
          label: "Export",
        },
        {
          label: "Clear",
          type: "clear",
        },
      ],
    },
    layout: "single",
    resultType: "table",
    resultActionItems: [
      {
        title: "Print",
      },
    ],
  };

  export const CROPItemPriceModifiedReport = {
    reportName: "Op Item PriceModification Report",
    filterForm: {
      title: "",
      type: "object",
      format: "MM/dd/YYYY",
      properties: {
        dtpfrom: {
          type: "date",
          title: "From Date",
        },
        dtpto: {
          type: "date",
          title: "To Date",
        },
        locationid: {
          type: "dropdown",
          placeholder: "---Location---",
          title: "Location",
          defaultValue: MaxHealthStorage.getCookie("HSPLocationId"),
          optionsModelConfig: {
            uri: `${environment.CommonApiUrl}api/lookup/getlocationmaster`,
            fields: {
              title: "name",
              value: "id",
            },
          },
        },
      },
    },
    form: {
      layout: {
        locationid: "w-full",
        openScrollFor: "w-full",
      },
      actionItems: [
        {
          label: "Preview",
          type: "crystalReport",
          reportConfig: {
            reportName: "Op Item PriceModification Report",
            reportEntity: "CROPItemPriceModifiedReport",
          },
        },
        {
          label: "Export",
        },
        {
          label: "Clear",
          type: "clear",
        },
      ],
    },
    layout: "single",
    resultType: "table",
    resultActionItems: [
      {
        title: "Print",
      },
    ],
  };
  export const ServiceTaxReport = {
    reportName: "Service Tax Report",
    filterForm: {
      title: "",
      type: "object",
      format: "MM/dd/YYYY",
      properties: {
        dtpFromDate: {
          type: "date",
          title: "FromDate",
        },
        dtpToDate: {
          type: "date",
          title: "ToDate",
        },
        // location: {
        //   type: "dropdown",
        //   placeholder: "---Location---",
        //   title: "Location",
        // },
        locationid: {
          type: "dropdown",
          placeholder: "---Location---",
          title: "Location",
          //defaultValue: MaxHealthStorage.getCookie("HSPLocationId"),
          optionsModelConfig: {
            uri: `${environment.CommonApiUrl}api/lookup/getlocationmaster`,
            fields: {
              title: "name",
              value: "id",
            },
          },
        },
        rbIP: {
          type: "radio",
          title: "Report Type",
          required: "true",
          options: [
            { title: "IP", value: "true" },
            { title: "OP", value: "false" },
          ],
          defaultValue: "0",
        },
      },
    },
    form: {
      layout: {
        locationid: "w-full",
        openScrollFor: "w-full",
      },
      actionItems: [
        {
          label: "Preview",
          type: "crystalReport",
          reportConfig: {
            reportName: "Service Tax Report",
            reportEntity: "ServiceTaxReportDataReports",
          },
        },
        {
          label: "Export",
        },
        {
          label: "Clear",
          type: "clear",
        },
      ],
    },
    layout: "single",
    resultType: "table",
    resultActionItems: [
      {
        title: "Print",
      },
    ],
  };
  export const freeOutPatientReport = {
    reportName: "Free Out Patient Report",
    filterForm: {
      title: "",
      type: "object",
      format: "MM/dd/YYYY",
      properties: {
        FromDate: {
          type: "date",
          title: "From Date",
        },
        ToDate: {
          type: "date",
          title: "To Date",
        },
       
        locationID: {
          type: "dropdown",
          placeholder: "---Location---",
          title: "Location",
          optionsModelConfig: {
            uri: `${environment.CommonApiUrl}api/lookup/getlocationmaster`,
            fields: {
              title: "name",
              value: "id",
            },
          },
        },
      },
    },
    form: {
      layout: {
        location: "w-full",
        locationID: "w-full",
      },
      actionItems: [
        {
          label: "Preview",
          type: "crystalReport",
          reportConfig: {
            reportName: "Free Out Patient Report",
            reportEntity: "freeOutPatientReport",
          },
        },
        {
          label: "Clear",
          type: "clear",
        },
      ],
    },
    layout: "single",
    resultType: "table",
    resultActionItems: [
      {
        title: "Print",
      },
      {
        title: "Export",
      },
    ],
  };

  export const miscellaneousBillingReportNew = {
    reportName: "Miscellaneous Bills Report (OP) New",
    filterForm: {
      title: "",
      type: "object",
      format: "MM/dd/YYYY",
      properties: {
        FromDate: {
          type: "date",
          title: "From Date",
        },
        ToDate: {
          type: "date",
          title: "To Date",
        },
       
        locationID: {
          type: "dropdown",
          placeholder: "---Location---",
          title: "Location",
          optionsModelConfig: {
            uri: `${environment.CommonApiUrl}api/lookup/getlocationmaster`,
            fields: {
              title: "name",
              value: "id",
            },
          },
        },
      },
    },
    form: {
      layout: {
        location: "w-full",
        locationID: "w-full",
      },
      actionItems: [
        {
          label: "Preview",
          type: "crystalReport",
          reportConfig: {
            reportName: "Miscellaneous Bills Report (OP) New",
            reportEntity: "miscellaneousBillReport",
          },
        },
        {
          label: "Clear",
          type: "clear",
        },
      ],
    },
    layout: "single",
    resultType: "table",
    resultActionItems: [
      {
        title: "Print",
      },
      {
        title: "Export",
      },
    ],
  };

  export const opBillRegister = {
    reportName: "OP Bill Register",
    filterForm: {
      title: "",
      type: "object",
      format: "MM/dd/YYYY",
      properties: {
        FromDate: {
          type: "date",
          title: "From Date",
        },
        ToDate: {
          type: "date",
          title: "To Date",
        },
       
        locationID: {
          type: "dropdown",
          placeholder: "---Location---",
          title: "Location",
          optionsModelConfig: {
            uri: `${environment.CommonApiUrl}api/lookup/getlocationmaster`,
            fields: {
              title: "name",
              value: "id",
            },
          },
        },

        sortBy: {
          type: "radio",
          options: [
            
            { title: "Summary", value: 1 },
            { title: "Details", value: 2 },
          ],
          defaultValue: "Summary",
          
        },
      },
    },
    form: {
      layout: {
        location: "w-full",
        locationID: "w-full",
      },
      actionItems: [
        {
          label: "Preview",
          type: "crystalReport",
          reportConfig: {
            reportName: "OP Bill Register",
            reportEntity: "opBillRegisterReport",
          },
        },
        {
          label: "Clear",
          type: "clear",
        },
      ],
    },
    layout: "single",
    resultType: "table",
    resultActionItems: [
      {
        title: "Print",
      },
      {
        title: "Export",
      },
    ],
  };

  export const opRefundReport = {
    reportName: "OP Refund Report",
    filterForm: {
      title: "",
      type: "object",
      format: "MM/dd/YYYY",
      properties: {
        ValueFromDate: {
          type: "date",
          title: "From Date",
        },
        ValueToDate: {
          type: "date",
          title: "To Date",
        },
       
        SelectedLocationsId: {
          type: "dropdown",
          placeholder: "--- Select Organization---",
          title: "Organization",
          optionsModelConfig: {
            uri: `${environment.CommonApiUrl}api/lookup/locationlookup/0`,
            fields: {
              title: "address3",
              value: "id",
            },
          },
        },
      },
    },
    form: {
      layout: {
        location: "w-full",
        SelectedLocationsId: "w-full",
      },
      actionItems: [
        {
          label: "Preview",
          type: "crystalReport",
          reportConfig: {
            reportName: "OP Refund Report",
            reportEntity: "OPRefundReport",
          },
        },
        {
          label: "Clear",
          type: "clear",
        },
      ],
    },
    
    resultActionItems: [
      {
        title: "Print",
      },
      {
        title: "Export",
      },
    ],
    layout: "single",
    resultType: "table",
  };

  export const discountReport = {
    reportName: "OP Discount Report",
    filterForm: {
      title: "",
      type: "object",
      format: "MM/dd/YYYY",
      properties: {
        ReportChecked: {
          type: "radio",
          options: [
            
            { title: "Summary", value: 1 },
            { title: "Details", value: 2 },
          ],
          defaultValue: "Summary",
          
        },

        
      
        ValueFromDate: {
          type: "date",
          title: "From Date",
        },
        ValueToDate: {
          type: "date",
          title: "To Date",
        },
       
        SelectedLocationsId: {
          type: "dropdown",
          placeholder: "--- Select Organization---",
          title: "Organization",
          optionsModelConfig: {
            uri: `${environment.CommonApiUrl}api/lookup/locationlookup/0`,
            fields: {
              title: "address3",
              value: "id",
            },
          },
        },
      },
    },
    form: {
      layout: {
        location: "w-full",
        SelectedLocationsId: "w-full",
      },
      actionItems: [
        {
          label: "Preview",
          type: "crystalReport",
          reportConfig: {
            reportName: "OP Discount Report",
            reportEntity: "opDiscountReport",
          },
        },
        {
          label: "Clear",
          type: "clear",
        },
      ],
    },
    
    resultActionItems: [
      {
        title: "Print",
      },
      {
        title: "Export",
      },
    ],
    layout: "single",
    resultType: "table",
  };
}
