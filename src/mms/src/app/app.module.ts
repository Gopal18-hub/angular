import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule, MMSRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { HeaderModule } from "@shared/v2/modules/header";
// import { OPPharmacyModule } from "../../../modules/OPPharmacy/index";
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
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

const importModules = [
  HeaderModule,
  HttpClientModule,
  //MaxHealthSnackBarModule,
  MaxHealthMessageDialogModule,
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
    AppRoutingModule,
    BrowserAnimationsModule,
    ...importModules,
    AppRoutingModule,
    MatProgressSpinnerModule,
  ],
  providers: [...providers, { provide: APP_BASE_HREF, useValue: "/mms" }],
  bootstrap: [AppComponent],
})
export class AppModule {}

@NgModule({
  imports: [...importModules, MMSRoutingModule],
  providers: [...providers],
})
export class MMSModule {}
