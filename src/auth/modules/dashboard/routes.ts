import { NgModule } from "@angular/core";
import {
  RouterModule,
  Routes,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";

import { DashboardComponent } from "./dashboard.component";
import { RedirectComponent } from "../../../shared/modules/header/redirect/redirect.component";
import { AuthGuardService } from "@shared/services/guards/auth-guard.service";
import { NoPermissionComponent } from "./no-permission/no-permission/no-permission.component";

const routes: Routes = [
  {
    path: "dashboard",
    component: DashboardComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: "no-permission",
    component: NoPermissionComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild([
      ...routes,
      {
        path: "**",
        resolve: {
          url: "externalUrlRedirectResolver",
        },
        component: RedirectComponent,
      },
    ]),
  ],
  exports: [RouterModule],
  providers: [
    {
      provide: "externalUrlRedirectResolver",
      useValue: (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
        window.location.href = window.location.origin + state.url;
      },
    },
  ],
})
export class DashboardRoutingModule {}

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class DashboardAllRoutingModule {}
