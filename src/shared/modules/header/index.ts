import { NgModule } from '@angular/core';
import { HeaderComponent } from './header.component';
import { SubComponent } from './sub/sub.component';
import { CommonModule } from '@angular/common';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';


@NgModule({
  declarations: [
    HeaderComponent,
    SubComponent
  ],
  imports: [
    CommonModule,
    MatMenuModule,
    MatButtonModule
  ],
  exports: [HeaderComponent, SubComponent],
  providers: [],
  bootstrap: []
})
export class HeaderModule { }
