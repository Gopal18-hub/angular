import { Component, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconRegistry } from "@angular/material/icon";

import { DomSanitizer } from "@angular/platform-browser";
import { MessageDialogService } from "../../../../../src/shared/ui/message-dialog/message-dialog.service";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "out-patients-delete-dialog",
  templateUrl: "./delete-dialog.component.html",
  styleUrls: ["./delete-dialog.component.scss"],
})
export class DeletedialogComponent implements OnInit {
  sendValuetoEmpsponsor: boolean = true;
  constructor(
    private matIconRegistry: MatIconRegistry,
    private domsanitiser: DomSanitizer,
    private messagedialogservice: MessageDialogService,
    private dialogRef: MatDialogRef<DeletedialogComponent>
  ) {
    //   this.matIconregistry
    // .addSvgIcon('warning','assets/warning.svg');
    this.matIconRegistry.addSvgIcon(
      "warning",
      this.domsanitiser.bypassSecurityTrustResourceUrl("assets/warning.svg")
    );
  }

  ngOnInit(): void {}
  deletesuccess() {
    // this.messagedialogservice.success("Deleted Successfully");
    this.dialogRef.close(this.sendValuetoEmpsponsor);
  }
}
