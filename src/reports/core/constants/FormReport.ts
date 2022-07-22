export namespace FormReport {
  export const equipmentSchedule = {
    reportName: "Equipment Schedule",
    filterForm: {
      title: "",
      type: "object",
      properties: {
        equipmentName: {
          type: "dropdown",
          placeholder: "---Equipment---",
          title: "Equipment Name",
        },
        fromDate: {
          type: "date",
          title: "From Date",
        },
        toDate: {
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
        },
        {
          label: "Clear",
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
  export const DoctorSheduleReport = {
    reportName: "Doctors",
    filterForm: {
      title: "",
      type: "object",
      properties: {
        Doctors: {
          type: "dropdown",
          placeholder: "---All Doctors---",
          title: "",
        },
        TransactionDate: {
          type: "radio",
          title: "Transaction Date",
        },
        AppoinmentDate: {
          type: "radio",
          title: "AppoinmentDate",
        },
        fromDate: {
          type: "date",
          title: "From Date",
        },
        toDate: {
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
        },
        {
          label: "Clear",
        },
      ],
    },
  };
  export const DoctorSheduleReportBySpecilialisation = {
    reportName: "Specilialisation",
    filterForm: {
      title: "",
      type: "object",
      properties: {
        Specilialisation: {
          type: "dropdown",
          placeholder: "---Specilialisation---",
          title: "",
        },
        TransactionDate: {
          type: "radio",
          title: "Transaction Date",
        },
        AppoinmentDate: {
          type: "radio",
          title: "AppoinmentDate",
        },
        fromDate: {
          type: "date",
          title: "From Date",
        },
        toDate: {
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
        },
        {
          label: "Clear",
        },
      ],
    },
  };
  export const GeneralOPDReport = {
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
      },
    },
    form: {
      layout: {
        equipmentName: "w-full",
      },
      actionItems: [
        {
          label: "Preview",
        },
        {
          label: "Clear",
        },
      ],
    },
  };
  export const HappyFamilyPlanAllocationReport = {
    reportName: "Happy Family Plan",
    filterForm: {
      title: "",
      type: "object",
      properties: {
        PlanName: {
          type: "radio",
          title: "Plan Name",
        },
        PlanNameDropdown: {
          type: "dropdown",
          placeholder: "---PlanName---",
          title: "",
        },
        Membership: {
          type: "radio",
          title: "Membership",
        },
        Location: {
          type: "dropdown",
          placeholder: "---Location---",
          title: "Location",
        },
        MembershipDropDown: {
          type: "dropdown",
          placeholder: "---Membership---",
          title: "",
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
        },
        {
          label: "Clear",
        },
      ],
    },
  };
  export const HappyFamilyPlanUtilizationReport = {
    reportName: "Happy Family Utilization Report Summary",
    filterForm: {
      title: "",
      type: "object",
      properties: {
        MembershipDropDown: {
          type: "dropdown",
          placeholder: "---Membership---",
          title: "Membership",
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
        },
        {
          label: "Clear",
        },
      ],
    },
  };
  export const DetailedHappyFamilyPlanUtilizationReport = {
    reportName: "Detailed Happy Family Utilization Report Summary",
    filterForm: {
      title: "",
      type: "object",
      properties: {
        MembershipDropDown: {
          type: "dropdown",
          placeholder: "---Membership---",
          title: "Membership",
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
        },
        {
          label: "Clear",
        },
      ],
    },
  };

  export const expiredPatientReport = {
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
          placeholder: "---Location---",
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
}
