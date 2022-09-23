import { Injectable } from "@angular/core";
import { HttpRequest } from "@angular/common/http";
import { CookieService } from "./cookie.service";
import { HttpService } from "./http.service";
import { ApiConstants } from "../constants/ApiConstants";
import { MaxModules } from "../constants/Modules";

@Injectable({
  providedIn: "root",
})
export class PermissionService {
  accessControls: any = [];

  manipulatedAccessControls: any = [];

  masterModules: any = [];
  modules: any = [];
  features: any = [];

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
        }
      }
    }

    this.manipulatedAccessControls = temp;
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
        if (
          "locationSpecific" in masterModule.childrens[j] &&
          masterModule.childrens[j].locationSpecific !=
            this.cookieService.get("LocationIACode")
        ) {
          definedModules[index].childrens[j].disabled = true;
        }
        children.childrens.forEach((feature: any, c: number) => {
          if (!this.features.includes(feature.id)) {
            if (!feature.allUsersAllow)
              definedModules[index].childrens[j].childrens[c].disabled = true;
          }
          if (
            "locationSpecific" in masterModule.childrens[j] &&
            masterModule.childrens[j].locationSpecific !=
              this.cookieService.get("LocationIACode")
          ) {
            definedModules[index].childrens[j].childrens[c].disabled = true;
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
