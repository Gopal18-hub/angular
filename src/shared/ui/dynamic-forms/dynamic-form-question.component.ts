import {
  Component,
  Input,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
  OnDestroy,
} from "@angular/core";
import { FormGroup, FormArray, FormControl, Validators } from "@angular/forms";
import { Observable, Subscription } from "rxjs";
import { QuestionBase } from "./interface/question-base";
import { QuestionControlService } from "./service/question-control.service";
import { map, startWith } from "rxjs/operators";
import { MatAutocompleteTrigger } from "@angular/material/autocomplete";
import "../../utilities/String-Extentions";
import maskInput from "vanilla-text-mask";
import { MatAutocomplete } from "@angular/material/autocomplete";

@Component({
  selector: "maxhealth-question",
  templateUrl: "./dynamic-form-question.component.html",
  styleUrls: ["./dynamic-form.scss"],
})
export class DynamicFormQuestionComponent
  implements OnInit, AfterViewInit, OnChanges, OnDestroy
{
  @Input() question: QuestionBase<any> = {} as QuestionBase<any>;
  @Input() questions: QuestionBase<any>[] = [];
  @Input() index: number | undefined;
  @Input() form: FormGroup = {} as FormGroup;

  get isValid() {
    return !this.form.controls[this.question.key].errors?.["required"];
  }
  get isCorrect() {
    return this.form.controls[this.question.key].errors?.["incorrect"];
  }

  get patternError() {
    return this.form.controls[this.question.key].errors?.["pattern"];
  }

  passwordHide = true;

  arrowIcon = "arrow_drop_down";

  @ViewChild("element") element!: ElementRef;

  @ViewChild("auto") autocomplete!: MatAutocomplete;

  @ViewChild(MatAutocompleteTrigger) trigger!: MatAutocompleteTrigger;

  filteredOptions!: Observable<any>;

  emailDomains: string[] = [
    "yahoo.com",
    "gmail.com",
    //"google.com",
    "hotmail.com",
    "maxhealthcare.com",
    // "me.com",
    // "aol.com",
    // "mac.com",
    // "live.com",
    // "comcast.com",
    // "googlemail.com",
    // "msn.com",
    // "hotmail.co.uk",
    // "yahoo.co.uk",
    // "facebook.com",
    // "verizon.net",
    // "att.net",
    // "gmz.com",
    // "mail.com",
  ];

  subscription!: Subscription;

  dateMaskConfig: any = {
    mask: [/\d/, /\d/, "/", /\d/, /\d/, "/", /\d/, /\d/, /\d/, /\d/],
    guide: false,
    placeholderChar: "_",
    pipe: undefined,
    keepCharPositions: false,
  };

  constructor(private qcs: QuestionControlService) {}

  compareFn: (f1: any, f2: any) => boolean = this.compareByValue;

  compareByValue(f1: any, f2: any) {
    return f1 && f2 && f1 == f2;
  }

  ngOnDestroy() {
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }
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

  ngOnChanges(changes: SimpleChanges): void {
    if (this.element) {
      this.question.elementRef = this.element.nativeElement;
    }
    if (
      this.question &&
      this.question.type &&
      this.question.type == "autocomplete"
    ) {
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

  ngOnInit() {
    if (this.question)
      this.question.label = this.question.label.replace(/_/gi, " ");
    // this.form.controls[this.question.key].valueChanges.subscribe((value) => {
    //   this.excuteCondition(this.question.conditions, value);
    // });

    if (
      this.question &&
      this.question.type &&
      this.question.type == "autocomplete"
    ) {
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
    let strOption = "";
    if (option && option.title) {
      if (option.title.includes("/")) {
        strOption = option.title.split("/")[0];
      } else {
        strOption = option.title;
      }
    }
    return strOption.trimEnd();
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
    if (
      this.question &&
      this.question.type &&
      this.question.type == "autocomplete"
    ) {
      this._subscribeToClosingActions();
    } else if (
      this.question &&
      this.question.type &&
      this.question.type == "date"
    ) {
      maskInput({
        inputElement: this.element.nativeElement,
        ...this.dateMaskConfig,
      });
    }
  }

  generateRandomEmail() {
    this.form.controls[this.question.key].setValue("info@maxhealthcare.com");
  }

  keyPressNumbers(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    // Only Numbers 0-9
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }

  keyPressAlpha(event: any) {
    // if (!this.question.pattern) {
    //   this.question.pattern = '/[a-zA-Z]/';
    // }

    const inp = String.fromCharCode(event.keyCode);

    if (/[a-zA-Z. ]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  private _subscribeToClosingActions(): void {
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }

    this.subscription = this.trigger.panelClosingActions.subscribe(
      (e) => {
        if ((!e || !e.source) && !this.question.allowSearchInput) {
          const selected = this.question.options
            .map((option: any) => option.value)
            .find(
              (option: any) =>
                option === this.form.controls[this.question.key].value.value
            );
          if (selected == null) {
            this.form.controls[this.question.key].setValue(null);
          }
        }
      },
      (err) => this._subscribeToClosingActions(),
      () => this._subscribeToClosingActions()
    );
  }

  handler(event: any): void {
    this.form.controls[this.question.key].setValue(event.option.value);
  }

  autocompleteOpened() {
    console.log(this.element.nativeElement.parentNode.parentNode.parentNode);
    let inputWidth =
      this.element.nativeElement.parentNode.parentNode.parentNode.getBoundingClientRect()
        .width - 1;
    setTimeout(() => {
      let panel = this.autocomplete.panel?.nativeElement;
      if (!panel) return;
      panel.style.minWidth = inputWidth + "px";
    });
  }
}
