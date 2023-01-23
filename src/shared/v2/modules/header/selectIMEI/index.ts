import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormGroup } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { DynamicFormsModule } from "@shared/v2/ui/dynamic-forms";
import { SelectimeiComponent } from "./selectimei.component";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    DynamicFormsModule,
    FormGroup,
  ],
  exports: [SelectimeiComponent],
  declarations: [SelectimeiComponent],
  entryComponents: [SelectimeiComponent],
  providers: [],
})
export class SelectimeiModule {}
