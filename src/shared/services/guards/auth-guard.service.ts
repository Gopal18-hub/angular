import { Injectable } from "@angular/core";
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { AuthService } from "../auth.service";
import { environment } from "@environments/environment";
import { PermissionService } from "../../services/permission.service";

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(
    public auth: AuthService,
    public router: Router,
    private permission: PermissionService
  ) {}

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
    if (route.data["featureId"]) {
      const accessControls: any = this.permission.getAccessControls();
      const exist: any =
        accessControls[route.data["masterModule"]][route.data["moduleId"]][
          route.data["featureId"]
        ];
      if (exist) return true;
      else {
        window.location.href = environment.IentityServerRedirectUrl + "login";
        return false;
      }
    }
    return true;
  }
}
