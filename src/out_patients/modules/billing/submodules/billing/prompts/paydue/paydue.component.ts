import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { registerLocaleData } from "@angular/common";
import enIN from "@angular/common/locales/en-IN";
import { Router } from "@angular/router";

registerLocaleData(enIN);

@Component({
  selector: "out-patients-paydue",
  templateUrl: "./paydue.component.html",
  styleUrls: ["./paydue.component.scss"],
})
export class PaydueComponent implements OnInit {
  skipReason = "";

  skipReasonsList: any = [
    {
      title: "Patient will be paying in next visit",
      value: "Patient will be paying in next visit",
    },
  ];

  constructor(
    public dialogRef: MatDialogRef<PaydueComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router
  ) {}

  ngOnInit(): void {}

  paynow() {
    this.dialogRef.close({ paynow: true });
  }

  saveReason() {
    this.dialogRef.close({ skipReason: this.skipReason });
  }
}
