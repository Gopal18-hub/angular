import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "out-patients-order-set-details",
  templateUrl: "./order-set-details.component.html",
  styleUrls: ["./order-set-details.component.scss"],
})
export class OrderSetDetailsComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<OrderSetDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {}
}
