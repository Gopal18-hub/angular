import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { PharmacyApiConstants } from "../constants/pharmacyApiConstant";
import { takeUntil } from "rxjs/operators";
import { OnlineOrderStaticConstants } from "../constants/online-order-static-constant";
import { SnackBarService } from "@shared/v2/ui/snack-bar/snack-bar.service";
import { HttpService } from "@shared/v2/services/http.service";
@Injectable({
  providedIn: "root",
})
export class OnlineOrderService {
  private readonly _destroying$ = new Subject<void>();
  searchFormData: any;
  updateFormData = new Subject<boolean>();
  dataOnlineOrder: any = [];
  dataOnlineOrderHeader_Pharm: any = [];
  pageIndex: number = 0;
  lastOrderID: number = 0;
  preOrderID: number = 1;
  apiProcessing: boolean = false;
  pageSize: number =
    OnlineOrderStaticConstants.linedataOnlineOrderconfig.paginationPageSize;
  dataOnlineOrderDrugLine: any = [];
  clearAll = new Subject<boolean>();
  updateAll = new Subject<boolean>();
  updateDelete = new Subject<boolean>();
  changeEventOnlineOrderDetails = new Subject<boolean>();
  firstTimeCall: boolean = true;

  constructor(
    private http: HttpService,
    public snackbarService: SnackBarService
  ) {}

  ngOnInit() {}

  clear() {
    this.clearAll.next(true);
  }
  deleteOnlineOrder(data: any) {
    if (data && data.index > -1 && data.data && data.data.orderId) {
      this.http
        .get(
          PharmacyApiConstants.onlineorderdelete +
            "/?OrderId=" +
            data.data.orderId
        )
        .pipe(takeUntil(this._destroying$))
        .subscribe(
          (resultData) => {
            this.dataOnlineOrder.splice(
              this.dataOnlineOrder.findIndex(
                (d: any) => d.orderId === data.data.orderId
              ),
              1
            ); //remove element from array
            this.updateDelete.next(data);
          },
          (error: any) => {
            if (error && error.error && typeof error.error == "string") {
              this.snackbarService.showSnackBar(error.error, "error", "");
            }
          }
        );
    }
  }

  getOnlineOrderSearchData(data: string) {
    if (this.preOrderID != this.lastOrderID) {
      if (this.lastOrderID != 0) {
        this.preOrderID = this.lastOrderID;
      }

      if (this.pageIndex === 0) {
        this.apiProcessing = true;
      }
      let req = data;
      if (this.lastOrderID > 0) {
        req = data + "&LastOrderId=" + this.lastOrderID;
      }
      this.http
        .get(PharmacyApiConstants.onlineordersearch + req)
        .pipe(takeUntil(this._destroying$))
        .subscribe(
          (resultData) => {
            this.apiProcessing = false;
            if (this.pageIndex > 0) {
              if (resultData.objOrderDetails_Pharm) {
                resultData.objOrderDetails_Pharm.forEach((item: any) => {
                  this.dataOnlineOrder.push(item);
                });
              }
              if (resultData.objOrderHeader_Pharm) {
                resultData.objOrderHeader_Pharm.forEach((item: any) => {
                  this.dataOnlineOrderHeader_Pharm.push(item);
                });
              }
            } else {
              this.dataOnlineOrder = resultData.objOrderDetails_Pharm;
              this.dataOnlineOrderHeader_Pharm =
                resultData.objOrderHeader_Pharm;
            }
            this.mapListDataOnlineOrder();
            if (resultData.objOrderDetails_Pharm.length > 0) {
              this.lastOrderID =
                resultData.objOrderDetails_Pharm[
                  resultData.objOrderDetails_Pharm.length - 1
                ].orderId;
            }
          },
          (error: any) => {
            this.apiProcessing = false;
            if (error && error.error && typeof error.error == "string") {
              this.snackbarService.showSnackBar(error.error, "error", "");
              setTimeout(() => {
                this.snackbarService.closeSnackBar();
              }, 1000 * 10); //  10 sec
            }
          }
        );
    } else {
      setTimeout(() => {
        this.getOnlineOrderSearchData(data);
      }, 1000);
    }
  }

  mapListDataOnlineOrder() {
    if (this.dataOnlineOrder) {
      this.dataOnlineOrder.forEach((item: any) => {
        if (item.mrpValue !== "" && item.mrpValue !== undefined)
          item.mrpValue = Number(item.mrpValue).toFixed(2);

        if (item.mrpValue < 1000) {
          item.markLegends = "lbelow-1000";
        } else if (item.mrpValue < 2000) {
          item.markLegends = "l1000-2000";
        } else if (item.mrpValue < 4000) {
          item.markLegends = "l2000-4000";
        } else {
          item.markLegends = "labove-4000";
        }
        item.viewP = "View";
        // Hide Remove Row
        if (item.orderStatus === "Rejected") {
          item.removeRowHide = true;
        }
        item.detailsList = this.dataOnlineOrderHeader_Pharm.filter(
          (x: any) => x.orderid === item.orderId
        );
        item.detailsList.forEach((item: any, i: any) => {
          item.sno = i + 1;
          if (item.drugid == 0) {
            this.dataOnlineOrderDrugLine.splice(i, 1);
          }
        });
      });
    }
    this.dataOnlineOrder.sort(function (a: any, b: any) {
      return b.orderId - a.orderId;
    });
    this.updateAll.next(true);
  }
}
