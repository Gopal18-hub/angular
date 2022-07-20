import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { CrystalReportModule } from "../../modules/crystal-report";
import { PromptReportModule } from "../../modules/prompt-report";
import { MaxHealthMessageDialogModule } from "@shared/ui/message-dialog";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaxHealthMessageDialogModule,
    CrystalReportModule,
    PromptReportModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
