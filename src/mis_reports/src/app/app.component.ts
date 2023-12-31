import { Component } from "@angular/core";
import { AuthService } from "@shared/services/auth.service";
import { ReportService } from "@shared/services/report.service";

@Component({
  selector: "mis-reports-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  title = "MIS Reports";
  isAuthenticated: boolean = false;
  reportapiloader: boolean = false;

  constructor(private auth: AuthService,
    private report: ReportService,) {}

  ngOnInit(): void {
    this.isAuthenticated = this.auth.isAuthenticated();
  }
  ngAfterViewInit(): void {
    this.report.reportPrintloader.subscribe((res: boolean) => {
      this.reportapiloader = res;
    });   
  }
}
