import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { MaxHealthMessageDialogModule } from "@shared/ui/message-dialog";
import { HeaderModule } from "@shared/modules/header";

import { ReportsModule } from "../../modules/reports";
import { CommonModule, APP_BASE_HREF, DatePipe } from "@angular/common";
import { TokenInterceptor } from "@shared/services/interceptors/token.interceptor";
import { AuthGuardService } from "@shared/services/guards/auth-guard.service";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReportsModule,
    CommonModule,
    MaxHealthMessageDialogModule,
    HeaderModule,
  ],
  providers: [
    AuthGuardService,
    DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    { provide: APP_BASE_HREF, useValue: "/mis-reports" },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
