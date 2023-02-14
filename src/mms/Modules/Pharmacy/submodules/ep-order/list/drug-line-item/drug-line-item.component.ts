import { Component, OnInit, ViewChild, OnDestroy, Inject } from "@angular/core";
import { EPOrderStaticConstants } from "../../../../../../core/constants/ep-order-static-constant";
import { EPOrderService } from "../../../../../../core/services/ep-order.service";
import { Subject } from "rxjs";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router } from "@angular/router";
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
    public EPOrderService: EPOrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // this.calltabledata();
    this.dataEPOrderDrugLine = this.data.detailsList;
  }

  private readonly _destroying$ = new Subject<void>();
  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

  ngAfterViewInit(): void {
    this.drugLineItemdataEPOrderDrugLineTable.stringLinkOutput.subscribe(
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
      selected: this.drugLineItemdataEPOrderDrugLineTable.selection.selected,
    });
  }
}
