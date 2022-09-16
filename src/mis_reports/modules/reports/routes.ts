import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ReportsComponent } from "./reports.component";
// // import { ReportsComponent } from "src/mis_reports/modules/reports/reports.component";

const routes: Routes = [
  {
    path: "",
    component: ReportsComponent,
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
