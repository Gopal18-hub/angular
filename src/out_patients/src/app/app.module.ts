import { NgModule, ModuleWithProviders } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import {
  AppRoutingModule,
  OutPatientRoutingModule,
} from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HeaderModule } from "@shared/modules/header";
import { BillingModule } from "@modules/billing";
import { RegistrationModule } from "@modules/registration";
import { PatientHistoryModule } from "@modules/patient-history";
import { EmployeeSponsorTaggingModule } from "@modules/employee-sponsor-tagging";
import { QmsModule } from "@modules/qms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { MaxHealthMessageDialogModule } from "@shared/ui/message-dialog";
import { TokenInterceptor } from "@shared/services/interceptors/token.interceptor";
import { DatePipe } from "@angular/common";
import { APP_BASE_HREF } from "@angular/common";
import { AuthService } from "@shared/services/auth.service";
import { HttpService } from "@shared/services/http.service";
import { MessageDialogService } from "@shared/ui/message-dialog/message-dialog.service";
import { SearchService } from "@shared/services/search.service";
import { CookieService } from "@shared/services/cookie.service";
import { AcdModule } from "@modules/acd";
import { StaffDeptModule } from "@modules/staff-dept";
import { ReportsModule } from "@modules/reports";
import { ConfigureModule } from "@modules/configure";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

const importModules = [
  HeaderModule,
  BillingModule,
  RegistrationModule,
  HttpClientModule,
  //MaxHealthSnackBarModule,
  EmployeeSponsorTaggingModule,
  MaxHealthMessageDialogModule,
  PatientHistoryModule,
  QmsModule,
  AcdModule,
  StaffDeptModule,
  ReportsModule,
  ConfigureModule,
];

const providers = [
  DatePipe,
  {
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptor,
    multi: true,
  },
  AuthService,
  HttpService,
  MessageDialogService,
  SearchService,
  CookieService,
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ...importModules,
    AppRoutingModule,
    MatProgressSpinnerModule,
  ],
  providers: [
    ...providers,
    { provide: APP_BASE_HREF, useValue: "/out-patients" },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

@NgModule({
  imports: [...importModules, OutPatientRoutingModule],
  providers: [...providers],
})
export class OutPatientModule {}
