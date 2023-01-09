import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SessionGuardService } from "@shared/services/guards/session-guard.service";
import { LoginComponent } from "./login.component";

const routes: Routes = [
  {
    path: "login",
    component: LoginComponent,
    canActivate: [SessionGuardService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginRoutingModule {}
