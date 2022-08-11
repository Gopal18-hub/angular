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
      width: "1100px",
      height: "85%",
    });
  }
}
