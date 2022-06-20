import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { EmptyPlaceholderComponent } from './empty-placeholder.component';

@NgModule({
    imports: [
      CommonModule,      
    ],
    exports: [EmptyPlaceholderComponent],
    declarations: [ EmptyPlaceholderComponent ],
    providers: [],
  })
  export class EmptyPlaceholderModule {}