import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuardService } from "@shared/services/guards/auth-guard.service";
import { AuthCallbackComponent } from "./auth-callback/auth-callback.component";
import { SilentRefreshComponent } from "./silent-refresh/silent-refresh.component";

const routes: Routes = [
  {
    path: "auth-callback",
    component: AuthCallbackComponent,
    // canActivate: [AuthGuardService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OpenIDRoutingModule {}
