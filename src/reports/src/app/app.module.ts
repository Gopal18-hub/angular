import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";

import { CrystalReportModule } from "../../modules/crystal-report";
import { PromptReportModule } from "../../modules/prompt-report";
import { MaxHealthMessageDialogModule } from "@shared/ui/message-dialog";
import { DatePipe } from "@angular/common";
import { TokenInterceptor } from "@shared/services/interceptors/token.interceptor";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaxHealthMessageDialogModule,
    CrystalReportModule,
    PromptReportModule,
  ],
  providers: [
    DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
