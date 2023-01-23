import { NgModule } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  RouterModule,
  RouterStateSnapshot,
  Routes,
} from "@angular/router";
import { RedirectComponent } from "@shared/v2/modules/header/redirect/redirect.component";
import { DashboardComponent } from "../shared/dashboard/dashboard.component";
const routes: Routes = [
  //   {
  //   path: "",
  //   redirectTo: "oppharmacy",
  //   pathMatch: "full",
  // },
  {
    path: "",
    component: DashboardComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot([
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
        // console.log("state.url", state.url);
        // console.log("window.location.origin", window.location.origin);
        // window.location.href = window.location.origin + state.url;
      },
    },
  ],
})
export class AppRoutingModule {}
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class MMSRoutingModule {}
