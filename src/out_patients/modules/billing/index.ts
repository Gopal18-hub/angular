import { NgModule } from "@angular/core";
import { BillingComponent } from "./billing.component";
import {
  BillingComponent as BillingComponentPage,
  SimilarPatientDialog,
} from "./submodules/billing/billing.component";
import { DepositComponent } from "./submodules/deposit/deposit.component";
import { DetailsComponent } from "./submodules/details/details.component";
import { OnlineOpBillsComponent } from "./submodules/online-op-bills/online-op-bills.component";
import { OpOrderRequestComponent } from "./submodules/op-order-request/op-order-request.component";
import { MiscellaneousBillingComponent } from "./submodules/miscellaneous-billing/miscellaneous-billing.component";
import { InitiateDepositComponent } from "./submodules/initiate-deposit/initiate-deposit.component";
import { BillingRoutingModule } from "./routes";
import { PaymentModeComponent } from "./submodules/billing/payment-mode/payment-mode.component";
import { MatGridListModule } from "@angular/material/grid-list";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatDividerModule } from "@angular/material/divider";
import { RefundDialogComponent } from "./submodules/deposit/refund-dialog/refund-dialog.component";
import { MatDialogModule } from "@angular/material/dialog";
import { MatRadioModule } from "@angular/material/radio";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatSelectModule } from "@angular/material/select";
import { PortalModule } from "@angular/cdk/portal";
import { DynamicFormsModule } from "../../../shared/ui/dynamic-forms";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { MatTabsModule } from "@angular/material/tabs";
import { MatButtonModule } from "@angular/material/button";
import { MatListModule } from "@angular/material/list";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { VisitHistoryDialogComponent } from "./submodules/details/visit-history-dialog/visit-history-dialog.component";
import { MatIconModule } from "@angular/material/icon";
import { MaxHealthTableModule } from "../../../shared/ui/table";
import { DispatchReportComponent } from "./submodules/dispatch-report/dispatch-report.component";
import { DmgMappingComponent } from "./submodules/dmg-mapping/dmg-mapping.component";
import { SelectAtleastOneComponent } from "./submodules/dispatch-report/select-atleast-one/select-atleast-one.component";
import { MoreThanMonthComponent } from "./submodules/dispatch-report/more-than-month/more-than-month.component";
import { ExpiredPatientCheckComponent } from "./submodules/expired-patient-check/expired-patient-check.component";
import { SaveexpiredpatientDialogComponent } from "./submodules/expired-patient-check/saveexpiredpatient-dialog/saveexpiredpatient-dialog.component";
import { DeleteexpiredpatientDialogComponent } from "./submodules/expired-patient-check/deleteexpiredpatient-dialog/deleteexpiredpatient-dialog.component";
import { DepositDialogComponent } from "./submodules/deposit/deposit-dialog/deposit-dialog.component";

import { Form60Component } from "./submodules/deposit/refund-dialog/form60/form60.component";
import { sharedbillingModule } from "../../../out_patients/core/UI/billing";
import { MakedepositDialogComponent } from "./submodules/deposit/makedeposit-dialog/makedeposit-dialog.component";
import { MakeBillDialogComponent } from "./submodules/miscellaneous-billing/makebill-dialog/makebill-dialog.component";
import { PatientIdentityInfoComponent } from "@core/UI/billing/submodules/patient-identity-info/patient-identity-info.component";
import { DepositSuccessComponent } from "./submodules/deposit/deposit-success/deposit-success.component";
import { OprefundApprovalComponent } from "./submodules/oprefund-approval/oprefund-approval.component";
import { DmgDialogComponent } from "./submodules/dmg-mapping/dmg-dialog/dmg-dialog.component";

import { MatTooltipModule } from "@angular/material/tooltip";
import { ServicesComponent } from "./submodules/billing/submodules/services/services.component";

import { OrderServicesComponent } from "./submodules/op-order-request/submodules/services/services.component";
import { CreditDetailsComponent } from "./submodules/billing/submodules/credit-details/credit-details.component";
import { BillComponent } from "./submodules/billing/submodules/bill/bill.component";
import { OPOrderViewRequest } from "./submodules/op-order-request/submodules/view-request/view-request.component";
import { ConsultationsComponent } from "./submodules/billing/submodules/services/submodules/consultations/consultations.component";
import { InvestigationsComponent } from "./submodules/billing/submodules/services/submodules/investigations/investigations.component";
import { OderInvestigationsComponent } from "./submodules/op-order-request/submodules/services/submodules/investigations/investigations.component";
import { HealthCheckupsComponent } from "./submodules/billing/submodules/services/submodules/health-checkups/health-checkups.component";
import { ProcedureOtherComponent } from "./submodules/billing/submodules/services/submodules/procedure-other/procedure-other.component";
import { OrderProcedureOtherComponent } from "./submodules/op-order-request/submodules/services/submodules/procedure-other/procedure-other.component";
import { OrderSetComponent } from "./submodules/billing/submodules/services/submodules/order-set/order-set.component";
import { ConsumablesComponent } from "./submodules/billing/submodules/services/submodules/consumables/consumables.component";
import { BillDetailComponent } from "../billing/submodules/miscellaneous-billing/billing/bill-detail/bill-detail.component";
import { MiscCredDetail } from "../billing/submodules/miscellaneous-billing/billing/bill-detail/bill-detail.component";
import { GstComponent } from "../billing/submodules/miscellaneous-billing/billing/gst/gst.component";
import { BillDetailTableComponent } from "./submodules/details/bill-detail-table/out-patients-bill-detail-table.component";
import { PartialCredBillComponent } from "./submodules/details/cred-bill-settlement/part-cred-bill-settlement.component";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { EmptyPlaceholderModule } from "../../../shared/ui/empty-placeholder";
import { PostDischargeFollowUpBillingComponent } from "../billing/submodules/post-discharge-follow-up-billing/post-discharge-follow-up-billing.component";
import { PostDischargeBillComponent } from "./submodules/post-discharge-follow-up-billing/submodules/bill/post-discharge-bill.component";
import { PostDischargeServicesComponent } from "./submodules/post-discharge-follow-up-billing/submodules/services/post-discharge-services.component";
import { PostDischargeCreditDetailsComponent } from "./submodules/post-discharge-follow-up-billing/submodules/credit-details/post-discharge-credit-details.component";
import { PostDischargeConsultationsComponent } from "./submodules/post-discharge-follow-up-billing/submodules/services/submodules/post-discharge-consultations/post-discharge-consultations.component";
import { PaydueComponent } from "./submodules/billing/prompts/paydue/paydue.component";
import { InvestigationWarningComponent } from "./submodules/billing/prompts/investigation-warning/investigation-warning.component";
import { UnbilledInvestigationComponent } from "./submodules/billing/prompts/unbilled-investigation/unbilled-investigation.component";
import { HealthCheckupWarningComponent } from "./submodules/billing/prompts/health-checkup-warning/health-checkup-warning.component";
import { ConsumableDetailsComponent } from "./submodules/billing/prompts/consumable-details/consumable-details.component";
import { ReferalDoctorWarningComponent } from "./submodules/billing/prompts/referal-doctor-warning/referal-doctor-warning.component";
import { PackageDoctorModificationComponent } from "./submodules/billing/prompts/package-doctor-modification/package-doctor-modification.component";
import { OrderSetDetailsComponent } from "./submodules/billing/prompts/order-set-details/order-set-details.component";
import { ConsultationWarningComponent } from "./submodules/billing/prompts/consultation-warning/consultation-warning.component";
import { SearchDialogComponent } from "./submodules/details/search-dialog/search-dialog.component";
import { OprefundDialogComponent } from "./submodules/oprefund-approval/oprefund-dialog/oprefund-dialog.component";
import { MaxHealthSnackBarModule } from "@shared/ui/snack-bar";
import { RefundAfterBillComponent } from "./submodules/details/refund-after-bill/refund-after-bill.component";
import { AppointmentSearchComponent } from "./submodules/billing/prompts/appointment-search/appointment-search.component";
import { PaymentDialogComponent } from "./submodules/details/payment-dialog/payment-dialog.component";
import { MiscellaneousBillingsComponent } from "./submodules/miscellaneous-billings/miscellaneous-billings.component";
import { BillsComponent } from "./submodules/miscellaneous-billings/bills/bills.component";
import { CreditDetailComponent } from "./submodules/miscellaneous-billings/credit-details/credit-details.component";
import { IomPopupComponent } from "./submodules/billing/prompts/iom-popup/iom-popup.component";
import { BillDetailsRefundDialogComponent } from "./submodules/details/refund-dialog/refund-dialog.component";
import { ShowPlanDetilsComponent } from "./submodules/billing/prompts/show-plan-detils/show-plan-detils.component";
import { PrintRefundReceiptDialogComponent } from "./submodules/details/printrefundreceiptdialog/print-refund-receipt-dialog.component";
import { ResendBillEmailDialogComponent } from "./submodules/details/resend-bill-email-dialog/resend-bill-email-dialog.component";
import { DmgPopupComponent } from "./submodules/billing/prompts/dmg-popup/dmg-popup.component";
import { ConfigurationBillingComponent } from "./submodules/billing/prompts/configuration-billing/configuration-billing.component";
import { OnlineAppointmentComponent } from "./submodules/billing/prompts/online-appointment/online-appointment.component";
import { GstTaxDialogComponent } from "./submodules/miscellaneous-billing/prompts/gst-tax-dialog/gst-tax-dialog.component";
import { DiscountAmtDialogComponent } from "./submodules/miscellaneous-billing/prompts/discount-amt-dialog/discount-amt-dialog.component";
import { AcknowledgedScrollAmountReportComponent } from "./submodules/acknowledged-scroll-amount-report/acknowledged-scroll-amount-report.component";
import { IomCompanyBillingComponent } from "./submodules/billing/prompts/iom-company-billing/iom-company-billing.component";
import { ExpiredDepositsComponent } from "./submodules/expired-deposits/expired-deposits.component";
import { MonthlyOpConsultationReportComponent } from "./submodules/monthly-op-consultation-report/monthly-op-consultation-report.component";
import { OnlineDepositReportComponent } from "./submodules/online-deposit-report/online-deposit-report.component";

import { BillForm60Component } from "./submodules/billing/prompts/payment-dialog/form60/form60.component";
import { BillPaymentDialogComponent } from "./submodules/billing/prompts/payment-dialog/payment-dialog.component";
import { BillingPaymentMethodsComponent } from "./submodules/billing/prompts/payment-dialog/payment-methods/payment-methods.component";
import { CashScrollComponent } from "./../billing/submodules/cash-scroll/cash-scroll.component";
import { CashScrollNewComponent } from "./../billing/submodules/cash-scroll/submodules/cash-scroll-new/cash-scroll-new.component";
import { CashScrollModifyComponent } from "./submodules/cash-scroll/submodules/cash-scroll-modify/cash-scroll-modify.component";
import { OpPrescriptionDialogComponent } from "./submodules/details/op-prescription-dialog/op-prescription-dialog.component";
import { ExpdepositRefundDialogComponent } from "./submodules/expired-deposits/expdeposit-refund-dialog/expdeposit-refund-dialog.component";
import { ExpdepositCheckddDialogComponent } from "./submodules/expired-deposits/expdeposit-checkdd-dialog/expdeposit-checkdd-dialog.component";
import { DisountReasonComponent } from "./submodules/billing/prompts/discount-reason/disount-reason.component";
import { DepositDetailsComponent } from "./submodules/billing/prompts/deposit-details/deposit-details.component";
import { GstTaxComponent } from "./submodules/billing/prompts/gst-tax-popup/gst-tax.component";
import { StaffDeptDialogComponent } from "./submodules/miscellaneous-billing/billing/staff-dept-dialog/staff-dept-dialog.component";
import { PrintduereceiptComponent } from "./submodules/details/printduereceipt/printduereceipt.component";

import { ReferralModule } from "@core/ui/referral";
import { PopuptextComponent } from "./submodules/billing/prompts/popuptext/popuptext.component";
import { Form60YesOrNoComponent } from "./submodules/deposit/form60-dialog/form60-yes-or-no.component";
import { BillingStaffDeptDialogComponent } from "./submodules/billing/prompts/discount-reason/staff-dept-dialog/staff-dept-dialog.component";

import { DragDropModule } from "@angular/cdk/drag-drop";
import { ReasonForDueBillComponent } from "./submodules/billing/prompts/reason-for-due-bill/reason-for-due-bill.component";
import { SendMailDialogComponent } from "./submodules/billing/prompts/send-mail-dialog/send-mail-dialog.component";
import { MiscCreditDetailsComponent } from "./submodules/miscellaneous-billing/billing/credit-details/misc-credit-details.component";
import { MiscDiscountReasonComponent } from "./submodules/miscellaneous-billing/prompts/misc-discount reason/misc-discount-reason.component";
import { TwiceConsultationReasonComponent } from "./submodules/billing/prompts/twice-consultation-reason/twice-consultation-reason.component";
import { EcareOpSummaryReportComponent } from "./submodules/ecare-op-summary-report/ecare-op-summary-report.component";
import { DmgOthergrpDocPopupComponent } from "./submodules/billing/prompts/dmg-othergrp-doc-popup/dmg-othergrp-doc-popup.component";
import { ReasonForGxtTaxComponent } from "./submodules/billing/prompts/reason-for-gxt-tax/reason-for-gxt-tax.component";
import { OnlinePaymentPaidPatientComponent } from "./submodules/billing/prompts/online-payment-paid-patient/online-payment-paid-patient.component";
import { SrfReasonComponent } from "./submodules/billing/prompts/srf-reason/srf-reason.component";
@NgModule({
  declarations: [
    BillingStaffDeptDialogComponent,
    BillingPaymentMethodsComponent,
    BillForm60Component,
    BillPaymentDialogComponent,
    BillingComponent,
    BillDetailTableComponent,
    BillingComponentPage,
    DepositComponent,
    DetailsComponent,
    GstComponent,
    OnlineOpBillsComponent,
    OpOrderRequestComponent,
    MiscellaneousBillingComponent,
    InitiateDepositComponent,
    PaymentModeComponent,
    RefundDialogComponent,
    VisitHistoryDialogComponent,
    DispatchReportComponent,
    DmgMappingComponent,
    SelectAtleastOneComponent,
    MoreThanMonthComponent,
    ExpiredPatientCheckComponent,
    SaveexpiredpatientDialogComponent,
    DeleteexpiredpatientDialogComponent,
    DepositDialogComponent,
    Form60Component,
    MakedepositDialogComponent,
    PatientIdentityInfoComponent,
    DepositSuccessComponent,
    OprefundApprovalComponent,
    DmgDialogComponent,
    ServicesComponent,
    OrderServicesComponent,
    CreditDetailsComponent,
    BillComponent,
    OPOrderViewRequest,
    ConsultationsComponent,
    InvestigationsComponent,
    OderInvestigationsComponent,
    HealthCheckupsComponent,
    ProcedureOtherComponent,
    OrderProcedureOtherComponent,
    OrderSetComponent,
    ConsumablesComponent,
    BillDetailComponent,
    PartialCredBillComponent,
    PostDischargeFollowUpBillingComponent,
    PostDischargeBillComponent,
    PostDischargeServicesComponent,
    PostDischargeCreditDetailsComponent,
    PostDischargeConsultationsComponent,
    MiscCredDetail,
    PaydueComponent,
    InvestigationWarningComponent,
    UnbilledInvestigationComponent,
    HealthCheckupWarningComponent,
    ConsumableDetailsComponent,
    ReferalDoctorWarningComponent,
    PackageDoctorModificationComponent,
    OrderSetDetailsComponent,
    MakeBillDialogComponent,
    ConsultationWarningComponent,
    SearchDialogComponent,
    OprefundDialogComponent,
    SimilarPatientDialog,
    RefundAfterBillComponent,
    AppointmentSearchComponent,
    PaymentDialogComponent,
    MiscellaneousBillingsComponent,
    BillsComponent,
    CreditDetailComponent,
    IomPopupComponent,
    BillDetailsRefundDialogComponent,
    ShowPlanDetilsComponent,
    PrintRefundReceiptDialogComponent,
    ResendBillEmailDialogComponent,
    DmgPopupComponent,
    ConfigurationBillingComponent,
    OnlineAppointmentComponent,
    GstTaxDialogComponent,
    DiscountAmtDialogComponent,
    AcknowledgedScrollAmountReportComponent,
    IomCompanyBillingComponent,
    ExpiredDepositsComponent,
    MonthlyOpConsultationReportComponent,
    CashScrollNewComponent,
    CashScrollComponent,
    CashScrollModifyComponent,
    OpPrescriptionDialogComponent,
    OnlineDepositReportComponent,
    ExpdepositRefundDialogComponent,
    ExpdepositCheckddDialogComponent,
    DisountReasonComponent,
    DepositDetailsComponent,
    GstTaxComponent,
    StaffDeptDialogComponent,
    PrintduereceiptComponent,
    PopuptextComponent,
    Form60YesOrNoComponent,
    ReasonForDueBillComponent,
    SendMailDialogComponent,
    MiscCreditDetailsComponent,
    MiscDiscountReasonComponent,
    TwiceConsultationReasonComponent,
    EcareOpSummaryReportComponent,
    DmgOthergrpDocPopupComponent,
    ReasonForGxtTaxComponent,
    OnlinePaymentPaidPatientComponent,
    SrfReasonComponent,
  ],
  imports: [
    BillingRoutingModule,
    MatGridListModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    MatButtonModule,
    MatDialogModule,
    DynamicFormsModule,
    MatTabsModule,
    MatRadioModule,
    MatCheckboxModule,
    MatSelectModule,
    CommonModule,
    MatListModule,
    MatIconModule,
    MaxHealthTableModule,
    MatTooltipModule,
    sharedbillingModule,
    PortalModule,
    MatProgressSpinnerModule,
    EmptyPlaceholderModule,
    MaxHealthSnackBarModule,
    ReferralModule,
    DragDropModule,
    MatAutocompleteModule,
  ],
  exports: [],
  providers: [],
  bootstrap: [],
})
export class BillingModule {}
