import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatDialogModule } from "@angular/material/dialog";

import {
  MessageSuccessComponent,
  MessageInfoComponent,
  MessageWarningComponent,
  MessageConfirmComponent,
  MessageErrorComponent
} from "./message.component";

@NgModule({
  imports: [CommonModule, MatIconModule, MatButtonModule, MatDialogModule],
  exports: [],
  declarations: [
    MessageSuccessComponent,
    MessageInfoComponent,
    MessageWarningComponent,
    MessageConfirmComponent,
    MessageErrorComponent
  ],
  providers: [],
})
export class MaxHealthMessageDialogModule {}
