import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "out-patients-consultation-warning",
  templateUrl: "./consultation-warning.component.html",
  styleUrls: ["./consultation-warning.component.scss"],
})
export class ConsultationWarningComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ConsultationWarningComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {}
}
