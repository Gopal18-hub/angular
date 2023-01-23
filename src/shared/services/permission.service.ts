import { Injectable } from "@angular/core";
import { HttpRequest } from "@angular/common/http";
import { CookieService } from "./cookie.service";
import { HttpService } from "./http.service";
import { ApiConstants } from "../constants/ApiConstants";
import { MaxModules } from "../constants/Modules";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class PermissionService {
  accessControls: any = [];

  manipulatedAccessControls: any = [];

  masterModules: any = [];
  modules: any = [];
  features: any = [];

  rolesLoaded = new Subject<boolean>();

  constructor(public cookieService: CookieService, public http: HttpService) {}

  async getPermissionsRoleWise() {
    let userId = Number(this.cookieService.get("UserId"));
    let roles = this.cookieService
      .get("role")
      .split(",")
      .map((x) => +x);
    console.log(roles);
    let temp: any = {};
    if (roles) {
      if (roles.length > 0) {
        if (this.cookieService.get("role")) {
          let response = await this.http
            .get(ApiConstants.getPermissions(this.cookieService.get("role")))
            .toPromise();

          if (response) {
            response.permissions.forEach((ele: any) => {
              if (!temp[ele.masterModuleId]) {
                temp[ele.masterModuleId] = {};
                this.masterModules.push(ele.masterModuleId);
              }
              if (!temp[ele.masterModuleId][ele.moduleId]) {
                this.modules.push(ele.moduleId);
                temp[ele.masterModuleId][ele.moduleId] = {};
              }
              if (!temp[ele.masterModuleId][ele.moduleId][ele.featureId]) {
                temp[ele.masterModuleId][ele.moduleId][ele.featureId] = {};
                this.features.push(ele.featureId);
              }
              temp[ele.masterModuleId][ele.moduleId][ele.featureId][
                ele.functionId
              ] = true;
            });
            this.checkEWSAccess(temp);
          }
        }
      }
    }

    this.manipulatedAccessControls = temp;

    this.rolesLoaded.next(true);
  }

  checkEWSAccess(accessControls: any) {
    let exist: any = accessControls[2][7][600];
    if (exist == undefined) {
      exist = false;
    } else {
      exist = accessControls[2][7][600][1559];
      exist = exist == undefined ? false : exist;
    }

    if (exist) {
      this.cookieService.delete("EWSAccess", "/");
      this.cookieService.set("EWSAccess", "1", {
        path: "/",
      });
    } else {
      this.cookieService.delete("EWSAccess", "/");
      this.cookieService.set("EWSAccess", "0", {
        path: "/",
      });
    }
  }

  checkModules() {
    let definedModules: any = MaxModules.getModules();
    definedModules.forEach((masterModule: any, index: number) => {
      if (
        !(
          this.masterModules.includes(masterModule.id) ||
          ("type" in masterModule &&
            this.modules.includes(masterModule.id) &&
            masterModule.type == "module")
        )
      ) {
        definedModules[index].disabled = true;
      }
    });
    definedModules.forEach((masterModule: any, index: number) => {
      masterModule.childrens.forEach((children: any, j: number) => {
        if ("locationSpecific" in masterModule.childrens[j]) {
          const location = masterModule.childrens[j].locationSpecific.filter(
            (l: any) =>
              l.loc === Number(this.cookieService.get("HSPLocationId"))
          );
          if (location.length <= 0) {
            definedModules[index].childrens[j].disabled = true;
          }
        }
        children.childrens.forEach((feature: any, c: number) => {
          if (!this.features.includes(feature.id)) {
            if (!feature.allUsersAllow)
              definedModules[index].childrens[j].childrens[c].disabled = true;
          }
          if ("locationSpecific" in masterModule.childrens[j].childrens[c]) {
            const location = masterModule.childrens[j].childrens[
              c
            ].locationSpecific.filter(
              (l: any) =>
                l.loc === Number(this.cookieService.get("HSPLocationId"))
            );
            if (location.length <= 0) {
              definedModules[index].childrens[j].childrens[c].disabled = true;
            }
          }
        });
      });
    });
    return definedModules;
  }

  public getMasterModules() {
    return this.masterModules;
  }

  public getModules() {
    return this.modules;
  }

  public getFeatures() {
    return this.features;
  }

  public getAccessControls() {
    return this.manipulatedAccessControls;
  }
}
