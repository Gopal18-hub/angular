export namespace FormReport {
  export const equipmentSchedule = {
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
