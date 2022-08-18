import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "out-patients-consumable-details",
  templateUrl: "./consumable-details.component.html",
  styleUrls: ["./consumable-details.component.scss"],
})
export class ConsumableDetailsComponent implements OnInit {
  @ViewChild("table") tableRows: any;
  itemsData: any = [];
  config: any = {
    clickedRows: false,
    actionItems: false,
    dateformat: "dd/MM/yyyy",
    selectBox: false,
    displayedColumns: [
      "itemName",
      "qty",
      "amount",
      "include",
      "procedure",
      "reason",
    ],
    columnsInfo: {
      itemName: {
        title: "Item Name",
        type: "string",
      },
      qty: {
        title: "Qty",
        type: "number",
      },
      amount: {
        title: "Amount",
        type: "number",
      },
      include: {
        title: "Include in Procedure",
        type: "checkbox",
      },
      procedure: {
        title: "Procedure",
        type: "string",
      },
      reason: {
        title: "Reason",
        type: "textarea",
      },
    },
  };

  constructor(
    public dialogRef: MatDialogRef<ConsumableDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.data.items.forEach((item: any, index: number) => {
      this.itemsData.push({
        itemName: "",
        qty: "",
        amount: "",
        include: "",
        procedure: "",
        reason: "",
      });
    });
  }

  close() {
    this.dialogRef.close();
  }
}
