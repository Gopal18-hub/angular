import { Component, OnInit, ViewChild } from "@angular/core";

@Component({
  selector: "out-patients-consumables",
  templateUrl: "./consumables.component.html",
  styleUrls: ["./consumables.component.scss"],
})
export class ConsumablesComponent implements OnInit {
  @ViewChild("table") tableRows: any;
  data: any = [];
  config: any = {
    clickedRows: false,
    actionItems: false,
    removeRow: true,
    dateformat: "dd/MM/yyyy",
    selectBox: false,
    displayedColumns: [
      "sno",
      "surgeryName",
      "priority",
      "credit",
      "cash",
      "doctorName",
      "taxAmount",
      "totalAmount",
    ],
    columnsInfo: {
      sno: {
        title: "S.No.",
        type: "number",
      },
      surgeryName: {
        title: "Surgery Name",
        type: "string",
      },
      priority: {
        title: "Priority",
        type: "string",
      },
      credit: {
        title: "Credit",
        type: "number",
      },
      cash: {
        title: "Cash",
        type: "number",
      },
      doctorName: {
        title: "Doctor Name",
        type: "string",
      },
      taxAmount: {
        title: "Tax Amount",
        type: "number",
      },
      totalAmount: {
        title: "Total Amount",
        type: "number",
      },
    },
  };

  constructor() {}

  ngOnInit(): void {}
}
