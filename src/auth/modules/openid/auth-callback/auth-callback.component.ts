import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../../../../shared/services/auth.service";
import * as Oidc from "oidc-client";
import { CookieService } from "@shared/services/cookie.service";
import { environment } from "@environments/environment";
import { ADAuthService } from "@auth/core/services/adauth.service";
@Component({
  selector: "auth-auth-callback",
  templateUrl: "./auth-callback.component.html",
  styleUrls: ["./auth-callback.component.scss"],
})
export class AuthCallbackComponent implements OnInit {
  constructor(
    private router: Router,
    private auth: AuthService,
    private cookie: CookieService,
    private adauth: ADAuthService
  ) {}

  ngOnInit(): void {
    this.auth
      .completeAuthentication()
      .then(async (user) => {
        this.auth.setToken(user.access_token);
        //  this.cookie.set("accessToken", user.access_token);
        console.log("roles", user.profile["role"]);
        this.cookie.set("role", user.profile["role"]);
        await this.adauth.clearCookies().toPromise();
        this.router.navigate(["dashboard"]);
      })
      .catch((e) => {
        console.log(e);
        this.cookie.deleteAll();
        this.cookie.deleteAll("/", environment.cookieUrl, true);
        this.router.navigate(["login"]);
      });
  }
}
