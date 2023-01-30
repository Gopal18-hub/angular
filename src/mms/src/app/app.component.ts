import { Component, OnInit } from "@angular/core";
import { AuthService } from "@shared/services/auth.service";
import { ReportService } from "@shared/services/report.service";
import { PermissionService } from "@shared/services/permission.service";
@Component({
  selector: "mms-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  title = "MMS";
  isAuthenticated: boolean = false;
  reportapiloader: boolean = false;
  roleLoaded: boolean = false;

  constructor(
    private auth: AuthService,
    private report: ReportService,
    private permissionService: PermissionService
  ) {}

  ngOnInit(): void {
    this.isAuthenticated = this.auth.isAuthenticated();
  }

  ngAfterViewInit(): void {
    this.report.reportPrintloader.subscribe((res: boolean) => {
      this.reportapiloader = res;
    });
    this.permissionService.rolesLoaded.subscribe((res: boolean) => {
      this.roleLoaded = res;
    });
  }
}
