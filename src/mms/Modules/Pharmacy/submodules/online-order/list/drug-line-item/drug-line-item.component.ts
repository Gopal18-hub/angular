import { Component, OnInit, ViewChild, OnDestroy, Inject } from "@angular/core";
import { OnlineOrderStaticConstants } from "../../../../../../core/constants/online-order-static-constant";
import { OnlineOrderService } from "../../../../../../core/services/online-order.service";
import { Subject } from "rxjs";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router } from "@angular/router";
@Component({
  selector: "op-pharmacy-online-order-drug-line-item",
  templateUrl: "./drug-line-item.component.html",
  styleUrls: ["./drug-line-item.component.scss"],
})
export class OpPharmacyOnlineOrderDrugLineItemComponent
  implements OnInit, OnDestroy
{
  linedataOnlineOrderDrugLineconfig =
    OnlineOrderStaticConstants.linedataOnlineOrderDrugLineconfig;
  @ViewChild("drugLineItemdataOnlineOrderDrugLineTable")
  drugLineItemdataOnlineOrderDrugLineTable: any;
  dataOnlineOrderDrugLine: any = [];

  constructor(
    public dialogRef: MatDialogRef<OpPharmacyOnlineOrderDrugLineItemComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public OnlineOrderService: OnlineOrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // this.calltabledata();
    this.dataOnlineOrderDrugLine = this.data.detailsList;
  }

  private readonly _destroying$ = new Subject<void>();
  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

  ngAfterViewInit(): void {
    this.drugLineItemdataOnlineOrderDrugLineTable.stringLinkOutput.subscribe(
      (res: any) => {}
    );
  }
  onCreateBill() {
    this.close();
    // this.router.navigate(["pharmacy", "issue-entry"], {
    //   queryParams: this.data,
    // });
  }

  close() {
    this.dialogRef.close({
      selected:
        this.drugLineItemdataOnlineOrderDrugLineTable.selection.selected,
    });
  }
}
