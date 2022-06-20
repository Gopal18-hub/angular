import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../op-registration.component';

@Component({
  selector: 'out-patients-foreigner-dialog',
  templateUrl: './foreigner-dialog.component.html',
  styleUrls: ['./foreigner-dialog.component.scss']
})
export class ForeignerDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ForeignerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) { }

  ngOnInit(): void {
  }

}
