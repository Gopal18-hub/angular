import { environment } from "@environments/environment";

export namespace CommonApiConstants {
  //PATIENT AGE RESPONSE TYPE ageTypeModel[]
  export const ageTypeLookUp =
    environment.CommonApiUrl + "api/lookup/agetypelookup/0";

  //PATIENT GENDER RESPONSE TYPE genderModel[]
  export const genderLookUp =
    environment.CommonApiUrl + "api/lookup/genderlookup/0";

  // doctor save
 
    export const saveDoctor = (
      ) =>{
        return (
          environment.BillingApiUrl +
          "api/outpatientbilling/savenewtempreferraldoctor" 
        );
      };
    export const getdoctor = (
      Type: number,
      ReferralDoctorName?: string
    ) => {
      return (
        environment.BillingApiUrl +
        "api/outpatientbilling/getdoctorinfo/" +
        Type +
        "?DoctorName=" +
        ReferralDoctorName
      );
    };
    //spcialisation for doctors
    export const getspecialization = `${environment.PatientApiUrl}api/patient/getspecialization`;
    export const getsimilarsoundreferraldoctor = (
      speciality: string,
      DoctorName:string,
      mobile: string
    ) =>
    `${environment.PatientApiUrl}api/patient/getsimilarsoundreferraldoctor/${speciality}?DoctorName=${DoctorName}&mobile=${mobile}`;
}
