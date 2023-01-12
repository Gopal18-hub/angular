import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { CommonModule } from "@angular/common";

import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";

import { MaxHealthMessageDialogModule } from "@shared/ui/message-dialog";
import { DatePipe, APP_BASE_HREF } from "@angular/common";
import { HeaderModule } from "@shared/modules/header";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    AppRoutingModule,
    HttpClientModule,
    MaxHealthMessageDialogModule,
    HeaderModule,
  ],
  providers: [DatePipe, { provide: APP_BASE_HREF, useValue: "/" }],
  bootstrap: [AppComponent],
})
export class AppModule {}
