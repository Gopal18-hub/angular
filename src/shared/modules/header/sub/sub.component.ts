import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "maxhealth-sub-header",
  templateUrl: "./sub.component.html",
  styleUrls: ["./sub.component.scss"],
})
export class SubComponent implements OnInit {
  @Input() submodules: any = [];

  activeSubModule: any;

  searchFormData = {
    "": {
      title: "",
      type: "object",
      properties: {
        username: {
          type: "string",
          title: "Username",
          required: true,
        },
        password: {
          type: "password",
          title: "Password",
          required: true,
        },
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
  };

  constructor() {}

  ngOnInit(): void {}

  onRouterLinkActive($event: any, imodule: any) {
    console.log($event);
    if ($event) {
      this.activeSubModule = imodule;
    }
  }
}
