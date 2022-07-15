import { NgModule } from "@angular/core";
import { ReportsComponent } from './reports.component';
import { AcknowledgementScrollAmountReportComponent } from './submoduls/acknowledgement-scroll-amount-report/acknowledgement-scroll-amount-report.component';
import { CashScrollComponent } from './submoduls/cash-scroll/cash-scroll.component';
import { DoctorScheduleComponent } from './submoduls/doctor-schedule/doctor-schedule.component';
import { EquipmentScheduleComponent } from './submoduls/equipment-schedule/equipment-schedule.component';
import { ExpiredDepositsComponent } from './submoduls/expired-deposits/expired-deposits.component';
import { ExpiredPatientCheckComponent } from './submoduls/expired-patient-check/expired-patient-check.component';
import { GeneralOpdScrollReportComponent } from './submoduls/general-opd-scroll-report/general-opd-scroll-report.component';
import { HappyFamilyReportComponent } from './submoduls/happy-family-report/happy-family-report.component';
import { MonthlyOpConsultationReportComponent } from './submoduls/monthly-op-consultation-report/monthly-op-consultation-report.component';
import { OnlineDepositReportComponent } from './submoduls/online-deposit-report/online-deposit-report.component';

@NgModule({
  declarations: [
    ReportsComponent,
    AcknowledgementScrollAmountReportComponent,
    CashScrollComponent,
    DoctorScheduleComponent,
    EquipmentScheduleComponent,
    ExpiredDepositsComponent,
    ExpiredPatientCheckComponent,
    GeneralOpdScrollReportComponent,
    HappyFamilyReportComponent,
    MonthlyOpConsultationReportComponent,
    OnlineDepositReportComponent
  ],
  imports: [],
})
export class ReportModule {}
