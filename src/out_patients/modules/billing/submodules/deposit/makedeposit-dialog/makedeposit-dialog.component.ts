import { Component, OnInit } from "@angular/core";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { MatDialog } from "@angular/material/dialog";
import { DepositDialogComponent } from "../deposit-dialog/deposit-dialog.component";

@Component({
  selector: "out-patients-makedeposit-dialog",
  templateUrl: "./makedeposit-dialog.component.html",
  styleUrls: ["./makedeposit-dialog.component.scss"],
})
export class MakedepositDialogComponent implements OnInit {
  constructor(
    private maticonregistry: MatIconRegistry,
    private domsanitizer: DomSanitizer,
    private matDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.maticonregistry.addSvgIcon(
      "rupeeicon",
      this.domsanitizer.bypassSecurityTrustResourceUrl("assets/rupeeicon.svg")
    );
  }

  openDepositreceipt() {
    this.matDialog.open(DepositDialogComponent, {
      width: "70vw",
      height: "98vh",
    });
  }
}
