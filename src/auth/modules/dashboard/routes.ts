import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuardService } from "../../../shared/services/guards/auth-guard.service";
import { DashboardComponent } from "./dashboard.component";

const routes: Routes = [
  {
    path: "dashboard",
    canActivate: [AuthGuardService],
    component: DashboardComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
