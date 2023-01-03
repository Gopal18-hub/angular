import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../../../shared/services/auth.service";
import { HttpService } from "../../../../shared/services/http.service";
import { ActivatedRoute, Router } from "@angular/router";
import * as Oidc from "oidc-client";
// import { CookieService } from "@shared/services/cookie.service";

@Component({
  selector: "auth-silent-refresh",
  templateUrl: "./silent-refresh.component.html",
  styleUrls: ["./silent-refresh.component.scss"],
})
export class SilentRefreshComponent implements OnInit {
  constructor(
    public auth: AuthService,
    public http: HttpService,
    // private cookie: CookieService
  ) {}

  ngOnInit(): void {
    this.auth
      .completeSilentRefresh()
      .then((user) => {
        // this.cookie.delete("accessToken");
        this.auth.deleteToken();
        this.auth.setToken(user.access_token);
      })
      .catch((error) => {
        console.log(error);
        window.location.reload();
      });
  }
}
