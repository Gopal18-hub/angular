import { Component, OnInit, ViewChild } from "@angular/core";
import { BillingApiConstants } from "../../../../BillingApiConstant";
import { CookieService } from "@shared/services/cookie.service";
import { BillingService } from "../../../../billing.service";
import { HttpService } from "@shared/services/http.service";
import { ConsumableDetailsComponent } from "../../../../prompts/consumable-details/consumable-details.component";
import { MatDialog } from "@angular/material/dialog";

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
    removeRow: false,
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
        style: {
          width: "80px",
        },
      },
      surgeryName: {
        title: "Surgery Name",
        type: "string_link",
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

  constructor(
    private http: HttpService,
    private cookie: CookieService,
    public billingService: BillingService,
    public matDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  ngAfterViewInit(): void {
    this.tableRows.stringLinkOutput.subscribe((res: any) => {
      this.matDialog.open(ConsumableDetailsComponent, {
        width: "50%",
        height: "50%",
        data: {
          orderSet: res.element,
          items: res.element.items,
        },
      });
    });
  }

  getData() {
    return this.http
      .get(
        BillingApiConstants.consumableData(
          this.billingService.activeMaxId.iacode,
          this.billingService.activeMaxId.regNumber,
          this.cookie.get("HSPLocationId")
        )
      )
      .subscribe(
        (res) => {
          let data: any = [];
          res.consumableServiceHeadData.forEach((head: any, index: number) => {
            data.push({
              sno: index + 1,
              surgeryName: head.itemName,
              priority: head.priority,
              credit: 0,
              cash: 0,
              doctorName: head.doctorName,
              taxAmount: 0,
              totalAmount: head.amount,
              items: res.consumableServiceDetailsData,
            });
          });
          this.data = [...data];
        },
        (error) => {}
      );
  }
}
