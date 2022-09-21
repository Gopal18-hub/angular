import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "out-patients-unbilled-investigation",
  templateUrl: "./unbilled-investigation.component.html",
  styleUrls: ["./unbilled-investigation.component.scss"],
})
export class UnbilledInvestigationComponent implements OnInit {
  @ViewChild("table") tableRows: any;
  data: any = [];
  config: any = {
    clickedRows: false,
    actionItems: false,
    dateformat: "dd/MM/yyyy",
    selectBox: true,
    displayedColumns: [
      "testName",
      "docName",
      "visitDateTime",
      "labItemPriority",
      "specialization",
    ],
    columnsInfo: {
      testName: {
        title: "Test Name",
        type: "number",
      },
      docName: {
        title: "Docotr Name",
        type: "string",
      },
      visitDateTime: {
        title: "Visit Date Time",
        type: "date",
      },
      labItemPriority: {
        title: "Priority",
        type: "string",
      },
      specialization: {
        title: "Specialization",
        type: "string",
      },
    },
  };
  constructor(
    public dialogRef: MatDialogRef<UnbilledInvestigationComponent>,
    @Inject(MAT_DIALOG_DATA) public inputdata: any
  ) {}

  ngOnInit(): void {
    this.data = this.inputdata.investigations;
  }

  process() {
    this.dialogRef.close({
      process: 1,
      data: this.tableRows.selection.selected,
    });
  }

  cancel() {
    this.dialogRef.close({ process: 0 });
  }
}
