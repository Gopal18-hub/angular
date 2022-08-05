import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "out-patients-referal-doctor-warning",
  templateUrl: "./referal-doctor-warning.component.html",
  styleUrls: ["./referal-doctor-warning.component.scss"],
})
export class ReferalDoctorWarningComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ReferalDoctorWarningComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {}
}
