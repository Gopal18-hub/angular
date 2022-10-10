import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuardService } from "@shared/services/guards/auth-guard.service";
import { EmployeeSponsorTaggingComponent } from "./employee-sponsor-tagging.component";
const routes: Routes = [
  {
    path: "employee-sponsor-tagging",
    component: EmployeeSponsorTaggingComponent,
    canActivate: [AuthGuardService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeeSponsorRoutingModule {}
