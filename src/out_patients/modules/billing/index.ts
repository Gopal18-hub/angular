import { NgModule } from '@angular/core';
import { BillingComponent } from './billing.component';
import { BillingComponent  as BillingComponentPage } from './submodules/billing/billing.component';
import { DepositComponent } from './submodules/deposit/deposit.component';
import { DetailsComponent } from './submodules/details/details.component';
import { OnlineOpBillsComponent } from './submodules/online-op-bills/online-op-bills.component';
import { OpOrderRequestComponent } from './submodules/op-order-request/op-order-request.component';
import { MiscellaneousBillingComponent } from './submodules/miscellaneous-billing/miscellaneous-billing.component';
import { InitiateDepositComponent } from './submodules/initiate-deposit/initiate-deposit.component';
import { BillingRoutingModule } from './routes';
import { PaymentModeComponent } from './submodules/billing/payment-mode/payment-mode.component';
import {MatGridListModule} from '@angular/material/grid-list';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatDividerModule} from '@angular/material/divider';

import { RefundDialogComponent } from './submodules/deposit/refund-dialog/refund-dialog.component';
import { MatDialogModule } from "@angular/material/dialog";
import { MatRadioModule } from '@angular/material/radio';

import { DynamicFormsModule } from "../../../shared/ui/dynamic-forms";
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import {MatTabsModule} from '@angular/material/tabs';
import {MatButtonModule} from '@angular/material/button';
import {MatListModule} from '@angular/material/list';
import { VisitHistoryDialogComponent } from './submodules/details/visit-history-dialog/visit-history-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { MaxHealthTableModule } from '../../../shared/ui/table';
import { DispatchReportComponent } from './submodules/dispatch-report/dispatch-report.component';
import { DmgMappingComponent } from './submodules/dmg-mapping/dmg-mapping.component';
import { SelectAtleastOneComponent } from './submodules/dispatch-report/select-atleast-one/select-atleast-one.component';
import { MoreThanMonthComponent } from './submodules/dispatch-report/more-than-month/more-than-month.component';

@NgModule({
  declarations: [
       BillingComponent,
       BillingComponentPage,
       DepositComponent,
       DetailsComponent,
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
       MoreThanMonthComponent
       
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
    BrowserModule,
    CommonModule,
    MatListModule,
    MatIconModule,
    MaxHealthTableModule
  ],
  exports: [],
  providers: [],
  bootstrap: []
})
export class BillingModule { }
