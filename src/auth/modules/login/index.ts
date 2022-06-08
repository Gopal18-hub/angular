import { NgModule } from '@angular/core';

import { LoginRoutingModule } from './routes';
import { LoginComponent } from './login.component';


@NgModule({
  declarations: [
  
    LoginComponent
  ],
  imports: [
    LoginRoutingModule
  ],
  exports: [],
  providers: [],
  bootstrap: []
})
export class LoginModule { }
