import { Component, OnInit } from "@angular/core";
import { FormReport } from "@core/constants/FormReport";
import { ActivatedRoute, Router } from "@angular/router";
import { Subject } from "rxjs";
import { filter, takeUntil } from "rxjs/operators";
import { FormGroup } from "@angular/forms";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";

@Component({
  selector: "reports-basic",
  templateUrl: "./basic.component.html",
  styleUrls: ["./basic.component.scss"],
})
export class BasicComponent implements OnInit {
  private readonly _destroying$ = new Subject<void>();

  formGroup!: FormGroup;
  questions: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formService: QuestionControlService
  ) {}

  ngOnInit(): void {
    this.route.params
      .pipe(takeUntil(this._destroying$))
      .subscribe((params: any) => {
        if (
          params.reportName &&
          FormReport[params.reportName as keyof typeof FormReport]
        ) {
          let formResult: any = this.formService.createForm(
            FormReport[params.reportName].filterForm.properties,
            {}
          );
          this.formGroup = formResult.form;
          this.questions = formResult.questions;
        } else {
        }
      });
  }
}
