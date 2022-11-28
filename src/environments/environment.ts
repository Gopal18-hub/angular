// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  ApiUrl: "",
  cookieUrl: "localhost",
  passwordResetUrl: "https://selfheal.maxhealthcare.com/resetaccount",
  //dev environment urls
  CommonApiUrl: "http://172.30.0.16:1009/",
  PatientApiUrl: "http://172.30.0.16:1008/",

  //IdentityServerUrl: 'https://MaxHIS-Idsrv-dev.maxhealthcare.in/',
  //IentityServerRedirectUrl:'http://172.30.0.16/',
  ReportsApiUrl: "https://MaxHIS-Reports-dev.maxhealthcare.in/",
  BillingApiUrl: "http://172.30.0.16:1007/",
  ReportsSampleUrl: "https://MaxHIS-Reports-dev.maxhealthcare.in/",
  reportTenantUrl: "http://localhost:4205/reports/crystal-report/popup/",
  crystalReportBaseUrl: "https://MaxHIS-Reports-sit.maxhealthcare.in/",

  //local envionment urls for testing
  IdentityServerUrl: "https://localhost:5001/",
  IentityServerRedirectUrl: "http://localhost:8100/",
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
