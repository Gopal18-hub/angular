import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { MaxHealthMessageDialogModule } from "@shared/ui/message-dialog";

import { ReportsModule } from "../../modules/reports";
import { CommonModule } from "@angular/common";

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
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
