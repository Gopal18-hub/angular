import { environment } from "@environments/environment";

export namespace PharmacyApiConstants {
  // EP Order API Start
  export const epordersearch =
    environment.PatientApiUrl + "api/patient/geteprescriptdrugorders_pharmacy";
  export const eporderdetails =
    environment.PatientApiUrl + "api/patient/getphysicianorderdetailep";
  export const eporderdelete =
    environment.PatientApiUrl + "api/patient/eporderdelete";
  // EP Order API End
}
