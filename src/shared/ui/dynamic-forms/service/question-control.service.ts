import { Injectable } from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormArray,
  Validators,
  AbstractControl,
} from "@angular/forms";
import { QuestionBase } from "../interface/question-base";
import { DropdownQuestion } from "../types/question-dropdown";
import { TextboxQuestion } from "../types/question-textbox";
import { HttpService } from "../../../services/http.service";

import { NumberQuestion } from "../types/question-number";
import { RadioQuestion } from "../types/question-radio";
import { CheckboxQuestion } from "../types/question-checkbox";
import { RangeQuestion } from "../types/question-range";
import { ColorpickerQuestion } from "../types/question-colorpicker";
import { AutoCompleteQuestion } from "../types/question-autocomplete";
import { PasswordQuestion } from "../types/question-password";
import { AuthService } from "../../../services/auth.service";

@Injectable()
export class QuestionControlService {
  formGroup: FormGroup | undefined;

  constructor(private http: HttpService, private auth: AuthService) {}

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
        data.push(new DropdownQuestion(question));
      else if (question.type == "string")
        data.push(new TextboxQuestion(question));
      else if (question.type == "number")
        data.push(new NumberQuestion(question));
      else if (question.type == "textarea")
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
        data.push(new AutoCompleteQuestion(question));
    }

    //questions = questions.sort((a, b) => a.order - b.order)
    // questions.forEach(question => {
    // 	if(question.controlType=='dropdown') data.push(new DropdownQuestion(question));
    // 	else if(question.controlType=='string') data.push(new TextboxQuestion(question));
    //   else if(question.controlType=='textarea') data.push(new TextboxQuestion(question));
    //   else if(question.controlType=='hidden') data.push(new TextboxQuestion(question));
    //   else if(question.controlType=='email') data.push(new TextboxQuestion(question));
    //   else if(question.controlType=='file') data.push(new FileQuestion(question, this.http));
    // });
    return data;
    //console.log(data);
  }

  toFormGroup(questions: QuestionBase<any>[]) {
    let group: any = {};

    questions = questions.sort((a, b) => a.order - b.order);

    questions.forEach((question) => {
      if (question.type == "object") {
        let childQuestions: any = {};
        question.childQuestions = question.childQuestions.sort(
          (a: any, b: any) => a.order - b.order
        );
        question.childQuestions.forEach((childQuestion: any) => {
          childQuestions[childQuestion.key] = this.createControl(childQuestion);
        });
        group[question.key] = new FormGroup(childQuestions);
      } else if (question.type == "array") {
        let conditions = [];
        if (question.minimum) {
          conditions.push(this.minLengthArray(question.minimum));
        }
        question.childQuestions = question.childQuestions.sort(
          (a: any, b: any) => a.order - b.order
        );
        if (question.value) {
          let childQuestions: any = [];
          question.value.forEach((arrayItem: any, i: number) => {
            let temp: any = {};
            question.childQuestions.forEach((childQuestion: any) => {
              childQuestion.value = arrayItem[childQuestion.key];
              temp[childQuestion.key] = this.createControl(childQuestion);
            });
            childQuestions[i] = new FormGroup(temp);
          });
          console.log(childQuestions);
          group[question.key] = new FormArray(childQuestions, conditions);
        } else {
          let childQuestions: any = {};
          question.childQuestions.forEach((childQuestion: any) => {
            childQuestions[childQuestion.key] =
              this.createControl(childQuestion);
          });
          group[question.key] = new FormArray(
            [new FormGroup(childQuestions)],
            conditions
          );
        }
      } else {
        group[question.key] = this.createControl(question);
      }
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
    if (question.multiple) {
      if (question.value && withValue) {
        let multipleControls: any = [];
        question.value.forEach((element: any) => {
          multipleControls.push(new FormControl(element));
        });
        control = new FormArray(multipleControls, conditions);
      } else {
        control = new FormArray([], conditions);
      }
    } else {
      if (withValue) {
        control = new FormControl(question.value || "", conditions);
      } else {
        control = new FormControl("", conditions);
      }
    }
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
}
