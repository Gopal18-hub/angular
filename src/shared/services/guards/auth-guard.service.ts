import { Injectable } from "@angular/core";
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild,
} from "@angular/router";
import { AuthService } from "../auth.service";
import { environment } from "@environments/environment";
import { PermissionService } from "../../services/permission.service";

@Injectable()
export class AuthGuardService implements CanActivate, CanActivateChild {
  constructor(
    public auth: AuthService,
    public router: Router,
    private permission: PermissionService
  ) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!this.auth.isAuthenticated()) {
      window.location.href = environment.IentityServerRedirectUrl + "login";
      return false;
    }

    return true;
  }

  async canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    if (!this.auth.isAuthenticated()) {
      window.location.href = environment.IentityServerRedirectUrl + "login";
      return false;
    }
    if (route.data["featureId"]) {
      const accessControls: any = this.permission.getAccessControls();
      if (
        accessControls &&
        accessControls[route.data["masterModule"]] &&
        accessControls[route.data["masterModule"]][route.data["moduleId"]] &&
        accessControls[route.data["masterModule"]][route.data["moduleId"]][
          route.data["featureId"]
        ]
      ) {
        const exist: any =
          accessControls[route.data["masterModule"]][route.data["moduleId"]][
            route.data["featureId"]
          ];
        if (exist) return true;
        else {
          window.location.href = environment.IentityServerRedirectUrl + "login";
          return false;
        }
      } else {
        return true;
      }
    }
    return true;
  }
}
