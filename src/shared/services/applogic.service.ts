import { Injectable } from "@angular/core";
import { HttpRequest } from "@angular/common/http";
import { CookieService } from "./cookie.service";
import { HttpService } from "./http.service";
import { ApiConstants } from "../constants/ApiConstants";

@Injectable({
  providedIn: "root",
})
export class ApplicationLogicService {
  constructor(public cookieService: CookieService, public http: HttpService) {}

  getGSTVistaLiveFlag() {
    this.http
      .get(
        ApiConstants.getgstvistaliveflag(
          Number(this.cookieService.get("HSPLocationId"))
        )
      )
      .subscribe((res: any) => {
        if (res) {
          if (res[0].vistaLive) {
            this.cookieService.delete("VistaLive", "/");
            this.cookieService.set("VistaLive", res[0].vistaLive, {
              path: "/",
            });
          }
          if (res[0].gstflag) {
            this.cookieService.delete("GSTFlag", "/");
            this.cookieService.set("GSTFlag", res[0].gstflag, {
              path: "/",
            });
          }
        }
      });
  }
}
