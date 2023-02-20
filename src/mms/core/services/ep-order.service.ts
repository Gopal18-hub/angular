import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { PharmacyApiConstants } from "../constants/pharmacyApiConstant";
import { takeUntil } from "rxjs/operators";
import { EPOrderStaticConstants } from "../constants/ep-order-static-constant";
import { SnackBarService } from "@shared/v2/ui/snack-bar/snack-bar.service";
import { HttpService } from "@shared/v2/services/http.service";
@Injectable({
  providedIn: "root",
})
export class EPOrderService {
  private readonly _destroying$ = new Subject<void>();
  searchFormData: any;
  updateFormData = new Subject<boolean>();
  dataEPOrder: any = [];
  dataEPOrderHeader_Pharm: any = [];
  pageIndex: number = 0;
  lastOrderID: number = 0;
  preOrderID: number = 1;
  apiProcessing: boolean = false;
  pageSize: number =
    EPOrderStaticConstants.linedataEPOrderconfig.paginationPageSize;
  dataEPOrderDrugLine: any = [];
  clearAll = new Subject<boolean>();
  updateAll = new Subject<boolean>();
  updateDelete = new Subject<boolean>();
  changeEventEPOrderDetails = new Subject<boolean>();
  firstTimeCall: boolean = true;

  constructor(
    private http: HttpService,
    public snackbarService: SnackBarService
  ) {}

  ngOnInit() {}

  clear() {
    this.clearAll.next(true);
  }
  deleteEPOrder(data: any) {
    if (data && data.index > -1 && data.data && data.data.orderId) {
      this.http
        .get(
          PharmacyApiConstants.eporderdelete + "/?OrderId=" + data.data.orderId
        )
        .pipe(takeUntil(this._destroying$))
        .subscribe(
          (resultData) => {
            this.dataEPOrder.splice(
              this.dataEPOrder.findIndex(
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

  getEPOrderDetails(data: string) {
    this.http
      .get(PharmacyApiConstants.eporderdetails + data)
      .pipe(takeUntil(this._destroying$))
      .subscribe((resultData) => {
        this.dataEPOrderDrugLine = resultData.physicianOrderDetail;
        this.mapListDataEPOrderDrugLine();
        //this.changeEventEPOrderDetails.next(true);
      });
  }

  mapListDataEPOrderDrugLine() {
    this.dataEPOrderDrugLine.forEach((item: any, i: any) => {
      item.sno = i + 1;
      if (item.drugid == 0) {
        this.dataEPOrderDrugLine.splice(i, 1);
      }
    });
    this.changeEventEPOrderDetails.next(true);
  }

  getEPOrderSearchData(data: string) {
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
        .get(PharmacyApiConstants.epordersearch + req)
        .pipe(takeUntil(this._destroying$))
        .subscribe(
          (resultData) => {
            this.apiProcessing = false;
            if (this.pageIndex > 0) {
              if (resultData.objOrderDetails_Pharm) {
                resultData.objOrderDetails_Pharm.forEach((item: any) => {
                  this.dataEPOrder.push(item);
                });
              }
              if (resultData.objOrderHeader_Pharm) {
                resultData.objOrderHeader_Pharm.forEach((item: any) => {
                  this.dataEPOrderHeader_Pharm.push(item);
                });
              }
            } else {
              this.dataEPOrder = resultData.objOrderDetails_Pharm;
              this.dataEPOrderHeader_Pharm = resultData.objOrderHeader_Pharm;
            }
            this.mapListDataEPOrder();
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
            }
          }
        );
    } else {
      setTimeout(() => {
        this.getEPOrderSearchData(data);
      }, 1000);
    }
  }

  mapListDataEPOrder() {
    if (this.dataEPOrder) {
      this.dataEPOrder.forEach((item: any) => {
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
        item.viewEP = "View";
        // Hide Remove Row
        if (item.orderStatus === "Rejected") {
          item.removeRowHide = true;
        }
        item.detailsList = this.dataEPOrderHeader_Pharm.filter(
          (x: any) => x.orderid === item.orderId
        );
        item.detailsList.forEach((item: any, i: any) => {
          item.sno = i + 1;
          if (item.drugid == 0) {
            this.dataEPOrderDrugLine.splice(i, 1);
          }
        });
      });
    }
    this.dataEPOrder.sort(function (a: any, b: any) {
      return b.orderId - a.orderId;
    });
    this.updateAll.next(true);
  }
}
