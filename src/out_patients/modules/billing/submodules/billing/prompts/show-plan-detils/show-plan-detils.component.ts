import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "out-patients-show-plan-detils",
  templateUrl: "./show-plan-detils.component.html",
  styleUrls: ["./show-plan-detils.component.scss"],
})
export class ShowPlanDetilsComponent implements OnInit {
  @ViewChild("table") tableRows: any;
  data: any = [];
  config: any = {
    clickedRows: false,
    actionItems: false,
    dateformat: "dd/MM/yyyy",
    selectBox: false,
    displayedColumns: [
      "sno",
      "planType",
      "planName",
      "select",
      "serviceId",
      "planId",
    ],
    columnsInfo: {
      sno: {
        title: "SL.No",
        type: "number",
      },
      planType: {
        title: "Plan Type",
        type: "string",
      },
      planName: {
        title: "Plan Name",
        type: "string",
      },
      select: {
        title: "Select",
        type: "string",
      },
      serviceId: {
        title: "Service Id",
        type: "string",
      },
      planId: {
        title: "Plan Id",
        type: "string",
      },
    },
  };
  constructor(
    public dialogRef: MatDialogRef<ShowPlanDetilsComponent>,
    @Inject(MAT_DIALOG_DATA) public inputdata: any
  ) {}

  ngOnInit(): void {
    this.data = this.inputdata.planDetails;
  }

  cancel() {
    this.dialogRef.close({ process: 0 });
  }
}
