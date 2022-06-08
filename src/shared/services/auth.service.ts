import { Injectable } from '@angular/core';
import { HttpRequest } from '@angular/common/http';
import { CookieService } from './cookie.service';
import { HttpService } from './http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { environment } from '@environments/environment';
import { MaxHealthStorage } from './storage';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  cachedRequests: Array<HttpRequest<any>> = [];

  loginUser: any;

  userProfileUpdated = new Subject<any>();


  constructor(private route: ActivatedRoute, private router: Router, public cookieService: CookieService, public http: HttpService) { }


  public isAuthenticated(): boolean {
    const token = this.getToken();
    // Check whether the token is expired and return
    // true or false
    return token?true: false;
  }

  public updateUserDetails(data: any) {
    if (!this.loginUser.mobile_number) {
      this.loginUser.mobile_number = data.mobile_number;
    }
  }

  public getToken() {
    return this.cookieService.get('test');
  }


  public setToken(token: string): void {
    this.cookieService.set('test', token, { path: '/', domain: environment.cookieUrl, secure: true });
  }

  public logout(): void {
    this.cookieService.delete('test');
    this.cookieService.deleteAll();
    this.cookieService.deleteAll('/', environment.cookieUrl, true);

  }

  public collectFailedRequest(request: any): void {
    this.cachedRequests.push(request);
  }
  public retryFailedRequests(): void {
    // retry the requests. this method can
    // be called after the token is refreshed
  }

  public async me() {
    if (!this.isAuthenticated()) {
      return;
    }
    this.loginUser = await this.http.get('me').toPromise();
    this.userProfileUpdated.next(this.loginUser);
    return this.loginUser;
  }

  public redirectUrl() {
    if (this.route.snapshot.queryParamMap.get('redirect')) {
      //this.router.navigateByUrl(this.route.snapshot.queryParamMap.get('redirect'));
    } else {
      this.router.navigate(['dashboard']);
    }
  }

}