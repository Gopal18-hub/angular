import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from "@angular/material/dialog";
@Component({
  selector: 'out-patients-save-update-dialog',
  templateUrl: './save-update-dialog.component.html',
  styleUrls: ['./save-update-dialog.component.scss']
})
export class SaveUpdateDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<SaveUpdateDialogComponent>) { }

  ngOnInit(): void {
  }

  yes() {
    console.log("ts")
    this.dialogRef.close({ data: "Y" })
  }
  no() {
    this.dialogRef.close({ data: "N" })
  }

}
