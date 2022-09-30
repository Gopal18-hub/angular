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
import { MessageDialogService } from "@shared/ui/message-dialog/message-dialog.service";
import { SpecializationService } from "../../specialization.service";

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
      disabled: false,
    },
    {
      id: 2,
      title: "Investigations",
      component: InvestigationsComponent,
      disabled: false,
    },
    {
      id: 3,
      title: "Health Checkups",
      component: HealthCheckupsComponent,
      disabled: false,
    },
    {
      id: 4,
      title: "Procedure & Others",
      component: ProcedureOtherComponent,
      disabled: false,
    },
    {
      id: 5,
      title: "Order Set",
      component: OrderSetComponent,
      disabled: false,
    },
    {
      id: 6,
      title: "Consumables",
      component: ConsumablesComponent,
      disabled: false,
    },
  ];

  activeTab: any = this.tabs[0];

  activeMaxId: any;

  consumablesExist: boolean = false;

  healthCheckupExist: boolean = false;

  constructor(
    private billingService: BillingService,
    private matDialog: MatDialog,
    private http: HttpService,
    private cookie: CookieService,
    private messageDialogService: MessageDialogService,
    private specializationService: SpecializationService
  ) {}

  ngOnInit(): void {
    this.specializationService.getSpecialization();
    if (Number(this.cookie.get("HSPLocationId")) != 67) {
      this.tabs[4].disabled = true;
    }
    this.activeMaxId = this.billingService.activeMaxId;
    this.billingService.servicesTabStatus.subscribe((res: any) => {
      if ("consumables" in res) {
        this.consumablesExist = true;
        this.healthCheckupExist = false;
      } else if ("healthCheckup" in res) {
        this.healthCheckupExist = true;
        this.consumablesExist = false;
      } else if ("clear" in res) {
        this.healthCheckupExist = false;
        this.consumablesExist = false;
      } else if ("disableOrderSet" in res && res.disableOrderSet) {
        this.tabs[4].disabled = true;
      }
    });
  }

  async tabChange(tab: any) {
    this.activeMaxId = this.billingService.activeMaxId;

    if (tab.id != 6 && this.consumablesExist) {
      this.messageDialogService.info(
        "You cannot select Consumables with other Services"
      );
      return;
    }

    if (tab.id != 3 && this.healthCheckupExist) {
      this.messageDialogService.info(
        "You cannot select Health Checkup with other Services"
      );
      return;
    }

    if (
      tab.id == 3 &&
      this.billingService.checkOtherServicesForHealthCheckups()
    ) {
      this.healthCheckupWarning();
      return;
    } else if (
      tab.id == 6 &&
      this.billingService.checkOtherServicesForConsumables()
    ) {
      this.messageDialogService.info(
        "You cannot select Consumables with other Services"
      );
      return;
    } else if (tab.id == 2 && this.activeTab.id != tab.id) {
      if (this.billingService.unbilledInvestigations) {
      } else {
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
        uDialogRef.afterClosed().subscribe(async (ures: any) => {
          if (ures.process == 1) {
            if (ures.data.length > 0) {
              for (let i = 0; i < ures.data.length; i++) {
                const item = ures.data[i];
                await this.billingService.processInvestigationAdd(
                  1,
                  item.serviceId,
                  {
                    title: item.testName,
                    value: item.testID,
                    originalTitle: item.testName,
                    docRequired: item.doctorid ? true : false,
                    patient_Instructions: "",
                    serviceid: item.serviceId,
                    doctorid: item.doctorid,
                  }
                );
              }
            }
            this.billingService.unbilledInvestigations = true;
            this.activeTab = this.tabs[1];
            this.selectedComponent = new ComponentPortal(
              this.activeTab.component
            );
          }
        });
      } else {
        this.billingService.unbilledInvestigations = true;
        this.activeTab = this.tabs[1];
        this.selectedComponent = new ComponentPortal(this.activeTab.component);
      }
    });
  }
}
