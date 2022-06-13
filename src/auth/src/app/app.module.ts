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
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    ADAuthService,
    AuthGuardService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
