import { environment } from "@environments/environment";

export namespace ApiConstants {
  export const logout = `${environment.IdentityServerUrl}api/authenticate/Logout`;

  export const getPermissions = (RoleIds: string) => {
    return (
      `${environment.IdentityServerUrl}api/MaxPermission/getpermissionmatrixrolewise?RoleIds=[` +
      `${RoleIds}` +
      `]`
    );
  };

  export const getpatientvisithistory = (
    IACode: string,
    RegistrationNo: number,
    LocationId: number,
    DoctorId: number,
    IsConsult: boolean
  ) => {
    return (
      environment.BillingApiUrl +
      "api/outpatientbilling/getoppatientvisithistory/" +
      IACode +
      "/" +
      RegistrationNo +
      "/" +
      LocationId +
      "?IsConsult=" +
      IsConsult
    );
  };
  // export const getPermissions = `${environment.IdentityServerUrl}api/MaxPermission/getpermissionmatrixrolewise`;

  export const getPOSMachineMaster = (
    locationId: number,
    stationId: number
  ) => {
    return `${environment.BillingApiUrl}api/outpatientbilling/GetPosMachineMaster/${stationId}/${locationId}`;
  };

  export const getgstvistaliveflag = (locationId: number) => {
    return `${environment.BillingApiUrl}api/outpatientbilling/getgstvistaliveflag/${locationId}`;
  };

  export const getPayTmMachineMaster = (
    locationId: number,
    stationId: number
  ) => {
    return `${environment.BillingApiUrl}api/outpatientbilling/fectchpaytmdevice/${stationId}/${locationId}`;
  };
}
