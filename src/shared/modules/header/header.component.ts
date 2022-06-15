import { Component, OnInit, Inject } from "@angular/core";
import { MaxModules } from "../../constants/Modules";
import { APP_BASE_HREF } from "@angular/common";
import { AuthService } from "../../services/auth.service";
import { CookieService } from "../../services/cookie.service";
import { environment } from '@environments/environment';
@Component({
  selector: "maxhealth-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit {
  modules: any = [];
  location:string = '';
  station:string='';
  usrname:string='';
  activeModule: any;

  constructor(
    @Inject(APP_BASE_HREF) private baseHref: string,
    private authService: AuthService,
    private cookieService:CookieService
  ) {}

  ngOnInit(): void {
    this.modules = MaxModules.getModules();
    this.modules.forEach((element: any) => {
      if (element.defaultPath == this.baseHref) {
        this.activeModule = element;
      }
    });

    this.location = this.cookieService.get('Location');
    this.station = this.cookieService.get('Station');
    this.usrname= this.cookieService.get('UserName');

  }

  logout() {
    this.authService.logout().subscribe((response:any)=>{
  
    if (response.postLogoutRedirectUri) {
        window.location = response.postLogoutRedirectUri;
    }
    localStorage.clear();
      this.cookieService.delete('accessToken');
      this.cookieService.deleteAll();
      this.cookieService.deleteAll('/', environment.cookieUrl, true);
      this.authService.startAuthentication();
    });
      
  }
}
