import { NgModule } from "@angular/core";
import {
  RouterModule,
  Routes,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { AuthGuardService } from "../../../shared/services/guards/auth-guard.service";
import { DashboardComponent } from "./dashboard.component";
import { RedirectComponent } from "../../../shared/modules/header/redirect/redirect.component";

const routes: Routes = [
  {
    path: "dashboard",
    //canActivate: [AuthGuardService],
    component: DashboardComponent,
  },
  {
    path: "**",
    resolve: {
      url: "externalUrlRedirectResolver",
    },
    component: RedirectComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
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
