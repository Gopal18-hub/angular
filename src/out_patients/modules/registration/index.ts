import { NgModule } from "@angular/core";
import { DynamicFormsModule } from "@shared/ui/dynamic-forms";
import { RegistrationRoutingModule } from "./routes";
import { SimilarPatientDialog } from "./submodules/op-registration/op-registration.component";
import { OpRegistrationComponent } from "./submodules/op-registration/op-registration.component";
import { FindPatientComponent } from "./submodules/find-patient/find-patient.component";
import { DupRegMergingComponent } from "./submodules/dup-reg-merging/dup-reg-merging.component";
import { RegistrationUnmergingComponent } from "./submodules/registration-unmerging/registration-unmerging.component";
import { RegistrationComponent } from "./registration.component";
import { MaxHealthTableModule } from "@shared/ui/table";
import { OpRegApprovalComponent } from "./submodules/op-reg-approval/op-reg-approval.component";
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
import { MergeDialogComponent } from "./submodules/dup-reg-merging/merge-dialog/merge-dialog.component";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { AppointmentSearchComponent } from "./submodules/appointment-search/appointment-search.component";
import { AppointmentSearchDialogComponent } from "./submodules/appointment-search/appointment-search-dialog/appointment-search-dialog.component";
import { MatCardModule } from "@angular/material/card";
import { PrintLabelDialogComponent } from "./submodules/op-registration/print-label-dialog/print-label-dialog.component";
import { VipDialogComponent } from "./submodules/op-registration/vip-dialog/vip-dialog.component";
import { HotListingDialogComponent } from "./submodules/op-registration/hot-listing-dialog/hot-listing-dialog.component";
import { MatSelectModule } from "@angular/material/select";
import { NotesDialogComponent } from "./submodules/op-registration/notes-dialog/notes-dialog.component";
import { HwcDialogComponent } from "./submodules/op-registration/hwc-dialog/hwc-dialog.component";
import { SeafarersDialogComponent } from "./submodules/op-registration/seafarers-dialog/seafarers-dialog.component";
import { ForeignerDialogComponent } from "./submodules/op-registration/foreigner-dialog/foreigner-dialog.component";
import { HotListingApprovalComponent } from "./submodules/hot-listing-approval/hot-listing-approval.component";
import { FormDialogueModule } from "@shared/ui/form-dialogue";
import { EmptyPlaceholderModule } from "@shared/ui/empty-placeholder";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatRadioModule } from "@angular/material/radio";

import { AuthService } from "@shared/services/auth.service";
import { HttpService } from "@shared/services/http.service";
import { MessageDialogService } from "@shared/ui/message-dialog/message-dialog.service";
import { SearchService } from "@shared/services/search.service";
import { CookieService } from "@shared/services/cookie.service";
import { DMSComponent } from "../registration/submodules/dms/dms.component";
import { ModifyDialogComponent } from "@core/modify-dialog/modify-dialog.component";

import { RegistrationDialogueComponent } from "@modules/registration/submodules/op-registration/Registration-dialog/registration-dialogue/registration-dialogue.component";
import { PendingChangesGuard } from "@shared/services/guards/pending-change-guard.service";
import { MatTooltipModule } from "@angular/material/tooltip";
import { AuthGuardService } from "../../../shared/services/guards/auth-guard.service";
import { VisitHistoryModule } from "@shared/modules/visit-history";
import { PatientImageUploadDialogComponent } from './submodules/patient-image-upload-dialog/patient-image-upload-dialog.component';

@NgModule({
  declarations: [
    OpRegistrationComponent,
    FindPatientComponent,
    DupRegMergingComponent,
    RegistrationUnmergingComponent,
    RegistrationComponent,
    OpRegApprovalComponent,
    MergeDialogComponent,
    AppointmentSearchComponent,
    AppointmentSearchDialogComponent,
    PrintLabelDialogComponent,
    VipDialogComponent,
    HotListingDialogComponent,
    NotesDialogComponent,
    HwcDialogComponent,
    SeafarersDialogComponent,
    ForeignerDialogComponent,
    HotListingApprovalComponent,
    DMSComponent,
    ModifyDialogComponent,
    SimilarPatientDialog,
    RegistrationDialogueComponent,
    PatientImageUploadDialogComponent,
  ],
  imports: [
    RegistrationRoutingModule,
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
    VisitHistoryModule,
  ],
  exports: [],
  providers: [
    AuthService,
    HttpService,
    MessageDialogService,
    SearchService,
    CookieService,
    PendingChangesGuard,
    AuthGuardService,
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: { ...new MatDialogConfig(), autoFocus: false },
    },
  ],
  entryComponents: [AppointmentSearchComponent],
  bootstrap: [],
})
export class RegistrationModule {}
