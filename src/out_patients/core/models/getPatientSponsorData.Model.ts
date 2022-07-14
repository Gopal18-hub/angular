export class GetPatientSponsorDataModel {
  objPatientSponsorFlag: objPatientSponsorFlaginterface[];
  objPatientSponsorData: objPatientSponsorDatainterface[];
  constructor(
    objPatientSponsorFlag: objPatientSponsorFlaginterface[],
    objPatientSponsorData: objPatientSponsorDatainterface[]
  ) {
    this.objPatientSponsorFlag = objPatientSponsorFlag;
    this.objPatientSponsorData = objPatientSponsorData;
  }
}

interface objPatientSponsorFlaginterface {
  name: string;
  id: number;
  isTPA: number;
  creditAllow: number;
  companyIOM: string;
  iomValidity: string;
  staffAgeValidityCheck: boolean;
  iacode: string;
  registrationNo: string;
  empid: number;
  empcode: string;
  empRelationship: boolean;
  remark: string;
  dob: string;
}

interface objPatientSponsorDatainterface {
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
  empRelationship: true;
  remark: string;
  validfrom: string;
  validto: string;
}
