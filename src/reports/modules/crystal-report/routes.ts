import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CrystalReportComponent } from "./crystal-report.component";
import { PopupComponent } from "./submodules/popup/popup.component";
import { IframeComponent } from "./submodules/iframe/iframe.component";

const routes: Routes = [
  {
    path: "crystal-report",
    component: CrystalReportComponent,
    children: [
      {
        path: "popup/:reportName",
        component: PopupComponent,
      },
      {
        path: "iframe/:reportName",
        component: PopupComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrystalReportRoutingModule {}
