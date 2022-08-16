import { environment } from "@environments/environment";

export namespace BillingApiConstants {
  export const getcompanyandpatientsponsordata = (locationId: number) => {
    return `${environment.PatientApiUrl}api/patient/getcompanyandpatientsponsordata/${locationId}`;
  };

  export const getsimilarsoundopbilling = (
    IACode: string,
    RegistrationNo: number
  ) => {
    return (
      environment.BillingApiUrl +
      "api/outpatientbilling/getsimilarsoundopbilling/" +
      RegistrationNo +
      "/" +
      IACode
    );
  };

  export const getclinics = (locationId: number) => {
    return environment.CommonApiUrl + `api/lookup/getclinics/${locationId}`;
  };

  export const getspecialization =
    environment.PatientApiUrl + "api/patient/getspecialization";

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
    return `${environment.CommonApiUrl}api/lookup/getotherservicebillingonsearch//${locationId}/${searchKey}`;
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
}
