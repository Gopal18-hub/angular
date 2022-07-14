import { Injectable } from "@angular/core";
import { environment } from "@environments/environment";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Router } from "@angular/router";
import "winbox";
import { DomSanitizer } from "@angular/platform-browser";

declare const WinBox: WinBox.WinBoxConstructor;

@Injectable({
  providedIn: "root",
})
export class ReportService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private san: DomSanitizer
  ) {}
  baseUrl: string | undefined;

  openWindow(reportName: string, reportEntity: string, reportParams: any) {
    const params = "?" + new URLSearchParams(reportParams).toString();
    new WinBox(reportName, {
      url: `${environment.reportTenantUrl}${reportEntity}${params}`,
      x: "center",
      y: "center",
      width: "930px",
      height: "50%",
    });
  }

  getOPRegistrationForm(_iacode: string) {
    this.baseUrl = environment.ReportsApiUrl + "PrintFormReport";
    window.open(
      this.baseUrl + "?" + _iacode,
      "_blank",
      "toolbar=0,location=0,menubar=0"
    );
  }
  getOPRegistrationPrintLabel(_iacode: string) {
    this.baseUrl = environment.ReportsApiUrl + "PrintLabel";
    window.open(
      this.baseUrl + "?" + _iacode,
      "_blank",
      "toolbar=0,location=0,menubar=0"
    );
  }
  getOPRegistrationOrganDonorForm(_iacode: string) {
    this.baseUrl = environment.ReportsApiUrl + "PrintOrganDonorForm";
    window.open(
      this.baseUrl + "?" + _iacode,
      "_blank",
      "toolbar=0,location=0,menubar=0"
    );
  }
}
