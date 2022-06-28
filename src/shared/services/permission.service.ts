import { Injectable } from '@angular/core';
import { HttpRequest } from '@angular/common/http';
import { CookieService } from './cookie.service';
import { HttpService } from './http.service';
import { ApiConstants } from '../constants/ApiConstants';



@Injectable({
    providedIn: 'root'
})
export class PermissionService {

    constructor(public cookieService: CookieService,
        public http: HttpService) { }

    public getPermissionsRoleWise(): any {
        let userId = Number(this.cookieService.get("UserId"));
        let roles = this.cookieService.get("role").split(',').map(x => +x);
        console.log(roles);

       let response = this.http.post(ApiConstants.getPermissions,
            {
                "Id": userId,
                "RoleIds": roles,
                "Permissions": null
            }
        );
        return response;
    }
}