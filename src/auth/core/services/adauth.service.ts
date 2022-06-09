import { HttpHandler, HttpRequest, HttpClient } from '@angular/common/http';
import { HttpService } from 'src/shared/services/http.service';
import { Observable } from 'rxjs';
import { ApiConstants } from 'src/auth/core/constants/ApiConstants';
import { TokenInterceptor } from 'src/shared/services/interceptors/token.interceptor'



export class ADAuthService {

    constructor(public http: HttpService, public tokeninteceptor: TokenInterceptor) { }

    public authenticateUserName(username:string):any
    {
        return this.http.getExternal(ApiConstants.validate_username + username);
    }

    public authenticate(username:string,password:string)
    {
        let returnUrl;
        const headers = { 'Content-Type':'application/json'};
        const query = window.location.search.substring(1);
        const vars = query.split('&');
        for (let i = 0; i < vars.length; i++) {
          let pair = vars[i].split('=');
          if (decodeURIComponent(pair[0]) == "ReturnUrl") {
            returnUrl = decodeURIComponent(pair[1]);
          }
        }
          
        
        let req = this.http.postExternal(ApiConstants.autheticate,JSON.stringify({
                username,
                password,
                returnUrl
              }));

      
        // let response = this.http.post(ApiConstants.autheticate,JSON.stringify({
        //     username,
        //     password,
        //     returnUrl
        //   }),undefined,{headers: headers , credentials: 'include'});
    }

}
