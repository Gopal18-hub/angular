import { environment } from '@environments/environment';


export namespace ApiConstants
{

    export const validate_username  = environment.PatientApiUrl + 'api/authenticate/validateusernamebyad?UserName=';

    export const  autheticate = environment.PatientApiUrl + 'api/authenticate';

}