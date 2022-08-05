import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "out-patients-consumable-details",
  templateUrl: "./consumable-details.component.html",
  styleUrls: ["./consumable-details.component.scss"],
})
export class ConsumableDetailsComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ConsumableDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {}
}
