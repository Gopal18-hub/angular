import { NgModule } from "@angular/core";
import { CrystalReportComponent } from "./crystal-report.component";
import { PopupComponent } from "./submodules/popup/popup.component";
import { IframeComponent } from "./submodules/iframe/iframe.component";
import { CrystalReportRoutingModule } from "./routes";

@NgModule({
  declarations: [CrystalReportComponent, PopupComponent, IframeComponent],
  imports: [CrystalReportRoutingModule],
})
export class CrystalReportModule {}
