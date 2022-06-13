import { NgModule } from '@angular/core';
import {DynamicFormsModule} from '../../../shared/ui/dynamic-forms'
import { RegistrationRoutingModule } from './routes';
import { OpRegistrationComponent } from './submodules/op-registration/op-registration.component';
import { FindPatientComponent } from './submodules/find-patient/find-patient.component';
import { DupRegMergingComponent } from './submodules/dup-reg-merging/dup-reg-merging.component';
import { RegistrationUnmergingComponent } from './submodules/registration-unmerging/registration-unmerging.component';
import { RegistrationComponent } from './registration.component';
import { MaxHealthTableModule } from '../../../shared/ui/table';
import { OpRegApprovalComponent } from './submodules/op-reg-approval/op-reg-approval.component';
import { MatButtonModule } from '@angular/material/button';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import {MatTabsModule} from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MergeDialogComponent } from './submodules/dup-reg-merging/merge-dialog/merge-dialog.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { AppointmentSearchComponent } from './submodules/appointment-search/appointment-search.component';
import { AppointmentSearchDialogComponent } from './submodules/appointment-search/appointment-search-dialog/appointment-search-dialog.component';


@NgModule({
  declarations: [
       OpRegistrationComponent,
       FindPatientComponent,
       DupRegMergingComponent,
       RegistrationUnmergingComponent,
       RegistrationComponent,
       OpRegApprovalComponent,
        MergeDialogComponent,
          AppointmentSearchComponent,
          AppointmentSearchDialogComponent
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
    MatCheckboxModule,   
    DynamicFormsModule,
    ReactiveFormsModule,
    MatIconModule 
  ],
  exports: [],
  providers: [],
  entryComponents:[AppointmentSearchComponent],
  bootstrap: []
})
export class RegistrationModule { }
