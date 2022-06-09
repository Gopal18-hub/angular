import { HttpRequest } from '@angular/common/http';
import { HttpService } from 'src/shared/services/http.service';
import { Observable } from 'rxjs';
import { ApiConstants } from 'src/auth/core/constants/ApiConstants';



export class ADAuthService {

    constructor(public http: HttpService) { }

    public authenticateUserName(username:string)
    {
        return this.http.get(ApiConstants.validate_username + username);
    }

}
