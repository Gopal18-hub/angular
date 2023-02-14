import { Component, Inject, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "mms-ewspatient-popup",
  templateUrl: "./ewspatient-popup.component.html",
  styleUrls: ["./ewspatient-popup.component.scss"],
})
export class EwspatientPopupComponent implements OnInit {
  constructor(private _matSnackBar: MatSnackBar) {}

  ngOnInit(): void {}
  closeEwsPopup() {
    this._matSnackBar.dismiss();
  }
  submit() {}
}
