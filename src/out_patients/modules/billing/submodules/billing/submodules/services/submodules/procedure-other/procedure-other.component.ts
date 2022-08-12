import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";
import { HttpService } from "@shared/services/http.service";
import { ApiConstants } from "@core/constants/ApiConstants";
import { BillingApiConstants } from "../../../../BillingApiConstant";
import { CookieService } from "@shared/services/cookie.service";
import { BillingService } from "../../../../billing.service";

@Component({
  selector: "out-patients-procedure-other",
  templateUrl: "./procedure-other.component.html",
  styleUrls: ["./procedure-other.component.scss"],
})
export class ProcedureOtherComponent implements OnInit {
  formData = {
    title: "",
    type: "object",
    properties: {
      otherService: {
        type: "autocomplete",
        placeholder: "--Select--",
        required: true,
      },
      procedure: {
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
    dateformat: "dd/MM/yyyy",
    selectBox: false,
    displayedColumns: [
      "sno",
      "procedures",
      "qty",
      "specialisation",
      "doctorName",
      "price",
    ],
    columnsInfo: {
      sno: {
        title: "S.No",
        type: "number",
      },
      procedures: {
        title: "Procedures",
        type: "string",
      },
      qty: {
        title: "Qty",
        type: "number",
      },
      specialisation: {
        title: "Specialisation",
        type: "string",
        options: [],
      },
      doctorName: {
        title: "Doctor Name",
        type: "string",
        options: [],
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
    this.getOtherService();
    this.getSpecialization();
  }

  rowRwmove($event: any) {
    this.billingService.ProcedureItems.splice($event.index, 1);
    this.data = [...this.billingService.ProcedureItems];
  }

  getSpecialization() {
    this.http.get(BillingApiConstants.getspecialization).subscribe((res) => {
      this.config.columnsInfo.specialisation.options = res.map((r: any) => {
        return { title: r.name, value: r.id };
      });
    });
  }

  getdoctorlistonSpecializationClinic(clinicSpecializationId: number) {
    this.http
      .get(
        BillingApiConstants.getdoctorlistonSpecializationClinic(
          false,
          clinicSpecializationId,
          Number(this.cookie.get("HSPLocationId"))
        )
      )
      .subscribe((res) => {
        this.config.columnsInfo.doctorName.options = res.map((r: any) => {
          return { title: r.doctorName, value: r.doctorId };
        });
      });
  }

  getOtherService() {
    this.http.get(BillingApiConstants.getotherservice).subscribe((res) => {
      this.questions[0].options = res.map((r: any) => {
        return { title: r.name, value: r.id };
      });
      this.questions[0] = { ...this.questions[0] };
    });
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
        this.billingService.addToProcedure({
          sno: this.data.length + 1,
          procedures: this.formGroup.value.otherService.title,
          qty: 1,
          specialisation: "",
          doctorName: "",
          price: res.amount,
        });

        this.data = [...this.billingService.ProcedureItems];
      });
  }
}
