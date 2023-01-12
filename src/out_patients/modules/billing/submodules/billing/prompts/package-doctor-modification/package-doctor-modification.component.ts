import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HttpService } from "@shared/services/http.service";
import { BillingApiConstants } from "../../BillingApiConstant";
import { CookieService } from "@shared/services/cookie.service";
import { SpecializationService } from "../../specialization.service";
import { BillingService } from "../../billing.service";

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
    rowHighlightOnHover: false,
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

  packageContent: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<PackageDoctorModificationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpService,
    private cookie: CookieService,
    private specializationService: SpecializationService,
    private billingService: BillingService
  ) {}

  getData(hid: string, serviceid: string) {
    this.http
      .get(BillingApiConstants.getHealthCheckupdetails(hid, serviceid))
      .subscribe((res) => {
        let i = 0;
        res.forEach((item: any, index: number) => {
          if (item.itemServiceID != 25) {
            this.packageContent.push(item.itemName);
          }
          // if (item.isConsult == 1 && item.itemServiceID == 25) {
          if (item.itemServiceID == 25) {
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

  async getdoctorlistonSpecializationClinic(
    clinicSpecializationId: number,
    index: number
  ) {
    this.config.columnsInfo.doctorName.moreOptions[index] =
      await this.specializationService.getDoctorsOnSpecialization(
        clinicSpecializationId
      );
  }

  ngOnInit(): void {
    this.getData(this.data.orderSet.itemid, this.data.orderSet.serviceid);
  }

  ngAfterViewInit(): void {
    this.tableRows.controlValueChangeTrigger.subscribe((res: any) => {
      if (res.data.col == "doctorName") {
        this.data.doctorsList[res.data.index] = res.$event.value;
      }
    });
  }

  checkValidationSubmit() {
    if (this.tableRows && this.tableRows.tableForm) {
      if (this.tableRows.tableForm.valid) {
        this.billingService.changeBillTabStatus(false);
      } else {
        this.billingService.changeBillTabStatus(true);
      }
    }

    if (this.data.doctorsList.length > 0) {
      if (
        this.data.doctorsList.length ==
        this.data.doctorsList.filter(Number).length
      ) {
        return false;
      }
      return true;
    }
    return true;
  }

  close() {
    this.dialogRef.close({
      data: this.itemsData,
      itemId: this.data.orderSet.itemid,
      doctorList: this.data.doctorsList,
    });
  }

  packageDoctorclosebtn() {
    if (this.data && this.data.items.length != 0) {
      this.billingService.doctorList = this.data.doctorsList;
      this.billingService.changeBillTabStatus(false);
    } else {
      this.billingService.doctorList = this.billingService.doctorList.map(
        (d: number) => d * 0
      ); //this.data.doctorsList;
      this.billingService.changeBillTabStatus(true);
    }
  }
}
