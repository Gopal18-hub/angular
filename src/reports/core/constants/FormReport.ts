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
          placeholder: "---Location---",
          title: "Location",
        },
      },
    },
    form: {
      layout: {
        location: "w-full",
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





