import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { FormDialogueComponent } from "./form-dialogue.component";
import { MatButtonModule } from "@angular/material/button";
import { DynamicFormsModule } from "@shared/ui/dynamic-forms";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    DynamicFormsModule,
  ],
  exports: [FormDialogueComponent],
  declarations: [FormDialogueComponent],
  entryComponents: [FormDialogueComponent],
  providers: [],
})
export class FormDialogueModule {}
