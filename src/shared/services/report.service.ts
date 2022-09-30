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

  openWindow(
    reportName: string,
    reportEntity: string,
    reportParams: any,
    x: string | number = "center",
    y: string | number = "center"
  ) {
    const params = "?" + new URLSearchParams(reportParams).toString();
    const winbox: any = new WinBox(reportName, {
      url: `${environment.reportTenantUrl}${reportEntity}${params}`,
      x: x,
      y: y,
      width: "1100px",
      height: "85%",
      id: reportEntity,
    });
    winbox.addControl({
      index: 0,
      class: "material-print-icon",
      image: "",
      click: function (event: any, winbox: any) {
        (<any>document.getElementById(reportEntity))
          .querySelector("iframe")
          .contentWindow.document.querySelector("iframe")
          .contentWindow.print();
      },
    });
  }
}
