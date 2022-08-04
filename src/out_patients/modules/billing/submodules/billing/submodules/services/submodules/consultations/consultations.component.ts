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
        type: "autocomplete",
      },
      doctorName: {
        type: "autocomplete",
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
      "doctorName",
      "type",
      "scheduleSlot",
      "bookingDate",
      "price",
    ],
    columnsInfo: {
      sno: {
        title: "S.No.",
        type: "number",
      },
      doctorName: {
        title: "Docotr Name",
        type: "string",
      },
      type: {
        title: "Type",
        type: "string",
      },
      scheduleSlot: {
        title: "Schedule Slot",
        type: "string",
      },
      bookingDate: {
        title: "Booking Date",
        type: "date",
      },
      price: {
        title: "Price",
        type: "number",
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
    this.formGroup.controls["specialization"].valueChanges.subscribe(
      (val: any) => {
        this.getdoctorlistonSpecializationClinic(val.value);
      }
    );
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
          return { title: r.doctorName, value: r.doctorId };
        });
      });
  }
}
