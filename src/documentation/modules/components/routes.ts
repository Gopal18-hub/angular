import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuardService } from "@shared/services/guards/auth-guard.service";
import { ComponentdescriptionComponent } from "../component-description/component-description.component";
import { ComponentsComponent } from "./components.component";
const routes: Routes = [
  {
    path: "",
    component: ComponentsComponent,
    canActivate: [AuthGuardService],
    canActivateChild: [AuthGuardService],
    children: [
      {
        path: "component",
        component: ComponentdescriptionComponent,
        // data: { masterModule: 2, moduleId: 7, featureId: 60 },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OPPharmacyRoutingModule {}
