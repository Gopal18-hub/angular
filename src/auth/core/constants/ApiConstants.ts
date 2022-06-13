import { environment } from "@environments/environment";

export namespace ApiConstants {
  export const validate_username =
    environment.IdentityServerUrl +
    "api/authenticate/validateusernamebyad?UserName=";

  export const autheticate = environment.IdentityServerUrl + "api/authenticate";

  export const searchPatientDefault =
    environment.PatientApiUrl + "api/patient/getallpatientssearch";

  export function getSearchPatientUrl(
    MaxId?: string,
    Name?: string,
    PhoneNumber?: string,
    DOB?: string,
    AadhaarId?: string,
    HealthId?: string
  ) {
    let searchPatient =
      environment.PatientApiUrl +
      "api/patient/getallpatientssearch?MaxId=${MaxId}&Name=${Name}&PhoneNumber=${PhoneNumber}&DOB=${DOB}&AadhaarId=${AadhaarId}&HealthId=${HealthId}";

    return searchPatient;
  }
}
