export interface GetDataForOldScroll {
  getACKDetails: getACKDetailsInterface[];
  getACKOtherdetails: getACKOtherdetailsInterface[];
}

interface getACKDetailsInterface {
  stationslno: number;
  fromdatetime: string;
  todatetime: string;
  scrolldatetime: string;
  name: string;
  operatorid: number;
  flag: true;
  ackOperator: number;
  stationID: number;
  station: string;
}
interface getACKOtherdetailsInterface {
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
  datetime: string;
  duesrec: number;
  hsPlocationid: number;
  depositamount: number;
  batchno: number;
  donationAmount: number;
  upiAmt: number;
  maxid: string;
  compName: string;
  inetAmt: number;
}
