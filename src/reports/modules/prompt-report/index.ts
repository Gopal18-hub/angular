import { NgModule } from "@angular/core";
import { PromptReportComponent } from "./prompt-report.component";
import { BasicComponent } from "./submodules/basic/basic.component";
import { MatIconModule } from "@angular/material/icon";
import { PromptReportRoutingModule } from "./routes";
import { MaxHealthTableModule } from "@shared/ui/table";
import { DynamicFormsModule } from "@shared/ui/dynamic-forms";
import { CommonModule } from "@angular/common";

@NgModule({
  declarations: [PromptReportComponent, BasicComponent],
  imports: [
    CommonModule,
    DynamicFormsModule,
    MaxHealthTableModule,
    PromptReportRoutingModule,
  ],
})
export class PromptReportModule {}
