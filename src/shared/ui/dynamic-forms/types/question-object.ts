import { QuestionBase } from '../interface/question-base';

export class ObjectQuestion extends QuestionBase<string> {
  type = 'object';

  constructor(options: {} = {}) {
    super(options);
  }

}