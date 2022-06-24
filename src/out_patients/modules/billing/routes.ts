import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { BillingComponent } from "./billing.component";
import { BillingComponent as BillingComponentPage } from "./submodules/billing/billing.component";

import { DepositComponent } from "./submodules/deposit/deposit.component";
import { DetailsComponent } from "./submodules/details/details.component";
import { OnlineOpBillsComponent } from "./submodules/online-op-bills/online-op-bills.component";
import { OpOrderRequestComponent } from "./submodules/op-order-request/op-order-request.component";
import { MiscellaneousBillingComponent } from "./submodules/miscellaneous-billing/miscellaneous-billing.component";
import { InitiateDepositComponent } from "./submodules/initiate-deposit/initiate-deposit.component";
import { DispatchReportComponent } from "./submodules/dispatch-report/dispatch-report.component";
import { DmgMappingComponent } from "./submodules/dmg-mapping/dmg-mapping.component";

const routes: Routes = [
    {
      path: 'out-patient-billing', component: BillingComponent, children: [
          { path: '', component: BillingComponentPage },
          { path: 'deposit', component: DepositComponent },
          { path: 'details', component: DetailsComponent },
          { path: 'online-op-bill', component: OnlineOpBillsComponent },
          { path: 'op-order-request', component: OpOrderRequestComponent },
          { path: 'miscellaneous-billing', component: MiscellaneousBillingComponent },
          { path: 'initiate-deposit', component: InitiateDepositComponent },
          { path: 'dispatch-report', component: DispatchReportComponent} ,      
          { path:  'dmg-mapping', component:DmgMappingComponent}       
    
      ]
    }
  {
    path: "billing",
    component: BillingComponent,
    children: [
      { path: "", component: BillingComponentPage },
      { path: "deposit", component: DepositComponent },
      { path: "details", component: DetailsComponent },
      { path: "online-op-bill", component: OnlineOpBillsComponent },
      { path: "op-order-request", component: OpOrderRequestComponent },
      {
        path: "miscellaneous-billing",
        component: MiscellaneousBillingComponent,
      },
      { path: "initiate-deposite", component: InitiateDepositComponent },
      { path: "dispatch-report", component: DispatchReportComponent },
      { path: "dmg-mapping", component: DmgMappingComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BillingRoutingModule {}
