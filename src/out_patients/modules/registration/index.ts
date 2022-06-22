import { NgModule } from "@angular/core";
import { DynamicFormsModule } from "../../../shared/ui/dynamic-forms";
import { RegistrationRoutingModule } from "./routes";
import { OpRegistrationComponent } from "./submodules/op-registration/op-registration.component";
import { FindPatientComponent } from "./submodules/find-patient/find-patient.component";
import { DupRegMergingComponent } from "./submodules/dup-reg-merging/dup-reg-merging.component";
import { RegistrationUnmergingComponent } from "./submodules/registration-unmerging/registration-unmerging.component";
import { RegistrationComponent } from "./registration.component";
import { MaxHealthTableModule } from "../../../shared/ui/table";
import { OpRegApprovalComponent } from "./submodules/op-reg-approval/op-reg-approval.component";
import { MatButtonModule } from "@angular/material/button";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatNativeDateModule, MatRippleModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatDialogModule } from "@angular/material/dialog";
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
import { FormDialogueComponent } from "./submodules/op-registration/form-dialogue/form-dialogue.component";
import { EmptyPlaceholderModule } from "../../../shared/ui/empty-placeholder";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"; 

import { AuthService } from "../../../shared/services/auth.service";
import { HttpService } from "../../../shared/services/http.service";
import { MessageDialogService } from "../../../shared/ui/message-dialog/message-dialog.service";
import { SearchService } from "../../../shared/services/search.service";
import { CookieService } from "../../../shared/services/cookie.service";
import { DMSComponent } from '../registration/submodules/dms/dms.component';
import { ModifyDialogComponent } from "../../core/modify-dialog/modify-dialog.component";


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
    FormDialogueComponent,
    DMSComponent,
    ModifyDialogComponent
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
  ],
  exports: [],
  providers: [
    AuthService,
    HttpService,
    MessageDialogService,
    SearchService,
    CookieService,
  ],
  entryComponents: [AppointmentSearchComponent, FormDialogueComponent],
  bootstrap: [],
})
export class RegistrationModule {}
