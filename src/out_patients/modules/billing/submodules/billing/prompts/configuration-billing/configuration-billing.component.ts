import { Component, OnInit,ViewChild } from '@angular/core';
import { FormGroup } from "@angular/forms";

@Component({
  selector: 'out-patients-configuration-billing',
  templateUrl: './configuration-billing.component.html',
  styleUrls: ['./configuration-billing.component.scss']
})
export class ConfigurationBillingComponent implements OnInit {

  constructor() { }
  questions: any;
  Configurationbilling!: FormGroup;

  
  @ViewChild("configbillingtable") configbillingtable: any;

 
  configurationbillingconfig: any = {
    clickedRows: true,
    clickSelection: "single",
    selectBox: true,
    displayedColumns: [
      "deducted",
      "itemname",
      "servicename"
    ],
    columnsInfo: {
      deducted: {
        title: "Deducted",
        type: "string",
        // style: {
        //   width: "7rem",
        // },
      },
      itemname: {
        title: "Item Name",
        type: "number",
        // style: {
        //   width: "6rem",
        // },
      },
      servicename: {
        title: "Service Name",
        type: "date",
        // style: {
        //   width: "8rem",
        // },
      },     
    },
  };

  patientname: string | undefined;
  maxid: string | undefined;
  companyname: string | undefined;
  tpa: string | undefined;
  creditlimit: string | undefined;
  
  ngOnInit(): void {
  }

}
