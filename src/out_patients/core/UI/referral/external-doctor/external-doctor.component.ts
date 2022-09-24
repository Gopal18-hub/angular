import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";
import { HttpService } from "@shared/services/http.service";

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

  constructor(
    private formService: QuestionControlService,
    private http: HttpService
  ) {}

  ngOnInit(): void {}

  initiateForm($event: any) {
    $event.stopPropagation();
    this.addDoctor = true;
    let formResult: any = this.formService.createForm(
      this.formData.properties,
      {}
    );
    this.formGroup = formResult.form;
    this.questions = formResult.questions;
  }
  createDoctor($event: any) {
    $event.stopPropagation();
    if (this.formGroup.valid) {
    }
  }

  cancelCreateDoctor($event: any) {
    $event.stopPropagation();
    this.addDoctor = false;
  }
}
