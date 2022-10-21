import { NgModule } from "@angular/core";
import { PromptReportComponent } from "./prompt-report.component";
import { BasicComponent } from "./submodules/basic/basic.component";
import { PromptReportRoutingModule } from "./routes";
import { MaxHealthTableModule } from "@shared/ui/table";
import { DynamicFormsModule } from "@shared/ui/dynamic-forms";
import { CommonModule, DatePipe } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatToolbarModule } from "@angular/material/toolbar";
import { SingleComponent } from "./submodules/single/single.component";
import { TabsComponent } from "./submodules/tabs/tabs.component";
import { MatTabsModule } from "@angular/material/tabs";
import { MatIconModule } from "@angular/material/icon";
@NgModule({
  declarations: [
    PromptReportComponent,
    BasicComponent,
    SingleComponent,
    TabsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DynamicFormsModule,
    MaxHealthTableModule,
    PromptReportRoutingModule,
    MatButtonModule,
    MatToolbarModule,
    MatTabsModule,
    MatIconModule
  ],
  providers: [DatePipe],
})
export class PromptReportModule {}
