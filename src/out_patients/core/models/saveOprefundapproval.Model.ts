export class SaveOprefundApprovalModel {
  opRefundApprovalData: oprefundapprovaldatainterface[];
  operatorId: number;
  locationId: number;
  constructor(
    opRefundApprovalData: oprefundapprovaldatainterface[],
    operatorId: number,
    locationId: number
  ) {
    this.opRefundApprovalData = opRefundApprovalData;
    this.operatorId = operatorId;
    this.locationId = locationId;
  }
}
interface oprefundapprovaldatainterface {
  recordId: number;
  flag: number;
  hostName: string;
  risReason: string;
  serviceId: number;
  testStatus: number;
  iacode: string;
  registrationNo: number;
  billNo: string;
  itemName: string;
}
