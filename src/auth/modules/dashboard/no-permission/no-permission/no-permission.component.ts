import { Component, OnInit } from "@angular/core";
import { environment } from "@environments/environment";

@Component({
  selector: "auth-no-permission",
  templateUrl: "./no-permission.component.html",
  styleUrls: ["./no-permission.component.scss"],
})
export class NoPermissionComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  redirectToHome() {
    window.location.href = environment.IentityServerRedirectUrl + "dashboard";
  }
}
