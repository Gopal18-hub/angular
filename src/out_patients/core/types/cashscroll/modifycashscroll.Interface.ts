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
  sno?:any;
  forclr?: any;
  forreadonly?: any;
  ddnumber?: any;
  totalamount?: any;
  internetpaymtamt?: any;
  actualinternetpaymtamt?: any;
  receiptNo: string;
  billno: string;
  billamount: any;
  refund: any;
  discountamount: any;
  planamount: any;
  plandiscount: any;
  balance: any;
  netamount: any;
  cash: any;
  cheque: any;
  dd: any;
  creditCard: any;
  mobilePayment: any;
  onlinePayment: any;
  dues: any;
  tdsamount: any;
  operatorid: any;
  datetime: string;
  duesrec: any;
  hsPlocationid: any;
  depositamount: any;
  batchno: any;
  modifiedCheqAmt: any;
  modifiedCCAmt: any;
  modifiedDDAmt: any;
  modifiedCash: any;
  chequeNo: any;
  creditCardNo: string;
  modifiedCashPaymentMobile: any;
  modifiedCashMobileDetails: any;
  modifiedOnlinePayment: any;
  onlinePaymentDetails: any;
  operatorName: string;
  modifiedDonationAmount: any;
  donationAmount: any;
  upiAmt: any;
  modifiedUPIAmt: any;
  upiPaymentDetails: string;
  maxid: string;
  billDateTime: string;
}
