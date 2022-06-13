import { environment } from "@environments/environment";

export namespace ApiConstants {
  export const logout =
    environment.IdentityServerUrl + "api/authenticate/Logout";
}
