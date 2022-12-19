import { Injectable } from "@angular/core";
import { HttpRequest } from "@angular/common/http";
import { CookieService } from "./cookie.service";
import { HttpService } from "./http.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Subject } from "rxjs";
import { environment } from "@environments/environment";
import { MaxHealthStorage } from "./storage";
import { ApiConstants } from "../constants/ApiConstants";
import {
  UserManager,
  UserManagerSettings,
  User,
  WebStorageStateStore,
  OidcClient,
} from "oidc-client";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  cachedRequests: Array<HttpRequest<any>> = [];

  loginUser: any;

  userProfileUpdated = new Subject<any>();

  manager = new UserManager(getClientSettings());

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public cookieService: CookieService,
    public http: HttpService
  ) {
    this.manager.getUser().then((user) => {
      this.loginUser = user;
    });
    const query = window.location.search.substring(1);
    const pathname = window.location.pathname;

    if (query == null || query == "") {
      if (window.location.href == window.origin + "/" || pathname == "/login")
        this.manager.signinRedirect();
    }
  }

  public isLoggedIn(): boolean {
    if (this.loginUser == null) {
      this.manager
        .getUser()
        .then((user) => {
          this.loginUser = user;
        })
        .catch((e) => {
          console.log(e);
        });
    }
    return this.loginUser != null && !this.loginUser.expired;
  }

  public isAuthenticated(): boolean {
    const token = this.getToken();
    // Check whether the token is expired and return
    // true or false
    return token ? true : false;
  }

  startAuthentication(): Promise<void> {
    return this.manager.signinRedirect();
  }

  signOutRedirect(): Promise<void> {
    return this.manager.signoutRedirect();
  }

  completeAuthentication(): Promise<User> {
    return this.manager.signinRedirectCallback();
  }

  completeSilentRefresh(): Promise<any> {
    return this.manager.signinSilentCallback();
  }

  public updateUserDetails(data: any) {
    if (!this.loginUser.mobile_number) {
      this.loginUser.mobile_number = data.mobile_number;
    }
  }

  public getToken() {
    return this.cookieService.get("accessToken");
  }

  public setToken(token: string): void {
    this.cookieService.set("accessToken", token, {
      path: "/",
      domain: environment.cookieUrl,
      secure: true,
    });
  }

  public logout(): any {
    var query = window.location.search;
    if (!query.includes("?logoutid=")) {
      query = "";
    }
    var logoutIdQuery =
      query && query.toLowerCase().indexOf("?logoutid=") == 0 && query;

    let response = this.http.post(ApiConstants.logout + logoutIdQuery, null);
    return response;
  }

  public collectFailedRequest(request: any): void {
    this.cachedRequests.push(request);
  }
  public retryFailedRequests(): void {
    // retry the requests. this method can
    // be called after the token is refreshed
  }

  public async me() {
    if (!this.isAuthenticated()) {
      return;
    }
    this.loginUser = await this.http.get("me").toPromise();
    this.userProfileUpdated.next(this.loginUser);
    return this.loginUser;
  }

  public redirectUrl() {
    if (this.route.snapshot.queryParamMap.get("redirect")) {
      //this.router.navigateByUrl(this.route.snapshot.queryParamMap.get('redirect'));
    } else {
      this.router.navigate(["dashboard"]);
    }
  }

  public setRefreshedToken() {
    //oidc.user:https://localhost/:hispwa
    let storage = localStorage.getItem(
      "oidc.user:" + environment.IdentityServerUrl + ":" + environment.clientId
    );
    let tokenKey;
    let accessToken = "";
    if (storage != null && storage != undefined && storage != "") {
      tokenKey = storage
        ?.split(",")[2]
        .split(":")[0]
        .replace('"', "")
        .replace('"', "");
      if (tokenKey == "access_token") {
        accessToken = storage
          ?.split(",")[2]
          .split(":")[1]
          .replace('"', "")
          .replace('"', "");
      }
    }

    if (accessToken != "" && accessToken != null && accessToken != undefined) {
      if (accessToken != this.cookieService.get("accessToken")) {
        this.cookieService.delete("accessToken", "/");
        this.cookieService.set("accessToken", accessToken, { path: "/" });
      }
    }
  }
}

export function getClientSettings(): UserManagerSettings {
  return {
    //   authority: 'https://localhost:443/',//for testing
    authority: environment.IdentityServerUrl,

    client_id: "hispwa",
    //redirect_uri: 'http://localhost:8100/auth-callback',//for testing
    redirect_uri: environment.IentityServerRedirectUrl + "auth-callback",

    //  post_logout_redirect_uri: 'http://localhost:8100/',//for testing
    post_logout_redirect_uri: environment.IentityServerRedirectUrl,

    response_type: "code",
    scope:
      "openid profile offline_access IdentityServerApi PC_OPRegApi PC_OPBillApi CommonDataApi",
    filterProtocolClaims: true,
    loadUserInfo: true,
    automaticSilentRenew: true,
    includeIdTokenInSilentRenew: true,
    revokeAccessTokenOnSignout: true,
    accessTokenExpiringNotificationTime: 60,
    silent_redirect_uri:
      environment.IentityServerRedirectUrl + "silent-refresh",
    silentRequestTimeout: 60,
    userStore: new WebStorageStateStore({ store: window.localStorage }),
    extraQueryParams: { new: 1 },
    monitorSession: true,
  };
}
