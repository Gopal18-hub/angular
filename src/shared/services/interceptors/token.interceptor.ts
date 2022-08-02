import { Injectable } from "@angular/core";
import { IHttpCacheResponse } from "../../constants/Schema";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse,
  HttpHeaders,
} from "@angular/common/http";
import { AuthService } from "../auth.service";
import { ApiHeaders } from "../../constants/ApiHeaders";
import { DbService } from "../db.service";
import { mergeMap, tap, catchError } from "rxjs/operators";
import { Observable, of, throwError, from } from "rxjs";

const AllowInDB = [
  "MaxPermission/getpermissionmatrixrolewise",
  "lookup/getlocality",
];

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(public auth: AuthService, private db: DbService) {}

  // Create observable to get the data from the embedded database
  private getCachedResponse(url: string): Observable<IHttpCacheResponse> {
    const cachedResponsePromise: Promise<IHttpCacheResponse> =
      this.db.getCacheResponse(url);
    return from(cachedResponsePromise);
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    request = request.clone({
      //setHeaders: ApiHeaders.getHeaders(request.url)
      setHeaders: {
        "Content-Type": "application/json",
      },
    });

    if (request.url.endsWith("authenticate")) {
      request = request.clone({
        setHeaders: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
    }
    if (
      request.url.includes("Logout") ||
      request.url.includes("MaxPermission")
    ) {
      if (!request.headers.has("Authorization")) {
        request = request.clone({
          setHeaders: {
            Authorization: `bearer ${this.auth.getToken()}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });
      }
    }
    if (
      request.url.includes("patientunmerging") ||
      request.url.includes("patientmerging") ||
      request.url.includes("approvedrejectdeletehotlisting") ||
      // request.url.includes("patienthotlisting") ||
      request.url.includes("modifyopdpatient")
    ) {
      request = request.clone({
        setHeaders: {
          "Content-Type": "application/json",
        },
        responseType: "text",
      });
    }
    // Used to be accessible from the whole chain of observers
    let sharedCacheResponse: IHttpCacheResponse | null = null;

    console.log(request);

    return this.getCachedResponse(request.url).pipe(
      // Modify request headers if there is already something in cache
      mergeMap((cachedResponse: IHttpCacheResponse) => {
        // Keep reference so we do not have to fetch it again later
        sharedCacheResponse = cachedResponse;

        const exist = AllowInDB.find((uri) => {
          return request.url.match(uri);
        });

        // If there is a response in cache, put the date in header so the api won't send the data again
        if (
          cachedResponse &&
          cachedResponse.body &&
          request.method == "GET" &&
          exist
        ) {
          // const headers = new HttpHeaders({
          //   "if-last-modified-since": cachedResponse.lastModified,
          // });

          // // Update headers
          // request = request.clone({ headers });
          //this.processNext(request, next, sharedCacheResponse);
          const response: HttpResponse<any> = new HttpResponse({
            status: 200,
            body: sharedCacheResponse?.body,
          });
          return of(response);
        }
        return this.processNext(request, next, sharedCacheResponse);
      })
    );
  }

  processNext(
    request: HttpRequest<any>,
    next: HttpHandler,
    sharedCacheResponse: IHttpCacheResponse | null
  ) {
    return next.handle(request).pipe(
      // Save the response in cache
      tap((event) => {
        if (event instanceof HttpResponse && request.method == "GET") {
          const body = event.body;

          // Save everything in cache
          this.db.putCacheResponse({
            url: request.url,
            body: body,
            lastModified: event.headers.get("last-modified"),
          });
        }
      }),
      // If any error occurs and a response in cache is available, return it.
      catchError((err, caught) => {
        // Require better logic but for the example, on error, return value cached
        if (err instanceof HttpErrorResponse && request.method == "GET") {
          const response: HttpResponse<any> = new HttpResponse({
            status: 200,
            body: sharedCacheResponse?.body,
          });
          return of(response);
        }
        return throwError(err);
      })
    );
  }
}
