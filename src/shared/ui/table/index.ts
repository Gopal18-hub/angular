import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule }  from '@angular/material/icon';
import { MaxTableComponent } from './max-table.component';

import {MatTableModule} from '@angular/material/table';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {A11yModule} from '@angular/cdk/a11y';
import {MatSortModule} from '@angular/material/sort';
import {MatPaginatorModule} from '@angular/material/paginator';



@NgModule({
  imports: [
    CommonModule,
     MatIconModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    MatTableModule,
    MatCheckboxModule,
    A11yModule,
    MatSortModule,
    MatPaginatorModule
  ],
  exports:[ MaxTableComponent ],
  declarations: [   
    MaxTableComponent
  ],
  providers: [  ]
})
export class MaxHealthTableModule { }
