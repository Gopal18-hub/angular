import { Component, OnInit } from '@angular/core';
import { QuestionControlService } from '../../../shared/ui/dynamic-forms/service/question-control.service';
import { FormGroup }                 from '@angular/forms';

@Component({
  selector: 'auth-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginFormData = {
    title: "",
    type: "object",
    properties : {
      username : {
          type: 'string',
          title: 'Username',
          required: true,
      },
      password: {
          type: 'password',
          title: 'Password',
          required: true
      },
      location: {
        type: 'autocomplete',
        title: 'Location',
        required: true
      },
      station: {
        type: 'autocomplete',
        title: 'Station',
        required: true
      }
    }
  }

  loginForm!: FormGroup;

  questions: any;

  constructor(private formService: QuestionControlService) { }

  ngOnInit(): void {
      let formResult: any = this.formService.createForm(this.loginFormData.properties, {});
      this.loginForm = formResult.form;
      this.questions  = formResult.questions;
  }

  loginSubmit() {
      if(this.loginForm.valid) {

      } else {
        this.formService.validateAllFormFields(this.loginForm);
      }
  }

}
