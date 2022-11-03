import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HttpService } from "@shared/services/http.service";
import { BillingApiConstants } from "../../BillingApiConstant";
import { CookieService } from "@shared/services/cookie.service";
import { Observable } from "rxjs";
import { FormControl } from "@angular/forms";
import { map, startWith } from "rxjs/operators";
import { SpecializationService } from "../../specialization.service";

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
    selectCheckBoxPosition: 3,
    selectCheckBoxLabel: "Select*",
    dateformat: "dd/MM/yyyy",
    selectBox: true,
    clickSelection: "single",
    displayedColumns: ["sno", "planType", "planName"],
    columnsInfo: {
      sno: {
        title: "Sl.No",
        type: "number",
        style: {
          width: "80px",
        },
      },
      planType: {
        title: "Plan Type",
        type: "string",
      },
      planName: {
        title: "Plan Name",
        type: "string",
      },
    },
  };

  otherPlanConfig: any = {
    clickedRows: false,
    actionItems: false,
    selectCheckBoxPosition: 6,
    dateformat: "dd/MM/yyyy",
    selectBox: true,
    selectCheckBoxLabel: "Select",
    displayedColumns: [
      "stepNo",
      "serviceName",
      "itemName",
      "noOfTimes",
      "price",
      "availnooftimes",
    ],
    columnsInfo: {
      stepNo: {
        title: "Step",
        type: "number",
        style: {
          width: "80px",
        },
      },
      serviceName: {
        title: "Services Name",
        type: "string",
        style: {
          width: "15%",
        },
      },
      itemName: {
        title: "Item Name",
        type: "string",
        style: {
          width: "40%",
        },
      },
      noOfTimes: {
        title: "Limit",
        type: "number",
        style: {
          width: "80px",
        },
      },
      price: {
        title: "App Amount",
        type: "currency",
        style: {
          width: "150px",
        },
      },
      availnooftimes: {
        title: "Avail no.of time",
        type: "number",
        style: {
          width: "120px",
        },
      },
    },
  };

  planType = "healthPlan";

  doctorList: any = [];

  isConsultationExist: boolean = false;

  selectedDoctor = new FormControl();

  arrowIcon = "arrow_drop_down";

  filteredOptions!: Observable<any>;

  constructor(
    public dialogRef: MatDialogRef<ShowPlanDetilsComponent>,
    @Inject(MAT_DIALOG_DATA) public inputdata: any,
    private http: HttpService,
    private cookie: CookieService,
    private specializationService: SpecializationService
  ) {}

  ngOnInit(): void {
    this.planType = this.inputdata.type;
    if (this.inputdata.type == "otherPlanDetails") {
      this.inputdata.planDetails.forEach((item: any) => {
        item.disablecheckbox =
          item.availnooftimes == item.noOfTimes ? true : false;
      });
      this.data = this.inputdata.planDetails;
    } else {
      this.data = this.inputdata.planDetails;
    }
  }

  ngAfterViewInit(): void {
    if (this.planType == "otherPlanDetails") {
      this.tableRows.selection.changed.subscribe((res: any) => {
        this.isConsultationExist = false;
        let consultationExist = 0;
        if (this.tableRows.selection.selected.length == 0) {
          this.data.forEach((item: any) => {
            item.disablecheckbox =
              item.availnooftimes == item.noOfTimes ? true : false;
          });
          this.data = [...this.data];
        } else {
          this.tableRows.selection.selected.forEach((sItem: any) => {
            if (sItem.serviceid == 25) {
              if (!consultationExist) {
                consultationExist = sItem.itemid;
                this.getDoctorsListInfo(sItem.itemid);
              }
            }
          });

          if (consultationExist) {
            this.data.forEach((item: any) => {
              if (item.serviceid == 25) {
                item.disablecheckbox =
                  item.itemid == consultationExist ? false : true;
              }
            });
            this.data = [...this.data];
          } else {
            this.data.forEach((item: any) => {
              item.disablecheckbox =
                item.availnooftimes == item.noOfTimes ? true : false;
            });
            this.data = [...this.data];
          }
        }
      });
    }
  }

  async getDoctorsListInfo(specialisationId: number) {
    this.doctorList = await this.specializationService.getDoctorsListInfo(
      specialisationId
    );
    this.isConsultationExist = true;
    this.filteredOptions = this.selectedDoctor.valueChanges.pipe(
      startWith(""),
      map((value: any) => (typeof value === "string" ? value : value?.title)),
      map((title: any) =>
        title ? this._filter(title) : this.doctorList.slice()
      )
    );
  }

  private _filter(title: string): any[] {
    const filterValue = title.toLowerCase();

    return this.doctorList.filter((option: any) =>
      option.title.toLowerCase().includes(filterValue)
    );
  }

  displayFn(option: any): string {
    let strOption = "";
    if (option && option.title) {
      if (option.title.includes("/")) {
        strOption = option.title.split("/")[0];
      } else {
        strOption = option.title;
      }
    }
    return strOption.trimEnd();
  }

  cancel() {
    this.dialogRef.close();
  }

  getDoctorsList() {}

  save() {
    console.log(this.selectedDoctor);
    this.dialogRef.close({
      selected: this.tableRows.selection.selected,
      selectedDoctor: this.selectedDoctor.value,
    });
  }
}
