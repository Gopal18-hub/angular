import { NgModule } from '@angular/core';
import { HeaderComponent } from './header.component';
import { SubComponent } from './sub/sub.component';


@NgModule({
  declarations: [
    HeaderComponent,
    SubComponent
  ],
  imports: [
  ],
  exports: [HeaderComponent, SubComponent],
  providers: [],
  bootstrap: []
})
export class HeaderModule { }
