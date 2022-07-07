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
      
     CrystalReport.billingreport("253266",5)
     // CrystalReport.printOrganDonorForm("BHTN.230538")
      // CrystalReport.DailyCollectionReport()
      // CrystalReport.DiabeticPlanModifyreport("08/19/2021","03/31/2023","Quit Alcohol program (PPG)","Tobbaco Cessation Program","Others Plan","18500")
      // CrystalReport.DiabeticPlanMainReport()
     // CrystalReport.DiabeticPlanNewreport()
     // CrystalReport.OnlinePaymentDetailReport()
    );
    console.log(this.url);
  }
}
