import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { MaxModules } from "../../constants/Modules";
import { APP_BASE_HREF } from "@angular/common";
import { AuthService } from "../../services/auth.service";
import { CookieService } from "../../services/cookie.service";
import { environment } from "@environments/environment";
import { PermissionService } from "../../services/permission.service";
import { ActivatedRoute, Router } from "@angular/router";
import { FormGroup } from "@angular/forms";
import { SearchService } from "../../services/search.service";
import { QuestionControlService } from "../../ui/dynamic-forms/service/question-control.service";

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

  searchFormData: any;

  searchForm!: FormGroup;

  questions: any;

  @ViewChild("searchVal") globalSearchInputBox: any;

  activePageItem: any;

  constructor(
    @Inject(APP_BASE_HREF) private baseHref: string,
    private authService: AuthService,
    private cookieService: CookieService,
    private permissionService: PermissionService,
    private router: Router,
    private route: ActivatedRoute,
    private searchService: SearchService,
    private formService: QuestionControlService
  ) {}

  async ngOnInit() {
    this.searchFormData = this.searchService.searchFormData;
    this.searchService.activePageTrigger.subscribe((data) => {
      this.activePageItem = data.activePage;
    });
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

  reInitiateSearch(type: string) {
    let formResult: any = this.formService.createForm(
      this.searchFormData[type].properties,
      {}
    );
    this.searchForm = formResult.form;
    this.questions = formResult.questions;
  }

  searchSubmit() {
    this.searchService.searchTrigger.next({ data: this.searchForm.value });
    setTimeout(() => {
      this.searchForm.reset();
    }, 800);
  }

  goToHome() {
    window.location.href = window.location.origin + "/dashboard";
  }

  applyFilter(val: string) {
    const data: any = { globalSearch: 1, SearchTerm: val };
    const searchFormData: any = {};
    Object.keys(this.searchForm.value).forEach((ele) => {
      searchFormData[ele] = val;
    });
    this.searchService.searchTrigger.next({ data: data, searchFormData });
    setTimeout(() => {
      this.globalSearchInputBox.nativeElement.value = "";
    }, 800);
  }
}
