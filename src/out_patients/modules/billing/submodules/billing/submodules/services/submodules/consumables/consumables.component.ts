import { Component, OnInit, ViewChild } from "@angular/core";
import { BillingApiConstants } from "../../../../BillingApiConstant";
import { CookieService } from "@shared/services/cookie.service";
import { BillingService } from "../../../../billing.service";
import { HttpService } from "@shared/services/http.service";
import { ConsumableDetailsComponent } from "../../../../prompts/consumable-details/consumable-details.component";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";

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
        style: {
          width: "28%",
        },
      },
      priority: {
        title: "Priority",
        type: "string",
        style: {
          width: "100px",
        },
      },
      credit: {
        title: "Credit",
        type: "number",
        style: {
          width: "100px",
        },
      },
      cash: {
        title: "Cash",
        type: "number",
        style: {
          width: "100px",
        },
      },
      doctorName: {
        title: "Doctor Name",
        type: "string",
      },
      taxAmount: {
        title: "Tax Amount",
        type: "number",
        style: {
          width: "120px",
        },
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
    public matDialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getData();
    this.billingService.clearAllItems.subscribe((clearItems) => {
      if (clearItems) {
        this.data = [];
      }
    });
  }

  ngAfterViewInit(): void {
    this.tableRows.stringLinkOutput.subscribe((res: any) => {
      this.matDialog.open(ConsumableDetailsComponent, {
        width: "70%",
        height: "50%",
        data: {
          orderSet: res.element,
          items: res.element.items,
        },
      });
    });
  }

  getData() {
    this.billingService.ConsumableItems = [];
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
            this.billingService.addToConsumables({
              sno: index + 1,
              surgeryName: head.itemName,
              priority: head.priority,
              credit: 0,
              cash: 0,
              doctorName: head.doctorName,
              taxAmount: 0,
              totalAmount: head.amount,
              items: res.consumableServiceDetailsData,
              billItem: {
                itemId: head.itemId,
                priority: head.priority,
                serviceId: head.serviceId,
                price: head.amount,
                serviceName: "Consumables Charges",
                itemName: head.itemName,
                qty: 1,
                precaution: "",
                procedureDoctor: "",
                credit: 0,
                cash: 0,
                disc: 0,
                discAmount: 0,
                totalAmount: head.amount,
                gst: 0,
                gstValue: 0,
                specialisationID: 0,
                doctorID: 0,
              },
            });
          });
          this.data = [...this.billingService.ConsumableItems];
        },
        (error) => {}
      );
  }

  goToBill() {
    this.router.navigate(["../bill"], {
      queryParamsHandling: "merge",
      relativeTo: this.route,
    });
  }
}
