import { NgModule } from "@angular/core";
import { EmployeeSponsorRoutingModule } from "./routes";
import { EmployeeSponsorTaggingComponent } from "./employee-sponsor-tagging.component";
import { MatTabsModule } from "@angular/material/tabs";
//import { MatLabel } from '@angular/material/form-field';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { FormsModule } from "@angular/forms";
import { ReactiveFormsModule } from "@angular/forms";
import { MaxHealthTableModule } from "../../../shared/ui/table";
import { MatSelectModule } from "@angular/material/select";
import { CommonModule } from "@angular/common";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { DeletedialogComponent } from "./delete-dialog/delete-dialog.component";
import { DeletesuccessdialogComponent } from "./deletesuccess-dialog/deletesuccess-dialog.component";
import { SavedialogComponent } from "./save-dialog/save-dialog.component";
import { SavesuccessdialogComponent } from "./savesuccess-dialog/savesuccess-dialog.component";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
// import { DynamicFormQuestionComponent } from '../../../shared/ui/dynamic-forms/dynamic-form-question.component';
import { DynamicFormsModule } from "../../../shared/ui/dynamic-forms";
import { CompanydialogComponent } from "./companydialog/companydialog.component";
import { MatDialogModule } from "@angular/material/dialog";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
@NgModule({
  declarations: [
    EmployeeSponsorTaggingComponent,
    DeletedialogComponent,
    DeletesuccessdialogComponent,
    SavedialogComponent,
    SavesuccessdialogComponent,
    CompanydialogComponent,

    //  DynamicFormQuestionComponent
  ],
  imports: [
    CommonModule,
    EmployeeSponsorRoutingModule,
    MatTabsModule,
    //MatLabel,
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
    MatTooltipModule,
    MatProgressSpinnerModule,
  ],
  exports: [],
  providers: [],
  bootstrap: [],
})
export class EmployeeSponsorTaggingModule {}
