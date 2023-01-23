import { QuestionBase } from "../interface/question-base";
import { HttpService } from "@shared/v2/services/http.service";
import { CookieService } from "@shared/v2/services/cookie.service";
export class AutoCompleteQuestion extends QuestionBase<string> {
  override type: string;
  override options: { title: string; value: string }[] = [];

  constructor(
    options: any = {},
    private http: HttpService,
    private cookie: CookieService
  ) {
    super(options);
    this.type = options["type"] || "";
    this.options = options["options"] || [];
    if (options["optionsModelConfig"]) {
      this.getOptionModel(options["optionsModelConfig"]);
    }
  }

  getOptionModel(model: any) {
    this.http.get(model.uri).subscribe((res: any) => {
      var temp: any = [];
      this.options = [];
      // added filter for dropdown for Gav-224 in equipment schedule report
      if (model.fields.filter) {
        temp = res.filter((i: any) => {
          return i[model.fields.filter] == this.cookie.get("HSPLocationId");
        });
      } else {
        temp = res;
      }

      temp.forEach((item: any) => {
        let option: any = {
          title: item[model.fields.title],
          value: item[model.fields.value],
        };

        this.options.push(option);
      });
    });
  }
}
