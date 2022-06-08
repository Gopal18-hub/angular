import { QuestionBase } from '../interface/question-base';

export class ArrayQuestion extends QuestionBase<string> {
  type = 'array';

  constructor(options: {} = {}) {
    super(options);
  }

}