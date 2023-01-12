import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AcknowledgedScrollAmountReportComponent } from "@modules/billing/submodules/acknowledged-scroll-amount-report/acknowledged-scroll-amount-report.component";

import { AuthGuardService } from "@shared/services/guards/auth-guard.service";
import { ReportsComponent } from "./reports.component";

const routes: Routes = [
  {
    path: "report",
    component: ReportsComponent,

    loadChildren: () =>
      import("../../../reports/modules/prompt-report").then(
        (m) => m.PromptReportModule
      ),
  },

  {
    path: "report/Acknowledgement-Scroll-Amount-Report",
    component: AcknowledgedScrollAmountReportComponent,
  },
  {
    path: "report-multiple",
    component: ReportsComponent,

    loadChildren: () =>
      import("../../../reports/modules/prompt-report").then(
        (m) => m.PromptReportModule
      ),
    data: {
      reports: [
        {
          title: "Happy Family Plan",
          link: "prompt-report/HappyFamilyPlanAllocationReport",
        },
        {
          title: "Utilization Report Summary",
          link: "prompt-report/HappyFamilyPlanUtilizationReport",
        },
        {
          title: "Detailed Utilization Report Summary",
          link: "prompt-report/SummaryReportForUtilisationReport",
        },
      ],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule {}
