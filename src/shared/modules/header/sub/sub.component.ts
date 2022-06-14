import { Component, OnInit, Input } from "@angular/core";
import { QuestionControlService } from "../../../ui/dynamic-forms/service/question-control.service";
import { FormGroup } from "@angular/forms";

@Component({
  selector: "maxhealth-sub-header",
  templateUrl: "./sub.component.html",
  styleUrls: ["./sub.component.scss"],
})
export class SubComponent implements OnInit {
  @Input() submodules: any = [];

  activeSubModule: any;

  searchFormData = {
    global: {
      title: "",
      type: "object",
      properties: {
        maxID: {
          type: "string",
          title: "Max ID",
          required: true,
        },
        phone: {
          type: "string",
          title: "Phone",
          required: true,
        },
        name: {
          type: "string",
          title: "Name",
          required: true,
        },
        dob: {
          type: "date",
          title: "DOB",
          required: true,
        },
        healthID: {
          type: "string",
          title: "Health ID",
          required: true,
        },
        adhaar: {
          type: "string",
          title: "Aadhaar",
          required: true,
        },
      },
    },
  };

  searchForm!: FormGroup;

  questions: any;

  constructor(private formService: QuestionControlService) {}

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.searchFormData.global.properties,
      {}
    );
    this.searchForm = formResult.form;
    this.questions = formResult.questions;
  }

  onRouterLinkActive($event: any, imodule: any) {
    console.log($event);
    if ($event) {
      this.activeSubModule = imodule;
    }
  }

  searchSubmit() {}
}
