import { environment } from '@environments/environment';


export namespace ApiConstants
{
    export const validate_username  = environment.IdentityServerUrl + 'api/authenticate/validateusernamebyad?UserName=';

    export const  autheticate = environment.IdentityServerUrl + 'api/authenticate';  
}