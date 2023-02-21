import {
  Component,
  OnInit,
  Input,
  Inject,
  ViewChild,
  OnChanges,
  SimpleChanges,
  HostListener,
} from "@angular/core";
import { QuestionControlService } from "../../../ui/dynamic-forms/service/question-control.service";
import { FormGroup } from "@angular/forms";
import { environment } from "@environments/environment";
import {
  Router,
  NavigationEnd,
  Event as NavigationEvent,
  ActivatedRoute,
} from "@angular/router";
import { SearchService } from "../../../services/search.service";
import { APP_BASE_HREF, DatePipe } from "@angular/common";
import { map, filter } from "rxjs/operators";
import { CookieService } from "@shared/services/cookie.service";
import { AuthService } from "@shared/v2/services/auth.service";
import { PermissionService } from "@shared/v2/services/permission.service";
import { MatDialog } from "@angular/material/dialog";
import { DbService } from "@shared/v2/services/db.service";

import { ChangelocationComponent } from "../changelocation/changelocation.component";
import { Subject, takeUntil } from "rxjs";
import { ChangepaswordComponent } from "../changepasword/changepasword.component";
import { SelectimeiComponent } from "../selectIMEI/selectimei.component";

import { HttpService } from "@shared/v2/services/http.service";
import { PharmacyApiConstants } from "../../../../../mms/core/constants/pharmacyApiConstant";
@Component({
  selector: "maxhealth-sub-header",
  templateUrl: "./sub.component.html",
  styleUrls: ["./sub.component.scss"],
})
export class SubComponent implements OnInit, OnChanges {
  @ViewChild("searchVal") globalSearchInputBox: any;

  @ViewChild("subsefdlkjdsfs") subsefdlkjdsfs: any;
  @ViewChild("Topmore") Topmore: any;
  @Input() submodules: any[] = [];

  @Input() module: any;

  activeSubModule: any;

  activePageItem: any;

  searchFormData: any;

  searchForm!: FormGroup;
  location: string = "";
  station: string = "";
  usrname: string = "";
  user: string = "";
  questions: any;
  searchFormProperties: any;
  selectedIndex: number = 1;
  leftIndex = 0;
  rightIndex = 3;
  private readonly _destroying$ = new Subject<void>();
  disableGlobalSearch: Boolean = false;
  @HostListener("window:keydown.Alt.r", ["$event"])
  navigateToRegister($event: any) {
    this.router.navigate(["/registration"]);
  }

  constructor(
    @Inject(APP_BASE_HREF) public baseHref: string,
    private authService: AuthService,
    private permissionService: PermissionService,
    private formService: QuestionControlService,
    private router: Router,
    private route: ActivatedRoute,
    private searchService: SearchService,
    private cookie: CookieService,
    private dbService: DbService,
    private matDialog: MatDialog,
    private http: HttpService,
    public datepipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.searchFormData = this.searchService.searchFormData;
    this.processSubModule();
    if (!this.activePageItem) this.reInitiateSearch("global");
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((event: NavigationEvent) => {
        this.processSubModule();
      });
    this.location = this.cookie.get("Location");
    this.station = this.cookie.get("Station");
    this.usrname = this.cookie.get("Name");
    this.user = this.cookie.get("UserName");
    // this.setIndex(0, "/pharmacy/issue-entry");
    this.updateOrdersCount();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.processSubModule();
  }

  goRight(index: number) {
    let fullIndex = this.submodules.length;
    if (this.rightIndex != fullIndex) {
      ++this.leftIndex;
      ++this.rightIndex;
    }
  }

  goLeft() {
    if (this.leftIndex != 0) {
      --this.leftIndex;
      --this.rightIndex;
    }
  }
  processSubModule() {
    const disableURL = ["/mms/pharmacy/ep-order", "/mms/pharmacy/online-order"];
    this.disableGlobalSearch =
      disableURL.indexOf(window.location.pathname) > -1;

    if (!this.submodules) {
      this.submodules = [];
    }
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
              this.reInitiateSearch(this.activePageItem.globalSearchKey);
            }
          });
        }
      }
    });
  }

  setIndex(index: number, defaultPath: any) {
    this.selectedIndex = index;
    this.router.navigate([defaultPath]); //["/pharmacy/issue-entry"]);
    //["/pharmacy/ep-order"]);
  }

  reInitiateSearch(type: string) {
    this.searchFormProperties = this.searchFormData[type];
    let formResult: any = this.formService.createForm(
      this.searchFormData[type].properties,
      {}
    );
    this.searchForm = formResult.form;
    this.questions = formResult.questions;
    this.questions[0].pattern = "[A-Za-z]+.[0-9]+";
  }

  onRouterLinkActive($event: any, imodule: any) {
    if ($event) {
      this.activeSubModule = imodule;
    }
  }

  onPageRouterLinkActive($event: any, mentItem: any) {
    console.log(mentItem);
    if ($event) {
      this.activePageItem = mentItem;
      this.reInitiateSearch(this.activePageItem.globalSearchKey);
    }
  }

  searchSubmit() {
    this.searchService.searchTrigger.next({ data: this.searchForm.value });
    setTimeout(() => {
      if (this.searchFormProperties.resetFormOnSubmit == false) {
      } else {
        this.searchForm.reset();
        if ("maxID" in this.searchForm.controls) {
          this.searchForm.controls["maxID"].setValue(
            this.cookie.get("LocationIACode") + "."
          );
        }
      }
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

  openIMEIDialog() {
    const changePasswordDialoref = this.matDialog.open(SelectimeiComponent, {
      width: "25vw",
      height: "33vh",
      data: {
        title: "Select POS IMEI",
        form: {
          title: "",
          type: "object",
          properties: {
            imei: {
              type: "autocomplete",
              title: "POS IMEI",
              required: true,
            },
          },
        },
        layout: "single",
        buttonLabel: "Save",
      },
    });

    changePasswordDialoref
      .afterClosed()
      .pipe(takeUntil(this._destroying$))
      .subscribe((result) => {
        if (result) {
          window.location.reload();
        }
      });
  }
  logout() {
    this.setRefreshedToken(); //Set refreshed access token in cookie
    this.authService.logout().subscribe((response: any) => {
      if (response.postLogoutRedirectUri) {
        window.location = response.postLogoutRedirectUri;
      }
      localStorage.clear();
      this.cookie.deleteAll();
      this.cookie.deleteAll("/", environment.cookieUrl, true);
      this.dbService.cachedResponses.clear();
      window.location.href = window.location.origin + "/login";
    });
  }

  openPayTmDialog() {}
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
      this.cookie.delete("accessToken", "/");
      this.cookie.set("accessToken", accessToken, { path: "/" });
    }
  }

  updateOrdersCount() {
    this.http
      .get(
        PharmacyApiConstants.eporderorderscounter +
          "/" +
          this.datepipe.transform(new Date(), "yyyy-MM-dd") +
          "/" +
          this.datepipe.transform(new Date(), "yyyy-MM-dd") +
          "/" +
          Number(this.cookie.get("HSPLocationId"))
      )
      .pipe(takeUntil(this._destroying$))
      .subscribe((res: any) => {
        if (res && (res.pendingOrderCount > 0 || res.onlineBillCount > 0)) {
          this.submodules.forEach((ch: any) => {
            if (
              res.onlineBillCount > 0 &&
              ch.title &&
              ch.title == "Online Orders"
            ) {
              ch.isBadge = true;
              ch.badgeCount = res.onlineBillCount;
            }
            if (
              res.pendingOrderCount > 0 &&
              ch.title &&
              ch.title == "EP Orders"
            ) {
              ch.isBadge = true;
              ch.badgeCount = res.pendingOrderCount;
            }
          });
        }
        this.submodules.forEach((ch: any) => {
          if (
            res.onlineBillCount == 0 &&
            ch.title &&
            ch.title == "Online Orders"
          ) {
            ch.isBadge = false;
          }
          if (
            res.pendingOrderCount == 0 &&
            ch.title &&
            ch.title == "EP Orders"
          ) {
            ch.isBadge = false;
          }
        });

        setTimeout(() => {
          this.updateOrdersCount();
        }, 1000 * 60 * 1); // Every 10 mins
      });
  }
}

@Component({
  selector: "maxhealth-sub-nested-menu",
  templateUrl: "./nested.component.html",
  styleUrls: ["./sub.component.scss"],
})
export class SubNestedComponent implements OnInit {
  @ViewChild("childMenu") childMenu: any;
  @Input() menu: any;
  @Input() module: any;
  @Input() subMenuTrigger: any;

  @Input() baseHref: any;

  @Input() onPageRouterLinkActive: any;

  @Input() tenentPath: any;
  activeSubModule: any;

  ngOnInit(): void {
    console.log(this.menu);
  }
}
