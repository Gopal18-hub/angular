import { Component, OnInit, Inject } from "@angular/core";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormGroup } from "@angular/forms";

@Component({
  selector: "out-patients-twice-consultation-reason",
  templateUrl: "./twice-consultation-reason.component.html",
  styleUrls: ["./twice-consultation-reason.component.scss"],
})
export class TwiceConsultationReasonComponent implements OnInit {
  form!: FormGroup;

  questions: any;

  constructor(
    public dialogRef: MatDialogRef<TwiceConsultationReasonComponent>,
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
    this.questions[0].elementRef.focus();
  }

  save() {
    if (this.form.valid) {
      this.dialogRef.close({ data: this.form.value });
    }
  }
  close() {
    this.dialogRef.close();
  }
}
