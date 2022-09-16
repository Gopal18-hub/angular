import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'out-patients-deposit-details',
  templateUrl: './deposit-details.component.html',
  styleUrls: ['./deposit-details.component.scss']
})
export class DepositDetailsComponent implements OnInit {

  config: any = {
    actionItems: false,
    //dateformat: 'dd/MM/yyyy',
    selectBox: true,
    displayedColumns: ['datetime', 'deposithead', 'receiptno', 'deposittakenby', 'amtavailable'],
    clickedRows: true,
    clickSelection: "single",
    columnsInfo: {
      datetime: {
        title: 'Date and Time',
        type: 'string',
      },
      deposithead: {
        title: 'Deposit Head',
        type: 'string',
      },
      receiptno: {
        title: 'Receipt No.',
        type: 'string',
      },
      deposittakenby: {
        title: 'Deposit Taken By',
        type: 'string',
      },
      amtavailable: {
        title: 'Amount Available',
        type: 'string',
        style: {
          width: "10rem"
        }
      },
    }
  }
  constructor() { }

  ngOnInit(): void {
  }

}
