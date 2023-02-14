import { CustomSnackBarComponent } from "./custom-snack-bar/custom-snack-bar.component";
import { Injectable } from "@angular/core";
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from "@angular/material/snack-bar";

@Injectable({
  providedIn: "root",
})
export class SnackBarService {
  defaultSBOptions: MatSnackBarConfig = {
    // duration: 5000,
    horizontalPosition: "center", //"right",
    verticalPosition: "bottom", //"top",
  };

  constructor(private _matSnackBar: MatSnackBar) {}

  showSnackBar(
    message: string,
    status: "success" | "error" | "info" | "warn",
    actionBtnOne: string,
    actionBtnTwo: string = "",
    callBack?: Function,
    className?: string,
    showCloseIcon: boolean = true
  ) {
    return this._matSnackBar.openFromComponent(CustomSnackBarComponent, {
      data: {
        message: message,
        actionOne: { name: actionBtnOne, class: "btn-primary" },
        actionTwo: { name: actionBtnTwo, class: "" },
        onActionCB: callBack,
        isSingleLine: true,
        showCloseIcon,
      },
      panelClass: className ? [className, status] : [status],
      ...this.defaultSBOptions,
    });
  }

  showConfirmSnackBar(
    message: string,
    status: "success" | "error" | "info" | "warn",
    actionBtnOne: string,
    actionBtnTwo: string = "",
    callBack?: Function,
    className?: string,
    showCloseIcon: boolean = true
  ) {
    return this._matSnackBar.openFromComponent(CustomSnackBarComponent, {
      data: {
        message: message,
        actionOne: { name: actionBtnOne, class: "btn-primary" },
        actionTwo: { name: actionBtnTwo, class: "" },
        onActionCB: callBack,
        isSingleLine: false,
        showCloseIcon,
      },
      panelClass: className ? [className, status] : [status],
      ...this.defaultSBOptions,
    });
  }

  closeSnackBar() {
    this._matSnackBar.dismiss();
  }
}
