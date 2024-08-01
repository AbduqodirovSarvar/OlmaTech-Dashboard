import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HelperService } from './helper.service';
import { Router } from '@angular/router';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root'
})
export class HttpConfigInterceptorService implements HttpInterceptor {

  constructor(private helperService: HelperService, private errorService: ErrorService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authReq = req.clone({
      setHeaders: {
        'Accept': '*/*',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.helperService.getAccessToken()}`
      }
    });

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        return this.errorService.handleError(error);
      })
    );
  }
}
