import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "out-patients-online-appointment",
  templateUrl: "./online-appointment.component.html",
  styleUrls: ["./online-appointment.component.scss"],
})
export class OnlineAppointmentComponent implements OnInit {
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
    public dialogRef: MatDialogRef<OnlineAppointmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.itemsData = this.data.items;
  }

  close() {
    this.dialogRef.close({ data: this.tableRows.dataSource.data });
  }
}
