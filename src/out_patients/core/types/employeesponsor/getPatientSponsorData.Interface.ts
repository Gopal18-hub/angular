export interface GetPatientSponsorDataInterface {
  objPatientDemographicData: objPatientDemographicDataInterface[];
  objEmployeeDependentData: objEmployeeDependentDataInterface[];
  objPatientSponsorDataAuditTrail: objPatientSponsorDataAuditTrailInterface[];
}

interface objPatientDemographicDataInterface {
  iacode: string;
  registrationNo: number;
  ptnName: string;
  sexname: string;
  dateOfBirth: string;
  ageWithName: string;
  ssn: string;
  nationality: string;
  mobileNo: string;
  complayId: number;
  corporateid: number;
  empCode: string;
  validfrom: string;
  validto: string;
}
interface objEmployeeDependentDataInterface {
  relationship: string;
  id: number;
  groupCompanyName: string;
  empCode: string;
  empName: string;
  doj: string;
  dependentName: string;
  relationship1: string;
  dob: string;
  gender: string;
  location: string;
  empStatus: string;
  flag: number;
  enterDate: string;
  enterBy: number;
  department: string;
  remark: string;
  maxid: string;
  age: string;
  remark_disabled?: boolean;
}

interface objPatientSponsorDataAuditTrailInterface {
  iacode: string;
  registrationNo: number;
  companyId: number;
  addedDateTime: string;
  addedBy: string;
  updatedDateTime: string;
  updatedBy: string;
  channelid: true;
  deleted: true;
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
}
