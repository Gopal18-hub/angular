import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/shared/services/auth.service';
import * as Oidc from 'oidc-client';



import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'auth-auth-callback',
  templateUrl: './auth-callback.component.html',
  styleUrls: ['./auth-callback.component.scss']
})
export class AuthCallbackComponent implements OnInit {

  constructor(private router:Router,private auth:AuthService) { }

  ngOnInit(): void {

    this.auth.completeAuthentication().then((user)=>{
      console.log(user.access_token); 
      localStorage.setItem('role',user.profile['role']); 
    }).catch((e)=>{
      console.log(e);
    }); 
    this.router.navigate(['dashboard']);
  }
}
