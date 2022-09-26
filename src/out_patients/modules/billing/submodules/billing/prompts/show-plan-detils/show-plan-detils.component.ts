import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HttpService } from "@shared/services/http.service";
import { BillingApiConstants } from "../../BillingApiConstant";
import { CookieService } from "@shared/services/cookie.service";

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

  planType = "healthPlan";

  doctorList: any = [];

  isConsultationExist: boolean = false;

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
      this.tableRows.selection.changed.subscribe((res: any) => {});
    }
  }

  cancel() {
    this.dialogRef.close();
  }

  getDoctorsList() {}

  save() {
    this.dialogRef.close({ selected: this.tableRows.selection.selected });
  }
}
