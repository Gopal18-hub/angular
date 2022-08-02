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
  approvalDoneBy: string;
  id: number;
  approvalRequestBy: number;
  paymentMode: string;
  billDatetime: string;
  itemId: number;
  itemName: string;
  serviceName: string;
  orderid: number;
  risOrder: number;
  serviceId: number;
  testStatus: number;
  risReason: string;
}
interface risRemarksInterface {
  id: number;
  name: string;
}
