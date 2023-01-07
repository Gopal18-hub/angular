import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ReportsComponent } from "./reports.component";
import { AuthGuardService } from "@shared/services/guards/auth-guard.service";
// // import { ReportsComponent } from "src/mis_reports/modules/reports/reports.component";

const routes: Routes = [
  {
    path: "op-ip",
    component: ReportsComponent,
    canActivate: [AuthGuardService],
    loadChildren: () =>
      import("../../../reports/modules/prompt-report").then(
        (m) => m.PromptReportModule
      ),
  },
  {
    path: "marketing",
    component: ReportsComponent,
    canActivate: [AuthGuardService],
    loadChildren: () =>
      import("../../../reports/modules/prompt-report").then(
        (m) => m.PromptReportModule
      ),
  },
  {
    path: "mms",
    component: ReportsComponent,
    canActivate: [AuthGuardService],
    loadChildren: () =>
      import("../../../reports/modules/prompt-report").then(
        (m) => m.PromptReportModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule {}
