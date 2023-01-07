export interface MiscMasterDataModel {
  objMiscBillingConfigurationList: objMiscBillingConfigurationList[];
  objMiscBillingRemarksList: objMiscBillingRemarksList[];
  objMiscDoctorsList: objMiscDoctorsList[];
}
export interface objMiscBillingConfigurationList {
  id: number;
  name: string;
  ismodify: true;
  serviceid: number;
}
export interface objMiscBillingRemarksList {
  id: number;
  name: string;
}

export interface objMiscDoctorsList {
  id: number;
  name: string;
}
