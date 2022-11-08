import { Component, OnInit, ViewChild } from "@angular/core";
import { BillingApiConstants } from "../../../../BillingApiConstant";
import { CookieService } from "@shared/services/cookie.service";
import { BillingService } from "../../../../billing.service";
import { HttpService } from "@shared/services/http.service";
import { ConsumableDetailsComponent } from "../../../../prompts/consumable-details/consumable-details.component";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { CalculateBillService } from "@core/services/calculate-bill.service";

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
        type: "currency",
        style: {
          width: "100px",
        },
      },
      cash: {
        title: "Cash",
        type: "currency",
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
        type: "currency",
        style: {
          width: "120px",
        },
      },
      totalAmount: {
        title: "Total Amount",
        type: "currency",
      },
    },
  };

  constructor(
    private http: HttpService,
    private cookie: CookieService,
    public billingService: BillingService,
    public matDialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private calculateBillService: CalculateBillService
  ) {}

  ngOnInit(): void {
    this.getData();
    this.billingService.clearAllItems.subscribe((clearItems: any) => {
      if (clearItems) {
        this.data = [];
      }
    });
  }

  ngAfterViewInit(): void {
    this.tableRows.stringLinkOutput.subscribe((res: any) => {
      const dialogConst = this.matDialog.open(ConsumableDetailsComponent, {
        width: "80%",
        height: "50%",
        data: {
          orderSet: res.element,
          items: res.element.items,
          procedureDataForConsumable: res.element.procedureDataForConsumable,
          consumablesUnselectedItems:
            this.calculateBillService.consumablesUnselectedItems,
        },
      });
      dialogConst.afterClosed().subscribe((result: any) => {
        if (result && "data" in result) {
          let tempAmount = 0;
          result.data.forEach((selectedItem: any) => {
            tempAmount += selectedItem.amount;
          });
          this.calculateBillService.consumablesUnselectedItems = result.data;
          this.billingService.ConsumableItems[res.index].totalAmount =
            this.billingService.ConsumableItems[res.index].totalAmount -
            tempAmount;
          this.billingService.ConsumableItems[res.index].billItem.totalAmount =
            this.billingService.ConsumableItems[res.index].billItem
              .totalAmount - tempAmount;
          this.billingService.ConsumableItems[res.index].billItem.price =
            this.billingService.ConsumableItems[res.index].billItem.price -
            tempAmount;
          this.data = [...this.billingService.ConsumableItems];
          this.billingService.calculateTotalAmount();
        }
      });
    });
  }

  getData() {
    this.billingService.ConsumableItems = [];
    this.billingService.billItems = [];
    return this.http
      .get(
        BillingApiConstants.consumableData(
          this.billingService.activeMaxId.iacode,
          this.billingService.activeMaxId.regNumber,
          this.cookie.get("HSPLocationId")
        )
      )
      .subscribe(
        (res: any) => {
          let data: any = [];
          res.consumableServiceHeadData.forEach((head: any, index: number) => {
            this.billingService.addToConsumables({
              sno: index + 1,
              surgeryName: head.itemName,
              priority: typeof head.priority == "string" ? 0 : head.priority, ////GAV1027 make bill priority issue
              credit: 0,
              cash: 0,
              doctorName: head.doctorName,
              taxAmount: head.totaltaX_Value,
              totalAmount: head.amount,
              items: res.consumableServiceDetailsData,
              procedureDataForConsumable: res.procedureDataForConsumable,
              billItem: {
                itemId: head.itemId,
                priority: typeof head.priority == "string" ? 0 : head.priority, ////GAV1027 make bill priority issue
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
                gst: head.totaltaX_RATE,
                gstValue: head.totaltaX_Value,
                specialisationID: 0,
                doctorID: 0,
              },
              //       gstDetail:{
              //   gsT_value:head.totaltaX_Value,
              //   gsT_percent:head.totaltaX_RATE,
              //   cgsT_Value:head.cgsT_Value,
              //   cgsT_Percent:head.cgst,
              //   sgsT_value:head.sgsT_Value,
              //   sgsT_percent:head.sgst,
              //   utgsT_value:head.utgsT_Value,
              //   utgsT_percent:head.utgst,
              //   igsT_Value:head.igsT_Value,
              //   igsT_percent:head.igst,
              //   cesS_value:head.cesS_Value,
              //   cesS_percent:head.cess,
              //   taxratE1_Value:head.taxratE1_Value,
              //   taxratE1_Percent:head.taxratE1,
              //   taxratE2_Value:head.taxratE2_Value,
              //   taxratE2_Percent:head.taxratE2,
              //   taxratE3_Value:head.taxratE3_Value,
              //   taxratE3_Percent:head.taxratE3,
              //   taxratE4_Value:head.taxratE4_Value,
              //   taxratE4_Percent:head.taxratE4,
              //   taxratE5_Value:head.taxratE5_Value,
              //   taxratE5_Percent:head.taxratE5,
              //   totaltaX_RATE:head.totaltaX_RATE,
              //   totaltaX_RATE_VALUE:head.totaltaX_Value,
              //   saccode:head.saccode,
              //   taxgrpid:head.taxgrpid,
              //   codeId:head.codeId,
              // },
              //  gstCode:{
              //       tax:head.tax,
              //       taxType:head.taxType,
              //       codeId:head.codeId,
              //       code:head.code,
              //     }
            });
          });
          this.data = [...this.billingService.ConsumableItems];
        },
        (error: any) => {}
      );
  }

  goToBill() {
    this.router.navigate(["../bill"], {
      queryParamsHandling: "merge",
      relativeTo: this.route,
    });
  }
}
