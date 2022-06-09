import { QuestionBase } from '../interface/question-base';

export class DropdownQuestion extends QuestionBase<string> {
  override type = 'dropdown';
  override options: {title: string, value: string}[] = [];

  constructor(options: any = {}) {
    super(options);
    this.options = options['options'] || [];
  }



}