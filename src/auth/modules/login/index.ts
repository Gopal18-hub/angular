import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './routes';
import { LoginComponent } from './login.component';

import { DynamicFormsModule } from '../../../shared/ui/dynamic-forms';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LoginRoutingModule,
    DynamicFormsModule,
    MatButtonModule,
    MatIconModule
  ],
  exports: [],
  providers: [],
  bootstrap: []
})
export class LoginModule { }
