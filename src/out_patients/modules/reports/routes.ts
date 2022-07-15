import { Component, NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ReportsComponent } from "./reports.component";
import { AcknowledgementScrollAmountReportComponent } from "./submoduls/acknowledgement-scroll-amount-report/acknowledgement-scroll-amount-report.component";
import { CashScrollComponent } from "./submoduls/cash-scroll/cash-scroll.component";
import { DoctorScheduleComponent } from "./submoduls/doctor-schedule/doctor-schedule.component";
import { EquipmentScheduleComponent } from "./submoduls/equipment-schedule/equipment-schedule.component";
import { ExpiredDepositsComponent } from "./submoduls/expired-deposits/expired-deposits.component";
import { ExpiredPatientCheckComponent } from "./submoduls/expired-patient-check/expired-patient-check.component";
import { GeneralOpdScrollReportComponent } from "./submoduls/general-opd-scroll-report/general-opd-scroll-report.component";
import { HappyFamilyReportComponent } from "./submoduls/happy-family-report/happy-family-report.component";
import { MonthlyOpConsultationReportComponent } from "./submoduls/monthly-op-consultation-report/monthly-op-consultation-report.component";
import { OnlineDepositReportComponent } from "./submoduls/online-deposit-report/online-deposit-report.component";

const routes: Routes = [
  {
    path: "reports",
    component: ReportsComponent,
    children: [
      {
        path: "acknowledgement-scroll-amount-report",
        component: AcknowledgementScrollAmountReportComponent,
      },
      { path: "cash-scroll", component: CashScrollComponent },
      { path: "doctor-schedule", component: DoctorScheduleComponent },
      { path: "equipment-schedule", component: EquipmentScheduleComponent },
      {
        path: "expired-deposits",
        component: ExpiredDepositsComponent,
      },
      {
        path: "expired-patient-check",
        component: ExpiredPatientCheckComponent,
      },
      {
        path: "general-opd-scroll-report",
        component: GeneralOpdScrollReportComponent,
      },
      { path: "happy-family-report", component: HappyFamilyReportComponent },
      {
        path: "monthly-op-consultation-report",
        component: MonthlyOpConsultationReportComponent,
      },
      {
        path: "online-deposit-report",
        component: OnlineDepositReportComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BillingRoutingModule {}
