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

    let response = await this.http
      .get(ApiConstants.getPermissions(roles))
      .toPromise();
    let temp: any = {};
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
        temp[ele.masterModuleId][ele.moduleId][ele.featureId][ele.functionId] =
          true;
      });
    }

    this.manipulatedAccessControls = temp;
  }

  checkModules() {
    let definedModules = MaxModules.getModules();
    definedModules = definedModules.filter((masterModule: any) => {
      return (
        this.masterModules.includes(masterModule.id) ||
        ("type" in masterModule &&
          this.modules.includes(masterModule.id) &&
          masterModule.type == "module")
      );
    });
    definedModules.forEach((masterModule: any) => {
      masterModule.childrens.forEach((children: any) => {
        children.childrens = children.childrens.filter((feature: any) => {
          return this.features.includes(feature.id);
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
