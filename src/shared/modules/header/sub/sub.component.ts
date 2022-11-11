import {
  Component,
  OnInit,
  Input,
  Inject,
  ViewChild,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import { QuestionControlService } from "../../../ui/dynamic-forms/service/question-control.service";
import { FormGroup } from "@angular/forms";
import {
  Router,
  NavigationEnd,
  Event as NavigationEvent,
} from "@angular/router";
import { SearchService } from "../../../services/search.service";
import { APP_BASE_HREF } from "@angular/common";
import { map, filter } from "rxjs/operators";
import { CookieService } from "@shared/services/cookie.service";

@Component({
  selector: "maxhealth-sub-header",
  templateUrl: "./sub.component.html",
  styleUrls: ["./sub.component.scss"],
})
export class SubComponent implements OnInit, OnChanges {
  @ViewChild("searchVal") globalSearchInputBox: any;

  @Input() submodules: any = [];

  @Input() module: any;

  activeSubModule: any;

  activePageItem: any;

  searchFormData: any;

  searchForm!: FormGroup;

  questions: any;
  searchFormProperties: any;

  constructor(
    @Inject(APP_BASE_HREF) public baseHref: string,
    private formService: QuestionControlService,
    private router: Router,
    private searchService: SearchService,
    private cookie: CookieService
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
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.processSubModule();
  }

  processSubModule() {
    if (!this.submodules) {
      this.submodules = [];
    }
    console.log(this.submodules);
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

  reInitiateSearch(type: string) {
    this.searchFormProperties = this.searchFormData[type];
    let formResult: any = this.formService.createForm(
      this.searchFormData[type].properties,
      {}
    );
    this.searchForm = formResult.form;
    this.questions = formResult.questions;
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

  activeSubModule: any;

  ngOnInit(): void {
    console.log(this.menu);
  }
}
