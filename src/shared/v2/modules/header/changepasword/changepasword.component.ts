import { Component, OnInit, Inject, AfterViewInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";
import { Subject } from "rxjs";

@Component({
  selector: "out-patients-changepasword",
  templateUrl: "./changepasword.component.html",
  styleUrls: ["./changepasword.component.scss"],
})
export class ChangepaswordComponent implements OnInit, AfterViewInit {
  form!: FormGroup;

  questions: any;
  private readonly _destroying$ = new Subject<void>();

  listSpecialCharacters: string = "[@$^()&_#*!%<>+?]";
  constructor(
    public dialogRef: MatDialogRef<ChangepaswordComponent>,
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

  ngAfterViewInit(): void {}

  close() {
    this.dialogRef.close();
  }
  submit() {
    if (this.form.valid) {
      console.log(this.form.value);
      this.dialogRef.close({ data: this.form.value });
    }
  }
}
