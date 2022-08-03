import { environment } from "@environments/environment";

export namespace BillingApiConstants {
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

  export const getclinics = () => {
    return environment.CommonApiUrl + "api/lookup/getclinics/7";
  };

  export const getspecialization =
    environment.PatientApiUrl + "api/patient/getspecialization";

  export const getdoctorlistonSpecializationClinic = (
    isClinic: boolean,
    clinicSpecializationId: number,
    locationId: number
  ) => {
    return `${environment.BillingApiUrl}api/outpatientbilling/getdoctorlistonSpecializationClinic/${isClinic}/${clinicSpecializationId}/${locationId}`;
  };
}
