import { Injectable } from "@angular/core";
import { environment } from "@environments/environment";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class ReportService {
  constructor(private http: HttpClient, private router: Router) {}
  baseUrl: string | undefined;

  getOPRegistrationForm(_iacode: string) {
    this.baseUrl =
      environment.ReportsApiUrl + "PrintFormReport";
    window.open(
      this.baseUrl + "?" + _iacode,
      "_blank",
      "toolbar=0,location=0,menubar=0"
    );
  }
  getOPRegistrationPrintLabel(_iacode: string) {
    this.baseUrl =
      environment.ReportsApiUrl + "PrintLabel";
    window.open(
      this.baseUrl + "?" + _iacode,
      "_blank",
      "toolbar=0,location=0,menubar=0"
    );
  }
  getOPRegistrationOrganDonorForm(_iacode: string) {
    this.baseUrl =
      environment.ReportsApiUrl + "PrintOrganDonorForm";
    window.open(
      this.baseUrl + "?" + _iacode,
      "_blank",
      "toolbar=0,location=0,menubar=0"
    );
  }
}
