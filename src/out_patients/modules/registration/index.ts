import { NgModule } from '@angular/core';

import { RegistrationRoutingModule } from './routes';
import { OpRegistrationComponent } from './submodules/op-registration/op-registration.component';
import { FindPatientComponent } from './submodules/find-patient/find-patient.component';
import { DupRegMergingComponent } from './submodules/dup-reg-merging/dup-reg-merging.component';
import { RegistrationUnmergingComponent } from './submodules/registration-unmerging/registration-unmerging.component';
import { RegistrationComponent } from './registration.component';

import { MaxHealthTableModule } from '../../../shared/ui/table';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import {MatTabsModule} from '@angular/material/tabs';

@NgModule({
  declarations: [
       OpRegistrationComponent,
       FindPatientComponent,
       DupRegMergingComponent,
       RegistrationUnmergingComponent,
       RegistrationComponent
  ],
  imports: [
    RegistrationRoutingModule,
    MaxHealthTableModule,
    CommonModule,
    MatButtonModule,
    MatTabsModule
  ],
  exports: [],
  providers: [],
  bootstrap: []
})
export class RegistrationModule { }
