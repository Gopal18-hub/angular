import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { OnlineOrderStaticConstants } from "../../../../../core/constants/online-order-static-constant";
import { OnlineOrderService } from "../../../../../core/services/online-order.service";
import { HttpService } from "@shared/services/http.service";
import { OpPharmacyOnlineOrderDrugLineItemComponent } from "./drug-line-item/drug-line-item.component";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { MatDialog } from "@angular/material/dialog";
import { CookieService } from "@shared/v2/services/cookie.service";
import { SnackBarService } from "@shared/v2/ui/snack-bar/snack-bar.service";

@Component({
  selector: "op-pharmacy-online-order-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"],
})
export class OpPharmacyOnlineOrderListComponent implements OnInit, OnDestroy {
  linedataOnlineOrderconfig =
    OnlineOrderStaticConstants.linedataOnlineOrderconfig;
  @ViewChild("listdataOnlineOrderTable")
  listdataOnlineOrderTable: any;
  dataOnlineOrder: any = [];
  clickedLineItem: any = [];
  pageIndexList = 5;
  defaultValueSort: any = this.linedataOnlineOrderconfig.defaultValueSort;
  constructor(
    public OnlineOrderService: OnlineOrderService,
    public http: HttpService,
    public matDialog: MatDialog,
    private cookie: CookieService,
    public snackbarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.OnlineOrderService.updateAll.subscribe((update: any) => {
      if (update) {
        this.searchFilter();
      }
    });
    this.OnlineOrderService.updateDelete.subscribe((deldata: any) => {
      this.dataOnlineOrder.splice(
        this.dataOnlineOrder.findIndex(
          (d: any) => d.orderId === deldata.data.orderId
        ),
        1
      ); //remove element from array
      this.dataOnlineOrder = [...this.dataOnlineOrder];
    });
    this.OnlineOrderService.changeEventOnlineOrderDetails.subscribe(
      (res: any) => {
        if (
          res &&
          this.OnlineOrderService.dataOnlineOrderDrugLine &&
          this.OnlineOrderService.dataOnlineOrderDrugLine.length > 0
        ) {
          this.openDialog(this.clickedLineItem);
        }
      }
    );

    this.OnlineOrderService.updateFormData.subscribe((res: any) => {
      if (res) {
        this.searchFilter();
      }
    });
  }
  getListDataOnTime() {
    for (
      var lis =
        this.OnlineOrderService.pageIndex *
        this.linedataOnlineOrderconfig.paginationPageSize;
      lis <
      (this.OnlineOrderService.pageIndex + 1) *
        this.linedataOnlineOrderconfig.paginationPageSize;
      lis++
    ) {
      if (this.OnlineOrderService.dataOnlineOrder[lis]) {
        this.dataOnlineOrder.push(this.OnlineOrderService.dataOnlineOrder[lis]);
      }
    }
    this.dataOnlineOrder = [...this.dataOnlineOrder];
  }
  searchFilter(isrun: boolean = false) {
    //this.dataOnlineOrder = this.OnlineOrderService.dataOnlineOrder;
    if (this.OnlineOrderService.pageIndex === 0) {
      this.dataOnlineOrder = [];
      this.listdataOnlineOrderTable.scrollTopHandler();
      this.getListDataOnTime();
    }

    if (isrun) {
      this.getListDataOnTime();
    }
  }

  ontableScrolling(event: any) {
    if (!this.OnlineOrderService.apiProcessing) {
      this.OnlineOrderService.pageIndex++;
      if (Math.round(this.OnlineOrderService.pageIndex % 2) === 0) {
        this.OnlineOrderService.getOnlineOrderSearchData(
          this.OnlineOrderService.searchFormData
        );
      }
      this.searchFilter(true);
    }
  }
  exportAsExcel() {
    this.listdataOnlineOrderTable.exportAsExcel();
  }

  rowRwmoveLineItems(event: any) {
    this.snackbarService.showConfirmSnackBar(
      "You want to Reject this(" + event.data.orderId + ") Prescription?",
      "success",
      "Yes",
      "No",
      (result: any) => {
        if (result && result == "Yes") {
          this.OnlineOrderService.deleteOnlineOrder(event);
        }
        this.snackbarService.closeSnackBar();
      }
    );
  }
  listRowClick(data: any): void {
    if (data && data.column && data.column == "viewP") {
    } else {
      this.clickedLineItem = data.row;
      this.openDialog(this.clickedLineItem);
    }
  }
  openDialog(data: any): void {
    const oDRef = this.matDialog.open(
      OpPharmacyOnlineOrderDrugLineItemComponent,
      {
        width: "60%",
        height: "50%",
        data: data,
        panelClass: [
          "animate__animated",
          "animate__slideInRight",
          "OnlineOrderDrugLineItem",
        ],
        position: { right: "0px", bottom: "0px" },
      }
    );
    oDRef
      .afterClosed()
      .pipe(takeUntil(this._destroying$))
      .subscribe(async (result: any) => {});
  }

  getOnlineOrderDetailsRequestBody(data: any): string {
    let re =
      "/" +
      data.maxid.toString().split(".")[1] +
      "/" +
      data.maxid.toString().split(".")[0] +
      "/" +
      Number(this.cookie.get("HSPLocationId")) +
      "/" +
      data.orderId;

    return re;
  }
  private readonly _destroying$ = new Subject<void>();
  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
