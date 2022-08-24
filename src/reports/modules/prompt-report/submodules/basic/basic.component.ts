import { Component, OnInit, SimpleChanges } from "@angular/core";
import { FormReport } from "../../../../core/constants/FormReport";
import { ActivatedRoute, Router } from "@angular/router";
import { Subject } from "rxjs";
import { filter, takeUntil } from "rxjs/operators";
import { FormGroup } from "@angular/forms";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";
import { ReportService } from "@shared/services/report.service";
import { DatePipe } from "@angular/common";
@Component({
  selector: "reports-basic",
  templateUrl: "./basic.component.html",
  styleUrls: ["./basic.component.scss"],
})
export class BasicComponent implements OnInit {
  private readonly _destroying$ = new Subject<void>();

  formGroup!: FormGroup;
  questions: any;

  reportConfig: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formService: QuestionControlService,
    private reportService: ReportService,
    private datepipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.route.params
      .pipe(takeUntil(this._destroying$))
      .subscribe((params: any) => {
        if (
          params.reportName &&
          FormReport[params.reportName as keyof typeof FormReport]
        ) {
          this.reportConfig =
            FormReport[params.reportName as keyof typeof FormReport];
          let formResult: any = this.formService.createForm(
            this.reportConfig.filterForm.properties,
            {}
          );
          this.formGroup = formResult.form;
          this.questions = formResult.questions;
        } else {
        }
      });
  }
  submit() {
    if (this.formGroup.valid) {
    }
  }

  buttonAction(button: any) {
    if (button.type == "clear") {
      this.formGroup.reset();
    } else if (button.type == "crystalReport") {
      for (var i = 0; i < this.questions.length; i++) {
        console.log(this.reportConfig.filterForm);
        if (this.questions[i].type == "date") {
          console.log(this.questions[i]);
          var temp = this.datepipe.transform(
            this.formGroup.controls[this.questions[i].key].value,
            this.reportConfig.filterForm.format
          );
          this.formGroup.controls[this.questions[i].key].setValue(temp);
        }
      }
      console.log(this.formGroup);
      this.reportService.openWindow(
        button.reportConfig.reportName,
        button.reportConfig.reportEntity,
        this.formGroup.value
      );
    }
  }
}
