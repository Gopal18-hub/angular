import { environment } from "@environments/environment";

export namespace BillingApiConstants {
  export const getforegexpiredpatientdetails = (
    IACode: string,
    RegistrationNo: number,
    fromTime?: string,
    toTime?: string,
    locationID?: string
  ) =>
    `${environment.BillingApiUrl}api/outpatientbilling/getforegexpiredpatientdetails/${RegistrationNo}/${IACode}`;

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
