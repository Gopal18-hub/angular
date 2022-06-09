import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './routes';
import { LoginComponent } from './login.component';

import { DynamicFormsModule } from '../../../shared/ui/dynamic-forms';

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LoginRoutingModule,
    DynamicFormsModule
  ],
  exports: [],
  providers: [],
  bootstrap: []
})
export class LoginModule { }
