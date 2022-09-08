import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HttpService } from "@shared/services/http.service";
import { BillingApiConstants } from "../../BillingApiConstant";

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
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpService
  ) {}

  getData(hid: string, serviceid: string) {
    // this.http
    //   .get(BillingApiConstants.getHealthCheckupdetails(hid, serviceid))
    //   .subscribe((res) => {
    //   res.forEach((item: any, index: number) => {
    //     this.itemsData.push({
    //       sno: index + 1,
    //       specialisation: "",
    //       doctorName: "",
    //     });
    //   });
    // });
  }

  ngOnInit(): void {
    this.getData(this.data.orderSet.itemid, this.data.orderSet.serviceid);
  }

  close() {
    this.dialogRef.close();
  }
}
