import { NgModule } from '@angular/core';
import {DynamicFormsModule} from '../../../shared/ui/dynamic-forms'
import { RegistrationRoutingModule } from './routes';
import { OpRegistrationComponent } from './submodules/op-registration/op-registration.component';
import { FindPatientComponent } from './submodules/find-patient/find-patient.component';
import { DupRegMergingComponent } from './submodules/dup-reg-merging/dup-reg-merging.component';
import { RegistrationUnmergingComponent } from './submodules/registration-unmerging/registration-unmerging.component';
import { RegistrationComponent } from './registration.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaxHealthTableModule } from '../../../shared/ui/table';
import { OpRegApprovalComponent } from './submodules/op-reg-approval/op-reg-approval.component';
import { MatButtonModule } from '@angular/material/button';
import {MatTabsModule} from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [
       OpRegistrationComponent,
       FindPatientComponent,
       DupRegMergingComponent,
       RegistrationUnmergingComponent,
       RegistrationComponent,
       OpRegApprovalComponent
  ],
  imports: [
    RegistrationRoutingModule,
    MaxHealthTableModule,
    MatButtonModule,
    MatTabsModule,
    CommonModule,
    DynamicFormsModule,
    ReactiveFormsModule,
    MatIconModule 
  ],
  exports: [],
  providers: [],
  bootstrap: []
})
export class RegistrationModule { }
