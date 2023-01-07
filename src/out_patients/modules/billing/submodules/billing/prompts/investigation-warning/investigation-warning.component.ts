import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "out-patients-investigation-warning",
  templateUrl: "./investigation-warning.component.html",
  styleUrls: ["./investigation-warning.component.scss"],
})
export class InvestigationWarningComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<InvestigationWarningComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {}

  yes() {
    this.dialogRef.close({ showlist: true });
  }

  no() {
    this.dialogRef.close({ showlist: false });
  }
}
