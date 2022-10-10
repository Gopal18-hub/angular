import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuardService } from "@shared/services/guards/auth-guard.service";
import { StaffDeptComponent } from "./staff-dept.component";

const routes: Routes = [
  {
    path: "staff-dept",
    component: StaffDeptComponent,
    canActivate: [AuthGuardService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StaffDeptRoutingModule {}
