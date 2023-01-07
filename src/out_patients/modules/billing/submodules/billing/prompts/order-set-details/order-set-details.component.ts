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
    clickSelection: "multiple",
    displayedColumns: ["sno", "serviceType", "serviceItemName", "price"],
    columnsInfo: {
      sno: {
        title: "S.No.",
        type: "number",
        style: {
          width: "80px",
        },
      },
      serviceType: {
        title: "Service Type",
        type: "string",
        style: {
          width: "20%",
        },
      },
      serviceItemName: {
        title: "Service Item Name",
        type: "string",
        style: {
          width: "65%",
        },
      },
      price: {
        title: "Price",
        type: "number",
        style: {
          width: "10%",
        },
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
        serviceType: item.serviceType,
        serviceItemName: item.name,
        price: item.price,
        testId: item.testId,
      });
    });
  }

  ngAfterViewInit() {
    this.itemsData.forEach((item: any, index: number) => {
      let exist = this.data.gridData.find(
        (gi: any) => gi.itemid == item.testId
      );
      if (exist) {
        this.tableRows.selection.select(item);
      }
    });
    console.log(this.tableRows.selection);
  }

  close() {
    this.dialogRef.close();
  }
}
