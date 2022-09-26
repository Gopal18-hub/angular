import { NgModule } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { ReferralComponent } from "./referral.component";
import { InternalDoctorComponent } from "./internal-doctor/internal-doctor.component";
import { ExternalDoctorComponent } from "./external-doctor/external-doctor.component";
import { MatMenuModule } from "@angular/material/menu";
import { DynamicFormsModule } from "@shared/ui/dynamic-forms";
import { MatButtonModule } from "@angular/material/button";

@NgModule({
  declarations: [
    ReferralComponent,
    InternalDoctorComponent,
    ExternalDoctorComponent,
  ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatIconModule,
    MatMenuModule,
    DynamicFormsModule,
    MatButtonModule,
  ],
  exports: [ReferralComponent],
  providers: [],
  bootstrap: [],
})
export class ReferralModule {}
