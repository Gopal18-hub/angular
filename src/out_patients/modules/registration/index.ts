import { NgModule } from '@angular/core';

import { RegistrationRoutingModule } from './routes';
import { OpRegistrationComponent } from './submodules/op-registration/op-registration.component';
import { FindPatientComponent } from './submodules/find-patient/find-patient.component';
import { DupRegMergingComponent } from './submodules/dup-reg-merging/dup-reg-merging.component';
import { RegistrationUnmergingComponent } from './submodules/registration-unmerging/registration-unmerging.component';
import { RegistrationComponent } from './registration.component'
import { MaxHealthTableModule } from '../../../shared/ui/table';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import {MatTabsModule} from '@angular/material/tabs';
import { MergeDialogComponent } from './submodules/dup-reg-merging/merge-dialog/merge-dialog.component';
import {MatCheckboxModule} from '@angular/material/checkbox';


@NgModule({
  declarations: [
       OpRegistrationComponent,
       FindPatientComponent,
       DupRegMergingComponent,
       RegistrationUnmergingComponent,
       RegistrationComponent,
       MergeDialogComponent
  ],
  imports: [
    RegistrationRoutingModule,
    MaxHealthTableModule,
    CommonModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    MatDialogModule,
    MatCheckboxModule
    


  ],
  exports: [],
  providers: [],
  bootstrap: []
})
export class RegistrationModule { }
