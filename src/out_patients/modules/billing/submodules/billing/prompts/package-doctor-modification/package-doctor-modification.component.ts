import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "out-patients-package-doctor-modification",
  templateUrl: "./package-doctor-modification.component.html",
  styleUrls: ["./package-doctor-modification.component.scss"],
})
export class PackageDoctorModificationComponent implements OnInit {
  @ViewChild("table") tableRows: any;
  itemsData: any = [];
  config: any = {
    clickedRows: false,
    actionItems: false,
    dateformat: "dd/MM/yyyy",
    selectBox: false,
    displayedColumns: ["sno", "specialisation", "doctorName"],
    columnsInfo: {
      sno: {
        title: "Sl.No",
        type: "number",
      },
      specialisation: {
        title: "Specialisation",
        type: "string",
      },
      doctorName: {
        title: "Doctor Name",
        type: "dropdown",
        options: [],
      },
    },
  };

  constructor(
    public dialogRef: MatDialogRef<PackageDoctorModificationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.data.items.forEach((item: any, index: number) => {
      this.itemsData.push({
        sno: index + 1,
        specialisation: "",
        doctorName: "",
      });
    });
  }

  close() {
    this.dialogRef.close();
  }
}
