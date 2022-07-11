import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AcdComponent } from './acd.component';


const routes: Routes = [
    { 
   path:'acd',component:AcdComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AcdRoutingModule { }