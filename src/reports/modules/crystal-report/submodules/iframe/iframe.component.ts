import { Component, OnDestroy, OnInit } from "@angular/core";
import { CrystalReport } from "@core/constants/CrystalReport";
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { Subject } from "rxjs";
import { filter, takeUntil } from "rxjs/operators";

@Component({
  selector: "reports-iframe",
  templateUrl: "./iframe.component.html",
  styleUrls: ["./iframe.component.scss"],
})
export class IframeComponent implements OnInit, OnDestroy {
  url: any = "";

  private readonly _destroying$ = new Subject<void>();

  constructor(
    private san: DomSanitizer,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params
      .pipe(takeUntil(this._destroying$))
      .subscribe((params: any) => {
        if (
          params.reportName &&
          CrystalReport[params.reportName as keyof typeof CrystalReport]
        ) {
          if (
            typeof CrystalReport[
              params.reportName as keyof typeof CrystalReport
            ] == "string"
          ) {
            let url =
              CrystalReport[
                params.reportName as keyof typeof CrystalReport
              ].toString();
            this.url = this.san.bypassSecurityTrustResourceUrl(url);
          } else {
            let func: Function = <Function>(
              CrystalReport[params.reportName as keyof typeof CrystalReport]
            );
            let url: string = func(this.route.snapshot.queryParams).toString();
            this.url = this.san.bypassSecurityTrustResourceUrl(url);
          }
        } else {
        }
      });
  }

  ngAfterViewInit() {
    const iframeEle: any = document.getElementById("crystalreportiframe");
    const loadingEle: any = document.getElementById("loading");

    iframeEle.addEventListener("load", function () {
      // Hide the loading indicator
      loadingEle.style.display = "none";
      // Bring the iframe back
      iframeEle.style.opacity = 1;
    });
  }

  ngOnDestroy(): void {}
}
