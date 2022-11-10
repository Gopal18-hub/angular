import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { CookieService } from "@shared/services/cookie.service";
import { ReportService } from "@shared/services/report.service";
import { BillingService } from "../../billing.service";

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
  LocationID: any = Number(this.cookie.get("HSPLocationId"));
  billno: any;
  constructor(
    private reportService: ReportService,
    public billingservice: BillingService,
    private cookie: CookieService,
    public dialogRef: MatDialogRef<ConsumableDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.procedureDataForConsumable = this.data.procedureDataForConsumable;
    this.config.columnsInfo.procedure.options =
      this.procedureDataForConsumable.map((r: any) => {
        return { title: r.procedureName, value: r.procedureid };
      });
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
    this.itemsData.forEach((item: any, index: number) => {
      let exist = this.data.consumablesUnselectedItems.find(
        (gi: any) => gi.itemid == item.itemid
      );
      if (exist) {
        this.tableRows.selection.select(item);
      }
    });
    this.tableRows.selection.changed.subscribe((ch: any) => {
      console.log(ch);
    });
  }

  copyReason() {
    let copyText = "";
    const tempids: any = [];
    this.tableRows.selection.selected.forEach((item: any, index: number) => {
      if (item.reason) copyText = item.reason;
      tempids.push(item.itemid);
    });
    this.itemsData.forEach((item: any, index: number) => {
      if (tempids.includes(item.itemid)) item.reason = copyText;
    });
    this.itemsData = [...this.itemsData];
  }
  ConsumableBill() {
    if (this.billingservice.activeMaxId && this.billingservice.billNo) {
      this.dialogRef.close({ data: this.tableRows.selection.selected });
      this.reportService.openWindow(
        this.billno + "- Consumable Report",
        "ConsumabaleEntryDetailsReport",
        {
          MAXID: this.billingservice.activeMaxId.maxId,
          billno: this.billingservice.billNo,
          locationId: this.LocationID,
        }
      );
    }
  }
  close() {
    this.dialogRef.close({ data: this.tableRows.selection.selected });
  }
}
