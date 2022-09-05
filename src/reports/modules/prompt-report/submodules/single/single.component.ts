import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import { DatePipe } from "@angular/common";
import { ReportService } from "@shared/services/report.service";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";

@Component({
  selector: "reports-single",
  templateUrl: "./single.component.html",
  styleUrls: ["./single.component.scss"],
})
export class SingleComponent implements OnInit, OnChanges {
  @Input() reportConfig: any;
  formGroup: any;
  questions: any;

  constructor(
    private datepipe: DatePipe,
    private reportService: ReportService,
    private formService: QuestionControlService
  ) {}

  ngOnInit(): void {
    this.init();
  }

  init() {
    let formResult: any = this.formService.createForm(
      this.reportConfig.filterForm.properties,
      {}
    );
    this.formGroup = formResult.form;
    this.questions = formResult.questions;
  }

  ngOnChanges(changes: any): void {
    if (
      changes.reportConfig.currentValue.reportName !=
      changes.reportConfig.previousValue.reportName
    ) {
      this.init();
    }
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
