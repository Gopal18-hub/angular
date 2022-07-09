import { Injectable } from "@angular/core";
import { Subject, takeUntil } from "rxjs";
import { CookieService } from "@shared/services/cookie.service";
import { HttpService } from "@shared/services/http.service";
import { ApiConstants } from "../constants/ApiConstants";
import { Router } from "@angular/router";
import { MessageDialogService } from "@shared/ui/message-dialog/message-dialog.service";

@Injectable({
  providedIn: "root",
})
export class LookupService {
  routes: any = {
    "/registration/op-registration": "/registration/find-patient",
  };
  constructor(
    private cookie: CookieService,
    private http: HttpService,
    private router: Router,
    private messageDialogService: MessageDialogService
  ) {}

  async searchPatient(formdata: any): Promise<any> {
    let hspId = Number(this.cookie.get("HSPLocationId"));
    if (formdata.data["globalSearch"] == 1) {
      const resultData = await this.http
        .get(ApiConstants.globalSearchApi(formdata.data["SearchTerm"], hspId))
        .toPromise();
      if (resultData.length > 1) {
        this.router.navigate([this.routes[this.router.url]], {
          queryParams: formdata.searchFormData,
        });
      } else {
        return resultData[0];
      }
    } else {
      let maxid = 0;
      if (formdata.data["maxID"]) {
        maxid = Number(formdata.data["maxID"].split(".")[1]);
      }
      if (maxid <= 0 && maxid == undefined && maxid == null) {
        formdata["maxID"] = "";
      }
      this.http
        .get(
          ApiConstants.searchPatientApi(
            formdata.data["maxID"],
            "",
            formdata.data["name"],
            formdata.data["phone"],
            formdata.data["dob"],
            formdata.data["adhaar"],
            formdata.data["healthID"]
          )
        )
        .subscribe(
          (resultData) => {
            this.router.navigate(["registration", "find-patient"], {
              queryParams: formdata.data,
            });
          },
          (error) => {
            this.router.navigate(["registration", "find-patient"], {
              queryParams: formdata.data,
            });
          }
        );
    }
  }
}
