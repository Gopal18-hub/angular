import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './routes';
import { DashboardComponent } from './dashboard.component';
import { MaxHealthTableModule } from '../../../shared/ui/table';
//import{HeaderModule} from '../../../shared/modules/header'


@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DashboardRoutingModule,
    MaxHealthTableModule,
   // HeaderModule
  ],
  exports: [],
  providers: [],
  bootstrap: []
})
export class DashboardModule { }
