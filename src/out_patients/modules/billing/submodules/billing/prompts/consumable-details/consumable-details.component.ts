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
    selectBox: true,
    selectCheckBoxPosition: 3,
    selectCheckBoxLabel: "Include in Procedure",
    displayedColumns: ["itemName", "qty", "amount", "procedure", "reason"],
    columnsInfo: {
      itemName: {
        title: "Item Name",
        type: "string",
        style: {
          width: "20%",
        },
      },
      qty: {
        title: "Qty",
        type: "number",
        style: {
          width: "80px",
        },
      },
      amount: {
        title: "Amount",
        type: "number",
        style: {
          width: "10%",
        },
      },
      // include: {
      //   title: "Include in Procedure",
      //   type: "checkbox",
      // },
      procedure: {
        title: "Procedure",
        type: "dropdown",
        options: [],
      },
      reason: {
        title: "Reason",
        type: "textarea",
        style: {
          width: "20%",
        },
      },
    },
  };
  procedureDataForConsumable: any = [];

  constructor(
    public dialogRef: MatDialogRef<ConsumableDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.procedureDataForConsumable = this.data.procedureDataForConsumable;

    this.data.items.forEach((item: any, index: number) => {
      this.itemsData.push({
        itemName: item.itemName,
        qty: item.quantity,
        amount: item.amount,
        include: "",
        procedure: "",
        reason: "",
        itemid: item.itemid,
      });
    });
  }

  ngAfterViewInit(): void {
    //this.tableRows.selection.select(...this.tableRows.dataSource.data);
  }

  copyReason() {
    const copyText = this.itemsData[0].reason;
    this.itemsData.forEach((item: any) => {
      item.reason = copyText;
    });
    this.itemsData = [...this.itemsData];
  }

  close() {
    this.dialogRef.close({ data: this.tableRows.selection.selected });
  }
}
