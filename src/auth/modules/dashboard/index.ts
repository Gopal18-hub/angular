import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule, DatePipe } from "@angular/common";
import { DashboardRoutingModule, DashboardAllRoutingModule } from "./routes";
import { DashboardComponent } from "./dashboard.component";
import { MaxHealthTableModule } from "@shared/ui/table";
import { HeaderModule } from "@shared/modules/header";
import { MatIconModule } from "@angular/material/icon";
import { EmptyPlaceholderModule } from "@shared/ui/empty-placeholder";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { FormDialogueModule } from "@shared/ui/form-dialogue";
import { VisitHistoryModule } from "@shared/modules/visit-history";
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
    VisitHistoryModule,
  ],
  exports: [],
  providers: [DatePipe],
  bootstrap: [],
})
export class DashboardModule {}

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DashboardAllRoutingModule,
    MaxHealthTableModule,
    HeaderModule,
    MatIconModule,
    EmptyPlaceholderModule,
    MatProgressSpinnerModule,
    FormDialogueModule,
    VisitHistoryModule,
  ],
  providers: [DatePipe],
})
export class DashboardAllModule {}
