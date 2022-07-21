import { Component, OnInit } from "@angular/core";

import { ConsultationsComponent } from "./submodules/consultations/consultations.component";
import { InvestigationsComponent } from "./submodules/investigations/investigations.component";
import { HealthCheckupsComponent } from "./submodules/health-checkups/health-checkups.component";
import { ProcedureOtherComponent } from "./submodules/procedure-other/procedure-other.component";
import { OrderSetComponent } from "./submodules/order-set/order-set.component";
import { ConsumablesComponent } from "./submodules/consumables/consumables.component";

import { ComponentPortal } from "@angular/cdk/portal";

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
      title: "Procudure & Others",
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

  constructor() {}

  ngOnInit(): void {}

  tabChange(tab: any) {
    this.activeTab = tab;
    this.selectedComponent = new ComponentPortal(tab.component);
  }
}
