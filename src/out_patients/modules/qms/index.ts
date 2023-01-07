import { NgModule } from "@angular/core";
import { QmsRoutingModule } from "./routes";
import { QmsComponent } from "./qms.component";
import { MatTabsModule } from "@angular/material/tabs";
import { MatFormFieldModule } from "@angular/material/form-field";
import { DynamicFormsModule } from "../../../shared/ui/dynamic-forms";
import { MatButtonModule } from "@angular/material/button";
import { MaxHealthTableModule } from "../../../shared/ui/table";
@NgModule({
    declarations: [
        QmsComponent
    ],
    imports: [
        QmsRoutingModule,
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
  export class QmsModule {}