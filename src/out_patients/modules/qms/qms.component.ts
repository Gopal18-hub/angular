import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { QuestionControlService } from '@shared/ui/dynamic-forms/service/question-control.service';
import { MessageDialogService } from '@shared/ui/message-dialog/message-dialog.service';
@Component({
  selector: 'out-patients-qms',
  templateUrl: './qms.component.html',
  styleUrls: ['./qms.component.scss']
})
export class QmsComponent implements OnInit {
  area = [
    { id:1, value: "abc"},
    { id:2, value: "xyz"}
  ]
  counter = [
    { id:1, value: "abc"},
    { id:2, value: "xyz"}
  ]
  qmsFormData = {
    title: "",
    type: "object",
    properties: {
      area: {
        type: "dropdown",
        required: true,
        options: this.area
      },
      counter: {
        type: "dropdown",
        required: true,
        options: this.counter
      }
    }
  };
  qmsform!: FormGroup;
  questions: any;
  constructor(private formService: QuestionControlService, private matdialog: MessageDialogService) { }

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.qmsFormData.properties,
      {}
    );
    this.qmsform = formResult.form;
    this.questions = formResult.questions;
    this.qmsform.controls["area"].value;
  }
  okbtn()
  {
    this.matdialog.success( this.qmsform.controls["area"].value + ", " + this.qmsform.controls["counter"].value + " Selected successfully");
  }
}
