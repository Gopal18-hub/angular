import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { QuestionControlService } from "../../../../shared/ui/dynamic-forms/service/question-control.service";

@Component({
  selector: "out-patients-companydialog",
  templateUrl: "./companydialog.component.html",
  styleUrls: ["./companydialog.component.scss"],
})
export class CompanydialogComponent implements OnInit {
  companyiomformdata = {
    type: "object",
    title: "",
    properties: {
      iomtext: {
        title: "",
        type: "textarea",
      },
    },
  };

  companyiomForm!: FormGroup;
  questions: any;

  constructor(private formService: QuestionControlService) {}

  ngOnInit(): void {
    let formResult = this.formService.createForm(
      this.companyiomformdata.properties,
      {}
    );
    this.companyiomForm = formResult.form;
    this.questions = formResult.questions;
  }

  datasource: any = {
    from: "Renu kakka",
    Company: "BMW",
    Subject: "Renewal tie up",
  };
  // this.mattabledata = new MatTableDataSource(this.datasource);
}
