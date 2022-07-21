import { NgModule } from "@angular/core";
import { PromptReportComponent } from "./prompt-report.component";
import { BasicComponent } from "./submodules/basic/basic.component";
import { PromptReportRoutingModule } from "./routes";
import { MaxHealthTableModule } from "@shared/ui/table";
import { DynamicFormsModule } from "@shared/ui/dynamic-forms";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";

@NgModule({
  declarations: [PromptReportComponent, BasicComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DynamicFormsModule,
    MaxHealthTableModule,
    PromptReportRoutingModule,
    MatButtonModule,
  ],
})
export class PromptReportModule {}
