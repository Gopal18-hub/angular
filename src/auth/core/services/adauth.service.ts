import { HttpRequest } from '@angular/common/http';
import { HttpService } from 'src/shared/services/http.service';
import { Observable } from 'rxjs';
import { constants } from 'src/auth/core/constants/authconstants';



export class ADAuthService {

    constructor(public http: HttpService) { }

    public authenticateUserName(username:string)
    {
        return this.http.get(constants.validate_username + username);
    }

}
