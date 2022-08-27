import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { MatIconModule } from "@angular/material/icon";
import { MatDialogModule } from "@angular/material/dialog";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { DynamicFormsModule } from "../../../../shared/ui/dynamic-forms";
import { SharedBillingComponent } from "./shared-billing.component";
import { MaxHealthTableModule } from "@shared/ui/table";
import { PaymentMethodsComponent } from "./submodules/payment-methods/payment-methods.component";
import { FormSixtyComponent } from "./submodules/form60/form-sixty.component";
import { MatButtonModule } from "@angular/material/button";
import { ServiceDepositComponent } from "./submodules/service-deposit/service-deposit.component";
import { MatTabsModule } from "@angular/material/tabs";
import { VisitHistoryModule } from "@shared/modules/visit-history";
@NgModule({
  imports: [
    RouterModule,
    MatIconModule,
    MatDialogModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    DynamicFormsModule,
    MatButtonModule,
    MatTabsModule,
    MaxHealthTableModule,
    VisitHistoryModule,
  ],
  exports: [
    FormSixtyComponent,
    PaymentMethodsComponent,
    ServiceDepositComponent,
  ],
  declarations: [
    SharedBillingComponent,
    FormSixtyComponent,
    PaymentMethodsComponent,
    ServiceDepositComponent,
  ],
  providers: [],
})
export class sharedbillingModule {}
