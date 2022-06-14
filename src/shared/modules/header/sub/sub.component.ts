import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "maxhealth-sub-header",
  templateUrl: "./sub.component.html",
  styleUrls: ["./sub.component.scss"],
})
export class SubComponent implements OnInit {
  @Input() submodules: any = [];

  activeSubModule: any;

  constructor() {}

  ngOnInit(): void {}

  onRouterLinkActive($event: any, imodule: any) {
    console.log($event);
    if ($event) {
      this.activeSubModule = imodule;
    }
  }
}
