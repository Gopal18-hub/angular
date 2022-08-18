import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "out-patients-order-set-details",
  templateUrl: "./order-set-details.component.html",
  styleUrls: ["./order-set-details.component.scss"],
})
export class OrderSetDetailsComponent implements OnInit {
  @ViewChild("table") tableRows: any;
  itemsData: any = [];
  config: any = {
    clickedRows: false,
    actionItems: false,
    dateformat: "dd/MM/yyyy",
    selectBox: false,
    displayedColumns: ["sno", "serviceType", "serviceItemName", "price"],
    columnsInfo: {
      sno: {
        title: "S.No.",
        type: "number",
      },
      serviceType: {
        title: "Service Type",
        type: "string",
      },
      serviceItemName: {
        title: "Service Item Name",
        type: "date",
      },
      price: {
        title: "Price",
        type: "number",
      },
    },
  };

  constructor(
    public dialogRef: MatDialogRef<OrderSetDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.data.items.forEach((item: any, index: number) => {
      this.itemsData.push({
        sno: index + 1,
        serviceType: "",
        serviceItemName: item.name,
        price: 0,
      });
    });
  }

  close() {
    this.dialogRef.close();
  }
}
