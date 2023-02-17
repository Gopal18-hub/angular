import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { EPOrderStaticConstants } from "../../../../../core/constants/ep-order-static-constant";
import { EPOrderService } from "../../../../../core/services/ep-order.service";
import { HttpService } from "@shared/services/http.service";
import { OpPharmacyEPOrderDrugLineItemComponent } from "./drug-line-item/drug-line-item.component";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { MatDialog } from "@angular/material/dialog";
import { CookieService } from "@shared/v2/services/cookie.service";
import { SnackBarService } from "@shared/v2/ui/snack-bar/snack-bar.service";

@Component({
  selector: "op-pharmacy-ep-order-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"],
})
export class OpPharmacyEPOrderListComponent implements OnInit, OnDestroy {
  linedataEPOrderconfig = EPOrderStaticConstants.linedataEPOrderconfig;
  @ViewChild("listdataEPOrderTable")
  listdataEPOrderTable: any;
  dataEPOrder: any = [];
  clickedLineItem: any = [];
  pageIndexList = 5;
  defaultValueSort: any = this.linedataEPOrderconfig.defaultValueSort;
  constructor(
    public EPOrderService: EPOrderService,
    public http: HttpService,
    public matDialog: MatDialog,
    private cookie: CookieService,
    public snackbarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.EPOrderService.updateAll.subscribe((update: any) => {
      if (update) {
        this.searchFilter();
      }
    });
    this.EPOrderService.updateDelete.subscribe((deldata: any) => {
      
      this.dataEPOrder.splice(
        this.dataEPOrder.findIndex(
          (d: any) => d.orderId === deldata.data.orderId
        ),
        1
      ); //remove element from array
      this.dataEPOrder = [...this.dataEPOrder];
    });
    this.EPOrderService.changeEventEPOrderDetails.subscribe((res: any) => {
      if (
        res &&
        this.EPOrderService.dataEPOrderDrugLine &&
        this.EPOrderService.dataEPOrderDrugLine.length > 0
      ) {
        this.openDialog(this.clickedLineItem);
      }
    });

    this.EPOrderService.updateFormData.subscribe((res: any) => {
      if (res) {
        this.searchFilter();
      }
    });
  }
  getListDataOnTime() {
    for (
      var lis =
        this.EPOrderService.pageIndex *
        this.linedataEPOrderconfig.paginationPageSize;
      lis <
      (this.EPOrderService.pageIndex + 1) *
        this.linedataEPOrderconfig.paginationPageSize;
      lis++
    ) {
      if (this.EPOrderService.dataEPOrder[lis]) {
        this.dataEPOrder.push(this.EPOrderService.dataEPOrder[lis]);
      }
    }
    this.dataEPOrder = [...this.dataEPOrder];
  }
  searchFilter(isrun: boolean = false) {
    //this.dataEPOrder = this.EPOrderService.dataEPOrder;
    if (this.EPOrderService.pageIndex === 0) {
      this.dataEPOrder = [];
      this.listdataEPOrderTable.scrollTopHandler();
      this.getListDataOnTime();
    }

    if (isrun) {
      this.getListDataOnTime();
    }
  }

  ontableScrolling(event: any) {
    if (!this.EPOrderService.apiProcessing) {
      this.EPOrderService.pageIndex++;
      if (Math.round(this.EPOrderService.pageIndex % 2) === 0) {
        this.EPOrderService.getEPOrderSearchData(
          this.EPOrderService.searchFormData
        );
      }
      this.searchFilter(true);
    }
  }
  exportAsExcel() {
    this.listdataEPOrderTable.exportAsExcel();
  }

  rowRwmoveLineItems(event: any) {
    this.snackbarService.showConfirmSnackBar(
      "You want to Reject this(" + event.data.orderId + ") Prescription?",
      "success",
      "Yes",
      "No",
      (result: any) => {
        if (result && result == "Yes") {
          this.EPOrderService.deleteEPOrder(event);
        }
        this.snackbarService.closeSnackBar();
      }
    );
  }
  listRowClick(data: any): void {
    if (data && data.column && data.column == "viewEP") {
    } else {
      this.clickedLineItem = data.row;
      this.openDialog(this.clickedLineItem);
    }
  }
  openDialog(data: any): void {
    const oDRef = this.matDialog.open(OpPharmacyEPOrderDrugLineItemComponent, {
      width: "60%",
      height: "50%",
      data: data,
      panelClass: [
        "animate__animated",
        "animate__slideInRight",
        "EPOrderDrugLineItem",
      ],
      position: { right: "0px", bottom: "0px" },
    });
    oDRef
      .afterClosed()
      .pipe(takeUntil(this._destroying$))
      .subscribe(async (result: any) => {});
  }

  getEPOrderDetailsRequestBody(data: any): string {
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
