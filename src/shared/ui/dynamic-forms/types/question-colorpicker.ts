import { QuestionBase } from '../interface/question-base';

export class ColorpickerQuestion extends QuestionBase<string> {
  type: string;

  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
  }
}