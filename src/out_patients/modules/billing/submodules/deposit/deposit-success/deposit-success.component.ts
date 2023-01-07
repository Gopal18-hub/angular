import { Component, Inject, OnInit } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { Router } from "@angular/router";

@Component({
  selector: 'out-patients-deposit-success',
  templateUrl: './deposit-success.component.html',
  styleUrls: ['./deposit-success.component.scss']
})
export class DepositSuccessComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      message: String;     
    },
    private dialogRef: MatDialogRef<DepositSuccessComponent>,
    public matDialog: MatDialog,
  ) {}

  ngOnInit(): void {
  }

  depositok(){
    this.dialogRef.close();
  }
}
