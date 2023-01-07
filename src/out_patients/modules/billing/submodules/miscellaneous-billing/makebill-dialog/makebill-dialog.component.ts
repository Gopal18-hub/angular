import { Component, OnInit, Inject } from "@angular/core";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";

@Component({
  selector: "out-patients-makebill-dialog",
  templateUrl: "./makebill-dialog.component.html",
  styleUrls: ["./makebill-dialog.component.scss"],
})
export class MakeBillDialogComponent implements OnInit {
  constructor(
    private maticonregistry: MatIconRegistry,
    private domsanitizer: DomSanitizer,
    private matDialog: MatDialog,
    private dialogRef: MatDialogRef<MakeBillDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: String }
  ) {}

  ngOnInit(): void {
    this.maticonregistry.addSvgIcon(
      "rupeeicon",
      this.domsanitizer.bypassSecurityTrustResourceUrl("assets/rupeeicon.svg")
    );
  }

  makedepositclosebtn() {
    this.dialogRef.close("Success");
  }
}
