import { environment } from "@environments/environment";

export namespace BillingApiConstants {
  export const getcompanydetail = (locationId: number) => {
    return `${environment.CommonApiUrl}api/lookup/getcompanydetail/${locationId}`;
  };

  export const getopcompanyiomlocationwise = (
    locationId: number,
    companyId: number
  ) => {
    return `${environment.PatientApiUrl}api/patient/getopcompanyiomlocationwise/${locationId}/${companyId}`;
  };

  export const getsimilarsoundopbilling = (
    IACode: string,
    RegistrationNo: number
  ) => {
    return `${environment.BillingApiUrl}api/outpatientbilling/getsimilarsoundopbilling/${RegistrationNo}/${IACode}`;
  };

  export const getclinics = (locationId: number) => {
    return `${environment.CommonApiUrl}api/lookup/getclinics/${locationId}`;
  };

  export const getspecialization = `${environment.PatientApiUrl}api/patient/getspecialization`;

  export const getbillingdoctorsonsearch = (
    doctorName: string,
    locationId: number
  ) => {
    return `${environment.BillingApiUrl}api/outpatientbilling/getbillingdoctorsonsearch${doctorName}/${locationId}`;
  };

  export const getdoctorlistonSpecializationClinic = (
    isClinic: boolean,
    clinicSpecializationId: number,
    locationId: number
  ) => {
    return `${environment.BillingApiUrl}api/outpatientbilling/getdoctorlistonSpecializationClinic/${isClinic}/${clinicSpecializationId}/${locationId}`;
  };

  export const getinvestigationfromphysician = (
    IACode: string,
    RegistrationNo: number,
    locationId: string
  ) => {
    return `${environment.BillingApiUrl}api/outpatientbilling/getinvestigationfromphysician/${IACode}/${RegistrationNo}/${locationId}`;
  };

  export const getPrice = (
    priorityId: number,
    itemId: number,
    serviceId: number,
    hspLocationid: string
  ) => {
    return `${environment.BillingApiUrl}api/outpatientbilling/getpriceforitemwithtariffid/${priorityId}/${itemId}/${serviceId}/${hspLocationid}`;
  };

  export const getcalculateopbill = `${environment.BillingApiUrl}api/outpatientbilling/getcalculateopbill`;

  export const getPriceBulk = (
    hspLocationid: string,
    companyId: number = 0
  ) => {
    return `${environment.BillingApiUrl}api/outpatientbilling/getcalculateopbillformultiple/${companyId}/${hspLocationid}?IPOPTYPE=1&BedType=0`;
  };

  export const consultationTypes = `${environment.CommonApiUrl}api/lookup/getconsultationtype`;

  export const getInvetigationPriorities = `${environment.CommonApiUrl}api/lookup/getinvestigationpriority`;

  export const getinvestigationservice = `${environment.CommonApiUrl}api/lookup/getinvestigationservice`;

  export const getinvestigation = (locationId: number, serviceId: number) => {
    return `${environment.CommonApiUrl}api/lookup/getinvestigation/${locationId}/${serviceId}`;
  };

  export const getinvestigationSearch = (
    locationId: number,
    searchKey: string
  ) => {
    return `${environment.CommonApiUrl}api/lookup/getinvestigationonsearch/${locationId}/${searchKey}`;
  };

  export const gethealthcheckups = (locationId: number, departmentID: any) => {
    return `${environment.CommonApiUrl}api/lookup/gethealthcheckups/${locationId}/${departmentID}`;
  };
  export const getotherservice = `${environment.CommonApiUrl}api/lookup/getotherservice`;

  export const getotherserviceop = (locationId: number) => {
    return `${environment.CommonApiUrl}api/lookup/getotherserviceforop/${locationId}`;
  };

  export const getotherservicebilling = (
    locationId: number,
    servicingId: number
  ) => {
    return `${environment.CommonApiUrl}api/lookup/getotherservicebilling/${locationId}/${servicingId}`;
  };

  export const getotherservicebillingSearch = (
    locationId: number,
    searchKey: string
  ) => {
    return `${environment.CommonApiUrl}api/lookup/getotherservicebillingonsearch/${locationId}/${searchKey}`;
  };

  export const gethealthcheckupsonsearch = (
    locationId: number,
    searchKey: string
  ) => {
    return `${environment.CommonApiUrl}api/lookup/gethealthcheckupsonsearch/${locationId}/${searchKey}`;
  };

  export const departmentlookup = `${environment.CommonApiUrl}api/lookup/departmentlookup`;

  export const getOrderSet = (locationId: number) =>
    `${environment.BillingApiUrl}api/outpatientbilling/getordersetforbilling/${locationId}`;

  export const consumableData = (
    IACode: string,
    RegistrationNo: number,
    locationId: string
  ) =>
    `${environment.BillingApiUrl}api/outpatientbilling/getdetailsforthepatientforsurgery/${IACode}/${RegistrationNo}/${locationId}`;

  export const checkpriceforzeroitemid = (
    itemCode: string,
    locationId: string,
    type: string
  ) =>
    `${environment.BillingApiUrl}api/outpatientbilling/checkpriceforzeroitemid/${itemCode}/${locationId}/${type}`;

  export const getotherplanretrieve = (
    IACode: string,
    RegistrationNo: number,
    planId: string
  ) =>
    `${environment.BillingApiUrl}api/outpatientbilling/getotherplanretrieve/${planId}/${IACode}/${RegistrationNo}`;

  export const getselectedhappyfamilyplandetail = (
    IACode: string,
    RegistrationNo: number,
    planId: string,
    locationId: string
  ) =>
    `${environment.BillingApiUrl}api/outpatientbilling/getselectedhappyfamilyplandetail/${RegistrationNo}/${IACode}/${planId}/${locationId}`;

  export const getforonlinebilldetails = (
    IACode: string,
    RegistrationNo: number,
    locationId: string
  ) =>
    `${environment.BillingApiUrl}api/outpatientbilling/getforonlinebilldetails/${RegistrationNo}/${IACode}/${locationId}`;

  export const getforegexpiredpatientdetails = (
    IACode: string,
    RegistrationNo: number,
    fromTime?: string,
    toTime?: string,
    locationID?: string
  ) =>
    `${environment.BillingApiUrl}api/outpatientbilling/getforegexpiredpatientdetails/${RegistrationNo}/${IACode}`;

  export const getunorderedpatientvisits = (
    IACode: string,
    RegistrationNo: number
  ) =>
    `${environment.BillingApiUrl}api/outpatientbilling/getunorderedpatientvisits/${RegistrationNo}/${IACode}`;

  export const gethisdecommissionconfigurationvalue = (
    decommissionType: string,
    locationId: string
  ) =>
    `${environment.BillingApiUrl}api/outpatientbilling/getunorderedpatientvisits/${decommissionType}/${locationId}`;

  export const isopdoctorinbulk = (DoctorsId: string, HsplocationId: string) =>
    `${environment.BillingApiUrl}api/outpatientbilling/isopdoctorinbulk/${DoctorsId}/${HsplocationId}`;

  export const dmgList = (
    IACode: string,
    RegistrationNo: number,
    locationId: string,
    doctorId: number
  ) =>
    `${environment.BillingApiUrl}api/outpatientbilling/getlastgroupdoctorselected/${IACode}/${RegistrationNo}/${locationId}/${doctorId}`;

  export const getediganosticacdoninvestigationgrid = (
    locationid: string,
    orderId: number,
    RegistrationNo: number,
    IACode: string
  ) =>
    `${environment.PatientApiUrl}patient/getediganosticacdoninvestigationgrid/${locationid}/${orderId}/${RegistrationNo}/${IACode}`;

  export const checkPatientSex = (
    testId: string,
    gender: string,
    serviceId: string,
    type: string
  ) =>
    `${environment.BillingApiUrl}api/outpatientbilling/checkPatientSex/${testId}/${gender}/${serviceId}/${type}`;

  export const getHealthCheckupdetails = (hcuid: string, serviceid: string) =>
    `${environment.BillingApiUrl}api/outpatientbilling/getHealthCheckupdetails/${hcuid}/${serviceid}`;
}
