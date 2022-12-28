// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  ApiUrl: "",
  cookieUrl: "localhost",
  passwordResetUrl: "https://selfheal.maxhealthcare.com/resetaccount",
  //dev environment urls
  // CommonApiUrl: "http://172.30.0.16:1009/",
  // PatientApiUrl: "http://172.30.0.16:1008/",
  CommonApiUrl: "https://MaxHIS-Common-sit.maxhealthcare.in/",
  PatientApiUrl: "https://MaxHIS-OpReg-sit.maxhealthcare.in/",

  // IdentityServerUrl: "https://maxhis-idsrv-dev.maxhealthare.in/",
  // IentityServerRedirectUrl: "https://maxhis-dev.maxhealthcaredev.in/",
  ReportsApiUrl: "https://MaxHIS-Reports-dev.maxhealthcare.in/",
  BillingApiUrl: "https://Maxhis-OPBill-sit.maxhealthcare.in/", //"http://localhost:7003/", //"http://172.30.0.16:1007/",
  ReportsSampleUrl: "https://MaxHIS-Reports-dev.maxhealthcare.in/",
  reportTenantUrl: "http://localhost:4205/reports/crystal-report/popup/",
  crystalReportBaseUrl: "https://MaxHIS-Reports-sit.maxhealthcare.in/",

  //local envionment urls for testing
  IdentityServerUrl: "https://localhost:5001/",
  IentityServerRedirectUrl: "http://localhost:8100/",

  // IdentityServerUrl: "https://172.25.0.41/",
  //IentityServerRedirectUrl: "https://localhost:5002/",

  clientId: "hispwa",
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
