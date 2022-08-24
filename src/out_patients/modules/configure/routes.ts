import { NgModule } from "@angular/core";

import { Router, RouterModule, Routes } from "@angular/router";
import { ConfigureComponent } from "./configure.component";
import { ConfigureLimsComponent } from "./submodules/configure-lims/configure-lims.component";
import { ConfigureRisComponent } from "./submodules/configure-ris/configure-ris.component";
const routes: Routes = [
  {
    path: "configure",
    component: ConfigureComponent,
    children: [
      { path: "RIS", component: ConfigureRisComponent },
      { path: "LIMS", component: ConfigureLimsComponent },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfigureRoutingModule {}
