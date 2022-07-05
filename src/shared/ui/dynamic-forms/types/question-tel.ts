import { QuestionBase } from "../interface/question-base";

export class TelQuestion extends QuestionBase<string> {
  override type: string;

  constructor(options: any = {}) {
    super(options);
    this.type = options["type"] || "";
  }
}
