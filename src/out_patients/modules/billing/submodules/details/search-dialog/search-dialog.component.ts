import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CookieService } from '@shared/services/cookie.service';
import { QuestionControlService } from '@shared/ui/dynamic-forms/service/question-control.service';
@Component({
  selector: 'out-patients-search-dialog',
  templateUrl: './search-dialog.component.html',
  styleUrls: ['./search-dialog.component.scss']
})
export class SearchDialogComponent implements OnInit {
  searchFormData = {
    title: "",
    type: "object",
    properties: {
      billno: {
        type: "string",
      },
      maxid: {
        type: "number",
        defaultValue: this.cookie.get("LocationIACode") + ".",
      },
      mobile: {
        type: "number",
        pattern: "^[1-9]{1}[0-9]{9}",
      },
      checkbox: {
        type: "checkbox",
      },
      fromdate: {
        type: "date",
        maximum: new Date(),
      },
      todate: {
        type: "date",
        maximum: new Date(),
      }
    },
  };
  searchform!: FormGroup;
  questions: any;
  constructor(
    private cookie: CookieService,
    private formService: QuestionControlService
  ) { }

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.searchFormData.properties,
      {}
    );
    this.searchform = formResult.form;
    this.questions = formResult.questions;
  }

}
