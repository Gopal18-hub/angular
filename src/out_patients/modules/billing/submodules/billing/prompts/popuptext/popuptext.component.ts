import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "out-patients-popuptext",
  templateUrl: "./popuptext.component.html",
  styleUrls: ["./popuptext.component.scss"],
})
export class PopuptextComponent implements OnInit {
  popuptext: any = [];

  constructor(
    public dialogRef: MatDialogRef<PopuptextComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.popuptext = this.data.popuptext;
  }
}
