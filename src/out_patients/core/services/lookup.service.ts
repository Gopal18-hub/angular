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
    "registration/op-registration": "registration/find-patient",
  };
  constructor(
    private cookie: CookieService,
    private http: HttpService,
    private router: Router,
    private messageDialogService: MessageDialogService
  ) {}

  async searchPatient(formdata: any): Promise<any> {
    let hspId = Number(this.cookie.get("HSPLocationId"));
    if (formdata["globalSearch"] == 1) {
      await this.http
        .get(ApiConstants.globalSearchApi(formdata["SearchTerm"], hspId))
        .subscribe(
          (resultData) => {
            if (resultData.length > 1) {
              this.router.navigateByUrl(this.routes[this.router.url]);
            } else {
              return resultData[0];
            }
          },
          (error) => {
            this.messageDialogService.error(error.error);
          }
        );
    } else {
      let maxid = 0;
      if (
        formdata["maxID"] != undefined &&
        formdata["maxID"] != null &&
        formdata["maxID"] != ""
      ) {
        maxid = Number(formdata["maxID"].split(".")[1]);
      }

      if (maxid <= 0 && maxid == undefined && maxid == null) {
        formdata["maxID"] = "";
      }
      this.http
        .get(
          ApiConstants.searchPatientApi(
            formdata["maxID"],
            "",
            formdata["name"],
            formdata["phone"],
            formdata["dob"],
            formdata["adhaar"],
            formdata["healthID"]
          )
        )
        .subscribe(
          (resultData) => {
            this.router.navigate(["registration", "find-patient"], {
              queryParams: {
                maxID: formdata["maxID"],
                name: formdata["name"],
                phone: formdata["phone"],
                dob: formdata["dob"],
                healthID: formdata["healthID"],
                adhaar: formdata["adhaar"],
              },
            });
          },
          (error) => {
            this.router.navigate(["registration", "find-patient"], {
              queryParams: {
                maxID: formdata["maxID"],
                name: formdata["name"],
                phone: formdata["phone"],
                dob: formdata["dob"],
                healthID: formdata["healthID"],
                adhaar: formdata["adhaar"],
              },
            });
          }
        );
    }
  }
}
