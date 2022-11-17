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
    DoctorId: number
  ) => {
    return (
      environment.BillingApiUrl +
      "api/outpatientbilling/getoppatientvisithistory/" +
      IACode +
      "/" +
      RegistrationNo +
      "/" +
      LocationId +
      "?" +
      DoctorId
    );
  };
  // export const getPermissions = `${environment.IdentityServerUrl}api/MaxPermission/getpermissionmatrixrolewise`;

  export const getPOSMachineMaster = (
    locationId: number,
    stationId: number
  ) => {
    return `${environment.BillingApiUrl}api/outpatientbilling/GetPosMachineMaster/${stationId}/${locationId}`;
  };
}
