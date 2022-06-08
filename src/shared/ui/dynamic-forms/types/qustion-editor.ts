import { QuestionBase } from '../interface/question-base';

export class EditorQuestion extends QuestionBase<string> {
  type = 'editor';

  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
  }
}