import { Component, OnInit } from "@angular/core";

import { ConsultationsComponent } from "./submodules/consultations/consultations.component";
import { InvestigationsComponent } from "./submodules/investigations/investigations.component";
import { HealthCheckupsComponent } from "./submodules/health-checkups/health-checkups.component";
import { ProcedureOtherComponent } from "./submodules/procedure-other/procedure-other.component";
import { OrderSetComponent } from "./submodules/order-set/order-set.component";
import { ConsumablesComponent } from "./submodules/consumables/consumables.component";
import { CookieService } from "@shared/services/cookie.service";
import { ComponentPortal } from "@angular/cdk/portal";
import { BillingService } from "../../billing.service";
import { HealthCheckupWarningComponent } from "../../prompts/health-checkup-warning/health-checkup-warning.component";
import { MatDialog } from "@angular/material/dialog";
import { HttpService } from "@shared/services/http.service";
import { BillingApiConstants } from "../../BillingApiConstant";
import { InvestigationWarningComponent } from "../../prompts/investigation-warning/investigation-warning.component";
import { UnbilledInvestigationComponent } from "../../prompts/unbilled-investigation/unbilled-investigation.component";
@Component({
  selector: "out-patients-services",
  templateUrl: "./services.component.html",
  styleUrls: ["./services.component.scss"],
})
export class ServicesComponent implements OnInit {
  selectedComponent: ComponentPortal<any> = new ComponentPortal(
    ConsultationsComponent
  );
  tabs: any = [
    {
      id: 1,
      title: "Consultations",
      component: ConsultationsComponent,
    },
    {
      id: 2,
      title: "Investigations",
      component: InvestigationsComponent,
    },
    {
      id: 3,
      title: "Health Checkups",
      component: HealthCheckupsComponent,
    },
    {
      id: 4,
      title: "Procedure & Others",
      component: ProcedureOtherComponent,
    },
    {
      id: 5,
      title: "Order Set",
      component: OrderSetComponent,
    },
    {
      id: 6,
      title: "Consumables",
      component: ConsumablesComponent,
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
  }

  async tabChange(tab: any) {
    this.activeMaxId = this.billingService.activeMaxId;
    if (
      tab.id == 3 &&
      this.billingService.checkOtherServicesForHealthCheckups()
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
}
