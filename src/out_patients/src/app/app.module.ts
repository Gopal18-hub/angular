import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { HeaderModule } from "../../../shared/modules/header";

import { BillingModule } from "@modules/billing";
import { RegistrationModule } from "@modules/registration";
import { EmployeeSponsorTaggingModule } from "@modules/employee-sponsor-tagging";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { MaxHealthSnackBarModule } from "../../../shared/ui/snack-bar";
import { TokenInterceptor } from "../../../shared/services/interceptors/token.interceptor";
import { DatePipe } from "@angular/common";
import { APP_BASE_HREF } from "@angular/common";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HeaderModule,
    BillingModule,
    RegistrationModule,
    HttpClientModule,
    MaxHealthSnackBarModule,
    EmployeeSponsorTaggingModule
  ],
  providers: [
    DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    { provide: APP_BASE_HREF, useValue: "/out-patients" },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
