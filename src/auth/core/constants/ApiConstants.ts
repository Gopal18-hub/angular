import { environment } from "@environments/environment";

export namespace ApiConstants {
  export const validate_username = (UserName: String) => {
    return `${environment.IdentityServerUrl}api/authenticate/validateusernamebyad?UserName=${UserName}`;
  };

  export const validateADCredentials = (UserName: string, Password: string) => {
    return `${environment.IdentityServerUrl}api/authenticate/validateadcredentials?UserName=${UserName}&Password=${Password}`;
  };

  export const autheticate = environment.IdentityServerUrl + "api/authenticate";

  export const sessionCreation = () => {
    return `${environment.IdentityServerUrl}api/authenticate/createSession`;
  };
  export const deleteactivesession = (userId: number) => {
    return `${environment.IdentityServerUrl}api/authenticate/deleteActiveSession?userid=${userId}`;
  };

  export const updateActiveSessionToken = () => {
    return `${environment.IdentityServerUrl}api/authenticate/updateActiveSessionToken`;
  };

  export const clearCookies = `${environment.IdentityServerUrl}api/authenticate/clearCookies`;

  export const searchPatientDefault = (HsplocationId: number) => {
    return (
      environment.PatientApiUrl +
      "api/patient/getallpatientssearch?HsplocationId=" +
      `${HsplocationId}`
    );
  };

  //PATIENT TITLE MR/MRS etc.. RESPOSE TYPE sourceOfInfoModel[] NEED TO CANCATINATE $hspLocation/0 IN ENDPOINT
  export const searchPatientApi = (
    maxId?: string,
    SSN?: string,
    Name?: string,
    PhoneNumber?: string,
    DOB?: string,
    AadhaarId?: string,
    HealthId?: string
  ) => {
    return (
      environment.PatientApiUrl +
      "api/patient/getallpatientssearch?MaxId=" +
      maxId +
      "&SSN=" +
      SSN +
      "&Name=" +
      Name +
      "&PhoneNumber=" +
      PhoneNumber +
      "&DOB=" +
      DOB +
      "&AadhaarId=" +
      AadhaarId +
      "&HealthId=" +
      HealthId
    );
  };
}
