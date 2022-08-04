import { Component, OnInit, Inject } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { registerLocaleData } from "@angular/common";
import enIN from "@angular/common/locales/en-IN";

registerLocaleData(enIN);

@Component({
  selector: "out-patients-paydue",
  templateUrl: "./paydue.component.html",
  styleUrls: ["./paydue.component.scss"],
})
export class PaydueComponent implements OnInit {
  skipReason = "";

  skipReasonsList: any = [];

  constructor(
    public dialogRef: MatDialogRef<PaydueComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {}
}
