export interface ModifyCashScrollInterface {
  getERPscrollMainDto: getERPscrollMainDtoInterface[];
  getERPscrollDetailDto: getERPscrollDetailDtoInterface[];
}
interface getERPscrollMainDtoInterface {
  stationslno: number;
  fromdatetime: string;
  todatetime: string;
  scrolldatetime: string;
  name: string;
  operatorid: number;
  ackCashier: number;
  ackOperator: number;
}
export interface getERPscrollDetailDtoInterface {
  receiptNo: string;
  billno: string;
  billamount: number;
  refund: number;
  discountamount: number;
  planamount: number;
  plandiscount: number;
  balance: number;
  netamount: number;
  cash: number;
  cheque: number;
  dd: number;
  creditCard: number;
  mobilePayment: number;
  onlinePayment: number;
  dues: number;
  tdsamount: number;
  operatorid: number;
  datetime: string;
  duesrec: number;
  hsPlocationid: number;
  depositamount: number;
  batchno: string;
  modifiedCheqAmt: number;
  modifiedCCAmt: number;
  modifiedDDAmt: number;
  modifiedCash: number;
  chequeNo: string;
  creditCardNo: string;
  modifiedCashPaymentMobile: number;
  modifiedCashMobileDetails: number;
  modifiedOnlinePayment: number;
  onlinePaymentDetails: number;
  operatorName: string;
  modifiedDonationAmount: number;
  donationAmount: number;
  upiAmt: number;
  modifiedUPIAmt: number;
  upiPaymentDetails: string;
  maxid: string;
  billDateTime: string;
}
