import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { VisitHistoryDialogComponent } from './visit-history-dialog/visit-history-dialog.component';
@Component({
  selector: 'out-patients-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  constructor(public matDialog: MatDialog) { }

  ngOnInit(): void {
  }
  openhistory()
  {
    this.matDialog.open(VisitHistoryDialogComponent, { width: "70%", height: "50%"});
  }
}
