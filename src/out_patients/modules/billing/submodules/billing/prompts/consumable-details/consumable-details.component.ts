import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { CookieService } from "@shared/services/cookie.service";
import { PermissionService } from "@shared/services/permission.service";
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
    @Inject(MAT_DIALOG_DATA) public data: any,
    private permissionservice: PermissionService
  ) {}

  ngOnInit(): void {
    this.procedureDataForConsumable = this.data.procedureDataForConsumable;
    this.config.columnsInfo.procedure.options =
      this.procedureDataForConsumable.map((r: any) => {
        return { title: r.procedureName, value: r };
      });
    this.data.items.forEach((item: any, index: number) => {
      this.itemsData.push({
        itemName: item.itemName,
        qty: item.quantity,
        amount: item.amount,
        include: "",
        procedure: "",
        procedure_required: false,
        reason: "",
        itemid: item.itemid,
        i: index,
      });
    });
  }

  ngAfterViewInit(): void {
    this.tableRows.controlValueChangeTrigger.subscribe(async (res: any) => {
      if (res.data.col == "procedure") {
        this.tableRows.selection.select(this.itemsData[res.data.index]);
      }
    });

    this.itemsData.forEach((item: any, index: number) => {
      let exist = this.data.consumablesUnselectedItems.find(
        (gi: any) => gi.itemid == item.itemid
      );
      if (exist) {
        this.itemsData[index].procedure = exist.procedure;
        this.config.columnsInfo.procedure.options.find((dataExist:any)=>{
          if (exist.procedure.procedureName == dataExist.value.procedureName)
            item.procedure= dataExist.value;
        });
        this.itemsData[index].reason=exist.reason
        this.tableRows.selection.select(item);
      }
    });
    this.itemsData = [...this.itemsData];
    this.tableRows.selection.changed.subscribe((ch: any) => {
      if (ch.removed.length > 0) {
        ch.removed.forEach((rItem: any) => {
          this.itemsData[rItem.i].reason = "";
          this.itemsData[rItem.i].procedure = "";
          this.itemsData[rItem.i].procedure_required = false;
        });
        this.itemsData = [...this.itemsData];
      } else if (ch.added.length > 0) {
        ch.added.forEach((aItem: any) => {
          this.itemsData[aItem.i].procedure_required = true;
        });
      }
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
    const accessControls: any = this.permissionservice.getAccessControls();
    const exist: any = accessControls[2][7][534][1436];
    if (this.billingservice.activeMaxId) {
      this.dialogRef.close({ data: this.tableRows.selection.selected });
      this.reportService.openWindow(
        "- Consumable Report",
        "ConsumabaleEntryDetailsReport",
        {
          MAXID: this.billingservice.activeMaxId.maxId,
          billno: this.billingservice.billNo || '',
          locationId: this.LocationID,
          exportflagEnable: exist,
        }
      );
    }
  }
  close() {
    this.dialogRef.close({
      data: this.tableRows.selection.selected,
      orderSet: this.data.orderSet,
    });
  }
}
