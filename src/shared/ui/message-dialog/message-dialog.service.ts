import { Injectable, NgZone } from "@angular/core";
import {
  MessageSuccessComponent,
  MessageInfoComponent,
  MessageWarningComponent,
} from "./message.component";
import { MatDialog } from "@angular/material/dialog";

@Injectable({
  providedIn: "root",
})
export class MessageDialogService {
  dialogRef: any;
  constructor(public dialog: MatDialog) {}

  success(message: string) {
    const dialogRef = this.dialog.open(MessageSuccessComponent, {
      width: "25vw",
      maxWidth: "25vw",
      panelClass: "message-success",
      data: { message: message },
    });
    return dialogRef;
  }

  error(message: string) {
    const dialogRef = this.dialog.open(MessageInfoComponent, {
      width: "40vw",
      maxWidth: "40vw",
      panelClass: "message-success",
      data: { message: message },
    });
    return dialogRef;
  }

  info(message: string) {
    const dialogRef = this.dialog.open(MessageWarningComponent, {
      width: "40vw",
      maxWidth: "40vw",
      panelClass: "message-success",
      data: { message: message },
    });
    return dialogRef;
  }

  confirm(icon: string, message: string) {
    const dialogRef = this.dialog.open(MessageSuccessComponent, {
      width: "40vw",
      maxWidth: "40vw",
      panelClass: "message-success",
      data: { message: message },
    });
    return dialogRef;
  }
}
