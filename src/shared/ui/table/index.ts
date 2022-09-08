import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";

import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MaxTableComponent } from "./max-table.component";

import { MatTableModule } from "@angular/material/table";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { A11yModule } from "@angular/cdk/a11y";
import { MatSortModule } from "@angular/material/sort";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatMenuModule } from "@angular/material/menu";
import { RouterModule } from "@angular/router";
import { MaxTableFormComponent } from "./max-table-form/max-table-form.component";

import { DynamicFormsModule } from "../dynamic-forms";

import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
} from "@angular-material-components/datetime-picker";
import { OverlayModule } from "@angular/cdk/overlay";
import { TextFieldModule } from "@angular/cdk/text-field";

import { ContenteditableValueAccessor } from "../../utilities/directives/contenteditable-value-accessor";
import { ControlDirtyDirective } from "../../utilities/directives/control-dirty";

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    MatTableModule,
    MatCheckboxModule,
    A11yModule,
    MatSortModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatMenuModule,
    RouterModule,
    DynamicFormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    NgxMatDatetimePickerModule,
    OverlayModule,
    TextFieldModule,
    NgxMatNativeDateModule,
  ],
  exports: [MaxTableComponent, MaxTableFormComponent],
  declarations: [
    MaxTableComponent,
    MaxTableFormComponent,
    ContenteditableValueAccessor,
    ControlDirtyDirective,
  ],
  providers: [],
})
export class MaxHealthTableModule {}
