import { NgModule } from "@angular/core";

import { Router, RouterModule, Routes } from "@angular/router";
import { AuthGuardService } from "@shared/services/guards/auth-guard.service";
import { ConfigureComponent } from "./configure.component";
import { ConfigureLimsComponent } from "./submodules/configure-lims/configure-lims.component";
import { ConfigureRisComponent } from "./submodules/configure-ris/configure-ris.component";
const routes: Routes = [
  {
    path: "configure",
    component: ConfigureComponent,
    canActivate: [AuthGuardService],
    children: [
      { path: "", component: ConfigureRisComponent },
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
