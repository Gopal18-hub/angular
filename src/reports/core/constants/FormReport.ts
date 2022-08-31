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
        equipmentName: {
          type: "dropdown",
          placeholder: "---Equipment---",
          title: "Equipment Name",
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
        equipmentName: "w-full",
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

  // export const expiredPatientReport = {
  //   reportName: "Selection Criteria",
  //   filterForm: {
  //     title: "",
  //     type: "object",
  //     properties: {

  //       fromDate: {
  //         type: "date",
  //         title: "From Date",
  //       },
  //       toDate: {
  //         type: "date",
  //         title: "To Date",
  //       },
  //       location: {
  //         type: "dropdown",
  //         placeholder: "---Location---",
  //         title: "Location",
  //       },
  //     },
  //   },
  //   form: {
  //     layout: {
  //       location: "w-full",
  //     },
  //     actionItems: [
  //       {
  //         label: "Preview",
  //       },
  //       {
  //         label: "Clear",
  //       },
  //     ],
  //   },

  //   layout: "single",
  //   resultType: "table",
  //   resultActionItems: [
  //     {
  //       title: "Print",
  //     },
  //     {
  //       title: "Export",
  //     },
  //   ],
  // };

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
          optionsModelConfig: {
            uri: `${
              environment.CommonApiUrl
            }api/lookup/getalldoctorname/${MaxHealthStorage.getCookie(
              "HSPLocationId"
            )}`,
            fields: {
              title: "doctorname",
              value: "doctorname",
            },
          },
        },
        datetype: {
          type: "radio",
          options: [
            { title: "Transaction Date", value: 0 },
            { title: "Appoinment Date", value: 1 },
          ],
          defaultValue: "Transaction Date",
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
          optionsModelConfig: {
            uri: `${environment.CommonApiUrl}api/lookup/getallspecialisationname`,
            fields: {
              title: "name",
              value: "id",
            },
          },
        },
        datetype: {
          type: "radio",
          options: [
            { title: "Transaction Date", value: 0 },
            { title: "Appoinment Date", value: 1 },
          ],
          defaultValue: "transactionDate",
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
          defaultValue: "Transaction Date",
          conditions: [
            {
              expression: "self == 'PlanName'",
              controlKey: "planID",
              type: "show",
            },
            {
              expression: "self == 'PlanName'",
              controlKey: "Location",
              type: "show",
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
              type: "hide",
            },
          ],
        },
        planID: {
          type: "dropdown",
          placeholder: "---PlanName---",
          title: "",
          questionClasses: "hidden",
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
          questionClasses: "hidden",
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
          questionClasses: "hidden",
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

    layout: "tab",
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
    layout: "tab",
    resultType: "table",
  };

  export const expiredDeposits = {
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

  // export const onlineDepositReport = {

  //   filterForm: {
  //     title: "",
  //     type: "object",
  //     properties: {

  //       fromDate: {
  //         type: "date",
  //         title: "From Date",
  //       },
  //       toDate: {
  //         type: "date",
  //         title: "To Date",
  //       },
  //       location: {
  //         type: "dropdown",
  //         placeholder: "---Location---",
  //         title: "Location",
  //       },
  //     },
  //   },

  //   form: {
  //     layout: {
  //       location: "w-full",
  //     },
  //     actionItems: [
  //       {
  //         label:"Search"
  //       },
  //       {
  //         label: "Preview",
  //       },
  //       {
  //         label: "Clear",
  //       },

  //     ],
  //   },

  //   layout: "single",
  //   resultType: "table",
  //   resultActionItems: [
  //     {
  //       title: "Print",
  //     },
  //     {
  //       title: "Export",
  //     },
  //   ],
  // };

  // export const config = {
  //   clickedRows: true,
  //   clickSelection: "multiple",
  //   dateformat: "dd/MM/yyyy",
  //   selectBox: true,
  //   displayedColumns: [
  //     "maxId",
  //     "emailId",
  //     "mobileNo",
  //     "depositType",
  //     "amount",
  //     "stationName",
  //     "depositStatus",
  //     "date",
  //     "depositSource",
  //     "initdepdatetime",
  //     "initdepResponsetime",
  //     "payOrpayCheck",
  //     "payRefNo",
  //     "payBankRefNo",
  //     "HisUpdateDatetime",
  //     "HisDepositID",
  //     "receiptNo"
  //   ],
  //   columnsInfo: {
  //     maxId: {
  //       title: "Max ID",
  //       type: "string",
  //     },
  //     emailId: {
  //       title: "Email ID",
  //       type: "string",
  //     },
  //     mobileNo: {
  //       title: "Mobile No",
  //       type: "number",
  //     },
  //     depositType: {
  //       title: "Deposit Type",
  //       type: "string",

  //     },
  //     amount: {
  //       title: "Amount",
  //       type: "number",
  //     },
  //     stationName: {
  //       title: "Station Name",
  //       type: "string",
  //     },
  //     depositStatus: {
  //       title: "Deposit Status",
  //       type: "string",

  //     },
  //     date: {
  //       title: "Date",
  //       type: "date",
  //     },
  //     depositSource:{
  //       title: "Deposit Source",
  //       type: "string",
  //     },

  //     initdepdatetime: {
  //       title: "Init Dep Date Time",
  //       type: "date",
  //     },
  //     initdepResponsetime: {
  //       title: "Init Deposit Response Time",
  //       type: "date",
  //     },
  //     payOrpayCheck: {
  //       title: "Pay Or Pay Check Date",
  //       type: "string",
  //     },
  //     payRefNo: {
  //       title: "Pay Reference No",
  //       type: "number",
  //     },
  //     payBankRefNo: {
  //       title: "Pay Bank Reference No",
  //       type: "number",
  //     },
  //     HisUpdateDatetime: {
  //       title: "HIS Update Date Time",
  //       type: "date",
  //     },
  //     HisDepositID: {
  //       title: "HIS Deposit ID",
  //       type: "string",
  //     },
  //     receiptNo: {
  //       title: "Receipt No",
  //       type: "number",
  //     },
  //   },
  // }
}
