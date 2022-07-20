export class SaveExpiredPatientModel {
  iacode: string;
  regNo: number;
  name: string;
  dateofBirth: any;
  regDatetime: string;
  expiryDate: any;
  flagExpired: number;
  remarks: string;
  operatorid: number;
  errorDetails: string;
  constructor(
    iacode: string,
    regNo: number,
    name: string,
    dateofBirth: any,
    regDatetime: string,
    expiryDate: any,
    flagExpired: number,
    remarks: string,
    operatorid: number,
    errorDetails: string
  ) {
    this.iacode = iacode;
    this.regNo = regNo;
    this.name = name;
    this.dateofBirth = dateofBirth;
    this.regDatetime = regDatetime;
    this.expiryDate = expiryDate;
    this.flagExpired = flagExpired;
    this.remarks = remarks;
    this.operatorid = operatorid;
    this.errorDetails = errorDetails;
  }
}
