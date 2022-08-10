export interface OprefundPendingInterface {
  opRefundApprovalList: OpRefundApprovalListInterface[];
  risRemarks: risRemarksInterface[];
}
export interface OpRefundApprovalListInterface {
  maxid: string;
  ptnName: string;
  billNo: string;
  refundAmt: number;
  operatorName: string;
  authorisedby: string;
  reason: string;
  date: string;
  id: number;
  paymentMode: string;
  billDatetime: any;
  itemId: number;
  itemName: string;
  serviceName: string;
  orderid: number;
  risOrder: number;
  serviceId: number;
  testStatus: number;
  risReason: string;
  approvalRequestBy: string;
  approvalRequestDateTime: any;
  approvalDoneBy: string;
  approvalDoneDateTime: any;
  rejectedBy: string;
  rejectedDateTime: any;
}
interface risRemarksInterface {
  id: number;
  name: string;
}
