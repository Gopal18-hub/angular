import { Component, OnInit, ViewChild, OnDestroy, Inject } from "@angular/core";
import { EPOrderStaticConstants } from "../../../../../../core/constants/ep-order-static-constant";
import { EPOrderService } from "../../../../../../core/services/ep-order.service";
import { Subject } from "rxjs";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
@Component({
  selector: "op-pharmacy-ep-order-drug-line-item",
  templateUrl: "./drug-line-item.component.html",
  styleUrls: ["./drug-line-item.component.scss"],
})
export class OpPharmacyEPOrderDrugLineItemComponent
  implements OnInit, OnDestroy
{
  linedataEPOrderDrugLineconfig =
    EPOrderStaticConstants.linedataEPOrderDrugLineconfig;
  @ViewChild("drugLineItemdataEPOrderDrugLineTable")
  drugLineItemdataEPOrderDrugLineTable: any;
  dataEPOrderDrugLine: any = [];

  constructor(
    public dialogRef: MatDialogRef<OpPharmacyEPOrderDrugLineItemComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public EPOrderService: EPOrderService
  ) {}

  ngOnInit(): void {
    this.calltabledata();
  }

  private readonly _destroying$ = new Subject<void>();
  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

  calltabledata(): void {
    this.dataEPOrderDrugLine = this.EPOrderService.dataEPOrderDrugLine;
  }
  ngAfterViewInit(): void {
    this.drugLineItemdataEPOrderDrugLineTable.stringLinkOutput.subscribe(
      (res: any) => {}
    );
  }
  onCreateBill() {}

  close() {
    this.dialogRef.close({
      selected: this.drugLineItemdataEPOrderDrugLineTable.selection.selected,
    });
  }
}
