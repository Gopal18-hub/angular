import { Component, NgModule } from "@angular/core";
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
import { ExpiredPatientCheckComponent } from "./submodules/expired-patient-check/expired-patient-check.component";
import { OprefundApprovalComponent } from "./submodules/oprefund-approval/oprefund-approval.component";

import { ServicesComponent } from "./submodules/billing/submodules/services/services.component";
import { CreditDetailsComponent } from "./submodules/billing/submodules/credit-details/credit-details.component";
import { BillComponent } from "./submodules/billing/submodules/bill/bill.component";

const routes: Routes = [
  {
    path: "out-patient-billing",
    component: BillingComponent,
    children: [
      {
        path: "",
        component: BillingComponentPage,
        children: [
          { path: "", component: ServicesComponent },
          { path: "services", component: ServicesComponent },
          { path: "bill", component: BillComponent },
          { path: "credit-details", component: CreditDetailsComponent },
        ],
      },
      { path: "deposit", component: DepositComponent },
      { path: "details", component: DetailsComponent },
      { path: "online-op-bill", component: OnlineOpBillsComponent },
      { path: "op-order-request", component: OpOrderRequestComponent },
      {
        path: "miscellaneous-billing",
        component: MiscellaneousBillingComponent,
      },
      { path: "initiate-deposit", component: InitiateDepositComponent },
      { path: "op-refund-approval", component: OprefundApprovalComponent },
      { path: "dispatch-report", component: DispatchReportComponent },
      { path: "dmg-mapping", component: DmgMappingComponent },
      {
        path: "expired-patient-check",
        component: ExpiredPatientCheckComponent,
      },
    ],
  },
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
      {
        path: "expired-patient-check",
        component: ExpiredPatientCheckComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BillingRoutingModule {}
