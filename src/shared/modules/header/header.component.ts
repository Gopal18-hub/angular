import { Component, OnInit, Inject } from "@angular/core";
import { MaxModules } from "../../constants/Modules";
import { APP_BASE_HREF } from "@angular/common";
import { AuthService } from "../../services/auth.service";
import { CookieService } from "../../services/cookie.service";
import { environment } from "@environments/environment";
import { PermissionService } from "../../services/permission.service";
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
  activeModule: any;

  constructor(
    @Inject(APP_BASE_HREF) private baseHref: string,
    private authService: AuthService,
    private cookieService: CookieService,
    private permissionService: PermissionService
  ) {}

  ngOnInit(): void {
    this.modules = MaxModules.getModules();
    this.modules.forEach((element: any) => {
      if (
        element.defaultPath == this.baseHref ||
        element.defaultPath == window.location.pathname
      ) {
        this.activeModule = element;
      }
    });

    this.location = this.cookieService.get("Location");
    this.station = this.cookieService.get("Station");
    this.usrname = this.cookieService.get("UserName");   
  }

  logout() {     
    this.authService.logout().subscribe((response: any) => {
      if (response.postLogoutRedirectUri) {
        window.location = response.postLogoutRedirectUri;
      }
      localStorage.clear();
      this.cookieService.delete("accessToken");
      this.cookieService.deleteAll();
      this.cookieService.deleteAll("/", environment.cookieUrl, true);
      this.authService.startAuthentication();
    });
  }

  getPermissions(){    
    this.permissionService.getPermissionsRoleWise()
    .subscribe((response:any)=>{
      console.log(response);

    },(error:any)=>{
        console.log(error);
    }); 
  }
}
