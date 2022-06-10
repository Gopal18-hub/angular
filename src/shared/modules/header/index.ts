import { NgModule } from '@angular/core';
import { HeaderComponent } from './header.component';
import { SubComponent } from './sub/sub.component';
import { CommonModule } from '@angular/common';


@NgModule({
  declarations: [
    HeaderComponent,
    SubComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [HeaderComponent, SubComponent],
  providers: [],
  bootstrap: []
})
export class HeaderModule { }
