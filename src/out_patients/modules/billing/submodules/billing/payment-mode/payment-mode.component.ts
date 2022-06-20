import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
@Component({
  selector: 'out-patients-payment-mode',
  templateUrl: './payment-mode.component.html',
  styleUrls: ['./payment-mode.component.scss']
})
export class PaymentModeComponent implements OnInit {
  cashModeForm = new FormGroup({
    amount: new FormControl('')
  });

  constructor() { }

  ngOnInit(): void {
  }
  checkalert()
  {
    alert("test")
  }

}
