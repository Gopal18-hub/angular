import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";
import { HttpService } from "@shared/services/http.service";
import { ApiConstants } from "@core/constants/ApiConstants";
import { BillingApiConstants } from "../../../../BillingApiConstant";
import { CookieService } from "@shared/services/cookie.service";
import { BillingService } from "../../../../billing.service";
@Component({
  selector: "out-patients-health-checkups",
  templateUrl: "./health-checkups.component.html",
  styleUrls: ["./health-checkups.component.scss"],
})
export class HealthCheckupsComponent implements OnInit {
  formData = {
    title: "",
    type: "object",
    properties: {
      department: {
        type: "autocomplete",
        placeholder: "--Select--",
        required: false,
      },
      healthCheckup: {
        type: "autocomplete",
        placeholder: "--Select--",
        required: true,
      },
    },
  };
  formGroup!: FormGroup;
  questions: any;

  @ViewChild("table") tableRows: any;
  data: any = [];
  config: any = {
    clickedRows: false,
    actionItems: false,
    removeRow: true,
    dateformat: "dd/MM/yyyy",
    selectBox: false,
    displayedColumns: ["sno", "healthCheckups", "price"],
    columnsInfo: {
      sno: {
        title: "S.No",
        type: "number",
      },
      healthCheckups: {
        title: "Health Checkups",
        type: "string",
      },
      price: {
        title: "Price",
        type: "number",
      },
    },
  };

  constructor(
    private formService: QuestionControlService,
    private http: HttpService,
    private cookie: CookieService,
    private billingService: BillingService
  ) {}

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.formData.properties,
      {}
    );
    this.formGroup = formResult.form;
    this.questions = formResult.questions;
    this.data = this.billingService.HealthCheckupItems;
    this.getDepartments();
  }

  rowRwmove($event: any) {
    this.billingService.HealthCheckupItems.splice($event.index, 1);
    this.data = [...this.billingService.HealthCheckupItems];
  }

  getDepartments() {
    this.http.get(BillingApiConstants.departmentlookup).subscribe((res) => {
      this.questions[0].options = res.map((r: any) => {
        return { title: r.name, value: r.id };
      });
      this.questions[0] = { ...this.questions[0] };
    });
    this.formGroup.controls["department"].valueChanges.subscribe((val: any) => {
      if (val && val.value) {
        this.gethealthcheckups(val.value);
      }
    });
  }

  gethealthcheckups(departmentId: any) {
    this.http
      .get(
        BillingApiConstants.gethealthcheckups(
          Number(this.cookie.get("HSPLocationId")),
          departmentId
        )
      )
      .subscribe(
        (res) => {
          this.formGroup.controls["healthCheckup"].reset();
          this.questions[1].options = res.map((r: any) => {
            return { title: r.name, value: r.id };
          });
          this.questions[1] = { ...this.questions[1] };
        },
        (error) => {
          this.formGroup.controls["healthCheckup"].reset();
          this.questions[1].options = [];
          this.questions[1] = { ...this.questions[1] };
        }
      );
  }

  add(priorityId = 1) {
    this.http
      .get(
        BillingApiConstants.getPrice(
          priorityId,
          this.formGroup.value.healthCheckup.value,
          26,
          this.cookie.get("HSPLocationId")
        )
      )
      .subscribe((res: any) => {
        this.billingService.addToHealthCheckup({
          sno: this.data.length + 1,
          healthCheckups: this.formGroup.value.healthCheckup.title,
          price: res.amount,
        });

        this.data = [...this.billingService.HealthCheckupItems];
        this.formGroup.reset();
      });
  }
}
