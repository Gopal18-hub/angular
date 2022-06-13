import { Component, OnInit, Inject } from "@angular/core";
import { MaxModules } from "../../constants/Modules";
import { APP_BASE_HREF } from "@angular/common";
import { AuthService } from "../../services/auth.service";
@Component({
  selector: "maxhealth-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit {
  modules: any = [];

  activeModule: any;

  constructor(
    @Inject(APP_BASE_HREF) private baseHref: string,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.modules = MaxModules.getModules();
    this.modules.forEach((element: any) => {
      if (element.defaultPath == this.baseHref) {
        this.activeModule = element;
      }
    });
  }

  logout() {
    this.authService.logout();
  }
}
