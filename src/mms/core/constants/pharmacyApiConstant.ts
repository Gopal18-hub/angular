import { environment } from "@environments/environment";

export namespace PharmacyApiConstants {
  // EP Order API Start
  export const epordersearch =
    environment.PatientApiUrl + "api/patient/geteprescriptdrugorders_pharmacy";
  export const eporderdetails =
    environment.PatientApiUrl + "api/patient/getphysicianorderdetailep";
  export const eporderdelete =
    environment.BillingApiUrl + "api/outpatientbilling/deleteeporder";
  export const eporderorderscounter =
    environment.PatientApiUrl + "api/patient/geteprescriptdrugorderscounter";

  // EP Order API End

  // Online Order API Start
  export const onlineordersearch =
    environment.PatientApiUrl + "api/patient/getonlineorders_pharmacy";
  export const onlineorderdelete =
    environment.BillingApiUrl + "api/outpatientbilling/deleteonlinorder";
  // Online Order API End
}
