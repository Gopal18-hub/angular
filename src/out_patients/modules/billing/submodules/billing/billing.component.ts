import { Component, OnInit } from '@angular/core';
import { MatDialog} from '@angular/material/dialog';
import { PaymentModeComponent } from './payment-mode/payment-mode.component';

@Component({
  selector: 'out-patients-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss']
})
export class BillingComponent implements OnInit {

  constructor(public matDialog: MatDialog) { }

  ngOnInit(): void {
  }
  openBillPaymentDialog()
  {
    this.matDialog.open(PaymentModeComponent,{ width: "70vw", 
    height: "98vh", 
    data:{
      Mobile: 9898989898, 
      Mail: "mail@gmail.com"
    }});
  }
}
