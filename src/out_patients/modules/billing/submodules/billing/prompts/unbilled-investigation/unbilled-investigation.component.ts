import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "out-patients-unbilled-investigation",
  templateUrl: "./unbilled-investigation.component.html",
  styleUrls: ["./unbilled-investigation.component.scss"],
})
export class UnbilledInvestigationComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<UnbilledInvestigationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {}
}
