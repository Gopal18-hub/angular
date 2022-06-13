import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OpRegistrationComponent } from './submodules/op-registration/op-registration.component';
import { FindPatientComponent } from './submodules/find-patient/find-patient.component';
import { DupRegMergingComponent } from './submodules/dup-reg-merging/dup-reg-merging.component';
import { RegistrationUnmergingComponent } from './submodules/registration-unmerging/registration-unmerging.component';
import { RegistrationComponent } from './registration.component';
import { OpRegApprovalComponent } from './submodules/op-reg-approval/op-reg-approval.component';
import { AppointmentSearchComponent } from './submodules/appointment-search/appointment-search.component';

const routes: Routes = [
    {
      path: 'registration', component: RegistrationComponent,  children: [
          { path: '', component: OpRegistrationComponent },
          { path: 'op-registration', component: OpRegistrationComponent },
          { path: 'find-patient', component: FindPatientComponent },
          { path: 'dup-reg-merging', component: DupRegMergingComponent },
          { path: 'registration-unmerging', component: RegistrationUnmergingComponent },
          { path: 'op-reg-approval', component: OpRegApprovalComponent},
          { path : 'appointment-search', component: AppointmentSearchComponent},
          
      ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegistrationRoutingModule { }
