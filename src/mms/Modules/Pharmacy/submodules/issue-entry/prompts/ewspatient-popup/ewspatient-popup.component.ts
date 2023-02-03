import { Component, Inject, OnInit } from "@angular/core";
import { MatBottomSheet } from "@angular/material/bottom-sheet";

@Component({
  selector: "mms-ewspatient-popup",
  templateUrl: "./ewspatient-popup.component.html",
  styleUrls: ["./ewspatient-popup.component.scss"],
})
export class EwspatientPopupComponent implements OnInit {
  constructor(private _bottomSheet: MatBottomSheet) {}

  ngOnInit(): void {}
  closeEwsPopup() {
    this._bottomSheet.dismiss();
  }
  submit() {}
}
