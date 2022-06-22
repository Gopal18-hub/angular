import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PatientHistoryComponent } from './patient-history.component';

const routes: Routes = [

    {

   path:'patient-history',component:PatientHistoryComponent

    }

];



@NgModule({

  imports: [RouterModule.forChild(routes)],

  exports: [RouterModule]

})

export class PatientHistoryRoutingModule { }