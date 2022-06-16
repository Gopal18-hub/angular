import { NgModule } from '@angular/core';
import { EmployeeSponsorRoutingModule } from './routes';
import { EmployeeSponsorTaggingComponent } from './employee-sponsor-tagging.component';
import { MatTabsModule } from '@angular/material/tabs';
//import { MatLabel } from '@angular/material/form-field';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MaxHealthTableModule } from '../../../shared/ui/table';


@NgModule({
    declarations: [
     EmployeeSponsorTaggingComponent
  ],
    imports: [
     EmployeeSponsorRoutingModule,
     MatTabsModule,
     //MatLabel,
     MatFormFieldModule,
     MatInputModule,
     FormsModule,
     MaxHealthTableModule
     

    ],
    exports: [],
    providers: [],
    bootstrap: []
  })
  export class EmployeeSponsorTaggingModule { }