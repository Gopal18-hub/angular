import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { MatIconModule } from "@angular/material/icon";
import { MatDialogModule } from "@angular/material/dialog";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { DynamicFormsModule } from "@shared/ui/dynamic-forms";
import { MaxHealthTableModule } from "@shared/ui/table";
import { MatButtonModule } from "@angular/material/button";
import { MatTabsModule } from "@angular/material/tabs";
import { VisitHistoryComponent } from "./visit-history.component";

@NgModule({
  declarations: [VisitHistoryComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    MatInputModule,
    MatIconModule,
    DynamicFormsModule,
    MaxHealthTableModule,
    MatTabsModule,
    MatDialogModule,
  ],
  exports: [VisitHistoryComponent],
  providers: [],
  bootstrap: [],
})
export class VisitHistoryModule {}
