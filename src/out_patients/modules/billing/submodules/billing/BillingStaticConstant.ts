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
