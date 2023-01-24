import { NgModule } from "@angular/core";
import { DynamicFormsModule } from "@shared/v2/ui/dynamic-forms";
import { MaxHealthTableModule } from "@shared/ui/table";
import { FormDialogueModule } from "@shared/ui/form-dialogue";
import { EmptyPlaceholderModule } from "@shared/ui/empty-placeholder";
import { AuthService } from "@shared/services/auth.service";
import { HttpService } from "@shared/services/http.service";
import { MessageDialogService } from "@shared/ui/message-dialog/message-dialog.service";
import { SearchService } from "@shared/services/search.service";
import { CookieService } from "@shared/services/cookie.service";
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
import { ComponentsComponent } from "./components.component";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatListModule } from "@angular/material/list";
import { ComponentdescriptionComponent } from "../component-description/component-description.component";

@NgModule({
  declarations: [ComponentsComponent, ComponentdescriptionComponent],
  imports: [
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
    MatSidenavModule,
    MatListModule,
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
  entryComponents: [],
  bootstrap: [],
})
export class ComponentsModule {}
