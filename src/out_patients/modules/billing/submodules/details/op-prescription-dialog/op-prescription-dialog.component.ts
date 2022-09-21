import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';

@Component({
  selector: 'out-patients-op-prescription-dialog',
  templateUrl: './op-prescription-dialog.component.html',
  styleUrls: ['./op-prescription-dialog.component.scss']
})
export class OpPrescriptionDialogComponent implements OnInit {

  private readonly _destroying$ = new Subject<void>();
  constructor(
    public dialogref: MatDialogRef<OpPrescriptionDialogComponent>
  ) { }

  ngOnInit(): void {
  }
  click(str: any)
  {
    if(str == 'yes')
    {
      this.dialogref.close(str);
    }
    else if(str == 'no')
    {
      this.dialogref.close(str)
    }
  }
  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
