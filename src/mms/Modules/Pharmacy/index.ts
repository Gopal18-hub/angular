import { NgModule } from "@angular/core";
import { DynamicFormsModule } from "@shared/v2/ui/dynamic-forms";
import { PharmacyRoutingModule } from "./routes";
import { MaxHealthTableModule } from "@shared/v2/ui/table";
import { FormDialogueModule } from "@shared/v2/ui/form-dialogue";
import { EmptyPlaceholderModule } from "@shared/v2/ui/empty-placeholder";
import { AuthService } from "@shared/v2/services/auth.service";
import { HttpService } from "@shared/v2/services/http.service";
import { MessageDialogService } from "@shared/v2/ui/message-dialog/message-dialog.service";
import { SearchService } from "@shared/v2/services/search.service";
import { CookieService } from "@shared/v2/services/cookie.service";
import { AuthGuardService } from "../../../shared/services/guards/auth-guard.service";

import { MatButtonModule } from "@angular/material/button";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatNativeDateModule, MatRippleModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import {
  MatDialogModule,
  MAT_DIALOG_DEFAULT_OPTIONS,
  MatDialogConfig,
} from "@angular/material/dialog";
import { MatTabsModule } from "@angular/material/tabs";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatCardModule } from "@angular/material/card";
import { MatSelectModule } from "@angular/material/select";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatRadioModule } from "@angular/material/radio";
import { MatTooltipModule } from "@angular/material/tooltip";
import { PharmacyComponent } from "./pharmacy.component";
import { IssueEntryComponent } from "./submodules/issue-entry/issue-entry.component";
import { RightPanelComponent } from "./submodules/issue-entry/right-panel/right-panel.component";
import { LeftPanelComponent } from "./submodules/issue-entry/left-panel/left-panel.component";
import { EwspatientPopupComponent } from "./submodules/issue-entry/prompts/ewspatient-popup/ewspatient-popup.component";
import { CustomSnackBarComponent } from "@shared/v2/ui/snack-bar/custom-snack-bar/custom-snack-bar.component";
import { SimilarPatientDialog } from "./submodules/issue-entry/left-panel/left-panel.component";
@NgModule({
  declarations: [
    PharmacyComponent,
    IssueEntryComponent,
    LeftPanelComponent,
    RightPanelComponent,
    EwspatientPopupComponent,
    CustomSnackBarComponent,
    SimilarPatientDialog,
  ],
  imports: [
    PharmacyRoutingModule,
    MatCardModule,
    MaxHealthTableModule,
    CommonModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    MatDialogModule,
    MatCheckboxModule,
    DynamicFormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatSelectModule,
    EmptyPlaceholderModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatTooltipModule,
    FormDialogueModule,
  ],
  exports: [],
  providers: [
    AuthService,
    HttpService,
    MessageDialogService,
    SearchService,
    CookieService,
    AuthGuardService,
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: { ...new MatDialogConfig(), autoFocus: false },
    },
  ],
  entryComponents: [], //AppointmentSearchComponent
  bootstrap: [],
})
export class PharmacyModule {}
