import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { Component, Inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  MatSnackBarRef,
  MAT_SNACK_BAR_DATA,
  MatSnackBarModule,
} from "@angular/material/snack-bar";

export interface IBtnParams {
  name: string;
  class: string;
}

@Component({
  selector: "app-custom-snack-bar",
  // imports: [CommonModule, MatButtonModule, MatSnackBarModule, MatIconModule],
  templateUrl: "./custom-snack-bar.component.html",
  styleUrls: ["./custom-snack-bar.component.scss"],
})
export class CustomSnackBarComponent implements OnInit {
  buttonList!: IBtnParams[];

  constructor(
    public snackBarComp: MatSnackBarRef<CustomSnackBarComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.buttonList = [this.data.actionOne, this.data.actionTwo];
  }

  onClose(buttonAction: string) {
    return this.data.onActionCB && this.data.onActionCB(buttonAction);
  }
}
