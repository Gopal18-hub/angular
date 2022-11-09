import { NgModule } from "@angular/core";
import { AcdRoutingModule } from "./routes";

import { AcdComponent } from "./acd.component";
import { MatTabsModule } from "@angular/material/tabs";
//import { MatLabel } from '@angular/material/form-field';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { FormsModule } from "@angular/forms";
import { ReactiveFormsModule } from "@angular/forms";
import { MaxHealthTableModule } from "../../../shared/ui/table";
import { MatSelectModule } from "@angular/material/select";
import { BrowserModule } from "@angular/platform-browser";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
// import { DynamicFormQuestionComponent } from '../../../shared/ui/dynamic-forms/dynamic-form-question.component';
import { DynamicFormsModule } from "../../../shared/ui/dynamic-forms";
import { MatDialogModule } from "@angular/material/dialog";
import { InvestigationOrdersComponent } from "./submodules/investigation-orders/investigation-orders.component";
import { MedicineOrdersComponent } from "./submodules/medicine-orders/medicine-orders.component";
import { ScheduleDateDialogComponent } from "./submodules/schedule-date-dialog/schedule-date-dialog.component";
import { SaveUpdateDialogComponent } from "./submodules/save-update-dialog/save-update-dialog.component";

@NgModule({
  declarations: [
    AcdComponent,
    InvestigationOrdersComponent,
    MedicineOrdersComponent,
    ScheduleDateDialogComponent,
    SaveUpdateDialogComponent,
  ],
  imports: [
    AcdRoutingModule,
    MatTabsModule,
    //MatLabel,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MaxHealthTableModule,
    MatSelectModule,
    ReactiveFormsModule,
    BrowserModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    DynamicFormsModule,
    MatDialogModule,
    MatProgressSpinnerModule,
  ],
  exports: [],
  providers: [],
  bootstrap: [],
})
export class AcdModule {}
