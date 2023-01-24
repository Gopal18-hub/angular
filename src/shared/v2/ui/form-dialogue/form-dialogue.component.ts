import { Component, OnInit, Inject, AfterViewInit } from "@angular/core";
import { QuestionControlService } from "@shared/v2/ui/dynamic-forms/service/question-control.service";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormGroup } from "@angular/forms";

@Component({
  selector: "out-patients-form-dialogue",
  templateUrl: "./form-dialogue.component.html",
  styleUrls: ["./form-dialogue.component.scss"],
})
export class FormDialogueComponent implements OnInit, AfterViewInit {
  form!: FormGroup;

  questions: any;

  constructor(
    public dialogRef: MatDialogRef<FormDialogueComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formService: QuestionControlService
  ) {}

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.data.form.properties,
      {}
    );
    this.form = formResult.form;
    this.questions = formResult.questions;
  }

  ngAfterViewInit(): void {
    if (this.questions[0].type == "autocomplete") {
      setTimeout(() => {
        this.questions[0].elementRef.focus();
      }, 200);
    } else {
      this.questions[0].elementRef.focus();
    }
  }

  submit() {
    if (this.form.valid) {
      this.dialogRef.close({ data: this.form.value });
    }
  }
  close() {
    this.dialogRef.close();
  }
}
