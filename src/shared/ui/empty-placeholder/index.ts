import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { EmptyPlaceholderComponent } from './empty-placeholder.component';


@NgModule({
    imports: [
      CommonModule, 
      ReactiveFormsModule,
      FormsModule,
      MatIconModule,
    ],
    exports: [EmptyPlaceholderComponent],
    declarations: [ EmptyPlaceholderComponent ],
    providers: [],
  })
  export class EmptyPlaceholderModule {}