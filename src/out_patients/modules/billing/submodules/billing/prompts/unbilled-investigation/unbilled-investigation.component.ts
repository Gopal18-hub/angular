import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MessageDialogService } from "@shared/ui/message-dialog/message-dialog.service";

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
      "specialisation",
    ],
    columnsInfo: {
      testName: {
        title: "Test Name",
        type: "number",
      },
      docName: {
        title: "Doctor Name",
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

  disableProcess: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<UnbilledInvestigationComponent>,
    @Inject(MAT_DIALOG_DATA) public inputdata: any,
    private messageDialogService: MessageDialogService
  ) {}

  ngOnInit(): void {
    this.data = this.inputdata.investigations;
  }

  ngAfterViewInit() {
    this.tableRows.selection.changed.subscribe((res: any) => {
      this.checkDuplicate();
    });
  }

  checkDuplicate() {
    let temp: any = [];
    let existProcess = false;
    for (let i = 0; i < this.tableRows.selection.selected.length; i++) {
      if (temp.includes(this.tableRows.selection.selected[i].testID)) {
        this.disableProcess = true;
        existProcess = true;
        this.messageDialogService.error(
          "Already selected the test - <b>" +
            this.tableRows.selection.selected[i].testName +
            "</b>"
        );
        break;
      }
      temp.push(this.tableRows.selection.selected[i].testID);
    }
    if (!existProcess) this.disableProcess = false;
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
