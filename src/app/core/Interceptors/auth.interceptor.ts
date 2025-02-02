
import { inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpInterceptorFn,
  HttpErrorResponse,
  HttpEventType
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

// Auth Interceptor
export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const authService = inject(AuthService);
  const authKey = authService.getItem('authToken') as string | null;
  const user = authService.getItem('userKey') as string | null;

  // Skip adding headers for login or signup requests
  if (req.url.includes('/login') || req.url.includes('/signup')) {
    return next(req);
  }

  // Append Authorization and User headers for other requests
  let headers = req.headers;
  if (authKey) {
    headers = headers.append('Authorization', `Bearer ${authKey}`);
  }
  if (user) {
    headers = headers.append('User', user);
  }

  const clonedReq = req.clone({ headers });

  return next(clonedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('Auth Interceptor Error:', error);
      return throwError(() => error);
    })
  );
}

// Logging Interceptor
export function loggingInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  return next(req).pipe(
    tap({
      next: (event: HttpEvent<any>) => {
        if (event.type === HttpEventType.Response) {
          console.log(`${req.url} returned a response with status ${event.status}`);
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error(`${req.url} failed with status ${error.status}`, error);
      }
    })
  );
}

// import { inject, Injectable } from '@angular/core';
// import {
//   HttpRequest,
//   HttpHandler,
//   HttpEvent,
//   HttpInterceptor,
//   HttpErrorResponse,
//   HttpHandlerFn,
//   HttpEventType,
// } from '@angular/common/http';
// import { Observable, throwError } from 'rxjs';
// import { catchError, tap } from 'rxjs/operators';
// import { AuthService } from '../services/auth.service';

// // export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
// //   const authService = inject(AuthService);
// //   const authKey = authService.getItem('authToken') as string | null;
// //   const clonedReq = authKey? req.clone(
// //     { headers: req.headers.append('Authorization', `Bearer ${authKey}`) }) : req;
// //   return next(clonedReq);
// // }
// export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
//   const authService = inject(AuthService);
//   const authKey = authService.getItem('authToken') as string | null;
//   const user = authService.getItem('userKey') as string | null;

//   // Skip adding headers for login or signup requests
//   if (req.url.includes('/login') || req.url.includes('/signup')) {
//     return next(req);
//   }

//   // Append headers for other requests
//   let headers = req.headers.append('Authorization', `Bearer ${authKey}`);
//   if (user) {
//     headers = headers.append('User', user);
//   }
//   const clonedReq = req.clone({ headers });

//   return next(clonedReq);
// }


// export function loggingInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
//   return next(req).pipe(tap((event:any) => {
//     if (event.type === HttpEventType.Response) {
//       console.log(req.url, 'returned a response with status', event.status);
//     }
//   }));
// }
