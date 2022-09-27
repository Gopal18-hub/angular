import { miscPatientDetail } from "./miscPatientDetail.Model";
export class MiscellaneousBillingModel {
  dtSaveOBill_P?: miscPatientDetail;
  dtMiscellaneous_list?: dtMiscellaneous_list[];
  ds_paymode?: {
    tab_paymentList: tab_paymentList[];
    tab_cheque: tab_cheque[];
    tab_dd: tab_dd[];
    tab_credit: tab_credit[];
    tab_debit: tab_debit[];
    tab_Mobile: tab_Mobile[];
    tab_Online: tab_Online[];
    tab_UPI: tab_UPI[];
  };
  dtDeposit_P?: dtDeposit_P[];
  dtSaveDeposit_P?: dtSaveDeposit_P;
  htParameter_P?: htParameter_P;
  dtGST_Parameter_P?: dtGST_Parameter_P;
  operatorId?: number;
  locationId?: number;
}

export class dtMiscellaneous_list {
  quantity?: number;
  serviceid?: number;
  amount?: number;
  discountAmount?: number;
  serviceName?: string;
  itemModify?: string;
  discounttype?: number;
  disReasonId?: number;
  docid?: number;
  remarksId?: number;
  itemId?: number;
  mPrice?: number;
  empowerApproverCode?: string;
  couponCode?: string;
}

export class tab_paymentList {
  slNo?: number;
  modeOfPayment?: string;
  amount?: number;
  flag?: number;
}

export class tab_cheque {
  chequeNo?: string;
  chequeDate?: string;
  bankName?: string;
  branchName?: string;
  city?: string;
  flag?: 0;
}

export class tab_dd {
  ddNumber?: string;
  ddDate?: string;
  bankName?: string;
  branchName?: string;
  flag?: 0;
}

export class tab_credit {
  ccNumber?: string;
  cCvalidity?: string;
  cardType?: number;
  approvalno?: string;
  cType?: number;
  flag?: number;
  approvalcode?: string;
  terminalID?: string;
  acquirer?: string;
  flagman?: string;
  cardholdername?: string;
  bankname?: string;
}

export class tab_debit {
  ccNumber?: string;
  cCvalidity?: string;
  cardType?: number;
  approvalno?: string;
  cType?: number;
  flag?: 0;
}

export class tab_Mobile {
  mobileNo?: string;
  mmid?: string;
  senderName?: string;
  bankName?: string;
  branchName?: string;
  beneficiaryMobile?: string;
  transactionRef?: string;
  flag?: 0;
}

export class tab_Online {
  transactionId?: string;
  bookingId?: string;
  cardValidation?: string;
  flag?: number;
  onlineContact?: string;
}

export class tab_UPI {
  ccNumber_UPI?: string;
  cCvalidity_UPI?: string;
  cardType_UPI?: number;
  approvalno_UPI?: string;
  cType_UPI?: number;
  flag?: number;
  approvalcode_UPI?: string;
  terminalID_UPI?: string;
  acquirer_UPI?: string;
  flagman_UPI?: string;
  cardholdername_UPI?: string;
  bankname_UPI?: string;
}

export class dtDeposit_P {
  id?: number;
  amount?: number;
  balanceamount?: 0;
}

export class dtSaveDeposit_P {
  cashtranid?: number;
  billid?: number;
  balance?: number;
  blockopid?: number;
  hsplocationId?: 0;
}

export class htParameter_P {
  employeename?: string;
  employeeCode?: string;
  department?: string;
  company?: string;
}

export class dtGST_Parameter_P {
  gsT_value?: number;
  gsT_percent?: number;
  cgsT_Value?: number;
  cgsT_Percent?: number;
  sgsT_value?: number;
  sgsT_percent?: number;
  utgsT_value?: number;
  utgsT_percent?: number;
  igsT_Value?: number;
  igsT_percent?: number;
  cesS_value?: number;
  cesS_percent?: number;
  taxratE1_Value?: number;
  taxratE1_Percent?: number;
  taxratE2_Value?: number;
  taxratE2_Percent?: number;
  taxratE3_Value?: number;
  taxratE3_Percent?: number;
  taxratE4_Value?: number;
  taxratE4_Percent?: number;
  taxratE5_Value?: number;
  taxratE5_Percent?: number;
  totaltaX_RATE?: number;
  totaltaX_RATE_VALUE?: number;
  saccode?: number;
  taxgrpid?: number;
}
