import {
  Component,
  Input,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from "@angular/core";
import { FormGroup, FormArray, FormControl, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { QuestionBase } from "./interface/question-base";
import { QuestionControlService } from "./service/question-control.service";
import { map, startWith } from "rxjs/operators";

@Component({
  selector: "maxhealth-question",
  templateUrl: "./dynamic-form-question.component.html",
  styleUrls: ["./dynamic-form.scss"],
})
export class DynamicFormQuestionComponent implements OnInit, AfterViewInit {
  @Input() question: QuestionBase<any> = {} as QuestionBase<any>;
  @Input() questions: QuestionBase<any>[] = [];
  @Input() index: number | undefined;
  @Input() form: FormGroup = {} as FormGroup;

  get isValid() {
    return this.form.controls[this.question.key].valid;
  }
  get isCorrect() {
    return this.form.controls[this.question.key].errors?.["incorrect"];
  }

  passwordHide = true;

  arrowIcon = "arrow_drop_down";

  @ViewChild("element") element!: ElementRef;

  filteredOptions!: Observable<any>;

  constructor(private qcs: QuestionControlService) {}

  compareFn: (f1: any, f2: any) => boolean = this.compareByValue;

  compareByValue(f1: any, f2: any) {
    return f1 && f2 && f1 == f2;
  }

  excuteCondition(conditions: any, value: any) {
    conditions.forEach((conditionParam: any) => {
      if (conditionParam.type == "disabled") {
        // if (eval(conditionParam.condition)) {
        //     this[conditionParam.type] = true;
        // } else {
        //     this[conditionParam.type] = false;
        // }
      } else if (conditionParam.type == "value") {
        let tempValue = eval(conditionParam.condition);
        this.form.controls[conditionParam.key].setValue(tempValue);
      } else if (conditionParam.type == "option") {
        console.log(conditionParam);
        let coptions = [];
        for (let i = 0; i < conditionParam.options.length; i++) {
          let element = { ...conditionParam.options[i] };
          if (element.disabled) {
            element.disabled = eval(element.disabled);
          }
          coptions.push(element);
        }
        let questionIndex = this.questions.findIndex(
          (it) => it.key == conditionParam.key
        );
        if (questionIndex > -1) {
          this.questions[questionIndex].options = coptions;
          this.form.controls[conditionParam.key].setValue("");
        }
      }
    });
  }

  ngOnInit() {
    this.question.label = this.question.label.replace(/_/gi, " ");
    this.form.controls[this.question.key].valueChanges.subscribe((value) => {
      this.excuteCondition(this.question.conditions, value);
    });

    if (this.question.type == "autocomplete") {
      this.filteredOptions = this.form.controls[
        this.question.key
      ].valueChanges.pipe(
        startWith(""),
        map((value: any) => (typeof value === "string" ? value : value?.title)),
        map((title: any) =>
          title ? this._filter(title) : this.question.options.slice()
        )
      );
    }
  }

  displayFn(option: any): string {
    return option && option.title ? option.title : "";
  }

  private _filter(title: string): any[] {
    const filterValue = title.toLowerCase();

    return this.question.options.filter((option: any) =>
      option.title.toLowerCase().includes(filterValue)
    );
  }

  setValue(form: any, key: string, $event: any) {
    form.controls[key].setValue($event.value);
  }

  ngAfterViewInit(): void {
    if (this.element) {
      this.question.elementRef = this.element.nativeElement;
    }
  }
}
