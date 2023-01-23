import {
  Component,
  OnInit,
  Inject,
  HostListener,
  ViewChild,
} from "@angular/core";
import { MaxModules } from "../../constants/Modules";
import { APP_BASE_HREF } from "@angular/common";
import { AuthService } from "../../services/auth.service";
import { CookieService } from "@shared/v2/services/cookie.service";
import { environment } from "@environments/environment";
import { PermissionService } from "../../services/permission.service";
import { ActivatedRoute, Router } from "@angular/router";
import { DbService } from "../../services/db.service";
import { MatDialog } from "@angular/material/dialog";
import { ChangelocationComponent } from "./changelocation/changelocation.component";
import { Subject, takeUntil } from "rxjs";
import { ChangepaswordComponent } from "./changepasword/changepasword.component";
import { SelectimeiComponent } from "./selectIMEI/selectimei.component";
import { PaytmMachineComponent } from "./paytm-machine/paytm-machine.component";
import { ADAuthService } from "../../../../auth/core/services/adauth.service";
import { FormGroup } from "@angular/forms";
import { MatSidenav } from "@angular/material/sidenav";

@Component({
  selector: "maxhealth-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit {
  modules: any = [];
  submodules: any = [];
  location: string = "";
  station: string = "";
  usrname: string = "";
  user: string = "";
  parentMenu: string = "";
  childMenu: string = "";
  activeModule: any;
  activeSubModule: any;
  activePageItem: any;
  isMenuVisible: boolean = false;
  searchFormData: any;

  searchForm!: FormGroup;

  menuJson = [
    "Out Patient",
    "Emergency",
    "In-Patients",
    "MMS",
    "Opr. Theater",
    "MIS reports",
    "Physicians",
    "Adverse Events",
    "Laboratory",
    "Donate Blood",
    "Administration",
  ];
  submenu = ["Materials", "Pharmacy", "Non Medical Items"];
  subchild = [
    "OP Pharmacy",
    "IP Pharmacy",
    "Master",
    "Staff Dependent",
    "OP Pharmacy",
    "IP Pharmacy",
    "Master",
    "Staff Dependent",
  ];
  private readonly _destroying$ = new Subject<void>();
  @ViewChild("sidenav") sidenav: MatSidenav | undefined;
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

  isExpanded = false;
  showSubmenu: boolean = false;
  showSubChild: boolean = false;
  showRecentsSubmenu: boolean = false;
  showFavouritesSubmenu: boolean = false;
  isShowing = false;
  showSubSubMenu: boolean = false;
  submenuName: any;
  submenuTitle: any;
  mouseenter() {
    if (!this.isExpanded) {
      this.isShowing = true;
    }
  }

  mouseleave() {
    if (!this.isExpanded) {
      this.isShowing = false;
    }
  }

  async ngOnInit() {
    await this.permissionService.getPermissionsRoleWise();
    this.isMenuVisible = false;
    this.modules = this.permissionService.checkModules();
    console.log("this.modules", this.modules);
    this.modules.forEach((element: any) => {
      if (
        element.defaultPath == this.baseHref ||
        element.defaultPath == window.location.pathname
      ) {
        this.activeModule = element;
      }
    });
    // For dev only
    this.activeModule = this.modules[1];
    //console.log('activeModule',this.activeModule);
    // this.setRefreshedToken(); //Set refreshed access token in cookie
    this.location = this.cookieService.get("Location");
    this.station = this.cookieService.get("Station");
    this.usrname = this.cookieService.get("Name");
    this.user = this.cookieService.get("UserName");
  }

  processSubModule() {
    if (!this.submodules) {
      this.submodules = [];
    }
    console.log("this.submodules", this.submodules);
    this.submodules.forEach((element: any) => {
      if (
        element.defaultPath &&
        window.location.pathname.includes(element.defaultPath)
      ) {
        if (element.childrens) {
          element.childrens.forEach((ch: any) => {
            if (
              ch.defaultPath &&
              window.location.pathname.includes(ch.defaultPath)
            ) {
              this.activeSubModule = element;
              this.activePageItem = ch;
              // this.reInitiateSearch(this.activePageItem.globalSearchKey);
            }
          });
        }
      }
    });
  }

  showSubMenu(event: any) {
    console.log("showsub", event);
    this.submenuName = event.target.innerText;
    this.submenuTitle = this.submenuName;
    this.showSubmenu = true;
    console.log("this.activeModule", this.activeModule);
    this.parentMenu = event.target.innerText;
    this.childMenu = "";
    // this.processSubModule();
    this.isMenuVisible = false;
    this.isExpanded = true;
  }

  hideSubMenu(event: any) {
    // console.log("this.submenuName", this.submenuName);
    console.log("this.activeModule", this.activeModule);
    // console.log("hide", event);

    console.log("this.parentMenu", this.parentMenu);
    console.log("this.childMenu", this.childMenu);
    // this.submenuName={...this.submenuName}
    // if (this.showSubChild == true) {
    //   this.showSubmenu = true;
    //   this.showSubChild = false;
    //   this.submenuName = this.submenuTitle;
    // } else {
    //   this.showSubmenu = false;
    //   this.submenuName = "";
    // }
    // this.parentMenu = this.submenuTitle;
    this.showSubmenu = true;
    let definedModules: any = MaxModules.getModules();
    // for (let s = 0; s < definedModules.sections?.length; s++) {

    //   for (let f = 0; f < section.fields?.length; f++) {
    //   }
    // }

    definedModules.forEach((masterModule: any, index: number) => {
      if (this.parentMenu === masterModule.title) {
        if (this.childMenu != "") {
          masterModule.childrens?.forEach(
            (childrenModule: any, childIndex: number) => {
              if (this.childMenu === childrenModule.title) {
                console.log("childrenModule", childrenModule);
                this.activeModule = masterModule;
                this.submenuName = masterModule.title;
                this.childMenu = ""; //masterModule.title;
              } else {
                if (
                  childrenModule.childrens != undefined &&
                  childrenModule.childrens.length > 0
                ) {
                  childrenModule.childrens?.forEach(
                    (subchildrenModule: any, subchildIndex: number) => {
                      console.log("subchildrenModule", subchildrenModule);
                      if (this.childMenu === subchildrenModule.title) {
                        this.activeModule = childrenModule;
                        this.submenuName = childrenModule.title;
                        this.childMenu = childrenModule.title;
                      }
                    }
                  );
                }
              }
            }
          );
        } else {
          console.log("masterModule", masterModule);
          this.activeModule = masterModule;
          this.submenuName = masterModule.title;
          this.childMenu = masterModule.title; //;
        }
      }
    });
    this.isMenuVisible = false;
    this.isExpanded = true;
  }

  subChildShow(event: any, childModule: any) {
    console.log("this.activeModule", this.activeModule);
    if (
      childModule.childrens != undefined &&
      childModule.childrens.length > 0
    ) {
      this.activeModule = childModule;
      this.showSubChild = true;
      this.showSubmenu = true;
      this.childMenu = event.target.innerText;
      this.submenuName = event.target.innerText;

      this.submodules = this.activeModule.childrens;
      console.log("this.submodules", this.submodules);
      this.isMenuVisible = false;
      this.isExpanded = true;
    } else {
      this.isMenuVisible = true;
      this.isExpanded = false;
    }
  }
  subChildHide() {
    this.showSubChild = false;

    let definedModules: any = MaxModules.getModules();
    definedModules.forEach((masterModule: any, index: number) => {
      if (this.childMenu === this.parentMenu) {
        console.log("masterModule", masterModule);
        this.activeModule = masterModule;
      }
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
      this.cookieService.delete("accessToken", "/");
      this.cookieService.set("accessToken", accessToken, { path: "/" });
    }
  }

  logout() {
    this.setRefreshedToken(); //Set refreshed access token in cookie
    // this.adauth
    //   .ClearExistingLogin(Number(this.cookieService.get("UserId")))
    //   .pipe(takeUntil(this._destroying$))
    //   .subscribe(async (resdata: any) => {
    //     console.log(resdata);
    //   });
    this.authService.logout().subscribe((response: any) => {
      if (response.postLogoutRedirectUri) {
        window.location = response.postLogoutRedirectUri;
      }
      sessionStorage.clear();
      this.cookieService.deleteAll();
      this.cookieService.deleteAll("/", environment.cookieUrl, true);
      this.authService.deleteToken();
      this.dbService.cachedResponses.clear();
      window.location.href = window.location.origin + "/login";
    });
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
          this.router.navigate([], {
            queryParams: {},
            relativeTo: this.route,
          });
          window.location.href =
            environment.IentityServerRedirectUrl + "/dashboard";
        }
      });
  }

  redirectToResetPassword() {
    window.open(environment.passwordResetUrl);
  }

  openIMEIDialog() {}

  openPayTmDialog() {}

  // reInitiateSearch(type: string) {
  //   this.searchFormProperties = this.searchFormData[type];
  //   let formResult: any = this.formService.createForm(
  //     this.searchFormData[type].properties,
  //     {}
  //   );
  //   this.searchForm = formResult.form;
  //   this.questions = formResult.questions;
  // }
}
