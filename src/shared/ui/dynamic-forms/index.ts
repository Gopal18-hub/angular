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
  ],
  exports: [DynamicFormQuestionComponent, MaskedInputDirective],
  declarations: [
    DynamicFormQuestionComponent,
    OptionGroupComponent,
    MaskedInputDirective,
  ],
  providers: [
    { provide: DateAdapter, useClass: MaxDateAdapter },
    QuestionControlService,
    {
      provide: MAT_SELECT_CONFIG,
      useValue: { overlayPanelClass: "max-select-overlay-panel" },
    },
  ],
})
export class DynamicFormsModule {}
