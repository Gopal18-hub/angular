export class searchFormModel {
  type: string;
  value: string;
  fromdate: any;
  todate: any;
  orderstatus: string;
  constructor(
    type: string,
    value: string,
    fromdate: any,
    todate: any,
    orderstatus: string
  ) {
    this.type = type;
    this.value = value;
    this.fromdate = fromdate;
    this.todate = todate;
    this.orderstatus = orderstatus;
  }
}
