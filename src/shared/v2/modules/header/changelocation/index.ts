import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormGroup } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { ChangelocationComponent } from "./changelocation.component";
import { MatButtonModule } from "@angular/material/button";
import { DynamicFormsModule } from "@shared/ui/dynamic-forms";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    DynamicFormsModule,
    FormGroup,
  ],
  exports: [ChangelocationComponent],
  declarations: [ChangelocationComponent],
  entryComponents: [ChangelocationComponent],
  providers: [],
})
export class ChangelocationModule {}
