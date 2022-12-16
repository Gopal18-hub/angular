import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
@Component({
  selector: "out-patients-clear-existing-login-dialog",
  templateUrl: "./clear-existing-login-dialog.component.html",
  styleUrls: ["./clear-existing-login-dialog.component.scss"],
})
export class ClearExistingLoginDialogComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<ClearExistingLoginDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: String }
  ) {}

  ngOnInit(): void {}

  yes() {
    this.dialogRef.close({ data: "Y" });
  }
  no() {
    this.dialogRef.close({ data: "N" });
  }
}
