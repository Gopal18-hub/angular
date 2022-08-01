export class SaveDmgpatientModel {
  oPBillID: number;
  unitDocID: number;
  docID: number;
  otherGroupDocRemark: string;
  registrationno: number;
  iacode: string;
  operatorid: number;
  hsplocationid: number;
  errorDetails: string;
  constructor(
    oPBillID: number,
    unitDocID: number,
    docID: number,
    otherGroupDocRemark: string,
    registrationno: number,
    iacode: string,
    operatorid: number,
    hsplocationid: number,
    errorDetails: string
  ) {
    this.oPBillID = oPBillID;
    this.unitDocID = unitDocID;
    this.docID = docID;
    this.otherGroupDocRemark = otherGroupDocRemark;
    this.registrationno = registrationno;
    this.iacode = iacode;
    this.operatorid = operatorid;
    this.hsplocationid = hsplocationid;
    this.errorDetails = errorDetails;
  }
}
