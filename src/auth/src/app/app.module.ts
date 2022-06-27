import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { MaxHealthSnackBarModule } from "../../../shared/ui/snack-bar";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { LoginModule } from "@modules/login";
import { SignupModule } from "@modules/signup";
import { OpenIDModule } from "@modules/openid";
import { DashboardModule } from "@modules/dashboard";

import { TokenInterceptor } from "../../../shared/services/interceptors/token.interceptor";
import { ADAuthService } from "../../../auth/core/services/adauth.service";
import { AuthGuardService } from "../../../shared/services/guards/auth-guard.service";
import { MatDialogModule } from "@angular/material/dialog";
import { AuthService } from "../../../shared/services/auth.service";
import { HttpService } from "../../../shared/services/http.service";
import { MaxHealthMessageDialogModule } from "../../../shared/ui/message-dialog";
import { MessageDialogService } from "../../../shared/ui/message-dialog/message-dialog.service";
import { SearchService } from "../../../shared/services/search.service";
import { CookieService } from "../../../shared/services/cookie.service";

import { APP_BASE_HREF } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    MaxHealthSnackBarModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LoginModule,
    SignupModule,
    OpenIDModule,
    DashboardModule,
    MatDialogModule,
    MatIconModule,
    MaxHealthMessageDialogModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    ADAuthService,
    AuthGuardService,
    AuthService,
    HttpService,
    MessageDialogService,
    SearchService,
    CookieService,
    { provide: APP_BASE_HREF, useValue: "/" },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
