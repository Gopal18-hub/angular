import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { PaymentMethodsComponent } from './payment-methods.component';

@NgModule({
  imports: [
    RouterModule,
  ],
  exports: [PaymentMethodsComponent],
  declarations: [PaymentMethodsComponent],
  providers: [],
})
export class MaxHealthPaymentMethodsModule {}
