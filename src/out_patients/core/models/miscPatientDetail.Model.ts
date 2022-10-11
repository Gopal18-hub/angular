export class miscPatientDetail {
  registrationno?: number;
  iacode?: string;
  billAmount?: number;
  depositAmount?: number;
  discountAmount?: number;
  stationid?: number;
  billType?: number;
  categoryId?: number;
  companyId?: number;
  operatorId?: number;
  collectedamount?: number;
  balance?: number;
  hsplocationid?: number;
  refdoctorid?: number;
  oldopbillid?: number;
  serviceTax?: number;
  creditLimit?: number;
  tpaId?: number;
  paidbyTPA?: number;
  interactionID?: number;
  corporateid?: number;
  corporateName?: string;
  channelId?: number;
  billToCompany?: number;
  invoiceType?: string;
  narration?: string;
  authorisedid?: number;
  mail?: string;
  cellNo?: string;
  paNno?: string;
  constructor(
    registrationno?: number,
    iacode?: string,
    billAmount?: number,
    depositAmount?: number,
    discountAmount?: number,
    stationid?: number,
    billType?: number,
    categoryId?: number,
    companyId?: number,
    operatorId?: number,
    collectedamount?: number,
    balance?: number,
    hsplocationid?: number,
    refdoctorid?: number,
    oldopbillid?: number,
    serviceTax?: number,
    creditLimit?: number,
    tpaId?: number,
    paidbyTPA?: number,
    interactionID?: number,
    corporateid?: number,
    corporateName?: string,
    channelId?: number,
    billToCompany?: number,
    invoiceType?: string,
    narration?: string,
    authorisedid?: number,
    mail?: string,
    cellNo?: string,
    paNno?: string
  ) {
    this.registrationno = registrationno;
    this.iacode = iacode;
    this.billAmount = billAmount;
    this.depositAmount = depositAmount;
    this.discountAmount = discountAmount;
    this.stationid = stationid;
    this.billType = billType;
    this.categoryId = categoryId;
    this.companyId = companyId;
    this.operatorId = operatorId;
    this.collectedamount = collectedamount;
    this.balance = balance;
    this.hsplocationid = hsplocationid;
    this.refdoctorid = refdoctorid;
    this.oldopbillid = oldopbillid;
    this.serviceTax = serviceTax;
    this.creditLimit = creditLimit;
    this.tpaId = tpaId;
    this.paidbyTPA = paidbyTPA;
    this.interactionID = interactionID;
    this.corporateid = corporateid;
    this.corporateName = corporateName;
    this.channelId = channelId;
    this.billToCompany = billToCompany;
    this.invoiceType = invoiceType;
    this.narration = narration;
    this.authorisedid = authorisedid;
    this.mail = mail;
    this.cellNo = cellNo;
    this.paNno = paNno;
  }
}
