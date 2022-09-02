import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "out-patients-dmg-popup",
  templateUrl: "./dmg-popup.component.html",
  styleUrls: ["./dmg-popup.component.scss"],
})
export class DmgPopupComponent implements OnInit {
  data: any = [];
  config: any = {
    clickedRows: false,
    actionItems: false,
    dateformat: "dd/MM/yyyy",
    selectBox: true,
    displayedColumns: ["name", "spec", "counter"],
    columnsInfo: {
      name: {
        title: "Name",
        type: "string",
      },
      spec: {
        title: "Spec",
        type: "string",
      },
      counter: {
        title: "Counter",
        type: "number",
      },
    },
  };
  constructor(
    public dialogRef: MatDialogRef<DmgPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public inputdata: any
  ) {}

  ngOnInit(): void {}
}
