import { environment } from "@environments/environment";

export namespace PatientApiConstants {
  /* ----------------------------------------------------------------------------------------------------------
    ------------------------------PatientApiUrl ENDPOINTS-------------------------------------------------- 
    ----------------------------------------------------------------------------------------------------------*/

  //PATIENT DETAILS BY REGISTATION NUMBER(MANDATORY) AND IADCODE(MANDATORY) RESPONSE TYPE patientDetailsModel
  export const patientDetails = (registrationno: number, iacode: string) => {
    return (
      environment.PatientApiUrl +
      "api/patient/getpatientdetailsbymaxid_pharmacy/" + //getpatientdetailsbymaxid_pharmacy
      registrationno +
      "/" +
      iacode
    );
  };

  // export const similarSoundPatientDetail =
  //   environment.PatientApiUrl + "api/patient/GetSimilarPatientsPhoneNo"; //getsimilarsoundpatient

  export const similarSoundPatientDetail = (mobileno: number) => {
    return (
      environment.PatientApiUrl +
      "api/patient/getsimilarpatientsphoneno/" +
      mobileno
    );
  };

  //spcialisation for doctors
  export const getspecialization = `${environment.PatientApiUrl}api/patient/getspecialization`;
}
