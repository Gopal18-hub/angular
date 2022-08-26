import { Injectable } from "@angular/core";
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { AuthService } from "../auth.service";
import { environment } from "@environments/environment";

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(public auth: AuthService, public router: Router) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // let url: string = state.url;
    if (!this.auth.isAuthenticated()) {
      //this.router.navigate(['login'], { queryParams: { redirect: url } });
      // this.router.navigate(["/login"]);
      // window.location.href = window.location.origin + "/login";
      window.location.href = environment.IentityServerRedirectUrl + "login";
      // this.auth.startAuthentication();
      return false;
    }
    //await this.auth.me();
    return true;
  }
}
