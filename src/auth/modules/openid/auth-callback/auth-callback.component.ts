import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../../../../shared/services/auth.service";
import * as Oidc from "oidc-client";
import { CookieService } from "@shared/services/cookie.service";
import { environment } from "@environments/environment";

@Component({
  selector: "auth-auth-callback",
  templateUrl: "./auth-callback.component.html",
  styleUrls: ["./auth-callback.component.scss"],
})
export class AuthCallbackComponent implements OnInit {
  constructor(
    private router: Router,
    private auth: AuthService,
    private cookie: CookieService
  ) {}

  ngOnInit(): void {
    this.auth
      .completeAuthentication()
      .then((user) => {
         this.auth.setToken(user.access_token);
        //  this.cookie.set("accessToken", user.access_token);
         this.cookie.set("role", user.profile["role"]);
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
