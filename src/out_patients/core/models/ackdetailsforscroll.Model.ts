export class AckDetailsForScrollModel {
  fromdate: string;
  todate: string;
  totdisc: number;
  totcash: number;
  ccamt: number;
  cheque: number;
  totdues: number;
  totrefund: number;
  scrolldate: string;
  gross: number;
  netamt: number;
  duereceived: number;
  totalamt: number;
  totdd: number;
  totplanamt: number;
  totplandiscount: number;
  totaltds: number;
  totaldeposit: number;
  mobilePayment: number;
  onlinePayment: number;
  modifiedCheqAmt: number;
  modifiedCCAmt: number;
  modifiedDDAmt: number;
  modifiedCash: number;
  modifiedCashPaymentMobile: number;
  modifiedOnlinePayment: number;
  dT_EXCELforScroll: dtExcelforScrollInterface[];
  scrollID: number;
  stationid: number;
  isAckCashier: boolean;
  modifiedUPIAmount: number;
  upiAmt: number;
  operatorId: number;
  hsplocationId: number;
  constructor(
    fromdate: string,
    todate: string,
    totdisc: number,
    totcash: number,
    ccamt: number,
    cheque: number,
    totdues: number,
    totrefund: number,
    scrolldate: string,
    gross: number,
    netamt: number,
    duereceived: number,
    totalamt: number,
    totdd: number,
    totplanamt: number,
    totplandiscount: number,
    totaltds: number,
    totaldeposit: number,
    mobilePayment: number,
    onlinePayment: number,
    modifiedCheqAmt: number,
    modifiedCCAmt: number,
    modifiedDDAmt: number,
    modifiedCash: number,
    modifiedCashPaymentMobile: number,
    modifiedOnlinePayment: number,
    dT_EXCELforScroll: dtExcelforScrollInterface[],
    scrollID: number,
    stationid: number,
    isAckCashier: boolean,
    modifiedUPIAmount: number,
    upiAmt: number,
    operatorId: number,
    hsplocationId: number
  ) {
    this.fromdate = fromdate;
    this.todate = todate;
    this.totdisc = totdisc;
    this.totcash = totcash;
    this.ccamt = ccamt;
    this.cheque = cheque;
    this.totdues = totdues;
    this.totrefund = totrefund;
    this.scrolldate = scrolldate;
    this.gross = gross;
    this.netamt = netamt;
    this.duereceived = duereceived;
    this.totalamt = totalamt;
    this.totdd = totdd;
    this.totplanamt = totplanamt;
    this.totplandiscount = totplandiscount;
    this.totaltds = totaltds;
    this.totaldeposit = totaldeposit;
    this.mobilePayment = mobilePayment;
    this.onlinePayment = onlinePayment;
    this.modifiedCheqAmt = modifiedCheqAmt;
    this.modifiedCCAmt = modifiedCCAmt;
    this.modifiedDDAmt = modifiedDDAmt;
    this.modifiedCash = modifiedCash;
    this.modifiedCashPaymentMobile = modifiedCashPaymentMobile;
    this.modifiedOnlinePayment = modifiedOnlinePayment;
    this.dT_EXCELforScroll = dT_EXCELforScroll;
    this.scrollID = scrollID;
    this.stationid = stationid;
    this.isAckCashier = isAckCashier;
    this.modifiedUPIAmount = modifiedUPIAmount;
    this.upiAmt = upiAmt;
    this.operatorId = operatorId;
    this.hsplocationId = hsplocationId;
  }
}

export interface dtExcelforScrollInterface {
  slNo: number;
  receiptNo: string;
  billNo: string;
  dateTime: string;
  billAmount: string;
  refund: string;
  depositamount: string;
  discountAmount: string;
  planAmount: string;
  planDiscount: string;
  netAmount: string;
  cash: string;
  cheque: string;
  dd: string;
  creaditCard: string;
  cashpaymentbyMobile: string;
  onlinePayment: string;
  dues: string;
  tdsAmount: string;
  totalAmount: string;
  modifiedCheqAmt: string;
  modifiedCCAmt: string;
  modifiedDDAmt: string;
  modifiedCash: string;
  chequeNo: string;
  creditCardNo: string;
  modifiedCashPaymentMobile: string;
  modifiedDDNumber: string;
  modifiedOnlinePayment: string;
  onlinePaymentDetails: string;
  operatorName: string;
  duereceved: string;
  batchno: string;
  upiAmt: string;
  modifiedUPIAmount: number;
  upiPaymentDetails: number;
}
