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
          title: "Max ID"
        },
        phone: {
          type: "string",
          title: "Phone"
        },
        name: {
          type: "string",
          title: "Name"
        },
        dob: {
          type: "date",
          title: "DOB"
        },
        healthID: {
          type: "string",
          title: "Health ID"
        },
        adhaar: {
          type: "string",
          title: "Aadhaar"
        },
      },
    },
    merge:{
      dateFormat:'dd/MM/yyyy',
      title: "",
      type: "object",
      properties: {       
        name: {
          type: "string",
          title: "Name"
        },
        phone: {
          type: "string",
          title: "Phone"
        },
        dob: {
          type: "date",
          title: "DOB"
        },
        email:{
          type: "string",
          title: "Email"
        }
      },
    },
    opapproval:{
      dateFormat:'dd/MM/yyyy',
      title: "",
      type: "object",
      properties: {       
        from: {
          type: "date",
          title: "From"
        },
        to: {
          type: "date",
          title: "To"
        }
      },
    },
    unmerge:{
      dateFormat:'dd/MM/yyyy',
      title: "",
      type: "object",
      properties: {       
        maxID: {
          type: "string",
          title: "Max ID"
        },
        ssn: {
          type: "string",
          title: "SSN"
        }
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
