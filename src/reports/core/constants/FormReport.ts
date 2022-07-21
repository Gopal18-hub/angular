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
}
