import { NgModule } from "@angular/core";
import { ConfigureComponent } from "./configure.component";
import { ConfigureRoutingModule } from "./routes";

import { ConfigureRisComponent } from "./submodules/configure-ris/configure-ris.component";
import { ConfigureLimsComponent } from "./submodules/configure-lims/configure-lims.component";
import { MatTabsModule } from "@angular/material/tabs";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { FormsModule } from "@angular/forms";
import { ReactiveFormsModule } from "@angular/forms";
import { DynamicFormsModule } from "../../../shared/ui/dynamic-forms";
import { MatButtonModule } from "@angular/material/button";
import { MaxHealthTableModule } from "../../../shared/ui/table";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { CommonModule } from "@angular/common";
@NgModule({
  declarations: [
    ConfigureComponent,
    ConfigureRisComponent,
    ConfigureLimsComponent,
  ],
  imports: [
    ConfigureRoutingModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    DynamicFormsModule,
    MatButtonModule,
    MaxHealthTableModule,
    MatProgressSpinnerModule,
    CommonModule,
  ],
  exports: [],
  providers: [],
  bootstrap: [],
})
export class ConfigureModule {}
