export namespace OnlineOrderStaticConstants {
  export const searchForm: any = {
    title: "",
    type: "object",
    properties: {
      type: {
        title: "",
        isHideTitle: true,
        type: "dropdown",
        placeholder: "--Select--",
        defaultValue: "maxid",
        options: [
          {
            value: "maxid",
            title: "MAX ID",
          },
          {
            value: "mobile",
            title: "Mobile ",
          },
          {
            value: "name",
            title: "Name",
          },
          {
            value: "doctor",
            title: "Doctor",
          },
        ],
      },
      value: {
        title: "",
        type: "string",
        required: false,
        isHideTitle: true,
      },
      fromDate: {
        title: "From Date",
        type: "date",
        required: true,
      },
      toDate: {
        title: "To Date",
        type: "date",
        required: true,
      },
      orderStatus: {
        title: "Order Status",
        type: "dropdown",
        placeholder: "--Select--",
        required: false,
        defaultValue: "1",
        options: [
          {
            value: "0",
            title: "All",
          },
          {
            value: "1",
            title: "Pending",
          },
          {
            value: "3",
            title: "Dispensed",
          },
          {
            value: "2",
            title: "Rejected",
          },
        ],
      },
    },
  };

  export const linedataOnlineOrderconfig: any = {
    clickedRows: true,
    clickSelection: "single",
    dateformat: "dd/MM/yyyy hh:mm:ss a",
    selectBox: false,
    removeRow: true,
    pagination: true,
    paginationPageSize: 15,
    removeRowstickyEnd: true,
    defaultValueSort: { active: "orderId", direction: "desc" },
    rowLayout: { dynamic: { rowClass: "row['markLegends']" } },
    displayedColumns: [
      "orderId",
      "maxid",
      "ptnName",
      "channel",
      "docName",
      "deptName",
      "visitDate",
      "mobileNo",
      "mrpValue",
      "pha_Token",
      "viewP",
      "orderStatus",
      "remarks",
    ],
    columnsInfo: {
      orderId: {
        title: "Order ID",
        type: "string",
        style: {
          width: "6rem",
        },
      },
      maxid: {
        title: "Max ID",
        type: "string",
        style: {
          width: "6rem",
        },
      },
      ptnName: {
        title: "Patient Name",
        type: "string",
        style: {
          width: "12rem",
        },
      },
      channel: {
        title: "Channel",
        type: "string",
        style: {
          width: "5rem",
        },
      },
      docName: {
        title: "Doctor Name",
        type: "string",
        style: {
          width: "9rem",
        },
      },
      deptName: {
        title: "Department",
        type: "number",
        style: {
          width: "6rem",
        },
      },
      visitDate: {
        title: "Visit Date",
        type: "date",
        style: {
          width: "10rem",
        },
      },
      mobileNo: {
        title: "Mobile No.",
        type: "string",
        style: {
          width: "6rem",
        },
      },
      mrpValue: {
        title: "Amount",
        type: "number",
        style: {
          width: "5rem",
        },
      },
      pha_Token: {
        title: "Token No.",
        type: "string",
        style: {
          width: "6rem",
        },
      },
      viewP: {
        title: "Prescription",
        type: "string_link",
        style: {
          width: "5rem",
        },
      },
      orderStatus: {
        title: "Order Status",
        type: "string",
        style: {
          width: "7rem",
        },
      },
      remarks: {
        title: "Remarks",
        type: "string",
        style: {
          width: "5rem",
        },
        tooltipColumn: "remarks",
      },
    },
  };

  export const linedataOnlineOrderDrugLineconfig: any = {
    clickedRows: true,
    selectBox: true,
    removeRow: false,
    clickSelection: "multiple",
    displayedColumns: [
      "sno",
      "drug",
      "drugDesc",
      "days",
      "dosage",
      "priority",
      "remarks",
    ],
    columnsInfo: {
      sno: {
        title: "S.no",
        type: "string",
        style: {
          width: "3rem",
        },
      },
      drug: {
        title: "Drug Name",
        type: "string",
        style: {
          width: "13rem",
        },
      },
      drugDesc: {
        title: "Instruction",
        type: "string",
        style: {
          width: "6rem",
        },
      },
      days: {
        title: "Days",
        type: "string",
        style: {
          width: "3rem",
        },
      },
      dosage: {
        title: "Dosage",
        type: "string",
        style: {
          width: "6rem",
        },
      },
      priority: {
        title: "Priority",
        type: "number",
        style: {
          width: "4rem",
        },
      },
      remarks: {
        title: "Remarks",
        type: "string",
        style: {
          width: "10rem",
        },
        tooltipColumn: "prescriptionremarks",
      },
    },
  };
}
