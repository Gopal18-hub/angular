import { Component, OnInit } from '@angular/core';
import { RefundDialogComponent } from './refund-dialog/refund-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { DepositDialogComponent } from './deposit-dialog/deposit-dialog.component';

@Component({
  selector: 'out-patients-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.scss']
})
export class DepositComponent implements OnInit {

  constructor(public matDialog: MatDialog) { }

  ngOnInit(): void {
  }
  openrefunddialog()
  {
    this.matDialog.open(RefundDialogComponent, { width: "60%", height: "90%"});
  }
  openDepositdialog(){
    this.matDialog.open(DepositDialogComponent,{width:'70vw',height:'95vh'});
  }

}
