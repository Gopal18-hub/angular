import { MaxHealthStorage } from "@shared/services/storage";

export namespace BillingStaticConstants {
  export const makeBillPayload: any = {
    ds_insert_bill: {
      tab_insertbill: {}, //header information of entire bill
      tab_d_opbillList: [], // Services list
      tab_o_opdoctorList: [], // consultation header
      tab_d_opdoctorList: [], // consultation breakup
      tab_o_optestList: [], // Investigation header
      tab_d_optestorderList: [], // Investigation brakup
      tab_o_procedureList: [], // Procedure header
      tab_d_procedureList: [], // Procedura breakup
      tab_d_packagebillList: [], // Healthcheckup header
      tab_d_depositList: [], // deposite adjustment details
      tab_getdepositList: [], // demopiste actual amount (patient deposit amount)
      tab_l_receiptList: [], //
    },
    hcudetails: "",
    ds_paymode: {
      tab_paymentList: [],
      tab_cheque: [],
      tab_dd: [],
      tab_credit: [],
      tab_debit: [],
      tab_Mobile: [],
      tab_Online: [],
      tab_UPI: [],
    },
    doctor_sheduleid: 0,
    step_no: [],
    selectedservice: [],
    dtHappyFamilyPlanTableSend: [],
    dtHappyFamilyPlanTableDetailSend: [],
    tab_L_ReffralPHP: {},
    srvTaxPer: 0,
    totSerTaxAmt: 0,
    taxReason: "",
    taxProcedureID: 0,
    VisitNumber: "",
    orderType: "",
    dtCPRS: [],
    tab_o_opDiscount: [],
    tab_o_opItemBasePrice: [],
    cmbInteraction: 0,
    htParms: {},
    opBloodGroupFlag: 0,
    dtFinalGrpDoc: {},
    gst: 0,
    gstValue: 0,
    cgst: 0,
    cgstValue: 0,
    sgst: 0,
    sgstValue: 0,
    utgst: 0,
    utgstValue: 0,
    igst: 0,
    igstValue: 0,
    cess: 0,
    cessValue: 0,
    sacCode: "99931600001",
    taxRate1: 0,
    taxRate1Value: 0,
    taxRate2: 0,
    taxRate2Value: 0,
    taxRate3: 0,
    taxRate3Value: 0,
    taxRate4: 0,
    taxRate4Value: 0,
    taxRate5: 0,
    taxRate5Value: 0,
    totaltaX_RATE: 0,
    totaltaX_Value: 0,
    taxGrpId: 0,
    billToCompanyId: 0,
    invoiceType: "B2C",
    finalDSGSTDetails: {
      gsT_value: 0,
      gsT_percent: 0,
      cgsT_Value: 0,
      cgsT_Percent: 0,
      sgsT_value: 0,
      sgsT_percent: 0,
      utgsT_value: 0,
      utgsT_percent: 0,
      igsT_Value: 0,
      igsT_percent: 0,
      cesS_value: 0,
      cesS_percent: 0,
      taxratE1_Value: 0,
      taxratE1_Percent: 0,
      taxratE2_Value: 0,
      taxratE2_Percent: 0,
      taxratE3_Value: 0,
      taxratE3_Percent: 0,
      taxratE4_Value: 0,
      taxratE4_Percent: 0,
      taxratE5_Value: 0,
      taxratE5_Percent: 0,
      totaltaX_RATE: 0,
      totaltaX_RATE_VALUE: 0,
      saccode: "",
      taxgrpid: 0,
    },
    txtOtherGroupDoc: "",
    dtCheckedItem: [],
    cghsBeneficiaryChangeReason: "",
    hspLocationId: 0,
    userId: 0,
    stationId: 0,
  };

  export const billingPageTabs: any = [
    {
      title: "Services",
      path: "services",
    },
    {
      title: "Bill",
      path: "bill",
    },
    {
      title: "Credit Details",
      path: "credit-details",
    },
  ];

  export const billingHeaderForm: any = {
    title: "",
    type: "object",
    properties: {
      maxid: {
        type: "string",
        defaultValue: MaxHealthStorage.getCookie("LocationIACode") + ".",
      },
      mobile: {
        type: "tel",
      },
      bookingId: {
        type: "string",
      },
      company: {
        type: "autocomplete",
        options: [],
        placeholder: "--Select--",
      },
      corporate: {
        type: "autocomplete",
        options: [],
        placeholder: "--Select--",
      },
      narration: {
        type: "buttonTextarea",
      },
      b2bInvoice: {
        type: "checkbox",
        options: [{ title: "B2B Invoice" }],
      },
    },
  };

  export const similarPatientTableConfig: any = {
    selectBox: false,
    clickedRows: true,
    clickSelection: "single",
    displayedColumns: [
      "maxid",
      "firstName",
      "lastName",
      "phone",
      "address",
      "age",
      "gender",
    ],
    columnsInfo: {
      maxid: {
        title: "Max ID",
        type: "string",
        style: {
          width: "120px",
        },
      },
      firstName: {
        title: "First Name",
        type: "string",
      },
      lastName: {
        title: "Last Name",
        type: "string",
      },
      phone: {
        title: "Phone No. ",
        type: "string",
      },
      address: {
        title: "Address ",
        type: "string",
        style: {
          width: "150px",
        },
        tooltipColumn: "address",
      },
      age: {
        title: "Age ",
        type: "string",
        style: {
          width: "90px",
        },
      },
      gender: {
        title: "Gender",
        type: "string",
        style: {
          width: "70px",
        },
      },
    },
  };

  export const billTabFormConfig = {
    type: "object",
    title: "",
    properties: {
      referralDoctor: {
        type: "dropdown",
        required: true,
        title: "Referral Doctor",
        placeholder: "--Select--",
      },
      interactionDetails: {
        type: "dropdown",
        required: false,
        title: "Interaction Details",
        placeholder: "--Select--",
      },
      billAmt: {
        type: "currency",
        required: false,
        defaultValue: "0.00",
        readonly: true,
      },
      availDiscCheck: {
        type: "checkbox",
        required: false,
        options: [{ title: "Avail Plan Disc ( - )" }],
        disabled: false,
      },
      availDisc: {
        type: "currency",
        required: false,
        defaultValue: "0.00",
        readonly: true,
        disabled: false,
      },
      discAmtCheck: {
        type: "checkbox",
        required: false,
        options: [{ title: " Discount  Amount  (  -  ) " }],
        disabled: false,
      },
      discAmt: {
        type: "currency",
        required: false,
        defaultValue: "0.00",
        readonly: true,
        disabled: false,
      },
      dipositAmtcheck: {
        type: "checkbox",
        required: false,
        options: [{ title: "Deposit Amount ( - )" }],
        disabled: false,
      },
      dipositAmt: {
        type: "currency",
        required: false,
        defaultValue: "0.00",
        readonly: true,
        disabled: false,
      },
      patientDisc: {
        type: "currency",
        required: false,
        defaultValue: "0.00",
        readonly: true,
      },
      compDisc: {
        type: "currency",
        required: false,
        defaultValue: "0.00",
        readonly: true,
      },
      planAmt: {
        type: "currency",
        required: false,
        defaultValue: "0.00",
        readonly: true,
      },
      coupon: {
        type: "string",
        required: false,
      },
      coPay: {
        type: "number",
        required: false,
        defaultValue: "0",
        readonly: true,
      },
      credLimit: {
        type: "currency",
        required: false,
        defaultValue: "0.00",
        readonly: true,
      },
      gstTax: {
        type: "currency",
        required: false,
        defaultValue: "0.00",
        readonly: true,
      },
      amtPayByPatient: {
        type: "currency",
        required: false,
        defaultValue: "0.00",
        readonly: true,
      },
      amtPayByComp: {
        type: "currency",
        required: false,
        defaultValue: "0.00",
        readonly: true,
      },
      paymentMode: {
        type: "radio",
        required: true,
        options: [
          { title: "Cash", value: 1, disabled: false },
          { title: "Credit", value: 3, disabled: false },
          { title: "Gen. OPD", value: 4, disabled: false },
        ],
        defaultValue: 1,
      },
      self: {
        type: "checkbox",
        required: false,
        options: [{ title: "Self" }],
      },
      dipositAmtEdit: {
        type: "currency",
        required: false,
        defaultValue: "0.00",
        readonly: true,
      },
    },
  };

  export const billTabTableConfig = {
    clickedRows: false,
    actionItems: false,
    dateformat: "dd/MM/yyyy",
    selectBox: false,
    removeRow: true,
    displayedColumns: [
      "sno",
      "serviceName",
      "itemName",
      "precaution",
      "procedureDoctor",
      "qty",
      "credit",
      "cash",
      "disc",
      "discAmount",
      "gst",
      "gstValue",
      "totalAmount",
    ],
    columnsInfo: {
      sno: {
        title: "S.No.",
        type: "number",
        style: {
          width: "65px",
        },
      },
      serviceName: {
        title: "Services Name",
        type: "string",
        style: {
          width: "150px",
        },
      },
      itemName: {
        title: "Item Name / Doctor Name",
        type: "string",
        style: {
          width: "200px",
        },
      },
      precaution: {
        title: "Precaution",
        type: "string_link",
        style: {
          width: "80px",
        },
      },
      procedureDoctor: {
        title: "Procedure Doctor",
        type: "string",
        style: {
          width: "150px",
        },
      },
      qty: {
        title: "Qty/Type",
        type: "string",
        style: {
          width: "80px",
        },
      },
      credit: {
        title: "Credit",
        type: "currency",
        style: {
          width: "100px",
        },
      },
      cash: {
        title: "Cash",
        type: "currency",
        style: {
          width: "100px",
        },
      },
      disc: {
        title: "Disc %",
        type: "string",
        style: {
          width: "60px",
        },
      },
      discAmount: {
        title: "Disc Amount",
        type: "currency",
        style: {
          width: "100px",
        },
      },
      totalAmount: {
        title: "Total Amount",
        type: "currency",
        style: {
          width: "130px",
        },
      },
      gst: {
        title: "GST%",
        type: "number",
        style: {
          width: "60px",
        },
      },
      gstValue: {
        title: "GST Value",
        type: "currency",
        style: {
          width: "130px",
        },
      },
    },
  };

  export const investigationItemBasedInstructions: any = {
    "6085":
      "Please refer to the prescription, in case of diagnosed/provisional/follow up Dengue, select the right CBC",
  };

  //constant to add allow items with Healthchekup/ consumables
  //tabid:[itemid]
  export const allowService: any = {
    3: [30632],
  };

  //CGHS Beneficiary Reasons
  export const cghsBeneficiaryReasons: any = [
    { title: "---Select---", value: 1 },
    { title: "Speciality not covered under CGHS", value: 2 },
    { title: "Hospital is not on CGHS Panel", value: 3 },
    { title: "As per Patient Instruction request", value: 4 },
  ];
}
