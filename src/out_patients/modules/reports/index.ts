import { NgModule } from "@angular/core";
import { ReportsRoutingModule } from "./routes";
import { ReportsComponent } from "./reports.component";
import { MatTabsModule } from "@angular/material/tabs";
import { CommonModule } from "@angular/common";

@NgModule({
  declarations: [ReportsComponent],
  imports: [CommonModule, ReportsRoutingModule, MatTabsModule],
  exports: [],
  providers: [],
  bootstrap: [],
})
export class ReportsModule {}
