import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { MaxHealthStorage } from './storage';

import { MaxHealthSnackBarService } from '../ui/snack-bar';

class Options {
  showErrorMessage?: boolean = false;
  showSuccessMessage?: boolean = false;
}

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient, private snackbar: MaxHealthSnackBarService) { }

  /** GET data from the server */
  get(url: string): Observable<any> {
    let final_url;
    final_url = environment.ApiUrl + url;
    return this.http.get<any>(final_url)
      .pipe(
        tap(data => this.log(data)),
        catchError(err => this.handleError(err, 'url', {}))
      );
  }

  /** GET data from the server */
  getExternal(url: string): Observable<any> {
    return this.http.get<any>(url)
      .pipe(
        tap(data => this.log(data)),
        catchError(err => this.handleError(err, 'url', {}))
      );
  }

  /** POST: add a new data to the server */
  post(url: string, data: any, options?: Options): Observable<any> {
    let final_url;
    final_url = environment.ApiUrl + url;
    return this.http.post<any>(final_url, data).pipe(
      tap((data: any) => this.log(data, options)),
      catchError(err => this.handleError<any>(err, 'add', options))
    );
  }

  /** POST: add a new data to the server */
  patch(url: string, data: any, options?: Options): Observable<any> {
    let final_url;
    final_url = environment.ApiUrl + url;
    return this.http.patch<any>(final_url, data).pipe(
      tap((data: any) => this.log(data, options)),
      catchError(err => this.handleError<any>(err, 'add', options))
    );
  }


  /** POST: add a new data to the server */
  postExternal(url: string, data: any, options?: Options): Observable<any> {
    return this.http.post<any>(url, data).pipe(
      tap((data: any) => this.log(data, options)),
      catchError(err => this.handleError<any>(err, 'add', options))
    );
  }


  /** POST: add a new data to the server */
  put(url: string, data: any): Observable<any> {
    let final_url;
    final_url = environment.ApiUrl + url;
    return this.http.put<any>(final_url, data).pipe(
      tap((data: any) => this.log(data)),
      catchError(err => this.handleError<any>(err, 'add'))
    );
  }

  /** POST: add a new data to the server */
  upload(url: string, data: any, options?: Options): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({ 'Accept': 'application/json' }),
      reportProgress: true,
    };
    let final_url;
    final_url = environment.ApiUrl + url;
    return this.http.post<any>(final_url, data).pipe(
      tap((data: any) => this.log(data, options)),
      catchError(err => this.handleError<any>(err, 'add', options))
    );
  }



  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   */
  private handleError<T>(error: HttpErrorResponse, operation = 'operation', options?: Options) {
    if (error.status === 401) {
      MaxHealthStorage.set('u', '');
      window.location.reload();
    } else {
      if (options && !options.showErrorMessage) {

      } else {
        if (error.error && error.error.message) {
          this.snackbar.open(error.error.message, 'error');
        } else {
          this.snackbar.open('Someting happend please try again', 'error');
        }
      }

    }
    // return an observable with a user-facing error message
    return throwError(error);
  }



  /** Log a Service message with the SnackbarService */
  private log(data: any, options?: Options) {
    if (options) {
      if (!options.showErrorMessage && !options.showSuccessMessage) {

      } else {
        this.__sowSnackBar(data);
      }
    } else {
      //this.__sowSnackBar(data);
    }

  }

  private __sowSnackBar(data: any) {
    if (!data.success) {
      this.snackbar.open(data.message, 'error');
    }
    else if (data.success && data.message) {
      this.snackbar.open(data.message, 'success')
    }
  }

}
