import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { OpRegistrationComponent } from "./submodules/op-registration/op-registration.component";
import { FindPatientComponent } from "./submodules/find-patient/find-patient.component";
import { DupRegMergingComponent } from "./submodules/dup-reg-merging/dup-reg-merging.component";
import { RegistrationUnmergingComponent } from "./submodules/registration-unmerging/registration-unmerging.component";
import { RegistrationComponent } from "./registration.component";
import { OpRegApprovalComponent } from "./submodules/op-reg-approval/op-reg-approval.component";
import { AppointmentSearchComponent } from "./submodules/appointment-search/appointment-search.component";
import { HotListingApprovalComponent } from "./submodules/hot-listing-approval/hot-listing-approval.component";
import { PendingChangesGuard } from "../../../shared/services/guards/pending-change-guard.service";
import { AuthGuardService } from "../../../shared/services/guards/auth-guard.service";
const routes: Routes = [
  {
    path: "registration",
    component: RegistrationComponent,
    children: [
      { path: "", component: OpRegistrationComponent },
      {
        path: "op-registration",
        component: OpRegistrationComponent,
        canDeactivate: [PendingChangesGuard],
        canActivate: [AuthGuardService],
      },
      {
        path: "find-patient",
        component: FindPatientComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: "dup-reg-merging",
        component: DupRegMergingComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: "registration-unmerging",
        component: RegistrationUnmergingComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: "op-reg-approval",
        component: OpRegApprovalComponent,
        canActivate: [AuthGuardService],
      },
      { path: "appointment-search", component: AppointmentSearchComponent },
      {
        path: "hot-listing-approval",
        component: HotListingApprovalComponent,
        canActivate: [AuthGuardService],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistrationRoutingModule {}
