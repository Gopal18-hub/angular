import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HttpService } from "@shared/services/http.service";
import { BillingApiConstants } from "../../BillingApiConstant";
import { CookieService } from "@shared/services/cookie.service";

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
        style: {
          width: "80px",
        },
      },
      specialisation: {
        title: "Specialisation",
        type: "string",
        style: {
          width: "30%",
        },
      },
      doctorName: {
        title: "Doctor Name",
        type: "dropdown",
        options: [],
        moreOptions: {},
      },
    },
  };

  constructor(
    public dialogRef: MatDialogRef<PackageDoctorModificationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpService,
    private cookie: CookieService
  ) {}

  getData(hid: string, serviceid: string) {
    this.http
      .get(BillingApiConstants.getHealthCheckupdetails(hid, serviceid))
      .subscribe((res) => {
        let i = 0;
        res.forEach((item: any, index: number) => {
          if (item.isConsult == 1 && item.itemServiceID == 25) {
            this.itemsData[i] = {
              sno: i + 1,
              specialisation: item.itemName,
              doctorName:
                this.data.doctorsList.length > 0
                  ? this.data.doctorsList[i] == 0
                    ? null
                    : this.data.doctorsList[i]
                  : null,
              doctorName_required: true,
            };
            this.getdoctorlistonSpecializationClinic(item.itemID, i);
            i++;
          }
        });
        this.itemsData = [...this.itemsData];
      });
  }

  getdoctorlistonSpecializationClinic(
    clinicSpecializationId: number,
    index: number
  ) {
    this.http
      .get(
        BillingApiConstants.getdoctorlistonSpecializationClinic(
          false,
          clinicSpecializationId,
          Number(this.cookie.get("HSPLocationId"))
        )
      )
      .subscribe((res) => {
        let options = res.map((r: any) => {
          return { title: r.doctorName, value: r.doctorId };
        });
        this.config.columnsInfo.doctorName.moreOptions[index] = options;
      });
  }

  ngOnInit(): void {
    this.getData(this.data.orderSet.itemid, this.data.orderSet.serviceid);
  }

  close() {
    this.dialogRef.close({
      data: this.itemsData,
      itemId: this.data.orderSet.itemid,
    });
  }
}
