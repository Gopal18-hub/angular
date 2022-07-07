import { Component, OnInit } from "@angular/core";
import { CrystalReport } from "@core/constants/CrystalReport";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "reports-iframe",
  templateUrl: "./iframe.component.html",
  styleUrls: ["./iframe.component.scss"],
})
export class IframeComponent implements OnInit {
  url: any = "";

  constructor(private san: DomSanitizer) {}

  ngOnInit(): void {
    this.url = this.san.bypassSecurityTrustResourceUrl(
      //CrystalReport.printOrganDonorForm("test")
      CrystalReport.refundreport("PGRF133695",4)
    );
  }
}
