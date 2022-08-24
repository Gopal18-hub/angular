import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormReport } from "../../../reports/core/constants/FormReport";
import { ActivatedRoute } from "@angular/router";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";

@Component({
  selector: "out-patients-reports",
  templateUrl: "./reports.component.html",
  styleUrls: ["./reports.component.scss"],
})
export class ReportsComponent implements OnInit, OnDestroy {
  private readonly _destroying$ = new Subject<void>();

  reportConfig: any;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    if (this.route.children.length > 0) {
      this.route.children[0].children[0].params
        .pipe(takeUntil(this._destroying$))
        .subscribe((params: any) => {
          if (
            params.reportName &&
            FormReport[params.reportName as keyof typeof FormReport]
          ) {
            this.reportConfig =
              FormReport[params.reportName as keyof typeof FormReport];
          }
        });
    }
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
