import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PromptReportComponent } from './prompt-report.component';

  const routes: Routes = [
    {
      path: "prompt-report",
      component: PromptReportComponent,
    },
  ];

  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
  })
  export class CrystalReportRoutingModule {}
  