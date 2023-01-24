import { NgModule } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  RouterModule,
  RouterStateSnapshot,
  Routes,
} from "@angular/router";
import { RedirectComponent } from "@shared/v2/modules/header/redirect/redirect.component";
import { ComponentsComponent } from "../../modules/components/components.component";
const routes: Routes = [
  {
    path: "",
    component: ComponentsComponent,
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
      useValue: (
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
      ) => {},
    },
  ],
})
export class AppRoutingModule {}
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class DOCUMENTATIONRoutingModule {}
