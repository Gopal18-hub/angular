import { Component, OnInit, Input, Inject } from "@angular/core";
import { QuestionControlService } from "../../../ui/dynamic-forms/service/question-control.service";
import { FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { SearchService } from "../../../services/search.service";
import { APP_BASE_HREF } from "@angular/common";

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

  searchFormData: any;

  searchForm!: FormGroup;

  questions: any;

  constructor(
    @Inject(APP_BASE_HREF) public baseHref: string,
    private formService: QuestionControlService,
    private router: Router,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
    this.searchFormData = this.searchService.searchFormData;

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
    if (!this.activePageItem) this.reInitiateSearch("global");
  }

  reInitiateSearch(type: string) {
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
  }

  goToHome() {
    window.location.href = window.location.origin + "/dashboard";
  }
}
