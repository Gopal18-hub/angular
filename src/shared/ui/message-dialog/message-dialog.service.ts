import { Injectable, NgZone } from "@angular/core";
import {
  MessageSuccessComponent,
  MessageInfoComponent,
  MessageWarningComponent,
  MessageConfirmComponent,
  MessageErrorComponent,
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
      width: "30vw",
      minWidth: "20vw",
      maxWidth: "30vw",
      panelClass: "message-success",
      data: { message: message },
      autoFocus: false,
    });
    return dialogRef;
  }

  error(message: string) {
    const dialogRef = this.dialog.open(MessageErrorComponent, {
      //width: "40vw",
      minWidth: "25vw",
      maxWidth: "40vw",
      minHeight: "25vh",
      panelClass: "message-error",
      data: { message: message },
      autoFocus: false,
    });
    return dialogRef;
  }

  info(message: string) {
    const dialogRef = this.dialog.open(MessageInfoComponent, {
      //width: "40vw",
      minWidth: "25vw",
      maxWidth: "40vw",
      minHeight: "25vh",
      panelClass: "message-info",
      data: { message: message },
      autoFocus: false,
    });
    return dialogRef;
  }

  confirm(icon: string, message: string) {
    const dialogRef = this.dialog.open(MessageConfirmComponent, {
      //width: "40vw",
      minWidth: "25vw",
      maxWidth: "40vw",
      minHeight: "30vh",
      panelClass: "message-confirm",
      data: { message: message },
      autoFocus: false,
    });
    return dialogRef;
  }

  warning(message: string) {
    const dialogRef = this.dialog.open(MessageWarningComponent, {
      width: "30vw",
      minWidth: "20vw",
      maxWidth: "30vw",
      panelClass: "message-warning",
      data: { message: message },
      autoFocus: false,
    });
    return dialogRef;
  }
}
