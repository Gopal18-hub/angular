import { Injectable } from "@angular/core";
import { HttpRequest } from "@angular/common/http";
import { CookieService } from "./cookie.service";
import { HttpService } from "./http.service";
import { ApiConstants } from "../constants/ApiConstants";

@Injectable({
  providedIn: "root",
})
export class PermissionService {
  accessControls: any = [];

  manipulatedAccessControls: any = [];

  constructor(public cookieService: CookieService, public http: HttpService) {}

  async getPermissionsRoleWise() {
    let userId = Number(this.cookieService.get("UserId"));
    let roles = this.cookieService
      .get("role")
      .split(",")
      .map((x) => +x);
    console.log(roles);

    let response = await this.http
      .post(ApiConstants.getPermissions, {
        Id: userId,
        RoleIds: roles,
        Permissions: null,
      })
      .toPromise();
    console.log(response);
  }

  public getAccessControls() {
    return this.manipulatedAccessControls;
  }
}
