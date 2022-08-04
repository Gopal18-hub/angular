import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";
import { HttpService } from "@shared/services/http.service";
import { ApiConstants } from "@core/constants/ApiConstants";
import { BillingApiConstants } from "../../../../BillingApiConstant";

@Component({
  selector: "out-patients-consultations",
  templateUrl: "./consultations.component.html",
  styleUrls: ["./consultations.component.scss"],
})
export class ConsultationsComponent implements OnInit {
  formData = {
    title: "",
    type: "object",
    properties: {
      specialization: {
        type: "dropdown",
      },
      doctorName: {
        type: "dropdown",
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
      "serviceName",
      "itemName",
      "precaution",
      "procedure",
      "qty",
      "credit",
      "cash",
      "disc",
    ],
    columnsInfo: {
      serviceName: {
        title: "Services Name",
        type: "string",
      },
      itemName: {
        title: "Item Name / Doctor Name",
        type: "string",
      },
      precaution: {
        title: "Precaution",
        type: "string",
      },
      procedure: {
        title: "Procedure Doctor",
        type: "string",
      },
      qty: {
        title: "Qty / Type",
        type: "string",
      },
      credit: {
        title: "Credit",
        type: "string",
      },
      cash: {
        title: "Cash",
        type: "string",
      },
      disc: {
        title: "Disc %",
        type: "string",
      },
    },
  };

  constructor(
    private formService: QuestionControlService,
    private http: HttpService
  ) {}

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.formData.properties,
      {}
    );
    this.formGroup = formResult.form;
    this.questions = formResult.questions;
    this.getSpecialization();
  }

  getSpecialization() {
    this.http.get(BillingApiConstants.getspecialization).subscribe((res) => {
      this.questions[0].options = res.map((r: any) => {
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
          1
        )
      )
      .subscribe((res) => {
        this.questions[1].options = res.map((r: any) => {
          return { title: r.name, value: r.id };
        });
      });
  }
}
