import { environment } from "@environments/environment";

export namespace ApiConstants {
  export const validate_username =
    environment.IdentityServerUrl +
    "api/authenticate/validateusernamebyad?UserName=";

  export const autheticate = environment.IdentityServerUrl + "api/authenticate";

  export const searchPatientDefault =
    environment.PatientApiUrl + "api/patient/getallpatientssearch";

 //PATIENT TITLE MR/MRS etc.. RESPOSE TYPE sourceOfInfoModel[] NEED TO CANCATINATE $hspLocation/0 IN ENDPOINT
 export const searchPatientApi = (maxId?: string,
  SSN?:string,
  Name?:string,
  PhoneNumber?:string,
  DOB?:string,
  AadhaarId?:string,
  HealthId?:string
  ) => {
  return (
    environment.PatientApiUrl + 'api/patient/getallpatientssearch?MaxId='+maxId+'&SSN='+SSN+'&Name='+Name+'&PhoneNumber='+PhoneNumber+'&DOB='+DOB+'&AadhaarId='+AadhaarId+'&HealthId='+HealthId
  );
};

}
