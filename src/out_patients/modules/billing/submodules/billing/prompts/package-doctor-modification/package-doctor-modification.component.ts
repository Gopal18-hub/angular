import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "out-patients-package-doctor-modification",
  templateUrl: "./package-doctor-modification.component.html",
  styleUrls: ["./package-doctor-modification.component.scss"],
})
export class PackageDoctorModificationComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<PackageDoctorModificationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {}
}
