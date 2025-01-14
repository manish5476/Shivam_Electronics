import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { AppMessageService } from './message.service';
import { response } from 'express';
export interface LoginResponse {
  token: string;
  refresh_token?: string;
  data: {
    user: any;
  };
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenKey = 'authToken';
  private refreshTokenKey = 'refreshToken';
  private userKey = 'user';

  private userSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(this.getStoredToken()?.token || null);
  public user: Observable<string | null> = this.userSubject.asObservable();
  private userDataSubject: BehaviorSubject<any> = new BehaviorSubject<any>(this.getStoredToken()?.user || null);

  constructor(
    private messageService:AppMessageService,
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  public setItem(key: string, value: any): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }

  public getItem<T>(key: string): T | null {
    if (isPlatformBrowser(this.platformId)) {
      try {
        return JSON.parse(localStorage.getItem(key) || 'null') as T;
      } catch {
        console.error(`Error parsing key: ${key}`);
        this.removeItem(key);
        return null;
      }
    }
    return null;
  }

  private removeItem(key: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(key);
    }
  }

  private getStoredToken(): { token: string | null; user: any | null } {
    return {
      token: this.getItem<string>(this.tokenKey),
      user: this.getItem<any>(this.userKey),
    };
  }

  private handleTokens(response: LoginResponse): void {
    if (isPlatformBrowser(this.platformId)) {
      this.setItem(this.tokenKey, response.token);
      if (response.refresh_token) {
        this.setItem(this.refreshTokenKey, response.refresh_token);
      }
      this.setItem(this.userKey, response.data.user);
      this.userSubject.next(response.token);
      this.userDataSubject.next(response.data.user);
    }
  }

  login(data: any): Observable<LoginResponse | null> {
    return this.http
      .post<LoginResponse>(`http://localhost:4000/api/v1/users/login`, data)
      .pipe(
        tap((response) => this.handleTokens(response)) ,
        catchError((error) => {
          this.messageService.handleResponse(error, 'Request Successful', 'The data was fetched correctly.');
          console.error('Login error:', error);
          return of(null);
        })
      );
  }

  signUp(data: any): Observable<LoginResponse | null> {
    return this.http
      .post<LoginResponse>(`http://localhost:4000/api/v1/users/signup`, data)
      .pipe(
        tap((response) => this.handleTokens(response)),
        catchError((error) => {
          console.error('Signup error:', error);
          return of(null);
        })    
      );
  }

  isAuthenticated(): boolean {
    const token = this.userSubject.value;
    return !!token && !this.isTokenExpired(token);
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }

  getToken(): string | null {
    return this.userSubject.value;
  }

  getUser(): any {
    return this.userDataSubject.value;
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.removeItem(this.tokenKey);
      this.removeItem(this.refreshTokenKey);
      this.removeItem(this.userKey);
    }
    this.userSubject.next(null);
    this.userDataSubject.next(null);
    this.router.navigate(['/login']);
  }

  refreshToken(): Observable<any> {
    const refreshToken = this.getItem<string>(this.refreshTokenKey);
    if (!refreshToken) {
      this.logout();
      return of(null);
    }
    return this.http
      .post<any>('http://localhost:4000/api/v1/users/refreshToken', { refresh_token: refreshToken })
      .pipe(
        tap((response) => this.handleTokens(response)),
        catchError((error) => {
          console.error('Refresh token error:', error);
          this.logout();
          return of(null);
        })
      );
  }
}

// import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
// import { isPlatformBrowser } from '@angular/common';
// import { HttpClient } from '@angular/common/http';
// import { Router } from '@angular/router';
// import { BehaviorSubject, Observable, of } from 'rxjs';
// import { tap, catchError } from 'rxjs/operators';

// @Injectable({
//   providedIn: 'root',
// })
// export class AuthService {
//   private tokenKey = 'authToken';
//   private usertoken='user'
//   private refreshTokenKey = 'refreshToken';
//   // private userSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(this.getStoredToken()); // Initialize with stored token
//   // public user: Observable<string | null> = this.userSubject.asObservable();
//   // private userSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(this.getStoredToken());

//   private userSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(this.getStoredToken().token);
//   public user: Observable<string | null> = this.userSubject.asObservable();
//   private userDataSubject: BehaviorSubject<any> = new BehaviorSubject<any>(this.getStoredToken().user);

//   constructor(
//     private http: HttpClient,
//     private router: Router,
//     @Inject(PLATFORM_ID) private platformId: Object
//   ) { }

//   private getStoredToken(): { token: string | null, user: any | null } {
//     if (isPlatformBrowser(this.platformId)) {
//       try {
//         const storedToken = localStorage.getItem(this.tokenKey);
//         const storedUser = localStorage.getItem(this.usertoken);
  
//         return {
//           token: storedToken ? JSON.parse(storedToken) : null,
//           user: storedUser ? JSON.parse(storedUser) : null,
//         };
//       } catch (error) {
//         console.error('Error parsing stored token or user data:', error);
//         localStorage.removeItem(this.tokenKey);
//         localStorage.removeItem(this.usertoken);
//         return { token: null, user: null };
//       }
//     }
//     return { token: null, user: null };
//   }
  
//   // private getStoredToken(): string | null {
//   //   if (isPlatformBrowser(this.platformId)) {
//   //     try {
//   //       const storedToken = localStorage.getItem(this.tokenKey);
//   //       return storedToken ? JSON.parse(storedToken) : null;
//   //     } catch (error) {
//   //       console.error('Error parsing stored token:', error);
//   //       localStorage.removeItem(this.tokenKey);
//   //       return null;
//   //     }
//   //   }
//   //   return null;
//   // }

//   login(data: any): Observable<any> {
//     return this.http
//       .post<any>(`http://localhost:4000/api/v1/users/login`, data)
//       .pipe(
//         tap((response) => this.handleTokens(response)),
//         catchError((error) => {
//           console.error('Login error:', error);
//           return of(null);
//         })
//       );
//   }

//   signUp(data: any): Observable<any> {
//     return this.http
//       .post<any>('http://localhost:4000/api/v1/users/signup', data)
//       .pipe(
//         tap((response) => this.handleTokens(response)),
//         catchError((error) => {
//           console.error('Signup error:', error);
//           return of(null);
//         })
//       );
//   }

//   // refreshToken(): Observable<any> {
//   //   const refreshToken = this.getRefreshToken();
//   //   if (!refreshToken) {
//   //     this.logout();
//   //     return of(null);
//   //   }
//   //   return this.http
//   //     .post<any>('your-refresh-token-api-endpoint', { refresh_token: refreshToken })
//   //     .pipe(
//   //       tap((response) => this.handleTokens(response)),
//   //       catchError((error) => {
//   //         this.logout();
//   //         console.error("Refresh token error:", error); // Log the error
//   //         return of(null);
//   //       })
//   //     );
//   // }

//   private handleTokens(response: any): void {
//     if (isPlatformBrowser(this.platformId)) {
//       if (response?.token) {
//         localStorage.setItem(this.tokenKey, JSON.stringify(response.token));
//         localStorage.setItem(this.usertoken, JSON.stringify(response.data.user));
//         this.userSubject.next(response.token);
//       }
//       if (response?.refresh_token) {
//         localStorage.setItem(this.refreshTokenKey, JSON.stringify(response.refresh_token));
//       }
//     }
//   }
  
//   // private handleTokens(response: any): void {
//   //   if (isPlatformBrowser(this.platformId)) {
//   //     if (response?.token) {
//   //       localStorage.setItem(this.tokenKey, JSON.stringify(response.token));
//   //       localStorage.setItem(this.usertoken,JSON.stringify(response.data.user))
//   //       this.userSubject.next(response.token);
//   //     }
//   //     if (response?.refresh_token) {
//   //       localStorage.setItem(this.refreshTokenKey, JSON.stringify(response.refresh_token));
//   //     }
//   //   }
//   // }

//   isAuthenticated(): boolean {
//     return !!this.userSubject.value; // Use the subject's value
//   }

//   getToken(): string | null {
//     return this.userSubject.value; // Get token from the subject
//   }
//   getUser(): any {
//     return this.userDataSubject.value; // Get user data from the user data subject
//   }

//   getRefreshToken(): string | null {
//     if (isPlatformBrowser(this.platformId)) {
//       try {
//         return JSON.parse(localStorage.getItem(this.refreshTokenKey) || 'null');
//       } catch (error) {
//         console.error("Error parsing refresh token:", error);
//         localStorage.removeItem(this.refreshTokenKey);
//         return null;
//       }
//     }
//     return null;
//   }

//   logout(): void {
//     if (isPlatformBrowser(this.platformId)) {
//       localStorage.removeItem(this.tokenKey);
//       localStorage.removeItem(this.refreshTokenKey);
//     }
//     this.userSubject.next(null);
//     this.router.navigate(['/login']);
//   }
// }
// // import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
// // import { isPlatformBrowser } from '@angular/common';
// // import { HttpClient } from '@angular/common/http';
// // import { Router } from '@angular/router';
// // import { BehaviorSubject, Observable, of } from 'rxjs';
// // import { catchError, tap, switchMap, filter, take, finalize } from 'rxjs/operators';
// // @Injectable({
// //   providedIn: 'root',
// // })
// // export class AuthService {
// //   private tokenKey = 'authToken';
// //   private refreshTokenKey = 'refreshToken'; // Key for refresh token
// //   private userSubject: BehaviorSubject<any | null>;
// //   public user: Observable<any | null>;

// //   constructor(
// //     private http: HttpClient,
// //     private router: Router,
// //     @Inject(PLATFORM_ID) private platformId: Object
// //   ) {
// //     let storedUser = null;
// //     if (isPlatformBrowser(this.platformId)) {
// //       try {
// //         const storedUserString = localStorage.getItem(this.tokenKey);
// //         storedUser = storedUserString ? JSON.parse(storedUserString) : null;
// //       } catch (error) {
// //         console.error('Error parsing stored user:', error);
// //         localStorage.removeItem(this.tokenKey);
// //       }
// //     }
// //     this.userSubject = new BehaviorSubject<any | null>(storedUser);
// //     this.user = this.userSubject.asObservable();
// //   }

// //   login(data: any): Observable<any> {
// //     return this.http
// //       .post<any>('http://localhost:4000/api/v1/users/login', data)
// //       .pipe(
// //         tap((response) => {
// //           this.setTokens(response); // Use setTokens to store both tokens
// //           this.userSubject.next(response.token);
// //         }),
// //         catchError((error) => {
// //           console.error('Login error:', error);
// //           return of(null);
// //         })
// //       );
// //   }

// //   signUp(data: any): Observable<any> {
// //     return this.http
// //       .post<any>('http://localhost:4000/api/v1/users/signup', data)
// //       .pipe(
// //         tap((response) => {
// //           this.setTokens(response); // Use setTokens to store both tokens
// //           this.userSubject.next(response.token);
// //         }),
// //         catchError((error) => {
// //           console.error('Signup error:', error);
// //           return of(null);
// //         })
// //       );
// //   }

// //   refreshToken(): Observable<any> {
// //     const refreshToken = this.getRefreshToken();
// //     if (!refreshToken) {
// //       this.logout();
// //       return of(null); // Or throwError if you prefer
// //     }

// //     return this.http.post<any>('http://localhost:4000/api/v1/users/refresh', { refresh_token: refreshToken }).pipe(
// //       tap((response) => {
// //         this.setTokens(response);
// //       }),
// //       catchError((error) => {
// //         this.logout(); // Important: Logout on refresh token failure
// //         return of(null);
// //       })
// //     );
// //   }

// //   private setTokens(response: any) {
// //     if (isPlatformBrowser(this.platformId) && response && response.access_token && response.refresh_token) {
// //         localStorage.setItem(this.tokenKey, JSON.stringify(response.access_token));
// //         localStorage.setItem(this.refreshTokenKey, JSON.stringify(response.refresh_token));
// //         this.userSubject.next(response.access_token);
// //       }
// //   }

// //   isAuthenticated(): boolean {
// //     if (isPlatformBrowser(this.platformId)) {
// //       return !!localStorage.getItem(this.tokenKey);
// //     }
// //     return false;
// //   }

// //   getToken(): string | null {
// //     if (isPlatformBrowser(this.platformId)) {
// //       return localStorage.getItem(this.tokenKey);
// //     }
// //     return null;
// //   }

// //   getRefreshToken(): string | null {
// //     if (isPlatformBrowser(this.platformId)) {
// //         return localStorage.getItem(this.refreshTokenKey);
// //     }
// //     return null;
// // }

// //   logout(): void {
// //     if (isPlatformBrowser(this.platformId)) {
// //       localStorage.removeItem(this.tokenKey);
// //       localStorage.removeItem(this.refreshTokenKey);
// //     }
// //     this.userSubject.next(null);
// //     this.router.navigate(['/login']);
// //   }
// // }
// // import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
// // import { isPlatformBrowser } from '@angular/common';
// // import { HttpClient, HttpHeaders } from '@angular/common/http';
// // import { Router } from '@angular/router';
// // import { BehaviorSubject, Observable, of } from 'rxjs';
// // import { map, catchError } from 'rxjs/operators';
// // @Injectable({
// //   providedIn: 'root',
// // })
// // export class AuthService {
// //   // getAuthHeaders(): any {
// //   //   throw new Error('Method not implemented.');
// //   // }
// //   private tokenKey = 'authToken';
// //   private userSubject: BehaviorSubject<any | null>; // Explicitly type as nullable
// //   public user: Observable<any | null>;

// //   constructor(
// //     private http: HttpClient,
// //     private router: Router,
// //     @Inject(PLATFORM_ID) private platformId: Object // Inject platform ID
// //   ) {
// //     let storedUser = null;

// //     if (isPlatformBrowser(this.platformId)) {
// //       // Check if running in browser
// //       try {
// //         const storedUserString = localStorage.getItem(this.tokenKey);
// //         storedUser = storedUserString ? JSON.parse(storedUserString) : null;
// //       } catch (error) {
// //         console.error('Error parsing stored user:', error);
// //         localStorage.removeItem(this.tokenKey); // Clear potentially corrupted data
// //       }
// //     }

// //     this.userSubject = new BehaviorSubject<any | null>(storedUser);
// //     this.user = this.userSubject.asObservable();
// //   }
// //   // http://localhost:4000/api/v1/users/login
// //   // https://4000-idx-shivamelectronicsbackend-1736329366153.cluster-e3wv6awer5h7kvayyfoein2u4a.cloudworkstations.dev/api/v1/users/login
// //   login(data: any): Observable<any> {
// //     return this.http
// //       .post<any>('http://localhost:4000/api/v1/users/login', data)
// //       .pipe(
// //         map((response) => {
// //           if (isPlatformBrowser(this.platformId) && response.token) {
// //             localStorage.setItem(this.tokenKey, JSON.stringify(response.token));
// //             this.userSubject.next(response.token);
// //           }
// //           return response;
// //         }),
// //         catchError((error) => {
// //           console.error('Login error:', error);
// //           return of(null); // Return null in case of error to avoid breaking the observable chain
// //         })
// //       );
// //   }

// //   signUp(data: any): Observable<any> {
// //     return this.http
// //       .post<any>('http://localhost:4000/api/v1/users/signup', data)
// //       .pipe(
// //         map((response) => {
// //           if (isPlatformBrowser(this.platformId) && response.token) {
// //             localStorage.setItem(this.tokenKey, JSON.stringify(response.token));
// //             this.userSubject.next(response.token);
// //           }
// //           return response;
// //         }),
// //         catchError((error) => {
// //           console.error('Signup error:', error);
// //           return of(null);
// //         })
// //       );
// //   }

// //   isAuthenticated(): boolean {
// //     if (isPlatformBrowser(this.platformId)) {
// //       return !!localStorage.getItem(this.tokenKey);
// //     }
// //     return false; // Return false if not in browser
// //   }

// //   getToken(): string | null {
// //     if (isPlatformBrowser(this.platformId)) {
// //       return localStorage.getItem(this.tokenKey);
// //     }
// //     return null;
// //   }

// //   logout(): void {
// //     if (isPlatformBrowser(this.platformId)) {
// //       localStorage.removeItem(this.tokenKey);
// //     }
// //     this.userSubject.next(null);
// //     this.router.navigate(['/login']);
// //   }

// //   getAuthHeaders(): HttpHeaders {
// //     const token = this.getToken();
// //     return new HttpHeaders({
// //       Authorization: token ? `Bearer ${token}` : '',
// //     });
// //   }
// // }
// /*
// import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
// import { isPlatformBrowser } from '@angular/common';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Router } from '@angular/router';
// import { BehaviorSubject, Observable, of } from 'rxjs';
// import { map, catchError } from 'rxjs/operators';
// import { JwtPayload, jwtDecode } from 'jwt-decode'; // Import jwt-decode

// interface TokenPayload extends JwtPayload { // Extend JwtPayload for custom claims
//   userId?: number;
//   email?: string;
//   roles?: string[];
// }

// @Injectable({
//   providedIn: 'root',
// })
// export class AuthService {
//   // getAuthHeaders(): any {
//   //   throw new Error('Method not implemented.');
//   // }
//   private tokenKey = 'authToken';
//   private userSubject: BehaviorSubject<any | null>; // Explicitly type as nullable
//   public user: Observable<any | null>;

//   constructor(
//     private http: HttpClient,
//     private router: Router,
//     @Inject(PLATFORM_ID) private platformId: Object // Inject platform ID
//   ) {
//     let storedUser = null;

//     if (isPlatformBrowser(this.platformId)) {
//       // Check if running in browser
//       try {
//         const storedUserString = localStorage.getItem(this.tokenKey);
//         storedUser = storedUserString ? JSON.parse(storedUserString) : null;
//       } catch (error) {
//         console.error('Error parsing stored user:', error);
//         localStorage.removeItem(this.tokenKey); // Clear potentially corrupted data
//       }
//     }

//     this.userSubject = new BehaviorSubject<any | null>(storedUser);
//     this.user = this.userSubject.asObservable();
//   }
//   // http://localhost:4000/api/v1/users/login
//   // https://4000-idx-shivamelectronicsbackend-1736329366153.cluster-e3wv6awer5h7kvayyfoein2u4a.cloudworkstations.dev/api/v1/users/login
//   login(data: any): Observable<any> {
//     return this.http
//       .post<any>(' http://localhost:4000/api/v1/users/login', data)
//       .pipe(
//         map((response) => {
//           if (isPlatformBrowser(this.platformId) && response.token) {
//             localStorage.setItem(this.tokenKey, JSON.stringify(response.token));
//             this.userSubject.next(response.token);
//           }
//           return response;
//         }),
//         catchError((error) => {
//           console.error('Login error:', error);
//           return of(null); // Return null in case of error to avoid breaking the observable chain
//         })
//       );
//   }

//   signUp(data: any): Observable<any> {
//     return this.http
//       .post<any>(' http://localhost:4000/api/v1/users/signup', data)
//       .pipe(
//         map((response) => {
//           if (isPlatformBrowser(this.platformId) && response.token) {
//             localStorage.setItem(this.tokenKey, JSON.stringify(response.token));
//             this.userSubject.next(response.token);
//           }
//           return response;
//         }),
//         catchError((error) => {
//           console.error('Signup error:', error);
//           return of(null);
//         })
//       );
//   }

//   isAuthenticated(): boolean {
//     if (isPlatformBrowser(this.platformId)) {
//       return !!localStorage.getItem(this.tokenKey);
//     }
//     return false; // Return false if not in browser
//   }

//   getToken(): string | null {
//     if (isPlatformBrowser(this.platformId)) {
//       return localStorage.getItem(this.tokenKey);
//     }
//     return null;
//   }

//   logout(): void {
//     if (isPlatformBrowser(this.platformId)) {
//       localStorage.removeItem(this.tokenKey);
//     }
//     this.userSubject.next(null);
//     this.router.navigate(['/login']);
//   }

//   getAuthHeaders(): HttpHeaders {
//     const token = this.getToken();
//     return new HttpHeaders({
//       Authorization: token ? `Bearer ${token}` : '',
//     });
//   }
// // <<<<<<< main
// // }*/
// // =======
// // }
// // /*
// // import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
// // import { isPlatformBrowser } from '@angular/common';
// // import { HttpClient, HttpHeaders } from '@angular/common/http';
// // import { Router } from '@angular/router';
// // import { BehaviorSubject, Observable, of } from 'rxjs';
// // import { map, catchError } from 'rxjs/operators';
// // import { JwtPayload, jwtDecode } from 'jwt-decode'; // Import jwt-decode

// // interface TokenPayload extends JwtPayload { // Extend JwtPayload for custom claims
// //   userId?: number;
// //   email?: string;
// //   roles?: string[];
// // }

// // @Injectable({
// //   providedIn: 'root',
// // })
// // export class AuthService {
// //   private tokenKey = 'authToken';
// //   private userSubject: BehaviorSubject<any | null>; // Explicitly type as nullable
// //   public user: Observable<any | null>;

// //   constructor(
// //     private http: HttpClient,
// //     private router: Router,
// //     @Inject(PLATFORM_ID) private platformId: Object // Inject platform ID
// //   ) {
// //     let storedUser = null;
// //     if (isPlatformBrowser(this.platformId)) {
// //       // Check if running in browser
// //       try {
// //         const storedUserString = localStorage.getItem(this.tokenKey);
// //         storedUser = storedUserString ? JSON.parse(storedUserString) : null;
// //       } catch (error) {
// //         console.error('Error parsing stored user:', error);
// //         localStorage.removeItem(this.tokenKey); // Clear potentially corrupted data
// //       }
// //     }

// //     this.userSubject = new BehaviorSubject<any | null>(storedUser);
// //     this.user = this.userSubject.asObservable();
// //   }
// //   // http://localhost:4000/api/v1/users/login
// //   // https://4000-idx-shivamelectronicsbackend-1736329366153.cluster-e3wv6awer5h7kvayyfoein2u4a.cloudworkstations.dev/api/v1/users/login
// //   login(data: any): Observable<any> {
// //     return this.http
// //       .post<any>(' http://localhost:4000/api/v1/users/login', data)
// //       .pipe(
// //         map((response) => {
// //           if (isPlatformBrowser(this.platformId) && response.token) {
// //             localStorage.setItem(this.tokenKey, JSON.stringify(response.token));
// //             this.userSubject.next(response.token);
// //           }
// //           return response;
// //         }),
// //         catchError((error) => {
// //           console.error('Login error:', error);
// //           return of(null); // Return null in case of error to avoid breaking the observable chain
// //         })
// //       );
// //   }

// //   signUp(data: any): Observable<any> {
// //     return this.http
// //       .post<any>(' http://localhost:4000/api/v1/users/signup', data)
// //       .pipe(
// //         map((response) => {
// //           if (isPlatformBrowser(this.platformId) && response.token) {
// //             localStorage.setItem(this.tokenKey, JSON.stringify(response.token));
// //             this.userSubject.next(response.token);
// //           }
// //           return response;
// //         }),
// //         catchError((error) => {
// //           console.error('Signup error:', error);
// //           return of(null);
// //         })
// //       );
// //   }
// //   isAuthenticated(): boolean {
// //     if (!isPlatformBrowser(this.platformId)) {
// //     return false; // Early exit if not in browser
// //   }

// //   const storedToken = localStorage.getItem(this.tokenKey);

// //   if (!storedToken) {
// //     return false;
// //   }

// //   try {
// //     const parsedToken = JSON.parse(storedToken);
    
// //     if (this.isValidToken(parsedToken)) {
// //       return true;
// //     }

// //     // Token is present in storage but is invalid. Remove it.
// //     localStorage.removeItem(this.tokenKey);
// //     return false;
// //   } catch (error) {
// //     console.error('Error parsing token:', error);
// //     localStorage.removeItem(this.tokenKey);
// //     return false;
// //   }
// // }


// //  isValidToken=(token: string | null): boolean =>{
// //    if (!token) {
// //     return false; // Token is null or undefined
// //   }
  
// //   try {
// //     const decodedToken: TokenPayload = jwtDecode(token);

// //     if (!decodedToken) {
// //       return false; // Token decoding failed
// //     }

// //     const now = Math.floor(Date.now() / 1000); // Current time in seconds
// //     if (decodedToken.exp && decodedToken.exp < now) {
// //       return false; // Token has expired
// //     }

// //     // Add other validation checks as needed (e.g., check for required claims)
// //     if (!decodedToken.userId) {
// //         return false;
// //     }
// //     return true; // Token is valid
// //   } catch (error) {
// //     console.error('Error decoding token:', error);
// //     return false; // Token is invalid or malformed
// //   }
// // }



// // // Example usage:
  
// //   getToken(): string | null {
// //     // Retrieve token from localStorage, handling potential parsing errors
// //     const storedToken = localStorage.getItem(this.tokenKey);
// //     if (!storedToken) {
// //       return null;
// //     }
  
// //     try {
// //       return JSON.parse(storedToken); // Parse if necessary
// //     } catch (error) {
// //       console.error('Error parsing token:', error);
// //       localStorage.removeItem(this.tokenKey);
// //       return null;
// //     }
// //   }
  
// //   logout(): void {
// //     localStorage.removeItem(this.tokenKey);
// //     this.userSubject.next(null);
// //     this.router.navigate(['/login']);
// //   }
  
// //   getAuthHeaders(): HttpHeaders {
// //     const token = this.getToken();
// //     if (token) {
// //       return new HttpHeaders({
// //         Authorization: `Bearer ${token}`
// //       });
// //     }
// //     return new HttpHeaders(); // Return empty headers if no token
// //   }
// // }

      
// //         // isAuthenticated(): boolean {
// //         //   if (isPlatformBrowser(this.platformId)) {
// //         //     return !!localStorage.getItem(this.tokenKey);
// //         //   }
// //         //   return false; // Return false if not in browser
// //         // }
      
// //         // getToken(): string | null {
// //         //   if (isPlatformBrowser(this.platformId)) {
// //         //     return localStorage.getItem(this.tokenKey);
// //         //   }
// //         //   return null;
// //         // }
      
// //         // logout(): void {
// //         //   if (isPlatformBrowser(this.platformId)) {
// //         //     localStorage.removeItem(this.tokenKey);
// //         //   }
// //         //   this.userSubject.next(null);
// //         //   this.router.navigate(['/login']);
// //         // }
      
// //         // getAuthHeaders(): HttpHeaders {
// //         //   const token = this.getToken();
// //         //   return new HttpHeaders({
// //         //     Authorization: token ? `Bearer ${token}` : '',
// //         //   });
// //         // }*/
// // >>>>>>> main
