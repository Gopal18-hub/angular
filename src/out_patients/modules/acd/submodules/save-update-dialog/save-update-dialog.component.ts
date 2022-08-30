import { Component, OnInit, Inject } from "@angular/core";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
@Component({
  selector: 'out-patients-save-update-dialog',
  templateUrl: './save-update-dialog.component.html',
  styleUrls: ['./save-update-dialog.component.scss']
})
export class SaveUpdateDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<SaveUpdateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: String }) { }

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
