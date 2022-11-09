import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { QuestionControlService } from '@shared/ui/dynamic-forms/service/question-control.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'out-patients-selectimei',
  templateUrl: './selectimei.component.html',
  styleUrls: ['./selectimei.component.scss']
})
export class SelectimeiComponent implements OnInit {

  form!: FormGroup;
  questions: any;
  private readonly _destroying$ = new Subject<void>();
  constructor(
    private formService: QuestionControlService,
    public dialogRef: MatDialogRef<SelectimeiComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.data.form.properties,
      {}
    );
    this.form = formResult.form;
    this.questions = formResult.questions;
  }

  submit()
  {

  }

  close()
  {
    this.dialogRef.close();
  }

}
