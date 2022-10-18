import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HttpService } from "@shared/services/http.service";
import { BillingApiConstants } from "../../BillingApiConstant";
import { CookieService } from "@shared/services/cookie.service";
import { Observable } from "rxjs";
import { FormControl } from "@angular/forms";
import { map, startWith } from "rxjs/operators";

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
          width: "30%",
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
        type: "string",
      },
      availnooftimes: {
        title: "Avail no.of time",
        type: "number",
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
    private cookie: CookieService
  ) {}

  ngOnInit(): void {
    this.planType = this.inputdata.type;

    this.data = this.inputdata.planDetails;
  }

  ngAfterViewInit(): void {
    if (this.planType == "otherPlanDetails") {
      this.tableRows.selection.changed.subscribe((res: any) => {
        this.isConsultationExist = false;
        this.tableRows.selection.selected.forEach((sItem: any) => {
          if (sItem.serviceid == 25) {
            this.getDoctorsListInfo();
          }
        });
      });
    }
  }

  getDoctorsListInfo() {
    if (this.doctorList.length == 0) {
      this.http
        .get(
          BillingApiConstants.getalldoctorname(
            Number(this.cookie.get("HSPLocationId"))
          )
        )
        .subscribe((res) => {
          this.doctorList = res.map((r: any) => {
            return {
              title: r.doctorname + " (" + r.specialityname + ")",
              value: r.doctorId,
              originalTitle: r.doctorName,
              specialisationid: r.specialisationid,
              //clinicID: r.clinicID,
            };
          });
          this.isConsultationExist = true;
          this.filteredOptions = this.selectedDoctor.valueChanges.pipe(
            startWith(""),
            map((value: any) =>
              typeof value === "string" ? value : value?.title
            ),
            map((title: any) =>
              title ? this._filter(title) : this.doctorList.slice()
            )
          );
        });
    } else {
      this.isConsultationExist = true;
    }
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
    this.dialogRef.close({ selected: this.tableRows.selection.selected });
  }
}
