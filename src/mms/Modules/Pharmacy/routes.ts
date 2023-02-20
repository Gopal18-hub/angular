import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuardService } from "@shared/services/guards/auth-guard.service";
import { PharmacyComponent } from "./pharmacy.component";
import { EPOrderComponent } from "./submodules/ep-order/ep-order.component";
import { IssueEntryComponent } from "./submodules/issue-entry/issue-entry.component";
const routes: Routes = [
  {
    path: "pharmacy",
    component: PharmacyComponent,
    canActivate: [AuthGuardService],
    canActivateChild: [AuthGuardService],
    children: [
      {
        path: "",
        component: IssueEntryComponent,
      },
      {
        path: "issue-entry",
        component: IssueEntryComponent,
      },
      {
        path: "ep-order",
        component: EPOrderComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PharmacyRoutingModule {}
