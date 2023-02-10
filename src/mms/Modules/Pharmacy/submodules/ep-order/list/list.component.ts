import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
  AfterViewInit,
} from "@angular/core";
import { EPOrderStaticConstants } from "../../../../../core/constants/ep-order-static-constant";
import { EPOrderService } from "../../../../../core/services/ep-order.service";
import { HttpService } from "@shared/services/http.service";
import { OpPharmacyEPOrderDrugLineItemComponent } from "./drug-line-item/drug-line-item.component";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { MatDialog } from "@angular/material/dialog";
import { MessageDialogService } from "@shared/v2/ui/message-dialog/message-dialog.service";
import { CookieService } from "@shared/v2/services/cookie.service";
import { SnackBarService } from "@shared/v2/ui/snack-bar/snack-bar.service";

@Component({
  selector: "op-pharmacy-ep-order-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"],
})
export class OpPharmacyEPOrderListComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  linedataEPOrderconfig = EPOrderStaticConstants.linedataEPOrderconfig;
  @ViewChild("listdataEPOrderTable")
  listdataEPOrderTable: any;
  dataEPOrder: any = [];
  clickedLineItem: any = [];
  pageIndex: number = 0;
  pageSize: number = 15;
  defaultValueSort: any = this.linedataEPOrderconfig.defaultValueSort;
  constructor(
    public EPOrderService: EPOrderService,
    public http: HttpService,
    public matDialog: MatDialog,
    private messageDialogService: MessageDialogService,
    private cookie: CookieService,
    public snackbarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.EPOrderService.updateAll.subscribe((update: any) => {
      if (update) {
        this.calltabledata();
      }
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

  searchFilter() {
    // let istype = this.EPOrderService.searchFormData.type.value
    //   ? String(this.EPOrderService.searchFormData.type.value.trim())
    //   : "";
    // let isvvalue = this.EPOrderService.searchFormData.value.value
    //   ? String(
    //       this.EPOrderService.searchFormData.value.value.trim()
    //     ).toUpperCase()
    //   : "";
    // let orderStatus = this.EPOrderService.searchFormData.orderStatus.value
    //   ? String(
    //       this.EPOrderService.searchFormData.orderStatus.value.trim()
    //     ).toUpperCase()
    //   : "";

    // let tempdataEPOrder = this.EPOrderService.dataEPOrder;
    // if (istype && istype != "" && isvvalue && isvvalue != "") {
    //   if (istype === "maxid") {
    //     tempdataEPOrder = tempdataEPOrder.filter((e: any) =>
    //       e.maxid.toUpperCase().includes(isvvalue)
    //     );
    //   } else if (istype === "mobile") {
    //     tempdataEPOrder = tempdataEPOrder.filter((e: any) =>
    //       e.mobileNo.toUpperCase().includes(isvvalue)
    //     );
    //   } else if (istype === "name") {
    //     tempdataEPOrder = tempdataEPOrder.filter((e: any) =>
    //       e.ptnName.toUpperCase().includes(isvvalue)
    //     );
    //   } else if (istype === "doctor") {
    //     tempdataEPOrder = tempdataEPOrder.filter((e: any) =>
    //       e.docName.toUpperCase().includes(isvvalue)
    //     );
    //   }
    // }

    // if (orderStatus && orderStatus != "" && orderStatus != "ALL") {
    //   tempdataEPOrder = tempdataEPOrder.filter(
    //     (e: any) => e.orderStatus.toUpperCase() === orderStatus
    //   );
    // }

    // if (this.pageIndex) {
    //   this.dataEPOrder = tempdataEPOrder.slice(
    //     this.pageIndex,
    //     this.pageSize * (this.pageIndex + 1)
    //   );
    // } else {
    //   this.dataEPOrder = tempdataEPOrder.slice(this.pageIndex, this.pageSize);
    // }
    this.dataEPOrder = this.EPOrderService.dataEPOrder;
  }

  calltabledata(): void {
    //this.dataEPOrder = this.EPOrderService.dataEPOrder;
    this.searchFilter();
  }
  ngAfterViewInit(): void {
    this.listdataEPOrderTable.stringLinkOutput.subscribe((res: any) => {
      // this.clickedLineItem = res.element;
      // this.EPOrderService.getEPOrderDetails(
      //   this.getEPOrderDetailsRequestBody(this.clickedLineItem)
      // );
    });
  }
  listRowClick(data: any): void {
    if (data && data.column && data.column == "viewEP") {
    } else {
      this.clickedLineItem = data.row;
      this.EPOrderService.getEPOrderDetails(
        this.getEPOrderDetailsRequestBody(this.clickedLineItem)
      );
    }
  }
  openDialog(data: any): void {
    const oDRef = this.matDialog.open(OpPharmacyEPOrderDrugLineItemComponent, {
      width: "70%",
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
  selectedDrug(drug: any): void {}
  ontableSorting(event: any) {}
  ontableScrolling(event: any) {
    this.pageIndex++;
    this.searchFilter();
  }
  exportAsExcel() {
    this.listdataEPOrderTable.exportAsExcel();
  }

  rowRwmoveLineItems(event: any) {
    // const deleteDialogref = this.messageDialogService.confirm(
    //   "",
    //   "Do you want to delete?"
    // );

    // deleteDialogref.afterClosed()
    //   .pipe(takeUntil(this._destroying$))
    //   .subscribe((result) => {
    //     if (result && result.result && result.type == "yes") {
    //     }
    //   });

    this.snackbarService.showConfirmSnackBar(
      "You want to Reject this(" + event.data.orderId + ") Prescription?",
      "info",
      "Yes",
      "No",
      (result: any) => {
        if (result && result == "Yes") {
          // this.http
          //   .post(EPOrderApiConstants.eporderdelete, event.data)
          //   .pipe(takeUntil(this._destroying$))
          //   .subscribe(
          //     (resultData) => {
          //     },
          //     (error) => {
          //     }
          //   );
        }
        this.snackbarService.closeSnackBar();
      }
    );

    // this.http
    //   .post(EPOrderApiConstants.eporderdelete, event.data)
    //   .pipe(takeUntil(this._destroying$))
    //   .subscribe(
    //     (resultData) => {
    //     },
    //     (error) => {
    //     }
    //   );
  }

  private readonly _destroying$ = new Subject<void>();
  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
