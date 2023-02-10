import { Injectable } from "@angular/core";
import { HttpService } from "@shared/services/http.service";
import { Subject } from "rxjs";
import { PharmacyApiConstants } from "../constants/pharmacyApiConstant";
import { takeUntil } from "rxjs/operators";
@Injectable({
  providedIn: "root",
})
export class EPOrderService {
  private readonly _destroying$ = new Subject<void>();
  searchFormData: any;
  updateFormData = new Subject<boolean>();
  dataEPOrder: any = [];
  dataEPOrderDrugLine: any = [];
  clearAll = new Subject<boolean>();
  updateAll = new Subject<boolean>();
  changeEventEPOrderDetails = new Subject<boolean>();

  constructor(private http: HttpService) {}

  ngOnInit() {}

  clear() {
    this.clearAll.next(true);
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
    this.http
      .get(PharmacyApiConstants.epordersearch + data)
      .pipe(takeUntil(this._destroying$))
      .subscribe((resultData) => {
        this.dataEPOrder = resultData.objOrderDetails;
        this.mapListDataEPOrder();
      });
  }

  mapListDataEPOrder() {
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
    });
    this.updateAll.next(true);
  }
}
