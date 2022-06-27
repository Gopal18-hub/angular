import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'out-patients-companydialog',
  templateUrl: './companydialog.component.html',
  styleUrls: ['./companydialog.component.scss']
})
export class CompanydialogComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  insideclick(){
    console.log('inside popupclose icon click');
  }
}
