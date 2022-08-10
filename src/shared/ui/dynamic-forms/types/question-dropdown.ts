import { QuestionBase } from "../interface/question-base";
import { HttpService } from "@shared/services/http.service";

export class DropdownQuestion extends QuestionBase<string> {
  override type = "dropdown";
  override options: { title: string; value: string }[] = [];

  constructor(options: any = {}, private http: HttpService) {
    super(options);
    this.options = options["options"] || [];
    if (options["optionsModelConfig"]) {
      this.getOptionModel(options["optionsModelConfig"]);
    }
  }

  getOptionModel(model: any) {
    this.http.get(model.uri).subscribe((res: any) => {
      this.options = [];
      res.forEach((item: any) => {
        let option: any = {
          title: item[model.fields.title],
          value: item[model.fields.value],
        };
        this.options.push(option);
      });
    });
  }
}
