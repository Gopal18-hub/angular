import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PromptReportComponent } from "./prompt-report.component";
import { BasicComponent } from "./submodules/basic/basic.component";
import { AuthGuardService } from "@shared/services/guards/auth-guard.service";

const routes: Routes = [
  {
    path: "prompt-report",
    component: PromptReportComponent,
    children: [
      {
        path: ":reportName",
        component: BasicComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PromptReportRoutingModule {}
