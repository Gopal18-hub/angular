import { Component, OnInit, Inject, HostListener } from "@angular/core";
import { MaxModules } from "../../constants/Modules";
import { APP_BASE_HREF } from "@angular/common";
import { AuthService } from "../../services/auth.service";
import { CookieService } from "../../services/cookie.service";
import { environment } from "@environments/environment";
import { PermissionService } from "../../services/permission.service";
import { ActivatedRoute, Router } from "@angular/router";
import { DbService } from "../../services/db.service";
import { MatDialog } from "@angular/material/dialog";
import { ChangelocationComponent } from "./changelocation/changelocation.component";
import { Subject, takeUntil } from "rxjs";

@Component({
  selector: "maxhealth-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit {
  modules: any = [];
  location: string = "";
  station: string = "";
  usrname: string = "";
  user: string = "";
  activeModule: any;
  private readonly _destroying$ = new Subject<void>();

  @HostListener("window:keydown.Alt.r", ["$event"])
  navigateToRegister($event: any) {
    this.router.navigate(["/registration"]);
  }

  constructor(
    @Inject(APP_BASE_HREF) private baseHref: string,
    private authService: AuthService,
    private cookieService: CookieService,
    private permissionService: PermissionService,
    private router: Router,
    private route: ActivatedRoute,
    private dbService: DbService,
    private matDialog: MatDialog
  ) {}

  async ngOnInit() {
    await this.permissionService.getPermissionsRoleWise();
    this.modules = this.permissionService.checkModules();
    this.modules.forEach((element: any) => {
      if (
        element.defaultPath == this.baseHref ||
        element.defaultPath == window.location.pathname
      ) {
        this.activeModule = element;
      }
    });
    // this.setRefreshedToken(); //Set refreshed access token in cookie
    this.location = this.cookieService.get("Location");
    this.station = this.cookieService.get("Station");
    this.usrname = this.cookieService.get("Name");
    this.user = this.cookieService.get("UserName");
  }

  logout() {
    this.setRefreshedToken(); //Set refreshed access token in cookie
    this.authService.logout().subscribe((response: any) => {
      if (response.postLogoutRedirectUri) {
        window.location = response.postLogoutRedirectUri;
      }
      localStorage.clear();
      this.cookieService.deleteAll();
      this.cookieService.deleteAll("/", environment.cookieUrl, true);
      this.dbService.cachedResponses.clear();
      window.location.href = window.location.origin + "/login";
    });
  }

  getPermissions() {
    this.setRefreshedToken(); //Set refreshed access token in cookie
    this.permissionService.getPermissionsRoleWise();
  }

  setRefreshedToken() {
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
      this.cookieService.delete("accessToken");
      this.cookieService.set("accessToken", accessToken);
    }
  }

  openChangeLocationDialog() {
    const changeLocationDialogref = this.matDialog.open(
      ChangelocationComponent,
      {
        width: "25vw",
        height: "44vh",
        data: {
          title: "Change Location and Station",
          form: {
            title: "",
            type: "object",
            properties: {
              location: {
                type: "autocomplete",
                title: "Location",
                required: true,
              },
              station: {
                type: "autocomplete",
                title: "Station",
                required: true,
              },
            },
          },
          layout: "single",
          buttonLabel: "Submit",
        },
      }
    );
    changeLocationDialogref
      .afterClosed()
      .pipe(takeUntil(this._destroying$))
      .subscribe((result) => {
        if (result) {
          window.location.reload();
        }
      });
  }
}
