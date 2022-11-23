import { environment } from "@environments/environment";
import { MaxHealthStorage } from "@shared/services/storage";
import * as moment from "moment";
import { Reportconstants } from "../../../reports/core/constants/reportconstant";

export namespace FormReport {
  export const equipmentSchedule = {
    reportName: "Equipment Schedule",
    filterForm: {
      title: "",
      type: "object",
      defaultValue: moment().format("DD/MM/YYYY"),
      properties: {
        equipmentName: {
          type: "hidden",
        },

        Cmb_Equip: {
          // type: "dropdown",

          type: "autocomplete",

          placeholder: "---Equipment---",

          title: "Equipment Name",
          required: true,
          // defaultValue: "0",

          optionsModelConfig: {
            uri: `${environment.CommonApiUrl}api/lookup/getequipmentmaster`,

            fields: {
              title: "name",

              value: "id",
              filter: "hsplocationid",
            },
          },

          conditions: [
            {
              expression: "self.title",

              controlKey: "equipmentName",

              type: "value",
            },
          ],
        },
        EquipFromDate: {
          type: "date",
          title: "From Date",
          defaultValue: new Date(),
          maximum: new Date(),
          required: true,
          conditions: [
            {
              expression: "self",
              controlKey: "EquipToDate",
              type: "dateMin",
            },
            {
              expression: "self",
              controlKey: "EquipToDate",
              type: "dateMaxWithDays",
              days: 30,
            },
          ],
        },
        EquipToDate: {
          type: "date",
          title: "To Date",
          defaultValue: new Date(),
          maximum: new Date(),
          required: true,
          conditions: [
            {
              expression: "self",
              controlKey: "EquipFromDate",
              type: "dateMax",
            },
            {
              expression: "self",
              controlKey: "EquipFromDate",
              // type: "dateMinWithDays",
              // days: 30,
            },
          ],
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
            reportName: "equipmentReport",
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
          defaultValue: new Date(),
        },
        todate: {
          type: "date",
          title: "To Date",
          defaultValue: new Date(),
        },
        locationid: {
          type: "autocomplete",
          placeholder: "---Location---",
          title: "Location",
          required: "true",
          // defaultValue: MaxHealthStorage.getCookie("HSPLocationId"),
          optionsModelConfig: {
            uri: `${environment.CommonApiUrl}api/lookup/getlocationmaster`,
            fields: {
              title: "name",
              value: "id",
            },
          },
        },
        RepType: {
          title: "Report Type",
          type: "radio",
          defaultValue: "1",
          options: [
            { title: "OP", value: "1" },
            { title: "PreAdmission", value: "2" },
            { title: "Emergency", value: "3" },
            { title: "IP", value: "4" },
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
          type: "export",
          reportEntity: "OnlinePaymentDetailReport",
          fileName: "Online Payment Detail Report.xls",
          contentType: "application/vnd.ms-excel",
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
      title: "",
      type: "object",
      defaultValue: moment().format("MM/DD/YYYY"),
      properties: {
        FromDate: {
          type: "date",
          title: "Date",
          defaultValue: new Date(),
        },
        locationID: {
          type: "autocomplete",
          placeholder: "---Location---",
          title: "Location",
          required: true,
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
        locationID: "w-full",
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
          type: "export",
          reportEntity: "DailyCollectionReport",
          fileName: "Daily Collection Report.xls",
          contentType: "application/vnd.ms-excel",
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
  export const ScrollSummaryReport = {
    reportName: "Scroll Summary Report",
    filterForm: {
      title: "",
      type: "object",
      format: "YYYY/dd/MM",
      properties: {
        ValueFromDate: {
          type: "date",
          title: "From Date",
          required: true,
          defaultValue: new Date(),
        },
        ValueToDate: {
          type: "date",
          title: "To Date",
          required: true,
          defaultValue: new Date(),
        },
        SelectedLocationsId: {
          type: "autocomplete",
          placeholder: "---Select Organization---",
          title: "Organization",
          required: true,
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
        SelectedLocationsId: "w-full",
      },
      actionItems: [
        {
          label: "Preview",
          type: "crystalReport",
          reportConfig: {
            reportName: "Scroll Summary Report",
            reportEntity: "ScrollSummaryReport",
          },
        },
        {
          label: "Export",
          type: "export",
          reportEntity: "ScrollSummaryReport",
          fileName: "Scroll Summary Report.xls",
          contentType: "application/vnd.ms-excel",
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
  export const DoctorSheduleReport = {
    reportName: "Doctors",
    filterForm: {
      title: "",
      type: "object",
      //format: "YYYY/MM/dd",
      defaultValue: moment().format("DD/MM/YYYY"),
      properties: {
        DocID: {
          type: "autocomplete",
          placeholder: "---All Doctors---",
          title: "",
          defaultValue: { title: "", value: 0 },
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
            { title: "Transaction Date", value: "0" },
            { title: "Appoinment Date", value: "1" },
          ],
          defaultValue: "0",
        },
        dtpStartDate: {
          type: "date",
          title: "From Date",
          defaultValue: new Date(),
          maximum: new Date(),
          conditions: [
            {
              expression: "self",
              controlKey: "dtpEndDate",
              type: "dateMin",
            },
            {
              expression: "self",
              controlKey: "dtpEndDate",
              type: "dateMaxWithDays",
              days: 30,
            },
          ],
        },
        dtpEndDate: {
          type: "date",
          title: "To Date",
          defaultValue: new Date(),
          maximum: new Date(),
          conditions: [
            {
              expression: "self",
              controlKey: "dtpStartDate",
              type: "dateMax",
            },
            {
              expression: "self",
              controlKey: "dtpStartDate",
              type: "dateMinWithDays",
              days: 30,
            },
          ],
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
            reportName: "Doctor Schedule",
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
    reportName: "Specialisation",
    filterForm: {
      title: "",
      type: "object",
      properties: {
        specilizationName: {
          type: "hidden",
          //defaultValue: "specilizationName",
        },
        Cmb_Special: {
          type: "autocomplete",
          placeholder: "---All Specialisation---",
          title: "",
          defaultValue: "0",
          optionsModelConfig: {
            uri: `${environment.CommonApiUrl}api/lookup/getallspecialisationname`,
            fields: {
              value: "id",
              title: "name",
            },
          },
          conditions: [
            {
              expression: "self.title",
              controlKey: "specilizationName",
              type: "value",
            },
          ],
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
          defaultValue: new Date(),
          maximum: new Date(),
          conditions: [
            {
              expression: "self",
              controlKey: "dtpEndDate",
              type: "dateMin",
            },
            {
              expression: "self",
              controlKey: "dtpEndDate",
              type: "dateMaxWithDays",
              days: 30,
            },
          ],
        },
        dtpEndDate: {
          type: "date",
          title: "To Date",
          defaultValue: new Date(),
          maximum: new Date(),
          conditions: [
            {
              expression: "self",
              controlKey: "dtpStartDate",
              type: "dateMax",
            },
            {
              expression: "self",
              controlKey: "dtpStartDate",
              type: "dateMinWithDays",
              days: 30,
            },
          ],
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
            reportName: "Doctor Schedule By Specialisation",
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
      defaultValue: moment().format("DD/MM/YYYY"),
      properties: {
        ValueFromDate: {
          type: "date",
          title: "From Date",
          defaultValue: new Date(),
          maximum: new Date(),
          conditions: [
            {
              expression: "self",
              controlKey: "ValueToDate",
              type: "dateMin",
            },
            {
              expression: "self",
              controlKey: "ValueToDate",
              type: "dateMaxWithDays",
              days: 30,
            },
          ],
        },
        ValueToDate: {
          type: "date",
          title: "To Date",
          defaultValue: new Date(),
          maximum: new Date(),
          conditions: [
            {
              expression: "self",
              controlKey: "ValueFromDate",
              type: "dateMax",
            },
            {
              expression: "self",
              controlKey: "ValueFromDate",
              // type: "dateMinWithDays",
              // days: 30,
            },
          ],
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
    reportName: "Happy Family Plan Allocation",
    filterForm: {
      title: "",
      type: "object",
      properties: {
        Flag: {
          type: "radio",
          options: [
            { title: "Plan Name", value: "Plan Name" },
            { title: "Membership No", value: "Membership No" },
          ],
          required: true,
          defaultValue: "Plan Name",
          conditions: [
            {
              expression: "self == 'Plan Name'",
              controlKey: "planID",
              type: "show",
            },
            {
              expression: "self == 'Plan Name'",
              controlKey: "planID",
              type: "required",
            },
            {
              expression: "self == 'Plan Name'",
              controlKey: "Location",
              type: "hide",
            },
            {
              expression: "self == 'Plan Name'",
              controlKey: "MemberShipNo",
              type: "hide",
            },
            {
              expression: "self == 'Membership No'",
              controlKey: "MemberShipNo",
              type: "show",
            },
            {
              expression: "self == 'Membership No'",
              controlKey: "planID",
              type: "hide",
            },
            {
              expression: "self == 'Membership No'",
              controlKey: "Location",
              type: "show",
            },
            {
              expression: "self == 'Membership No'",
              controlKey: "Location",
              type: "required",
            },
            {
              expression: "self == 'Membership No'",
              controlKey: "MemberShipNo",
              type: "required",
            },
          ],
        },
        planID: {
          type: "autocomplete",
          placeholder: "---Plan Name---",
          title: "",
          required: false,
          questionClasses: "max-hide",

          optionsModelConfig: {
            uri: `${environment.CommonApiUrl}api/lookup/getfamilyplanname`,
            fields: {
              title: "planname",
              value: "id",
            },
          },
          defaultValue: "",
        },

        Location: {
          type: "autocomplete",
          placeholder: "---Location---",
          title: "Location",
          required: false,
          questionClasses: "max-hide",
          defaultValue: {
            title: MaxHealthStorage.getCookie("Location"),
            value: MaxHealthStorage.getCookie("HSPLocationId"),
          },
          optionsModelConfig: {
            uri: `${environment.CommonApiUrl}api/lookup/getlocationmaster`,
            fields: {
              title: "name",
              value: "id",
            },
          },
        },
        MemberShipNo: {
          type: "autocomplete",
          placeholder: "---Membership---",
          title: "",
          required: false,
          questionClasses: "max-hide",
          optionsModelConfig: {
            uri: `${
              environment.CommonApiUrl
            }api/lookup/getmembershipnumberforreport/${MaxHealthStorage.getCookie(
              "HSPLocationId"
            )}`,
            fields: {
              title: "membershipno",
              value: "membershipno".trim(),
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
            reportName: "Happy Family Plan Allocation Report",
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
          type: "autocomplete",
          placeholder: "---Membership---",
          title: "Membership",
          required: true,
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
          type: "autocomplete",
          placeholder: "---Membership---",
          title: "Membership",
          required: true,
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
    reportName: "Expired Patient Report",
    filterForm: {
      title: "",
      type: "object",
      properties: {
        LocationName: {
          type: "hidden",
        },
        dtpfromdate: {
          type: "date",
          title: "From Date",
          defaultValue: new Date(),
          maximum: new Date(),
          conditions: [
            {
              expression: "self",
              controlKey: "dtptodate",
              type: "dateMin",
            },
          ],
        },
        dtptodate: {
          type: "date",
          title: "To Date",
          defaultValue: new Date(),
          maximum: new Date(),
          conditions: [
            {
              expression: "self",
              controlKey: "dtpfromdate",
              type: "dateMax",
            },
          ],
        },
        locationid: {
          type: "autocomplete",
          placeholder: "---Location---",
          title: "Location",
          required: true,
          optionsModelConfig: {
            uri: `${environment.CommonApiUrl}api/lookup/getlocationmaster`,
            fields: {
              title: "name",
              value: "id",
            },
          },
          conditions: [
            {
              expression: "self.title",
              controlKey: "LocationName",
              type: "value",
            },
          ],
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
          defaultValue: new Date().toISOString().slice(0, 10),
        },
        dtpToDate: {
          type: "date",
          title: "To Date",
          defaultValue: new Date().toISOString().slice(0, 10),
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
          type: "export",
          reportEntity: "OpenScrollReport",
          fileName: "Open Scroll Report.xls",
          contentType: "application/vnd.ms-excel",
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
          defaultValue: new Date().toISOString().slice(0, 10),
        },
        dtpto: {
          type: "date",
          title: "To Date",
          defaultValue: new Date().toISOString().slice(0, 10),
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
          type: "export",
          reportEntity: "CROPItemPriceModifiedReport",
          fileName: "Op Item PriceModification Report.xls",
          contenType: "application/vnd.ms-excel",
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
  export const ServiceTaxReportData = {
    reportName: "Service Tax Report",
    filterForm: {
      title: "",
      type: "object",
      defaultValue: moment().format("DD/MM/YYYY"),
      properties: {
        dtpFromDate: {
          type: "date",
          title: "FromDate",
          defaultValue: new Date().toISOString().slice(0, 10),
        },
        dtpToDate: {
          type: "date",
          title: "ToDate",
          defaultValue: new Date().toISOString().slice(0, 10),
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
          options: [
            { title: "IP", value: true },
            { title: "OP", value: false },
          ],
          defaultValue: true,
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
            reportEntity: "ServiceTaxReportData",
          },
        },
        {
          label: "Export",
          type: "export",
          reportEntity: "ServiceTaxReportData",
          fileName: "Service Tax Report.xls",
          contentType: "application/vnd.ms-excel",
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
      defaultValue: moment().format("DD/MM/YYYY"),
      properties: {
        locationName: {
          type: "hidden",
        },
        FromDate: {
          type: "date",
          title: "From Date",
          defaultValue: new Date(),
          maximum: new Date(),
          required: true,
          conditions: [
            {
              expression: "self",
              controlKey: "ToDate",
              type: "dateMin",
            },
            {
              expression: "self",
              controlKey: "ToDate",
              type: "dateMaxWithDays",
              days: 30,
            },
          ],
        },
        ToDate: {
          type: "date",
          title: "To Date",
          defaultValue: new Date(),
          maximum: new Date(),
          required: true,
          conditions: [
            {
              expression: "self",
              controlKey: "FromDate",
              type: "dateMax",
            },
            {
              expression: "self",
              controlKey: "FromDate",
              // type: "dateMinWithDays",
              // days: 30,
            },
          ],
        },

        locationID: {
          type: "dropdown",
          placeholder: "---Location---",
          title: "Location",
          required: true,
          optionsModelConfig: {
            uri: `${environment.CommonApiUrl}api/lookup/getlocationmaster`,
            fields: {
              title: "name",
              value: "id",
            },
          },
          conditions: [
            {
              expression: "self.title",

              controlKey: "locationName",

              type: "value",
            },
          ],
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
      defaultValue: moment().format("DD/MM/YYYY"),
      properties: {
        locationName: {
          type: "hidden",
        },
        FromDate: {
          type: "date",
          title: "From Date",
          defaultValue: new Date(),
          maximum: new Date(),
          required: true,
          conditions: [
            {
              expression: "self",
              controlKey: "ToDate",
              type: "dateMin",
            },
            {
              expression: "self",
              controlKey: "ToDate",
              type: "dateMaxWithDays",
              days: 30,
            },
          ],
        },
        ToDate: {
          type: "date",
          title: "To Date",
          defaultValue: new Date(),
          maximum: new Date(),
          required: true,
          conditions: [
            {
              expression: "self",
              controlKey: "FromDate",
              type: "dateMax",
            },
            {
              expression: "self",
              controlKey: "FromDate",
              // type: "dateMinWithDays",
              // days: 30,
            },
          ],
        },

        locationID: {
          type: "dropdown",
          placeholder: "---Location---",
          title: "Location",
          required: true,
          optionsModelConfig: {
            uri: `${environment.CommonApiUrl}api/lookup/getlocationmaster`,
            fields: {
              title: "name",
              value: "id",
            },
          },
          conditions: [
            {
              expression: "self.title",

              controlKey: "locationName",

              type: "value",
            },
          ],
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
      defaultValue: moment().format("DD/MM/YYYY"),
      properties: {
        locationName: {
          type: "hidden",
        },
        FromDate: {
          type: "date",
          title: "From Date",
          defaultValue: new Date(),
          maximum: new Date(),
          required: true,
          conditions: [
            {
              expression: "self",
              controlKey: "ToDate",
              type: "dateMin",
            },
            {
              expression: "self",
              controlKey: "ToDate",
              type: "dateMaxWithDays",
              days: 30,
            },
          ],
        },
        ToDate: {
          type: "date",
          title: "To Date",
          defaultValue: new Date(),
          maximum: new Date(),
          required: true,
          conditions: [
            {
              expression: "self",
              controlKey: "FromDate",
              type: "dateMax",
            },
            {
              expression: "self",
              controlKey: "FromDate",
              // type: "dateMinWithDays",
              // days: 30,
            },
          ],
        },

        locationID: {
          type: "autocomplete",
          placeholder: "---Location---",
          title: "Location",
          required: true,
          optionsModelConfig: {
            uri: `${environment.CommonApiUrl}api/lookup/getlocationmaster`,
            fields: {
              title: "name",
              value: "id",
            },
          },
          conditions: [
            {
              expression: "self.title",

              controlKey: "locationName",

              type: "value",
            },
          ],
        },

        sortBy: {
          type: "radio",
          options: [
            { title: "Summary", value: "1" },
            { title: "Details", value: "2" },
          ],
          defaultValue: "1",
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
          label: "Export",
          type: "export",
          reportEntity: "opBillRegisterReport",
          fileName: "Op Bill Register Report.xls",
          contenType: "application/vnd.ms-excel",
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
      defaultValue: moment().format("DD/MM/YYYY"),
      properties: {
        organisationName: {
          type: "hidden",
        },
        ValueFromDate: {
          type: "date",
          title: "From Date",
          defaultValue: new Date(),
          maximum: new Date(),
          conditions: [
            {
              expression: "self",
              controlKey: "ValueToDate",
              type: "dateMin",
            },
            {
              expression: "self",
              controlKey: "ValueToDate",
              type: "dateMaxWithDays",
              days: 30,
            },
          ],
        },
        ValueToDate: {
          type: "date",
          title: "To Date",
          defaultValue: new Date(),
          maximum: new Date(),
          required: true,
          conditions: [
            {
              expression: "self",
              controlKey: "ValueFromDate",
              type: "dateMax",
            },
            {
              expression: "self",
              controlKey: "ValueFromDate",
              // type: "dateMinWithDays",
              // days: 30,
            },
          ],
        },

        SelectedLocationsId: {
          type: "autocomplete",
          placeholder: "--- Select Organization---",
          title: "Organization",
          required: true,
          optionsModelConfig: {
            uri: `${environment.CommonApiUrl}api/lookup/locationlookup/0`,
            fields: {
              title: "address3",
              value: "id",
            },
          },
          conditions: [
            {
              expression: "self.title",

              controlKey: "organisationName",

              type: "value",
            },
          ],
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
          label: "Export",
          type: "export",
          reportEntity: "OPRefundReport",
          fileName: "OP Refund Report.xls",
          contenType: "application/vnd.ms-excel",
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
      defaultValue: moment().format("DD/MM/YYYY"),
      properties: {
        organisationName: {
          type: "hidden",
        },
        ReportChecked: {
          type: "radio",
          options: [
            { title: "Summary", value: "1" },
            { title: "Details", value: "2" },
          ],
          defaultValue: "1",
        },

        ValueFromDate: {
          type: "date",
          title: "From Date",
          defaultValue: new Date(),
          maximum: new Date(),
          conditions: [
            {
              expression: "self",
              controlKey: "ValueToDate",
              type: "dateMin",
            },
            {
              expression: "self",
              controlKey: "ValueToDate",
              type: "dateMaxWithDays",
              days: 30,
            },
          ],
        },
        ValueToDate: {
          type: "date",
          title: "To Date",
          defaultValue: new Date(),
          maximum: new Date(),
          conditions: [
            {
              expression: "self",
              controlKey: "ValueFromDate",
              type: "dateMax",
            },
            {
              expression: "self",
              controlKey: "ValueFromDate",
              // type: "dateMinWithDays",
              // days: 30,
            },
          ],
        },

        SelectedLocationsId: {
          type: "autocomplete",
          placeholder: "--- Select Organization---",
          title: "Organization",
          required: true,
          optionsModelConfig: {
            uri: `${environment.CommonApiUrl}api/lookup/locationlookup/0`,
            fields: {
              title: "address3",
              value: "id",
            },
          },
          conditions: [
            {
              expression: "self.title",

              controlKey: "organisationName",

              type: "value",
            },
          ],
        },
      },
    },
    form: {
      layout: {
        location: "w-full",
        SelectedLocationsId: "w-full",
        ReportChecked: "w-full",
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
          label: "Export",
          type: "export",
          reportEntity: "opDiscountReport",
          fileName: "Op Discount Report.xls",
          contenType: "application/vnd.ms-excel",
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
  export const DetailedReport = {
    reportName: "Detailed Report",
    filterForm: {
      title: "",
      type: "object",
      //format: "YYYY/MM/dd",
      defaultValue: moment().format("DD/MM/YYYY"),
      properties: {
        dtpStartDate: {
          type: "date",
          title: "From Date",
          defaultValue: new Date().toISOString().slice(0, 10),
        },
        dtpEndDate: {
          type: "date",
          title: "To Date",
          defaultValue: new Date().toISOString().slice(0, 10),
        },
        MaxID: {
          type: "string",
          title: "MaxID",
          defaultValue: "",
        },
        SSN: {
          type: "string",
          title: "SSN",
          defaultValue: "",
          readonly: true,
        },
        Clinic: {
          type: "dropdown",
          placeholder: "--Select--",
          title: "Clinic",
          defaultValue: "0",
          optionsModelConfig: {
            uri: `${
              environment.CommonApiUrl
            }api/lookup/getclinicdoctor/${MaxHealthStorage.getCookie(
              "HSPLocationId"
            )}`,
          },
        },
        Referal: {
          type: "dropdown",
          placeholder: "--- Select---",
          title: "Referal",
          optionsModelConfig: {
            uri: `${environment.BillingApiUrl}api/outpatientbilling/getreferraldoctor/1`,
            fields: {
              title: "name",
              value: "id",
            },
          },
        },
        Doctor: {
          type: "dropdown",
          placeholder: "--- Select ---",
          title: "Doctor",
          defaultValue: "0",
          optionsModelConfig: {
            uri: `${
              environment.CommonApiUrl
            }api/lookup/getalldoctorname/${MaxHealthStorage.getCookie(
              "HSPLocationId"
            )}`,
          },
        },
        SetOrder: {
          title: "SetOrder",
        },
      },
    },
    form: {
      layout: {},
      actionItems: [
        {
          label: "Preview",
          type: "crystalReport",
          reportConfig: {
            reportName: "Detailed Report",
            reportEntity: "DetailedReport",
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

  export const SummaryReport = {
    reportName: "Summary Report",
    filterForm: {
      title: "",
      type: "object",
      format: "YYYY/MM/dd",
      properties: {
        dtpStartDate: {
          type: "date",
          title: "From Date",
          defaultValue: new Date().toISOString().slice(0, 10),
        },
        dtpEndDate: {
          type: "date",
          title: "To Date",
          defaultValue: new Date().toISOString().slice(0, 10),
        },
        MaxID: {
          type: "string",
          title: "MaxID",
          defaultValue: "",
        },
        SSN: {
          type: "string",
          title: "SSN",
          defaultValue: "",
          readonly: true,
        },
        Clinic: {
          type: "dropdown",
          placeholder: "--Select--",
          title: "Clinic",
          defaultValue: "0",
          optionsModelConfig: {
            uri: `${
              environment.CommonApiUrl
            }api/lookup/getclinicdoctor/${MaxHealthStorage.getCookie(
              "HSPLocationId"
            )}`,
          },
        },
        Referal: {
          type: "dropdown",
          placeholder: "--- Select---",
          title: "Referal",
          optionsModelConfig: {
            uri: `${environment.BillingApiUrl}api/outpatientbilling/getreferraldoctor/1`,
            fields: {
              title: "name",
              value: "id",
            },
          },
        },
        Doctor: {
          type: "dropdown",
          placeholder: "--Select--",
          title: "Doctor",
          defaultValue: "0",
          optionsModelConfig: {
            uri: `${
              environment.CommonApiUrl
            }api/lookup/getalldoctorname/${MaxHealthStorage.getCookie(
              "HSPLocationId"
            )}`,
          },
        },
        SetOrder: {
          title: "SetOrder",
        },
      },
    },
    form: {
      layout: {},
      actionItems: [
        {
          label: "Preview",
          type: "crystalReport",
          reportConfig: {
            reportName: "Summary Report",
            reportEntity: "SummaryReport",
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

  export const VisitReport = {
    layout: "tabs",
    reportName: "Visit Report",
    childrens: [{ ...DetailedReport }, { ...SummaryReport }],
  };

  export const MiscellaneousMISReport = {
    reportName: "Miscellaneous Billing Report",
    filterForm: {
      title: "",
      type: "object",
      defaultValue: moment().format("DD/MM/YYYY"),
      properties: {
        FromDate: {
          type: "date",
          title: "From Date",
          defaultValue: new Date(),
          maximum: new Date(),
          required: true,
          conditions: [
            {
              expression: "self",
              controlKey: "ToDate",
              type: "dateMin",
            },
            {
              expression: "self",
              controlKey: "ToDate",
              type: "dateMaxWithDays",
              days: 30,
            },
          ],
        },
        ToDate: {
          type: "date",
          title: "To Date",
          defaultValue: new Date(),
          maximum: new Date(),
          required: true,
          conditions: [
            {
              expression: "self",
              controlKey: "FromDate",
              type: "dateMax",
            },
            {
              expression: "self",
              controlKey: "FromDate",
              // type: "dateMinWithDays",
              // days: 30,
            },
          ],
        },

        ChkAllLocation: {
          type: "checkbox",
          options: [{ title: "Location", value: 1 }],
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
            reportName: "Miscellaneous Billing Report",
            reportEntity: "MiscellaneousReportMIS",
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
}
