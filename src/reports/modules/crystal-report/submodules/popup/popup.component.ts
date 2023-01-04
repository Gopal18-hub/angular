import { Component, OnDestroy, OnInit } from "@angular/core";
import { CrystalReport } from "@core/constants/CrystalReport";
import { ActivatedRoute, Router } from "@angular/router";
import { Subject } from "rxjs";
import { filter, takeUntil } from "rxjs/operators";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "reports-popup",
  templateUrl: "./popup.component.html",
  styleUrls: ["./popup.component.scss"],
})
export class PopupComponent implements OnInit, OnDestroy {
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
    const iframeEle: any = document.getElementById("popupid");
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
