import { Injectable } from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormArray,
  Validators,
  AbstractControl,
  ValidatorFn,
} from "@angular/forms";
import { QuestionBase } from "../interface/question-base";
import { DropdownQuestion } from "../types/question-dropdown";
import { TextboxQuestion } from "../types/question-textbox";
import { HttpService } from "../../../services/http.service";

import { NumberQuestion } from "../types/question-number";
import { RadioQuestion } from "../types/question-radio";
import { CheckboxQuestion } from "../types/question-checkbox";
import { DateQuestion } from "../types/question-date";
import { RangeQuestion } from "../types/question-range";
import { ColorpickerQuestion } from "../types/question-colorpicker";
import { AutoCompleteQuestion } from "../types/question-autocomplete";
import { PasswordQuestion } from "../types/question-password";
import { AuthService } from "../../../services/auth.service";
import { TelQuestion } from "../types/question-tel";
import { DateTimeQuestion } from "../types/question-datetime";
import { CurrencyQuestion } from "../types/question-currency";
import { CookieService } from "@shared/v2/services/cookie.service";
import { PatternStringQuestion } from "../types/question-pattern-string";

@Injectable()
export class QuestionControlService {
  formGroup: FormGroup | undefined;

  constructor(
    private http: HttpService,
    private auth: AuthService,
    private cookie: CookieService
  ) {}

  processJson(
    questions: QuestionBase<any>[],
    refId?: any,
    replaceVlaues?: any
  ) {
    let data: any = [];

    for (const [key, question] of Object.entries(questions)) {
      question.key = key;
      if (question.replaceValue && replaceVlaues) {
        question.value = this.replacer(question.replaceValue, replaceVlaues);
      }

      if (question.type == "dropdown")
        data.push(new DropdownQuestion(question, this.http));
      else if (question.type == "pattern_string")
        data.push(new PatternStringQuestion(question));
      else if (question.type == "string")
        data.push(new TextboxQuestion(question));
      else if (question.type == "tel") data.push(new TelQuestion(question));
      else if (question.type == "number")
        data.push(new NumberQuestion(question));
      else if (question.type == "currency") {
        if (question.value)
          question.value = Number.parseFloat(question.value).toFixed(2);
        data.push(new CurrencyQuestion(question));
      } else if (question.type == "textarea")
        data.push(new TextboxQuestion(question));
      else if (question.type == "buttonTextarea")
        data.push(new TextboxQuestion(question));
      else if (question.type == "hidden")
        data.push(new TextboxQuestion(question));
      else if (question.type == "email")
        data.push(new TextboxQuestion(question));
      else if (question.type == "radio") data.push(new RadioQuestion(question));
      else if (question.type == "checkbox")
        data.push(new CheckboxQuestion(question));
      else if (question.type == "range") data.push(new RangeQuestion(question));
      else if (question.type == "colorpicker")
        data.push(new ColorpickerQuestion(question));
      else if (question.type == "password")
        data.push(new PasswordQuestion(question));
      else if (question.type == "autocomplete")
        data.push(new AutoCompleteQuestion(question, this.http, this.cookie));
      else if (question.type == "date") data.push(new DateQuestion(question));
      else if (question.type == "datetime")
        data.push(new DateTimeQuestion(question));
    }

    return data;
    //console.log(data);
  }

  toFormGroup(questions: QuestionBase<any>[]) {
    let group: any = {};

    questions = questions.sort((a, b) => a.order - b.order);

    questions.forEach((question) => {
      group[question.key] = this.createControl(question);
    });
    this.formGroup = new FormGroup(group);
    return this.formGroup;
  }

  // customConditions(formGroup: FormGroup) {
  //   return null;
  // }

  createControl(question: any, withValue = true) {
    let control;
    let conditions = [];
    if (question.required) {
      conditions.push(Validators.required);
    }
    if (question.type == "textarea") {
      conditions.push(this.NoWhitespaceValidator());
    }
    if (question.minimum) {
      if (question.multiple) {
        conditions.push(this.minLengthArray(question.minimum));
      } else {
        conditions.push(Validators.min(question.minimum));
      }
    }
    if (question.maximum) {
      conditions.push(Validators.max(question.maximum));
    }
    // if (question.multiple) {
    //   if (question.value && withValue) {
    //     let multipleControls: any = [];
    //     question.value.forEach((element: any) => {
    //       multipleControls.push(new FormControl(element));
    //     });
    //     control = new FormArray(multipleControls, conditions);
    //   } else {
    //     control = new FormArray([], conditions);
    //   }
    // } else {
    if (withValue) {
      control = new FormControl(question.value || "", conditions);
    } else {
      control = new FormControl("", conditions);
    }
    //}
    return control;
  }

  replacer(template: any, obj: any) {
    var keys = Object.keys(obj);
    var func = Function(...keys, "return `" + template + "`;");

    return func(...keys.map((k) => obj[k]));
  }

  minLengthArray(min: number) {
    return (c: AbstractControl): { [key: string]: any } => {
      if (c.value.length >= min) return { minLengthArray: { valid: true } };

      return { minLengthArray: { valid: false } };
    };
  }

  NoWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): any => {
      if (control.value && control.value != "") {
        let trimedvalue = control.value.replace(/\s/g, "");
        if (trimedvalue.length == 0) return { spaceError: { valid: false } };
        return null;
      }
    };
  }

  createForm(questions: any, data: any) {
    if (data) {
      for (const [key, value] of Object.entries(data)) {
        if (questions[key]) {
          questions[key]["value"] = value;
        }
      }
    }
    let temp = this.processJson(questions);
    let form = this.toFormGroup(temp);
    if (data && form) {
      form.patchValue(data);
    }
    return { form: form, questions: temp };
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  // -- date convert dd/mm/yyyy to Date Object
  convertDateObjFormat(date: any) {
    let initial = date.split(/\//);
    let final = [initial[1], initial[0], initial[2]].join("/");
    if (new Date(final) instanceof Date) {
      return new Date(final);
    } else {
      return date;
    }
  }
}
