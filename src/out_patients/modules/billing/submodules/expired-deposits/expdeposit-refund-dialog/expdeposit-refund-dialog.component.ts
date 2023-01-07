import { Component, Inject, OnInit } from "@angular/core";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MessageDialogService } from "@shared/ui/message-dialog/message-dialog.service";
@Component({
  selector: "out-patients-expdeposit-refund-dialog",
  templateUrl: "./expdeposit-refund-dialog.component.html",
  styleUrls: ["./expdeposit-refund-dialog.component.scss"],
})
export class ExpdepositRefundDialogComponent implements OnInit {
  OpenCheckdddialog: Boolean = true;
  constructor(
    public dialog: MatDialog,
    public messagedialogservice: MessageDialogService,
    private maticonregistry: MatIconRegistry,
    private domsanitizer: DomSanitizer,
    private dialogRef: MatDialogRef<ExpdepositRefundDialogComponent>
  ) {}

  ngOnInit(): void {
    this.maticonregistry.addSvgIcon(
      "yellowwarning",
      this.domsanitizer.bypassSecurityTrustResourceUrl(
        "assets/yellowwarning.svg"
      )
    );
  }

  OpenCheckdd(str: any) {
    if (str == "yes") {
      this.dialogRef.close(str);
    } else if (str == "no") {
      this.dialogRef.close(str);
    }
  }
}
