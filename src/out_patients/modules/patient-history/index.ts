import { NgModule } from "@angular/core";
import { PatientHistoryRoutingModule } from "./routes";
import { PatientHistoryComponent } from './patient-history.component';
import { MatTabsModule } from "@angular/material/tabs";
import { MatFormFieldModule } from "@angular/material/form-field";
import { DynamicFormsModule } from "../../../shared/ui/dynamic-forms";
import { MatButtonModule } from "@angular/material/button";
import { MaxHealthTableModule } from "../../../shared/ui/table";
@NgModule({
    declarations: [
    
    PatientHistoryComponent
  ],
    imports: [
        PatientHistoryRoutingModule,
        MatTabsModule,
        MatFormFieldModule,
        DynamicFormsModule,
        MatButtonModule,
        MaxHealthTableModule
    ],
    exports: [],
    providers: [

    ],
    bootstrap: [],
  })
  export class PatientHistoryModule {}