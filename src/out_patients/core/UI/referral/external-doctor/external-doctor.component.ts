import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";
import { HttpService } from "@shared/services/http.service";
import { ApiConstants } from "@core/constants/ApiConstants";
import { BillingApiConstants } from "../../../../modules/billing/submodules/billing/BillingApiConstant";

@Component({
  selector: "out-patients-referral-external-doctor",
  templateUrl: "./external-doctor.component.html",
  styleUrls: ["./external-doctor.component.scss"],
})
export class ExternalDoctorComponent implements OnInit {
  formData = {
    title: "",
    type: "object",
    properties: {
      firstname: {
        title: "First Name",
        type: "string",
        required: true,
      },
      lastname: {
        title: "Last Name",
        type: "string",
        required: true,
      },
      mobile: {
        title: "Mobile",
        type: "string",
        required: true,
      },
      speciality: {
        type: "dropdown",
        placeholder: "--Select--",
        title: "Speciality",
        required: true,
      },
    },
  };
  formGroup!: FormGroup;
  questions: any;

  addDoctor: boolean = false;

  doctorsList: any = [];

  term: any;

  @Output() selectedDoctorEvent: EventEmitter<any> = new EventEmitter();

  constructor(
    private formService: QuestionControlService,
    private http: HttpService
  ) {}

  ngOnInit(): void {
    this.getDoctorsList();
  }

  getDoctorsList() {
    this.http.get(ApiConstants.getreferraldoctor(2, "")).subscribe((res) => {
      this.doctorsList = res;
    });
  }

  getSpecialization() {
    this.http.get(BillingApiConstants.getspecialization).subscribe((res) => {
      this.questions[3].options = res.map((r: any) => {
        return { title: r.name, value: r.id };
      });
    });
  }

  selectedDoctor(docotr: any) {
    this.selectedDoctorEvent.emit({ docotr });
  }

  initiateForm($event: any) {
    $event.stopPropagation();
    this.addDoctor = true;
    let formResult: any = this.formService.createForm(
      this.formData.properties,
      {}
    );
    this.formGroup = formResult.form;
    this.questions = formResult.questions;
    this.getSpecialization();
  }
  createDoctor($event: any) {
    $event.stopPropagation();
    if (this.formGroup.valid) {
      this.http
        .get(
          ApiConstants.getsimilarsoundreferraldoctor(
            this.formGroup.value.speciality,
            this.formGroup.value.firstname,
            this.formGroup.value.lastname,
            this.formGroup.value.mobile
          )
        )
        .subscribe((res: any) => {
          if (res.length > 0) {
          } else {
          }
        });
    }
  }

  cancelCreateDoctor($event: any) {
    $event.stopPropagation();
    this.addDoctor = false;
  }
}
