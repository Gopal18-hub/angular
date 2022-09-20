export class AckDetailsForScrollModel {
  fromdate!: string;
  todate!: string;
  totdisc: number = 0;
  totcash: number = 0;
  ccamt: number = 0;
  cheque: number = 0;
  totdues: number = 0;
  totrefund: number = 0;
  scrolldate!: string;
  gross: number = 0;
  netamt: number = 0;
  duereceived: number = 0;
  totalamt: number = 0;
  totdd: number = 0;
  totplanamt: number = 0;
  totplandiscount: number = 0;
  totaltds: number = 0;
  totaldeposit: number = 0;
  mobilePayment: number = 0;
  onlinePayment: number = 0;
  modifiedCheqAmt: number = 0;
  modifiedCCAmt: number = 0;
  modifiedDDAmt: number = 0;
  modifiedCash: number = 0;
  modifiedCashPaymentMobile: number = 0;
  modifiedOnlinePayment: number = 0;
  dT_EXCELforScroll!: dtExcelforScroll[];
  scrollID: number = 0;
  stationid: number = 0;
  isAckCashier!: boolean;
  modifiedUPIAmount: number = 0;
  upiAmt: number = 0;
  operatorId: number = 0;
  hsplocationId: number = 0;
  constructor(

  ) {
    // this.fromdate = fromdate;
    // this.todate = todate;
    // this.totdisc = totdisc;
    // this.totcash = totcash;
    // this.ccamt = ccamt;
    // this.cheque = cheque;
    // this.totdues = totdues;
    // this.totrefund = totrefund;
    // this.scrolldate = scrolldate;
    // this.gross = gross;
    // this.netamt = netamt;
    // this.duereceived = duereceived;
    // this.totalamt = totalamt;
    // this.totdd = totdd;
    // this.totplanamt = totplanamt;
    // this.totplandiscount = totplandiscount;
    // this.totaltds = totaltds;
    // this.totaldeposit = totaldeposit;
    // this.mobilePayment = mobilePayment;
    // this.onlinePayment = onlinePayment;
    // this.modifiedCheqAmt = modifiedCheqAmt;
    // this.modifiedCCAmt = modifiedCCAmt;
    // this.modifiedDDAmt = modifiedDDAmt;
    // this.modifiedCash = modifiedCash;
    // this.modifiedCashPaymentMobile = modifiedCashPaymentMobile;
    // this.modifiedOnlinePayment = modifiedOnlinePayment;
    // this.dT_EXCELforScroll = dT_EXCELforScroll;
    // this.scrollID = scrollID;
    // this.stationid = stationid;
    // this.isAckCashier = isAckCashier;
    // this.modifiedUPIAmount = modifiedUPIAmount;
    // this.upiAmt = upiAmt;
    // this.operatorId = operatorId;
    // this.hsplocationId = hsplocationId;
  }
}

export class dtExcelforScroll {
  slNo: number;
  receiptNo: string;
  billNo: string;
  dateTime: any;
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

  constructor(
  slNo: number,
  receiptNo: string,
  billNo: string,
  dateTime: string,
  billAmount: string,
  refund: string,
  depositamount: string,
  discountAmount: string,
  planAmount: string,
  planDiscount: string,
  netAmount: string,
  cash: string,
  cheque: string,
  dd: string,
  creaditCard: string,
  cashpaymentbyMobile: string,
  onlinePayment: string,
  dues: string,
  tdsAmount: string,
  totalAmount: string,
  modifiedCheqAmt: string,
  modifiedCCAmt: string,
  modifiedDDAmt: string,
  modifiedCash: string,
  chequeNo: string,
  creditCardNo: string,
  modifiedCashPaymentMobile: string,
  modifiedDDNumber: string,
  modifiedOnlinePayment: string,
  onlinePaymentDetails: string,
  operatorName: string,
  duereceved: string,
  batchno: string,
  upiAmt: string,
  modifiedUPIAmount: number,
  upiPaymentDetails: number,
  )
  {
    this.slNo = slNo;
    this.receiptNo = receiptNo;
    this.billNo = billNo;
    this.dateTime = dateTime;
    this.billAmount = billAmount;
    this.refund = refund;
    this.depositamount = depositamount;
    this.discountAmount = discountAmount;
    this.planAmount = planAmount;
    this.planDiscount = planDiscount;
    this.netAmount = netAmount;
    this.cash = cash;
    this.cheque = cheque;
    this.dd = dd;
    this.creaditCard = creaditCard;
    this.cashpaymentbyMobile = cashpaymentbyMobile;
    this.onlinePayment = onlinePayment;
    this.dues = dues;
    this.tdsAmount = tdsAmount;
    this.totalAmount = totalAmount;
    this.modifiedCheqAmt = modifiedCheqAmt;
    this.modifiedCCAmt = modifiedCCAmt;
    this.modifiedDDAmt = modifiedDDAmt;
    this.modifiedCash = modifiedCash;
    this.chequeNo = chequeNo;
    this.creditCardNo = creditCardNo;
    this.modifiedCashPaymentMobile = modifiedCashPaymentMobile;
    this.modifiedDDNumber = modifiedDDNumber;
    this.modifiedOnlinePayment = modifiedOnlinePayment;
    this.onlinePaymentDetails = onlinePaymentDetails;
    this.operatorName = operatorName;
    this.duereceved = duereceved;
    this.batchno = batchno;
    this.upiAmt = upiAmt;
    this.modifiedUPIAmount = modifiedUPIAmount;
    this.upiPaymentDetails = upiPaymentDetails;
  }
}
