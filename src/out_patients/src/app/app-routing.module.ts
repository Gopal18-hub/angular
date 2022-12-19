import { NgModule } from "@angular/core";
import {
  RouterModule,
  Routes,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";

import { RedirectComponent } from "@shared/modules/header/redirect/redirect.component";

const routes: Routes = [
  {
    path: "",
    redirectTo: "registration",
    pathMatch: "full",
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
        window.location.href = window.location.origin + state.url;
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
export class OutPatientRoutingModule {}
