import { Component, OnInit } from "@angular/core";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "out-patients-oprefund-dialog",
  templateUrl: "./oprefund-dialog.component.html",
  styleUrls: ["./oprefund-dialog.component.scss"],
})
export class OprefundDialogComponent implements OnInit {
  constructor(
    private maticonregistry: MatIconRegistry,
    private domsanitizer: DomSanitizer
  ) {
    this.maticonregistry.addSvgIcon(
      "warning yellow",
      this.domsanitizer.bypassSecurityTrustResourceUrl("assets/warning.svg")
    );
  }

  ngOnInit(): void {}
}
