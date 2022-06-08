import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'auth-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm = {
    title: "",
    type: "object",
    properties : {
      
    }
  }

  constructor() { }

  ngOnInit(): void {
  }

}
