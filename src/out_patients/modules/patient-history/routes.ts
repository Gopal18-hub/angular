import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuardService } from "@shared/services/guards/auth-guard.service";
import { PatientHistoryComponent } from "./patient-history.component";

const routes: Routes = [
  {
    path: "patient-history",
    component: PatientHistoryComponent,
    canActivate: [AuthGuardService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],

  exports: [RouterModule],
})
export class PatientHistoryRoutingModule {}
