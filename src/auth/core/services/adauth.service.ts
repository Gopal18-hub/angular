import { Injectable } from "@angular/core";
import { HttpHandler, HttpRequest, HttpClient } from "@angular/common/http";
import { HttpService } from "../../../shared/services/http.service";
import { Observable } from "rxjs";
import { ApiConstants } from "../../../auth/core/constants/ApiConstants";

@Injectable({
  providedIn: "root",
})
export class ADAuthService {
  constructor(public http: HttpService) {}

  public authenticateUserName(username: string): any {
    return this.http.getExternal(ApiConstants.validate_username(username));
  }

  public authenticateAD(username: string, password: string): any {
    password = encodeURIComponent(password);
    return this.http.get(
      ApiConstants.validateADCredentials(username, password)
    );
  }
  public ClearExistingLogin(userid: number): any {
    return this.http.postExternal(ApiConstants.deleteactivesession(userid), {});
  }

  public updateActiveSessionToken(
    userId: number,
    token: string,
    locationid: number,
    stationid: number,
    moduleid: number
  ) {
    return this.http.postExternal(
      ApiConstants.updateActiveSessionToken(),
      JSON.stringify({
        userId,
        token,
        locationid,
        stationid,
        moduleid,
      })
    );
  }

  public authenticate(username: string, password: string) {
    let returnUrl;
    const query = window.location.search.substring(1);
    const vars = query.split("&");
    for (let i = 0; i < vars.length; i++) {
      let pair = vars[i].split("=");
      if (decodeURIComponent(pair[0]) == "ReturnUrl") {
        returnUrl = decodeURIComponent(pair[1]);
      }
    }
    return this.http.postExternal(
      ApiConstants.autheticate,
      JSON.stringify({
        username,
        password,
        returnUrl,
      })
    );
  }
  public sessionCreation(
    userId: number,
    token: string,
    locationid: number,
    stationid: number,
    moduleid: number
  ) {
    return this.http.postExternal(
      ApiConstants.sessionCreation(),
      JSON.stringify({
        userId,
        token,
        locationid,
        stationid,
        moduleid,
      })
    );
  }

  //clearCookies

  public clearCookies() {
    return this.http.post(ApiConstants.clearCookies, {});
  }
}
