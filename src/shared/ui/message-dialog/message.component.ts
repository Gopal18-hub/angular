import { Component, OnInit } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "maxhealth-message",
})
export class MessageComponent implements OnInit {
  constructor(public dialog: MatDialog) {}
  ngOnInit(): void {}

  success() {}

  error() {}

  confirm() {}
}
