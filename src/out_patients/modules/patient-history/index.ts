import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PatientHistoryRoutingModule } from "./routes";
import { PatientHistoryComponent } from './patient-history.component';
import { MatTabsModule } from "@angular/material/tabs";
import { MatFormFieldModule } from "@angular/material/form-field";
import { DynamicFormsModule } from "../../../shared/ui/dynamic-forms";
import { MatButtonModule } from "@angular/material/button";
import { MaxHealthTableModule } from "../../../shared/ui/table";
import { EmptyPlaceholderModule } from "@shared/ui/empty-placeholder";
import { MatIconModule } from "@angular/material/icon";
@NgModule({
    declarations: [
    
    PatientHistoryComponent
  ],
    imports: [
        CommonModule,
        PatientHistoryRoutingModule,
        MatTabsModule,
        MatFormFieldModule,
        DynamicFormsModule,
        MatButtonModule,
        MaxHealthTableModule,
        EmptyPlaceholderModule,
        MatIconModule
    ],
    exports: [],
    providers: [

    ],
    bootstrap: [],
  })
  export class PatientHistoryModule {}