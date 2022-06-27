import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeSponsorTaggingComponent } from './employee-sponsor-tagging.component';
const routes: Routes = [
    { 
   path:'employee-sponsor-tagging',component:EmployeeSponsorTaggingComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeSponsorRoutingModule { }