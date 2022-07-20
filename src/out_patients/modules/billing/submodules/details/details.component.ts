import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { VisitHistoryComponent } from '@core/UI/billing/submodules/visit-history/visit-history.component';
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
    this.matDialog.open(VisitHistoryComponent, { width: "70%", height: "50%"});
  }
}
