import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { QuestionControlService } from '@shared/ui/dynamic-forms/service/question-control.service';

@Component({
  selector: 'out-patients-reason-for-due-bill',
  templateUrl: './reason-for-due-bill.component.html',
  styleUrls: ['./reason-for-due-bill.component.scss']
})
export class ReasonForDueBillComponent implements OnInit {
  reasonForDueBillData = {
    title: "",
    type: "object",
    properties: {
      reason: {
        type: "dropdown",
        placeholder: "---Select---",
      },
      remarks: {
        type: "textarea",
        placeholder: "Write note"
      },
      authorisedby: {
        type: "dropdown",
        placeholder: "---Select---",
      },

    },
  };
  reasonForDueBillForm!: FormGroup;
  question: any;
  constructor(
    private formService: QuestionControlService
  ) { }

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.reasonForDueBillData.properties,
      {}
    );
    this.reasonForDueBillForm = formResult.form;
    this.question = formResult.questions;
  }

}
