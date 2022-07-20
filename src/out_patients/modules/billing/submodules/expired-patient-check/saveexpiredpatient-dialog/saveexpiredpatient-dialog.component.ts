import { Component, OnInit } from "@angular/core";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { MessageDialogService } from "../../../../../../shared/ui/message-dialog/message-dialog.service";

@Component({
  selector: "out-patients-saveexpiredpatient-dialog",
  templateUrl: "./saveexpiredpatient-dialog.component.html",
  styleUrls: ["./saveexpiredpatient-dialog.component.scss"],
})
export class SaveexpiredpatientDialogComponent implements OnInit {
  constructor(
    private maticonregistry: MatIconRegistry,
    private domsanitizer: DomSanitizer,
    private messagedialogservice: MessageDialogService
  ) {
    this.maticonregistry.addSvgIcon(
      "warning yellow",
      this.domsanitizer.bypassSecurityTrustResourceUrl("assets/warning.svg")
    );
  }

  ngOnInit(): void {}
}
