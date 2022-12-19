import { NgModule } from "@angular/core";
import { StaffDeptRoutingModule } from "./routes";
import { CommonModule } from "@angular/common";
import { StaffDeptComponent } from "./staff-dept.component";
import { MatTabsModule } from "@angular/material/tabs";
//import { MatLabel } from '@angular/material/form-field';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { FormsModule } from "@angular/forms";
import { ReactiveFormsModule } from "@angular/forms";
import { MaxHealthTableModule } from "../../../shared/ui/table";
import { MatSelectModule } from "@angular/material/select";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
// import { DynamicFormQuestionComponent } from '../../../shared/ui/dynamic-forms/dynamic-form-question.component';
import { DynamicFormsModule } from "../../../shared/ui/dynamic-forms";
import { MatDialogModule } from "@angular/material/dialog";

@NgModule({
  declarations: [StaffDeptComponent],
  imports: [
    CommonModule,
    StaffDeptRoutingModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MaxHealthTableModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    DynamicFormsModule,
    MatDialogModule,
  ],
  exports: [],
  providers: [],
  bootstrap: [],
})
export class StaffDeptModule {}
