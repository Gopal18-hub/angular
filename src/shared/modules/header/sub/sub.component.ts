import { Component, OnInit, Input, Inject, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { APP_BASE_HREF } from "@angular/common";
import { SearchService } from "../../../services/search.service";

@Component({
  selector: "maxhealth-sub-header",
  templateUrl: "./sub.component.html",
  styleUrls: ["./sub.component.scss"],
})
export class SubComponent implements OnInit {
  @Input() submodules: any = [];

  @Input() module: any;

  activeSubModule: any;

  activePageItem: any;

  constructor(
    @Inject(APP_BASE_HREF) public baseHref: string,
    private router: Router,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
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
              this.searchService.setActivePage(this.activePageItem);
              //this.reInitiateSearch(this.activePageItem.globalSearchKey);
            }
          });
        }
      }
    });
    //if (!this.activePageItem) this.reInitiateSearch("global");
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
      //this.reInitiateSearch(this.activePageItem.globalSearchKey);
    }
  }
}
