export class SaveDeleteEmployeeSponsorRequest {
  flag: number;
  compid: number;
  orderid: number;
  regno: string;
  iacode: string;
  locationid: number;
  userid: number;
  corporateid: number;
  channelid: boolean;
  empid: number;
  empcode: string;
  relation: number;
  remark: string;
  validfrom: string;
  vaildto: string;
  isdate: number;
  constructor(
    flag: number,
    compid: number,
    orderid: number,
    regno: string,
    iacode: string,
    locationid: number,
    userid: number,
    corporateid: number,
    channelid: boolean,
    empid: number,
    empcode: string,
    relation: number,
    remark: string,
    validfrom: string,
    vaildto: string,
    isdate: number
  ) {
    this.flag = flag;
    this.compid = compid;
    this.orderid = orderid;
    this.regno = regno;
    this.iacode = iacode;
    this.locationid = locationid;
    this.userid = userid;
    this.corporateid = corporateid;
    this.channelid = channelid;
    this.empid = empid;
    this.empcode = empcode;
    this.relation = relation;
    this.remark = remark;
    this.validfrom = validfrom;
    this.vaildto = vaildto;
    this.isdate = isdate;
  }
}
