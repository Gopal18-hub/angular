import { ComponentPortal } from "@angular/cdk/portal";
import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { BillingService } from "@modules/billing/submodules/billing/billing.service";
import { BillingApiConstants } from "@modules/billing/submodules/billing/BillingApiConstant";
import { HealthCheckupWarningComponent } from "@modules/billing/submodules/billing/prompts/health-checkup-warning/health-checkup-warning.component";
import { InvestigationWarningComponent } from "@modules/billing/submodules/billing/prompts/investigation-warning/investigation-warning.component";
import { UnbilledInvestigationComponent } from "@modules/billing/submodules/billing/prompts/unbilled-investigation/unbilled-investigation.component";
import { ConsultationsComponent } from "@modules/billing/submodules/billing/submodules/services/submodules/consultations/consultations.component";
import { ConsumablesComponent } from "@modules/billing/submodules/billing/submodules/services/submodules/consumables/consumables.component";
import { HealthCheckupsComponent } from "@modules/billing/submodules/billing/submodules/services/submodules/health-checkups/health-checkups.component";
import { InvestigationsComponent } from "@modules/billing/submodules/billing/submodules/services/submodules/investigations/investigations.component";
import { OrderSetComponent } from "@modules/billing/submodules/billing/submodules/services/submodules/order-set/order-set.component";
import { ProcedureOtherComponent } from "@modules/billing/submodules/billing/submodules/services/submodules/procedure-other/procedure-other.component";
import { CookieService } from "@shared/services/cookie.service";
import { HttpService } from "@shared/services/http.service";
import { threadId } from "worker_threads";
import { OderInvestigationsComponent } from "./submodules/investigations/investigations.component";
import { OrderProcedureOtherComponent } from "./submodules/procedure-other/procedure-other.component";

@Component({
  selector: "out-patients-services",
  templateUrl: "./services.component.html",
  styleUrls: ["./services.component.scss"],
})
export class OrderServicesComponent implements OnInit {
  selectedComponent: ComponentPortal<any> = new ComponentPortal(
    OderInvestigationsComponent
  );
  tabs: any = [
    {
      id: 0,
      title: "Investigations",
      component: OderInvestigationsComponent,
    },
    {
      id: 1,
      title: "Procedure & Others",
      component: OrderProcedureOtherComponent,
    },
  ];

  activeTab: any = this.tabs[0];

  activeMaxId: any;

  constructor(
    private billingService: BillingService,
    private matDialog: MatDialog,
    private http: HttpService,
    private cookie: CookieService
  ) {}

  ngOnInit(): void {
    this.activeMaxId = this.billingService.activeMaxId;
    this.activeTab = this.tabs[0];
  }

  async tabChange(tab: any) {
    this.activeMaxId = this.billingService.activeMaxId;
    if (
      tab.id == 3 &&
      this.billingService.checkOtherServicesForHealthCheckups(tab.id)
    ) {
      this.healthCheckupWarning();
      return;
    } else if (tab.id == 2 && this.activeTab.id != tab.id) {
      let checkinvestigations = await this.http
        .get(
          BillingApiConstants.getinvestigationfromphysician(
            this.activeMaxId.iacode,
            this.activeMaxId.regNumber,
            this.cookie.get("HSPLocationId")
          )
        )
        .toPromise();
      if (checkinvestigations.length > 0) {
        this.investigationCheck(checkinvestigations);
        return;
      }
    }
    this.activeTab = tab;
    this.selectedComponent = new ComponentPortal(tab.component);
  }

  healthCheckupWarning() {
    let dialogRef = this.matDialog.open(HealthCheckupWarningComponent, {
      width: "30vw",
      data: {},
    });
  }

  investigationCheck(checkinvestigations: any) {
    let dialogRef = this.matDialog.open(InvestigationWarningComponent, {
      width: "30vw",
      data: {},
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.showlist) {
        let uDialogRef = this.matDialog.open(UnbilledInvestigationComponent, {
          width: "60vw",
          height: "50vh",
          data: {
            investigations: checkinvestigations,
          },
        });
        uDialogRef.afterClosed().subscribe((ures: any) => {
          if (ures.process == 1) {
            this.activeTab = this.tabs[1];
            this.selectedComponent = new ComponentPortal(
              this.activeTab.component
            );
          }
        });
      } else {
        this.activeTab = this.tabs[1];
        this.selectedComponent = new ComponentPortal(this.activeTab.component);
      }
    });
  }
  onSaveClick() {}
  onViewClick() {}
}
