import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule, DatePipe } from "@angular/common";
import { DashboardRoutingModule } from "./routes";
import { DashboardComponent } from "./dashboard.component";
import { MaxHealthTableModule } from "../../../shared/ui/table";
import { HeaderModule } from "../../../shared/modules/header";
import { MatIconModule } from "@angular/material/icon";
import { EmptyPlaceholderModule } from "../../../shared/ui/empty-placeholder";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { FormDialogueModule } from "@shared/ui/form-dialogue";
@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DashboardRoutingModule,
    MaxHealthTableModule,
    HeaderModule,
    MatIconModule,
    EmptyPlaceholderModule,
    MatProgressSpinnerModule,
    FormDialogueModule,
  ],
  exports: [],
  providers: [DatePipe],
  bootstrap: [],
})
export class DashboardModule {}
