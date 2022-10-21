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
    const reportUrl = `${environment.reportTenantUrl}${reportEntity}${params}`;
    const winbox: any = new WinBox(reportName, {
      url: reportUrl,
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
        // (<any>document.getElementById(reportEntity))
        //   .querySelector("iframe")
        //   .contentWindow.document.querySelector("iframe")
        //   .contentWindow.print();
        // Create a new iframe for the print job
        const printFrame = document.createElement("iframe");
        printFrame.setAttribute(
          "style",
          "visibility: hidden; height: 0; width: 0; position: absolute; border: 0"
        );
        printFrame.setAttribute("id", "report-print");
        const req = new window.XMLHttpRequest();
        req.responseType = "arraybuffer";

        req.addEventListener("error", () => {
          // Since we don't have a pdf document available, we will stop the print job
        });

        req.addEventListener("load", () => {
          // Check for errors
          if ([200, 201].indexOf(req.status) === -1) {
            // Since we don't have a pdf document available, we will stop the print job
            return;
          }

          // Pass response or base64 data to a blob and create a local object url
          let localPdf: any = new window.Blob([req.response], {
            type: "application/pdf",
          });
          localPdf = window.URL.createObjectURL(localPdf);

          // Set iframe src with pdf document url
          printFrame.setAttribute("src", localPdf);

          document.getElementsByTagName("body")[0].appendChild(printFrame);

          // Get iframe element
          const iframeElement: any = document.getElementById("report-print");

          iframeElement.onload = () => {
            setTimeout(() => this.performPrint(iframeElement, params), 1000);
            return;
          };
        });

        req.open("GET", reportUrl + "&printflag=1", true);
        req.send();
      },
    });
  }

  performPrint(iframeElement: any) {
    try {
      iframeElement.contentWindow.print();
    } catch (error) {
      console.log(error);
    } finally {
      const iframe = document.getElementById("report-print");
      if (iframe) {
        iframe.remove();
      }
    }
  }
}
