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


@NgModule({
  declarations: [
       BillingComponent,
       BillingComponentPage,
       DepositComponent,
       DetailsComponent,
       OnlineOpBillsComponent,
       OpOrderRequestComponent,
       MiscellaneousBillingComponent,
       InitiateDepositComponent
  ],
  imports: [
    BillingRoutingModule
  ],
  exports: [],
  providers: [],
  bootstrap: []
})
export class BillingModule { }
