import { environment } from "@environments/environment";

export namespace CommonApiConstants {
  //PATIENT AGE RESPONSE TYPE ageTypeModel[]
  export const ageTypeLookUp =
    environment.CommonApiUrl + "api/lookup/agetypelookup/0";

  //PATIENT GENDER RESPONSE TYPE genderModel[]
  export const genderLookUp =
    environment.CommonApiUrl + "api/lookup/genderlookup/0";

  // doctor save
  export const referraldoctorsave = (
    DoctorName: string,
    MobileNumber: string,
    SpecialisationId: string,
    UserId: string
  ) =>
    `${environment.CommonApiUrl}api/lookup/referraldoctorsave/${DoctorName}/${MobileNumber}/${SpecialisationId}/${UserId}`;
}
