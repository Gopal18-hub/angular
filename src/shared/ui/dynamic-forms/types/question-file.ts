import { QuestionBase } from '../interface/question-base';
import { AuthService } from '../../../services/auth.service';

export class FileQuestion extends QuestionBase<string> {
  type = 'file';
  upload_path: string;

  constructor(options: any = {} , private auth: AuthService, refId?:any) {
    super(options);
    if (refId) {
      this.upload_path  = '/user/ai_models/'+this.auth.loginUser.id+'/'+refId;
    } else {
      this.upload_path = '/user/ai_models/'+this.auth.loginUser.id;
    }
  }

}