import { Component, OnInit, ViewChild } from "@angular/core";
import { Subject } from "rxjs";

@Component({
  selector: "out-patients-bill",
  templateUrl: "./bill.component.html",
  styleUrls: ["./bill.component.scss"],
})
export class BillComponent implements OnInit {
  @ViewChild("table") tableRows: any;
  data: any = [];
  config: any = {
    clickedRows: false,
    actionItems: false,
    dateformat: "dd/MM/yyyy",
    selectBox: false,
    displayedColumns: [
      "serviceName",
      "itemName",
      "precaution",
      "procedure",
      "qty",
      "credit",
      "cash",
      "disc",
    ],
    columnsInfo: {
      serviceName: {
        title: "Services Name",
        type: "string",
      },
      itemName: {
        title: "Item Name / Doctor Name",
        type: "string",
      },
      precaution: {
        title: "Precaution",
        type: "string",
      },
      procedure: {
        title: "Procedure Doctor",
        type: "string",
      },
      qty: {
        title: "Qty / Type",
        type: "string",
      },
      credit: {
        title: "Credit",
        type: "string",
      },
      cash: {
        title: "Cash",
        type: "string",
      },
      disc: {
        title: "Disc %",
        type: "string",
      },
    },
  };

  private readonly _destroying$ = new Subject<void>();

  constructor() {}

  ngOnInit(): void {}
}
