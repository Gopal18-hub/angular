import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuardService } from "@shared/services/guards/auth-guard.service";
import { AcdComponent } from "./acd.component";
import { InvestigationOrdersComponent } from "./submodules/investigation-orders/investigation-orders.component";
import { MedicineOrdersComponent } from "./submodules/medicine-orders/medicine-orders.component";

const routes: Routes = [
  {
    path: "acd",
    component: AcdComponent,
    canActivate: [AuthGuardService],
    children: [
      { path: "", component: InvestigationOrdersComponent },
      { path: "investigation-orders", component: InvestigationOrdersComponent },
      { path: "medicine-orders", component: MedicineOrdersComponent },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AcdRoutingModule {}
