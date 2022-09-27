import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MiscService } from '@modules/billing/submodules/miscellaneous-billing/MiscService.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'out-patients-deposit-details',
  templateUrl: './deposit-details.component.html',
  styleUrls: ['./deposit-details.component.scss']
})
export class DepositDetailsComponent implements OnInit {
  @ViewChild("depoTable") depoTable: any;
  private readonly _destroying$ = new Subject<void>();
  totalDeposit = 0;
  tableSelectedRows: any = [];
  depoDetails: any = [];
  calcBillData: any = [];
  config: any = {
    actionItems: false,
    dateformat: 'dd/MM/yyyy hh:mm:ss a',
    selectBox: true,
    displayedColumns: ['datetime', 'advanceType', 'receiptno', 'takenBy', 'balAmount'],
    clickedRows: true,
    //clickSelection: "single",
    columnsInfo: {
      datetime: {
        title: 'Date and Time',
        type: 'date',
      },
      advanceType: {
        title: 'Deposit Head',
        type: 'string',
      },
      receiptno: {
        title: 'Receipt No.',
        type: 'string',
      },
      takenBy: {
        title: 'Deposit Taken By',
        type: 'string',
      },
      balAmount: {
        title: 'Amount Available',
        type: 'string',
        style: {
          width: "10rem"
        }
      },
    }
  }
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<DepositDetailsComponent>, private miscPatient: MiscService,) { }

  ngOnInit(): void {
    setTimeout(() => {
      console.log(this.data, "depo")
      this.depoDetails = this.data.data;

      this.depoDetails
      this.depoDetails.forEach((e: any) => {
        e.balAmount = Number(e.balanceamount).toFixed(2);
        e.balanceamount = e.balanceamount;
      })
      this.depoDetails = [...this.depoDetails];

    })
  }
  ngAfterViewInit(): void {
    this.depoTable.selection.clear();
    this.depoTable.selection.changed
      .pipe(takeUntil(this._destroying$))
      .subscribe((res: any) => {
        if (this.depoTable.selection.selected.length > 0) {

          this.tableSelectedRows = this.depoTable.selection.selected;
        }
        this.tableSelectedRows.forEach((element: any) => {
          this.totalDeposit += element.balanceamount;
        });



      })
  }
  listRowClick() {

  }

  submit() {
    console.log(this.tableSelectedRows, "deposittab;es")
    this.calcBillData.depositSelectedrows = this.tableSelectedRows;
    this.miscPatient.setCalculateBillItems(this.calcBillData);
    this.dialogRef.close({ data: this.totalDeposit });
  }
}
