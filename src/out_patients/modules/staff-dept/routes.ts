import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StaffDeptComponent } from './staff-dept.component';



const routes: Routes = [
    { 
   path:'staff-dept',component:StaffDeptComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaffDeptRoutingModule { }