import { environment } from "@environments/environment";

export namespace CommonApiConstants {
  //PATIENT AGE RESPONSE TYPE ageTypeModel[]
  export const ageTypeLookUp =
    environment.CommonApiUrl + "api/lookup/agetypelookup/0";

  //PATIENT GENDER RESPONSE TYPE genderModel[]
  export const genderLookUp =
    environment.CommonApiUrl + "api/lookup/genderlookup/0";

  export const getcompanydetail = (locationId: number) => {
    return `${environment.CommonApiUrl}api/lookup/getcompanydetail/${locationId}`;
  };

  // doctor save

  export const saveDoctor = () => {
    return (
      environment.BillingApiUrl +
      "api/outpatientbilling/savenewtempreferraldoctor"
    );
  };
  export const getdoctor = (Type: number) => {
    return (
      environment.BillingApiUrl +
      "api/outpatientbilling/getdoctorinfo/" +
      Type 
     
    );
  };
  //spcialisation for doctors
  export const getspecialization = `${environment.PatientApiUrl}api/patient/getspecialization`;
  export const getdoctordetail = (
    
    DoctorID:number
  ) =>
    `${environment.PatientApiUrl}api/patient/getsimilarsoundreferraldoctor/${DoctorID}`;
    export const getsimilarsoundreferraldoctor = (
      speciality: string,
      DoctorName: string,
      mobile: string
    ) =>
      `${environment.PatientApiUrl}api/patient/getsimilarsoundreferraldoctor_pharm/${speciality}?DoctorName=${DoctorName}&mobile=${mobile}`;
}
