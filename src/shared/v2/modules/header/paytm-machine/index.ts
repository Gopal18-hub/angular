import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormGroup } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { DynamicFormsModule } from "@shared/ui/dynamic-forms";
import { PaytmMachineComponent } from "./paytm-machine.component";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    DynamicFormsModule,
    FormGroup,
  ],
  exports: [PaytmMachineComponent],
  declarations: [PaytmMachineComponent],
  entryComponents: [PaytmMachineComponent],
  providers: [],
})
export class SelectimeiModule {}
