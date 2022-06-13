import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { AuthService } from '../auth.service';
import { Observable } from 'rxjs';
import { ApiHeaders } from '../../constants/ApiHeaders';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(public auth: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
   
    request = request.clone({
      setHeaders: ApiHeaders.getHeaders(request.url)
    });

    if(request.url.endsWith('authenticate'))
    {
      request = request.clone({
        setHeaders: {
          'Content-Type': 'application/json',
        },
        withCredentials:true
      });
    }
    if(request.url.includes('Logout'))
    {
      if(!request.headers.has('Authorization'))
      {  
        if(this.auth.isLoggedIn())     
        {
          request = request.clone({
            setHeaders: {
              'Authorization': `bearer ${this.auth.getToken()}`,
              'Content-Type': 'application/json'
            },
            withCredentials:true
          });
        }       
      }
    }
    return next.handle(request);
  }
}