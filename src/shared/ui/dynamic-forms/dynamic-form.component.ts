import { Component, Input, OnInit, Output,EventEmitter }  from '@angular/core';
import { FormGroup }                 from '@angular/forms';
import { QuestionBase }              from './interface/question-base';
import { QuestionControlService }    from './service/question-control.service';
 
@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
})
export class DynamicFormComponent implements OnInit {
  @Output() cancelEvent= new EventEmitter<any>();
  @Output() submitEvent= new EventEmitter<any>();
  @Input() questions: QuestionBase<any>[] = [];
  @Input() withQuestions: boolean;
  @Input() refId: any;

  @Input() buttonLabel: any;
  @Input() patchValues: any;
  @Input() replaceVlaues: any;

  form: FormGroup;
  payLoad = '';

  defaultValues: any = {};
 
  constructor(private qcs: QuestionControlService) {  }
 
  ngOnInit() {
    for (const  [key, value] of Object.entries(this.questions)) {
      if(value['defaultValue']) this.defaultValues[key] = value['defaultValue'];
      if(!value['defaultValue'] && value['replaceValue'] && this.replaceVlaues) this.defaultValues[key] = this.replacer(value.replaceValue, this.replaceVlaues);
    }
    if (this.patchValues) {
      for (const [key, value] of Object.entries(this.patchValues)) {
        if (this.questions[key]) {
          this.questions[key]['value'] = value;
        }
      }
    }
    this.questions = this.qcs.processJson(this.questions, this.refId, this.replaceVlaues);
    console.log(this.questions);
    this.form = this.qcs.toFormGroup(this.questions); 
    if(this.patchValues && this.form) {
      this.form.patchValue(this.patchValues);
    }   
  }

  replacer(template, obj) {
    var keys = Object.keys(obj);
    var func = Function(...keys, "return `" + template + "`;");
  
    return func(...keys.map(k => obj[k]));
  }
 
  onSubmit() {
    console.log(this.form);
    //(!this.validateForm()) return false;
    this.payLoad = JSON.stringify(this.form.getRawValue());
    if(!this.withQuestions) this.submitEvent.emit(this.payLoad)
    else this.submitEvent.emit({payLoad:this.payLoad, questions: this.questions})
  }

  reset() {
    console.log(this.defaultValues);
    this.form.reset();
    if(this.defaultValues && this.form) {
      this.form.patchValue(this.defaultValues);
    } 
    this.questions.forEach((question)=>{
        if (question.type == 'range') {
            question.value = this.defaultValues[question.key];
        }
    })
  }

  validateForm(){
    if(!this.form.valid){
      return false;
    } else {
      return true;
    }
  }

  onCancel(){
      if(!this.withQuestions) this.cancelEvent.emit(true);
      else{
        this.submitEvent.emit({payLoad:this.form.value, questions: this.questions})
      }
  }



}