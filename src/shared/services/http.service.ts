import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";

import { Observable, of, throwError } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import { environment } from "@environments/environment";
import { MaxHealthStorage } from "./storage";

import { MessageDialogService } from "../ui/message-dialog/message-dialog.service";
import { Router } from "@angular/router";
import { CookieService } from "./cookie.service";
import { DbService } from "./db.service";

class Options {
  showErrorMessage?: boolean = false;
  showSuccessMessage?: boolean = false;
}

@Injectable({
  providedIn: "root",
})
export class HttpService {
  constructor(
    private http: HttpClient,
    private messageDialog: MessageDialogService,
    private router: Router,
    private cookieService: CookieService,
    private dbService: DbService
  ) {}

  /** GET data from the server */
  get(url: string): Observable<any> {
    let final_url;
    final_url = environment.ApiUrl + url;
    return this.http.get<any>(final_url).pipe(
      tap((data) => this.log(data)),
      catchError((err) => this.handleError(err, "url", {}))
    );
  }

  /** GET data from the server */
  getExternal(url: string): Observable<any> {
    return this.http.get<any>(url).pipe(
      tap((data) => this.log(data)),
      catchError((err) => this.handleError(err, "url", {}))
    );
  }

  /** POST: add a new data to the server */
  post(url: string, data: any, options?: Options): Observable<any> {
    let final_url;
    final_url = environment.ApiUrl + url;
    return this.http.post<any>(final_url, data).pipe(
      tap((data: any) => this.log(data, options)),
      catchError((err) => this.handleError<any>(err, "add", options))
    );
  }

  /** POST: add a new data to the server */
  patch(url: string, data: any, options?: Options): Observable<any> {
    let final_url;
    final_url = environment.ApiUrl + url;
    return this.http.patch<any>(final_url, data).pipe(
      tap((data: any) => this.log(data, options)),
      catchError((err) => this.handleError<any>(err, "add", options))
    );
  }

  /** POST: add a new data to the server */
  postExternal(url: string, data: any, options?: Options): Observable<any> {
    return this.http.post<any>(url, data).pipe(
      tap((data: any) => this.log(data, options)),
      catchError((err) => this.handleError<any>(err, "add", options))
    );
  }

  /** POST: add a new data to the server */
  put(url: string, data: any): Observable<any> {
    let final_url;
    final_url = environment.ApiUrl + url;
    return this.http.put<any>(final_url, data).pipe(
      tap((data: any) => this.log(data)),
      catchError((err) => this.handleError<any>(err, "add"))
    );
  }

  /** POST: add a new data to the server */
  upload(url: string, data: any, options?: Options): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({ Accept: "application/json" }),
      reportProgress: true,
    };
    let final_url;
    final_url = environment.ApiUrl + url;
    return this.http.post<any>(final_url, data).pipe(
      tap((data: any) => this.log(data, options)),
      catchError((err) => this.handleError<any>(err, "add", options))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   */
  private handleError<T>(
    error: HttpErrorResponse,
    operation = "operation",
    options?: Options
  ) {
    if (error.status === 401) {
      //window.location.reload();
      console.log(error);
      sessionStorage.clear();
      localStorage.clear();
      this.cookieService.deleteAll();
      this.cookieService.deleteAll("/", environment.cookieUrl, true);
      this.dbService.cachedResponses.clear();
      window.location.href = window.location.origin + "/login";
    } else {
      if (options && !options.showErrorMessage) {
      } else {
        if (error.error && error.error.message) {
          //  this.messageDialog.error(error.error.message);
        } else {
          // this.messageDialog.error("Someting happend please try again");
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
        this.__showSnackBar(data);
      }
    } else {
      // if (!options!.showErrorMessage && !options!.showSuccessMessage) {
      //   this.__showSnackBar(data);
      // }
    }
  }

  private __showSnackBar(data: any) {
    if (!data.success) {
      //  this.messageDialog.error(data.message);
    } else if (data.success && data.message) {
      // this.messageDialog.success(data.message);
    }
  }
}
