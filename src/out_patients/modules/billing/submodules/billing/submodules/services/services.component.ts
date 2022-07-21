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
  selectedComponent!: ComponentPortal<any>;
  tabs: any = [
    {
      title: "Consultations",
      component: ConsultationsComponent,
    },
    {
      title: "Investigations",
      component: InvestigationsComponent,
    },
    {
      title: "Health Checkups",
      component: HealthCheckupsComponent,
    },
    {
      title: "Procudure & Others",
      component: ProcedureOtherComponent,
    },
    {
      title: "Order Set",
      component: OrderSetComponent,
    },
    {
      title: "Consumables",
      component: ConsumablesComponent,
    },
  ];

  constructor() {}

  ngOnInit(): void {}

  tabChange(tab: any) {
    this.selectedComponent = new ComponentPortal(tab.component);
  }
}
