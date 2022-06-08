import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { QuestionBase }     from './interface/question-base';
import { QuestionControlService }    from './service/question-control.service';

@Component({
  selector: 'maxhealth-question',
  templateUrl: './dynamic-form-question.component.html',
  styleUrls: ['./dynamic-form.scss']
})
export class DynamicFormQuestionComponent implements OnInit {
  @Input() question: QuestionBase<any>;

  // get isValid() { return this.form.controls[this.question.key].valid; }

  constructor(private qcs: QuestionControlService) {  }

  compareFn: ((f1: any, f2: any) => boolean)|null = this.compareByValue;

  compareByValue(f1: any, f2: any) { 
    return f1 && f2 && f1 == f2; 
  }

  excuteCondition(conditions: any, value:any) {
    conditions.forEach((conditionParam: any) => {
      if (conditionParam.type == 'disabled') {
        if (eval(conditionParam.condition)) {
            this[conditionParam.type] = true;
        } else {
            this[conditionParam.type] = false;
        }
      } else if (conditionParam.type == 'value') {
          let tempValue = eval(conditionParam.condition);
          this.form.controls[conditionParam.key].setValue(tempValue);
      }
      else if (conditionParam.type == 'option') {
        console.log(conditionParam);
        let coptions = [];
        for(let i =0; i < conditionParam.options.length; i++) {
          let element = {...conditionParam.options[i]};
          if (element.disabled) { 
            element.disabled = eval(element.disabled);
          }
          coptions.push(element);
        }
        let questionIndex = this.questions.findIndex((it) => it.key == conditionParam.key);
        if(questionIndex > -1) { 
          this.questions[questionIndex].options = coptions;
          this.form.controls[conditionParam.key].setValue('');
        }
      }
     
    });
  }

  ngOnInit() {
      this.question.label = this.question.label.replace(/_/gi,' ');
      this.form.controls[this.question.key].valueChanges.subscribe(value=> {
          this.excuteCondition(this.question.conditions, value);
      })
  }


  setValue(form, key, $event) {
    form.controls[key].setValue($event.value)
  }



}