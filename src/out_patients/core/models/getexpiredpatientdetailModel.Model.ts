export class GetExpiredPatientDetailModel {
  regno: string;
  dateofBirth: string;
  dateofRegistration: string;
  flagexpired: boolean;
  remarks: string;
  expiryDate: string;
  ssn: string;
  dob: number;
  constructor(
    regno: string,
    dateofBirth: string,
    dateofRegistration: string,
    flagexpired: boolean,
    remarks: string,
    expiryDate: string,
    ssn: string,
    dob: number
  ) {
    this.regno = regno;
    this.dateofBirth = dateofBirth;
    this.dateofRegistration = dateofRegistration;
    this.flagexpired = flagexpired;
    this.remarks = remarks;
    this.expiryDate = expiryDate;
    this.ssn = ssn;
    this.dob = dob;
  }
}
