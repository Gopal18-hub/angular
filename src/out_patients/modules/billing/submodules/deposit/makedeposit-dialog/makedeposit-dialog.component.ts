import { Component, OnInit } from "@angular/core";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "out-patients-makedeposit-dialog",
  templateUrl: "./makedeposit-dialog.component.html",
  styleUrls: ["./makedeposit-dialog.component.scss"],
})
export class MakedepositDialogComponent implements OnInit {
  constructor(
    private maticonregistry: MatIconRegistry,
    private domsanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.maticonregistry.addSvgIcon(
      "warning",
      this.domsanitizer.bypassSecurityTrustResourceUrl("assets/rupeeicon.svg")
    );
  }
}
