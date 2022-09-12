import { NgModule } from "@angular/core";
import { ReportsRoutingModule } from "./routes";
import { ReportsComponent } from "./reports.component";
import { MatTabsModule } from "@angular/material/tabs";
import { CommonModule } from "@angular/common";
import { MatInputModule } from "@angular/material/input";
import { MaxHealthTableModule } from "@shared/ui/table";
import { DynamicFormsModule } from "@shared/ui/dynamic-forms";
import { MatButtonModule } from "@angular/material/button";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
@NgModule({
  declarations: [ReportsComponent],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    MatTabsModule,
    MatInputModule,
    MaxHealthTableModule,
    DynamicFormsModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
  exports: [],
  providers: [],
  bootstrap: [],
})
export class ReportsModule {}
