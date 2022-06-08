import { QuestionBase } from '../interface/question-base';

export class DropdownQuestion extends QuestionBase<string> {
  type = 'dropdown';
  options: {title: string, value: string}[] = [];

  constructor(options: {} = {}) {
    super(options);
    this.options = options['options'] || [];
  }



}