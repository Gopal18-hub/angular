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
import { Observable, Subscription, Subject, ReplaySubject } from "rxjs";
import { QuestionBase } from "./interface/question-base";
import { QuestionControlService } from "./service/question-control.service";
import { map, startWith, takeUntil } from "rxjs/operators";
import { MatAutocompleteTrigger } from "@angular/material/autocomplete";
import "../../utilities/String-Extentions";
import maskInput from "vanilla-text-mask";
import { MatAutocomplete } from "@angular/material/autocomplete";
import createAutoCorrectedDatePipe from "text-mask-addons/dist/createAutoCorrectedDatePipe";
import * as moment from "moment";
import {
  MatBottomSheet,
  MAT_BOTTOM_SHEET_DATA,
} from "@angular/material/bottom-sheet";
interface Bank {
  id: string;
  name: string;
}

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
  @ViewChild("templateBottomSheet") TemplateBottomSheet: any;
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
    guide: true,
    pipe: createAutoCorrectedDatePipe("dd/mm/yyyy"),
    keepCharPositions: true,
    placeholderChar: "\u2000",
  };

  toogleButtonTextarea: boolean = false;
  public bankMultiFilterCtrl: FormControl = new FormControl();

  constructor(
    private qcs: QuestionControlService,
    private bottomSheet: MatBottomSheet
  ) {}

  compareFn: (f1: any, f2: any) => boolean = this.compareByValue;

  compareByValue(f1: any, f2: any) {
    return f1 && f2 && f1 == f2;
  }

  ngOnDestroy() {
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }
  }

  excuteCondition(conditions: any, self: any, formValue: any) {
    conditions.forEach((conditionParam: any) => {
      switch (conditionParam.type) {
        case "value":
          let tempValue = eval(conditionParam.expression);
          this.form.controls[conditionParam.controlKey].setValue(tempValue);
          break;
        case "hide":
          const exprHideEvaluate = eval(conditionParam.expression);
          if (exprHideEvaluate) {
            let questionIndex = this.questions.findIndex(
              (it) => it.key == conditionParam.controlKey
            );
            if (questionIndex > -1) {
              this.questions[questionIndex].questionClasses = this.questions[
                questionIndex
              ].questionClasses.replace(/max-show/g, " ");
              this.questions[questionIndex].questionClasses += " max-hide";
            }
          }
          break;
        case "show":
          const exprShowEvaluate = eval(conditionParam.expression);
          if (exprShowEvaluate) {
            let questionIndex = this.questions.findIndex(
              (it) => it.key == conditionParam.controlKey
            );
            if (questionIndex > -1) {
              this.questions[questionIndex].questionClasses = this.questions[
                questionIndex
              ].questionClasses.replace(/max-hide/g, " ");
              this.questions[questionIndex].questionClasses += " max-show";
            }
          }
          break;
        case "required":
          let questionIndex: number = this.questions.findIndex(
            (it) => it.key == conditionParam.controlKey
          );
          const exprRequiredEvaluate = eval(conditionParam.expression);
          if (exprRequiredEvaluate && questionIndex > -1) {
            this.questions[questionIndex].required = true;
          } else {
            this.questions[questionIndex].required = false;
          }
          break;
        case "dateMin":
          let dateTempValue: any = eval(conditionParam.expression);
          let datequestionIndex = this.questions.findIndex(
            (it) => it.key == conditionParam.controlKey
          );
          this.questions[datequestionIndex].minimum = dateTempValue;
          break;
        case "dateMax":
          let dateMaxTempValue: any = eval(conditionParam.expression);
          let dateMaxquestionIndex = this.questions.findIndex(
            (it) => it.key == conditionParam.controlKey
          );
          this.questions[dateMaxquestionIndex].maximum = dateMaxTempValue;
          break;
        case "dateMaxWithDays":
          let dateWithDaysTempValue: any = eval(conditionParam.expression);
          let dateWithDaysquestionIndex = this.questions.findIndex(
            (it) => it.key == conditionParam.controlKey
          );
          this.questions[dateWithDaysquestionIndex].maximum = moment
            .min(
              moment(),
              moment(dateWithDaysTempValue).add(conditionParam.days, "days")
            )
            .toDate();

          break;
        case "dateMinWithDays":
          let dateWithMinDaysTempValue: any = eval(conditionParam.expression);
          let dateWithMinDaysquestionIndex = this.questions.findIndex(
            (it) => it.key == conditionParam.controlKey
          );
          this.questions[dateWithMinDaysquestionIndex].minimum = moment
            .min(
              moment(),
              moment(dateWithMinDaysTempValue).subtract(
                conditionParam.days,
                "days"
              )
            )
            .toDate();

          break;
        default:
          console.log(`NA`);
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

    if (
      this.question &&
      this.question.type &&
      this.question.type == "dropdown"
    ) {
      this.filteredList = this.question.options;
    }
  }

  public filteredList: any;
  private _onDestroy = new Subject<void>();

  ngOnInit() {
    if (this.question)
      this.question.label = this.question.label.replace(/_/gi, " ");
    if (this.question.conditions.length > 0) {
      if (this.question.defaultValue) {
        this.excuteCondition(
          this.question.conditions,
          this.question.defaultValue,
          this.form.value
        );
      }
      this.form.controls[this.question.key].valueChanges.subscribe((value) => {
        this.excuteCondition(this.question.conditions, value, this.form.value);
      });
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

    if (
      this.question &&
      this.question.type &&
      this.question.type == "date" &&
      this.element
    ) {
      maskInput({
        inputElement: this.element.nativeElement,
        ...this.dateMaskConfig,
      });
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

  setEmptyValue() {
    if (this.question.type == "range") {
      this.form.controls[this.question.key].setValue(0);
      this.question.value = 0;
    } else {
      this.form.controls[this.question.key].setValue("");
    }
  }

  @ViewChild("elementsearch") searchElement!: ElementRef;
  getValue() {
    if (
      this.question &&
      this.question.type &&
      this.question.type == "autocomplete"
    ) {
      let va = this.form.controls[this.question.key].value;
      return va && va.title ? va.title : va;
    } else if (
      this.question &&
      this.question.type &&
      this.question.type == "dropdown"
    ) {
      let va = this.form.controls[this.question.key].value;
      let result = this.question.options.find((c: any) => c.value === va);
      let re = result && result.title ? result.title : va;
      this.selectSearch(re);
      return re;
    } else {
      return this.form.controls[this.question.key].value;
    }
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
      //} else if (
      //  this.question &&
      //  this.question.type &&
      //  this.question.type == "date"
      //) {
      //  maskInput({
      //    inputElement: this.element.nativeElement,
      //    ...this.dateMaskConfig,
      //  });
    } else if (
      this.question &&
      this.question.type &&
      this.question.type == "currency"
    ) {
      this.question.elementRef.addEventListener("blur", (event: any) => {
        let value = this.form.controls[this.question.key].value;
        if (!value) value = "0.00";
        const temp = Number.parseFloat(value).toFixed(2);
        this.form.controls[this.question.key].setValue(temp, {
          emitEvent: false,
        });
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

  keyUpSetDateFormat(event: any) {
    let vl = event.target.value.replaceAll(/\s+/g, "").length;
    if (event.target.value.length === 8 && !isNaN(event.target.value)) {
      this.form.controls[this.question.key].setValue(
        this.qcs.convertDateObjFormat(
          maskInput({
            inputElement: this.element.nativeElement,
            ...this.dateMaskConfig,
          }).textMaskInputElement.state.previousConformedValue
        )
      );
    } else if (vl === 10 && isNaN(event.target.value)) {
      this.form.controls[this.question.key].setValue(
        this.qcs.convertDateObjFormat(event.target.value)
      );
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
                option ===
                (this.form.controls[this.question.key].value &&
                  this.form.controls[this.question.key].value.value)
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
  openTemplateSheetMenu() {
    this.bottomSheet.open(this.TemplateBottomSheet);
  }

  closeTemplateSheetMenu() {
    this.trigger.closePanel();
  }
  openedMatSelect(e: any) {
    setTimeout(() => {
      this.searchElement.nativeElement.focus();
    });
  }
  drapdownoptionmatselect() {
    return this.question.options && this.question.options.length > 5
      ? this.filteredList
      : this.question.options;
  }
  autocompleteOpened() {
    let inputWidth =
      this.element.nativeElement.parentNode.parentNode.parentNode.getBoundingClientRect()
        .width - 1;
    setTimeout(() => {
      let panel = this.autocomplete.panel?.nativeElement;
      if (!panel) return;
      panel.style.minWidth = inputWidth + "px";
      this.searchElement.nativeElement.focus();
    });
  }
  onKey(e: any) {
    e.stopPropagation();
    if (e && e.target && e.target.value) {
      this.selectSearch(e);
    } else {
      this.filteredList = this.question.options;
    }
  }

  selectSearch(value: any) {
    if (value) {
      let stt = String(value).toLowerCase();
      this.filteredList = this._filter(stt);
    } else {
      this.filteredList = this.question.options;
    }
  }
}
