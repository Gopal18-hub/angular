export class SaveandDeleteOpOrderRequest {
  flag: number;
  maxid: string;
  reqItemDetail: string;
  opOrderRequestId: string;
  userId: number;
  hsplocationid: number;
  constructor(
    flag: number,
    maxid: string,
    reqItemDetail: string,
    opOrderRequestId: string,
    userId: number,
    hsplocationid: number
  ) {
    this.flag = flag;
    this.maxid = maxid;
    this.reqItemDetail = reqItemDetail;
    this.opOrderRequestId = opOrderRequestId;
    this.userId = userId;
    this.hsplocationid = hsplocationid;
  }
}
