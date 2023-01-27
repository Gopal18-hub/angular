import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";

import { DynamicFormQuestionComponent } from "./dynamic-form-question.component";

import { QuestionControlService } from "./service/question-control.service";

import { MatInputModule } from "@angular/material/input";
import { MatRadioModule } from "@angular/material/radio";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSelectModule, MAT_SELECT_CONFIG } from "@angular/material/select";
import { MatSliderModule } from "@angular/material/slider";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatAutocompleteModule } from "@angular/material/autocomplete";

import { OptionGroupComponent } from "./partials/option-group/option-group.component";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule, DateAdapter } from "@angular/material/core";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MaskedInputDirective } from "../../utilities/directives/mask.directive";

import { MaxDateAdapter } from "./service/date-adapter";

import { OverlayModule } from "@angular/cdk/overlay";

import { A11yModule } from "@angular/cdk/a11y";
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from "@angular/material/form-field";

import { SpecialCharacterDirective } from "../../utilities/directives/specialChracter.directive";

import { MaxDateTimeAdapter } from "./service/date-time-adapter";

import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatDateAdapter,
} from "@angular-material-components/datetime-picker";
import { AccessControlDirective } from "@shared/v2/utilities/directives/access-control.directive";
import { MatBottomSheetModule } from "@angular/material/bottom-sheet";
@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatInputModule,
    MatRadioModule,
    MatButtonModule,
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule,
    MatSliderModule,
    MatTooltipModule,
    MatProgressBarModule,
    MatAutocompleteModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatCheckboxModule,
    OverlayModule,
    A11yModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
    MatBottomSheetModule,
  ],
  exports: [
    AccessControlDirective,
    DynamicFormQuestionComponent,
    MaskedInputDirective,
  ],
  declarations: [
    AccessControlDirective,
    DynamicFormQuestionComponent,
    OptionGroupComponent,
    MaskedInputDirective,
    SpecialCharacterDirective,
  ],
  providers: [
    { provide: DateAdapter, useClass: MaxDateAdapter },
    {
      provide: NgxMatDateAdapter,
      useClass: MaxDateTimeAdapter,
    },
    QuestionControlService,
    {
      provide: MAT_SELECT_CONFIG,
      useValue: { overlayPanelClass: "max-select-overlay-panel" },
    },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { floatLabel: "never" },
    },
  ],
})
export class DynamicFormsModule {}
