import { Component, OnInit } from "@angular/core";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { MessageDialogService } from "../../../../../../shared/ui/message-dialog/message-dialog.service";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "out-patients-deleteexpiredpatient-dialog",
  templateUrl: "./deleteexpiredpatient-dialog.component.html",
  styleUrls: ["./deleteexpiredpatient-dialog.component.scss"],
})
export class DeleteexpiredpatientDialogComponent implements OnInit {
  sendvalueToexpiredpatient: boolean = false;
  constructor(
    private maticonregistry: MatIconRegistry,
    private domsanitizer: DomSanitizer,
    private messagedialogservice: MessageDialogService,
    private dialogRef: MatDialogRef<DeleteexpiredpatientDialogComponent>
  ) {
    this.maticonregistry.addSvgIcon(
      "warning",
      this.domsanitizer.bypassSecurityTrustResourceUrl("assets/warning.svg")
    );
  }

  ngOnInit(): void {}
  deleteExpiredpatient() {
    this.sendvalueToexpiredpatient = true;
    this.dialogRef.close(this.sendvalueToexpiredpatient);

    // this.messagedialogservice.success("Expired Patient Has Been Deleted");
  }
}
