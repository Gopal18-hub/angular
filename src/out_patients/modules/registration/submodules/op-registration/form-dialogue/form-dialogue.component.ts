import { Component, OnInit, Inject } from "@angular/core";
import { QuestionControlService } from "../../../../../../shared/ui/dynamic-forms/service/question-control.service";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormGroup } from "@angular/forms";

@Component({
  selector: "out-patients-form-dialogue",
  templateUrl: "./form-dialogue.component.html",
  styleUrls: ["./form-dialogue.component.scss"],
})
export class FormDialogueComponent implements OnInit {
  form!: FormGroup;

  questions: any;

  constructor(
    public dialogRef: MatDialogRef<FormDialogueComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formService: QuestionControlService
  ) {

  }

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.data.form.properties,
      {}
    );
    this.form = formResult.form;
    this.questions = formResult.questions;
    this.questions[0].elementRef("focus");
  }

  submit() {
    if (this.form.valid) {
      this.dialogRef.close({ data: this.form.value });
    }
  }
}
