import { environment } from "@environments/environment";

export namespace PharmacyApiConstants {
  //PATIENT AGE RESPONSE TYPE ageTypeModel[]
  export const ageTypeLookUp =
    environment.CommonApiUrl + "api/lookup/agetypelookup/0";

  //PATIENT GENDER RESPONSE TYPE genderModel[]
  export const genderLookUp =
    environment.CommonApiUrl + "api/lookup/genderlookup/0";

  /* ----------------------------------------------------------------------------------------------------------
    ------------------------------PatientApiUrl ENDPOINTS-------------------------------------------------- 
    ----------------------------------------------------------------------------------------------------------*/

  //PATIENT DETAILS BY REGISTATION NUMBER(MANDATORY) AND IADCODE(MANDATORY) RESPONSE TYPE patientDetailsModel
  export const patientDetails = (registrationno: number, iacode: string) => {
    return (
      environment.PatientApiUrl +
      "api/patient/getpatientbymaxid/" +
      registrationno +
      "/" +
      iacode
    );
  };

  export const getforegexpiredpatientdetails = (
    IACode: string,
    RegistrationNo: number,
    fromTime?: string,
    toTime?: string,
    locationID?: string
  ) =>
    `${environment.BillingApiUrl}api/outpatientbilling/getforegexpiredpatientdetails/${RegistrationNo}/${IACode}`;

  export const similarSoundPatientDetail =
    environment.PatientApiUrl + "api/patient/getsimilarsoundpatient";

  export const getreferraldoctor = (
    Type: number,
    ReferralDoctorName?: string
  ) => {
    return (
      environment.BillingApiUrl +
      "api/outpatientbilling/getreferraldoctor/" +
      Type +
      "?ReferralDoctorName=" +
      ReferralDoctorName
    );
  };
}
