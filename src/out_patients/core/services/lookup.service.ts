import { Injectable } from "@angular/core";
import { Subject, takeUntil } from "rxjs";
import { CookieService } from "@shared/services/cookie.service";
import { HttpService } from "@shared/services/http.service";
import { ApiConstants } from "../constants/ApiConstants";
import { Router } from "@angular/router";
import { MessageDialogService } from "@shared/ui/message-dialog/message-dialog.service";
import { DatePipe } from "@angular/common";

@Injectable({
  providedIn: "root",
})
export class LookupService {
  routes: any = {
    "/registration/op-registration": "/registration/find-patient",
  };
  routeswithoutsearch: any = {
    "/qms": "/registration/find-patient",
    "/acd": "/registration/find-patient",
    "/staff-dept": "/registration/find-patient",
    "/out-patient-billing/online-op-bill": "/registration/find-patient",
    "/out-patient-billing/dispatch-report": "/registration/find-patient",
    "/configure/RIS": "/registration/find-patient",
    "/configure/LIMS": "/registration/find-patient",
  };
  constructor(
    private cookie: CookieService,
    private http: HttpService,
    private router: Router,
    private messageDialogService: MessageDialogService,
    private datepipe: DatePipe
  ) {}

  async searchPatient(formdata: any): Promise<any> {
    let hspId = Number(this.cookie.get("HSPLocationId"));
    if (formdata.data) {
      if (formdata.data["globalSearch"] == 1) {
        const resultData = await this.http
          .get(ApiConstants.globalSearchApi(formdata.data["SearchTerm"], hspId))
          .toPromise();
        if (this.routeswithoutsearch[this.router.url]) {
          this.router.navigate([this.routeswithoutsearch[this.router.url]], {
            queryParams: formdata.data,
          });
        } else {
          if (resultData.length > 1) {
            if (this.routes[this.router.url]) {
              this.router.navigate([this.routes[this.router.url]], {
                queryParams: formdata.data,
              });
            } else {
              return resultData;
            }
          } else {
            return resultData;
          }
        }
      } else {
        const searchData: any = this.removeEmpty(formdata.data);
        if (Object.keys(searchData).length > 0) {
          if ("maxID" in searchData) {
            let maxid = 0;
            if (searchData["maxID"]) {
              maxid = Number(searchData["maxID"].split(".")[1]);
            }
            if (!maxid) {
              searchData["maxID"] = "";
            }
          }
          if ("dob" in searchData) {
            if (searchData["dob"]) {
              searchData["dob"] = this.datepipe.transform(
                searchData["dob"],
                "dd/MM/yyyy"
              );
            } else {
              searchData["dob"] = "";
            }
          }
          let url = ApiConstants.searchPatientApi(
            searchData["maxID"] ? searchData["maxID"] : "",
            "",
            searchData["name"] ? searchData["name"] : "",
            searchData["phone"] ? searchData["phone"] : "",
            searchData["dob"] ? searchData["dob"] : "",
            searchData["adhaar"] ? searchData["adhaar"] : "",
            searchData["healthID"] ? searchData["healthID"] : ""
          );
          const resultData = await this.http.get(url).toPromise().catch((reason: any) => {
            return reason.error;
          });
          if (this.routeswithoutsearch[this.router.url]) {
            this.router.navigate([this.routeswithoutsearch[this.router.url]], {
              queryParams: formdata.data,
            });
          } else {
            if (!resultData || resultData == "Search Not found") {
              return [];
            }
            if (resultData.length > 1) {
              if (this.routes[this.router.url]) {
                this.router.navigate([this.routes[this.router.url]], {
                  queryParams: formdata.data,
                });
              } else {
                return resultData;
              }
            } else {
              return resultData;
            }
          }
        } else {
          if (this.routes[this.router.url]) {
            this.router.navigate([this.routes[this.router.url]], {
              queryParams: formdata.data,
            });
          } else {
            return [];
          }
        }
      }
    } else {
      return [];
    }
  }

  removeEmpty(obj: any) {
    return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v));
  }
}
