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
import { CreditDetailComponent } from "./submodules/miscellaneous-billings/credit-details/credit-details.component";
import { BillComponent } from "./submodules/billing/submodules/bill/bill.component";
import {
  BillDetailComponent,
  MiscCredDetail,
} from "./submodules/miscellaneous-billing/billing/bill-detail/bill-detail.component";
import { BillDetailTableComponent } from "./submodules/details/bill-detail-table/out-patients-bill-detail-table.component";
import { RefundAfterBillComponent } from "./submodules/details/refund-after-bill/refund-after-bill.component";
import { PartialCredBillComponent } from "./submodules/details/cred-bill-settlement/part-cred-bill-settlement.component";
import { PostDischargeFollowUpBillingComponent } from "./submodules/post-discharge-follow-up-billing/post-discharge-follow-up-billing.component";
import { PostDischargeBillComponent } from "./submodules/post-discharge-follow-up-billing/submodules/bill/post-discharge-bill.component";
import { PostDischargeServicesComponent } from "./submodules/post-discharge-follow-up-billing/submodules/services/post-discharge-services.component";
import { PostDischargeCreditDetailsComponent } from "./submodules/post-discharge-follow-up-billing/submodules/credit-details/post-discharge-credit-details.component";
import { AuthGuardService } from "../../../shared/services/guards/auth-guard.service";
import { MiscellaneousBillingsComponent } from "./submodules/miscellaneous-billings/miscellaneous-billings.component";
import { BillsComponent } from "./submodules/miscellaneous-billings/bills/bills.component";
const routes: Routes = [
  {
    path: "out-patient-billing",
    component: BillingComponent,
    //  canActivate: [AuthGuardService],
    children: [
      {
        path: "",
        component: BillingComponentPage,
        children: [
          // { path: "", component: ServicesComponent },
          { path: "", redirectTo: "services", pathMatch: "full" },
          { path: "services", component: ServicesComponent },
          { path: "bill", component: BillComponent },
          { path: "credit-details", component: CreditDetailsComponent },
        ],
      },
      { path: "deposit", component: DepositComponent },
      {
        path: "details",
        component: DetailsComponent,
        children: [
          {
            path: "",
            component: BillDetailTableComponent,
          },
          {
            path: "cred-bill-settlement",
            component: PartialCredBillComponent,
          },
          { path: "services", component: BillDetailTableComponent },
          {
            path: "refund-after-bill",
            component: RefundAfterBillComponent,
          },
        ],
      },
      { path: "online-op-bill", component: OnlineOpBillsComponent },
      { path: "op-order-request", component: OpOrderRequestComponent },
      {
        path: "miscellaneous-billing",
        component: MiscellaneousBillingComponent,
        children: [
          { path: "", component: BillDetailComponent },
          { path: "credit-details", component: MiscCredDetail },
          { path: "bill", component: BillDetailComponent },
        ],
      },
      {
        path: "miscellaneous-billings",
        component: MiscellaneousBillingsComponent,
        children: [
          { path: "", component: BillsComponent },
          { path: "misc-credit-details", component: CreditDetailComponent },
          { path: "misc-bills", component: BillsComponent },
        ],
      },
      { path: "initiate-deposit", component: InitiateDepositComponent },
      { path: "op-refund-approval", component: OprefundApprovalComponent },
      { path: "dispatch-report", component: DispatchReportComponent },
      { path: "dmg-mapping", component: DmgMappingComponent },
      {
        path: "expired-patient-check",
        component: ExpiredPatientCheckComponent,
      },
      {
        path: "post-discharge-follow-up-billing",
        component: PostDischargeFollowUpBillingComponent,
        children: [
          { path: "", component: PostDischargeServicesComponent },
          { path: "bill", component: PostDischargeBillComponent },
          { path: "services", component: PostDischargeServicesComponent },
          {
            path: "credit-details",
            component: PostDischargeCreditDetailsComponent,
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BillingRoutingModule {}
