export class SaveDeleteEmployeeSponsorResponse {
  iacode: string;
  registrationNo: number;
  companyId: number;
  addedDateTime: any;
  addedBy: string;
  updatedDateTime: any;
  updatedBy: string;
  channelid: boolean;
  deleted: boolean;
  orderid: number;
  company: string;
  corporateid: number;
  empid: number;
  empcode: string;
  empRelationship: boolean;
  remark: string;
  validfrom: string;
  validto: string;
  slno: number;
  flag: boolean;
  constructor(
    iacode: string,
    registrationNo: number,
    companyId: number,
    addedDateTime: string,
    addedBy: string,
    updatedDateTime: string,
    updatedBy: string,
    channelid: boolean,
    deleted: boolean,
    orderid: number,
    company: string,
    corporateid: number,
    empid: number,
    empcode: string,
    empRelationship: boolean,
    remark: string,
    validfrom: string,
    validto: string,
    slno: number,
    flag: boolean
  ) {
    this.iacode = iacode;
    this.registrationNo = registrationNo;
    this.companyId = companyId;
    this.addedDateTime = addedDateTime;
    this.addedBy = addedBy;
    this.updatedDateTime = updatedDateTime;
    this.updatedBy = updatedBy;
    this.channelid = channelid;
    this.deleted = deleted;
    this.orderid = orderid;
    this.company = company;
    this.corporateid = corporateid;
    this.empid = empid;
    this.empcode = empcode;
    this.empRelationship = empRelationship;
    this.remark = remark;
    this.validfrom = validfrom;
    this.validto = validto;
    this.slno = slno;
    this.flag = flag;
  }
}
