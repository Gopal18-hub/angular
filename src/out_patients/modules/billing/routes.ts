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
import { OrderServicesComponent } from "./submodules/op-order-request/submodules/services/services.component";
import { OPOrderViewRequest } from "./submodules/op-order-request/submodules/view-request/view-request.component";
import { AcknowledgedScrollAmountReportComponent } from "./submodules/acknowledged-scroll-amount-report/acknowledged-scroll-amount-report.component";
import { ExpiredDepositsComponent } from "./submodules/expired-deposits/expired-deposits.component";
import { MonthlyOpConsultationReportComponent } from "./submodules/monthly-op-consultation-report/monthly-op-consultation-report.component";
import { OnlineDepositReportComponent } from "./submodules/online-deposit-report/online-deposit-report.component";
import { CashScrollComponent } from "./submodules/cash-scroll/cash-scroll.component";
import { CashScrollNewComponent } from "./submodules/cash-scroll/submodules/cash-scroll-new/cash-scroll-new.component";
import { CashScrollModifyComponent } from "./submodules/cash-scroll/submodules/cash-scroll-modify/cash-scroll-modify.component";
import { MiscCreditDetailsComponent } from "./submodules/miscellaneous-billing/billing/credit-details/misc-credit-details.component";
import { EcareOpSummaryReportComponent } from "./submodules/ecare-op-summary-report/ecare-op-summary-report.component";
const routes: Routes = [
  {
    path: "out-patient-billing",
    component: BillingComponent,
    canActivate: [AuthGuardService],
    data: { masterModule: 2, moduleId: 7, featureId: 62 },
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
      {
        path: "deposit",
        component: DepositComponent,
        canActivate: [AuthGuardService],
        data: { masterModule: 2, moduleId: 7, featureId: 64 },
      },
      {
        path: "details",
        component: DetailsComponent,
        canActivate: [AuthGuardService],
        data: { masterModule: 2, moduleId: 7, featureId: 63 },
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
      {
        path: "op-order-request",
        component: OpOrderRequestComponent,
        children: [
          { path: "", component: OrderServicesComponent },
          { path: "services", component: OrderServicesComponent },
          { path: "view-request", component: OPOrderViewRequest },
          { path: "credit-details", component: CreditDetailsComponent },
        ],
      },
      { path: "op-order-request", component: OpOrderRequestComponent },
      {
        path: "miscellaneous-billing",
        component: MiscellaneousBillingComponent,
        children: [
          { path: "", component: BillDetailComponent },
          { path: "credit-details", component: MiscCreditDetailsComponent },
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
      {
        path: "dispatch-report",
        component: DispatchReportComponent,
        canActivate: [AuthGuardService],
        data: { masterModule: 2, moduleId: 7, featureId: 67 },
      },
      { path: "dmg-mapping", component: DmgMappingComponent },
      {
        path: "acknowledged-scroll-amount-report",
        component: AcknowledgedScrollAmountReportComponent,
      },
      {
        path: "expired-patient-check",
        component: ExpiredPatientCheckComponent,
      },
      {
        path: "expired-deposits",
        component: ExpiredDepositsComponent,
        canActivate: [AuthGuardService],
        data: { masterModule: 2, moduleId: 7, featureId: 579 },
      },
      {
        path: "monthly-op-consultation-report",
        component: MonthlyOpConsultationReportComponent,
      },
      {
        path: "ecare-op-summary-report",
        component: EcareOpSummaryReportComponent,
        canActivate: [AuthGuardService],
        data: { masterModule: 2, moduleId: 7, featureId: 67 },
      },
      {
        path: "online-deposit-report",
        component: OnlineDepositReportComponent,
      },
      {
        path: "post-discharge-follow-up-billing",
        component: PostDischargeFollowUpBillingComponent,
        canActivate: [AuthGuardService],
        data: { masterModule: 2, moduleId: 7, featureId: 62 },
        children: [
          { path: "", redirectTo: "services", pathMatch: "full" },
          { path: "", component: PostDischargeServicesComponent },
          { path: "bill", component: PostDischargeBillComponent },
          { path: "services", component: PostDischargeServicesComponent },
          {
            path: "credit-details",
            component: PostDischargeCreditDetailsComponent,
          },
        ],
      },
      {
        path: "cash-scroll",
        component: CashScrollComponent,
        canActivate: [AuthGuardService],
        data: { masterModule: 2, moduleId: 7, featureId: 66 },
        // children: [
        //   //  { path: "cash-scroll-modify", component: CashScrollModifyComponent },
        //   { path: "cash-scroll-new", component: CashScrollNewComponent },
        //   { path: "cash-scroll-modify", component: CashScrollModifyComponent },
        // ],
      },
      {
        path: "cash-scroll/cash-scroll-new",
        component: CashScrollNewComponent,
      },
      {
        path: "cash-scroll/cash-scroll-modify",
        component: CashScrollModifyComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BillingRoutingModule {}
