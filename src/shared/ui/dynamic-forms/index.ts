import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { DynamicFormComponent } from './dynamic-form.component';
import { DynamicFormQuestionComponent } from './dynamic-form-question.component';

import { QuestionControlService } from './service/question-control.service';

import { MatInputModule } from '@angular/material/input';
import { MatRadioModule }  from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule }  from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import {MatSliderModule} from '@angular/material/slider';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatProgressBarModule} from '@angular/material/progress-bar';

import { OptionGroupComponent } from './partials/option-group/option-group.component';

import { NgSelectModule } from '@ng-select/ng-select';

import { FileUploadComponent } from '../file-upload/file-upload.component';

@NgModule({
  imports: [
    CommonModule,
     MatIconModule,
    MatInputModule,
    MatRadioModule,
    MatButtonModule,
    MatSelectModule,
    ReactiveFormsModule,
    NgSelectModule,
    FormsModule,
    MatSliderModule,
    MatTooltipModule,
    MatProgressBarModule
  ],
  exports:[ DynamicFormComponent, FileUploadComponent ],
  declarations: [ DynamicFormComponent, DynamicFormQuestionComponent, OptionGroupComponent, FileUploadComponent ],
  providers: [ QuestionControlService ]
})
export class DynamicFormsModule { }
