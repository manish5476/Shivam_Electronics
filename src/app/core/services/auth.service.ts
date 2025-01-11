import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenKey = 'authToken';
  private userSubject: BehaviorSubject<any | null>; // Explicitly type as nullable
  public user: Observable<any | null>;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object // Inject platform ID
  ) {
    let storedUser = null;

    if (isPlatformBrowser(this.platformId)) {
      // Check if running in browser
      try {
        const storedUserString = localStorage.getItem(this.tokenKey);
        storedUser = storedUserString ? JSON.parse(storedUserString) : null;
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem(this.tokenKey); // Clear potentially corrupted data
      }
    }

    this.userSubject = new BehaviorSubject<any | null>(storedUser);
    this.user = this.userSubject.asObservable();
  }
  // http://localhost:4000/api/v1/users/login
  // https://4000-idx-shivamelectronicsbackend-1736329366153.cluster-e3wv6awer5h7kvayyfoein2u4a.cloudworkstations.dev/api/v1/users/login
  login(data: any): Observable<any> {
    return this.http
      .post<any>('https://4000-idx-shivamelectronicsbackendgit-1736444920605.cluster-a3grjzek65cxex762e4mwrzl46.cloudworkstations.dev/api/v1/users/login', data)
      .pipe(
        map((response) => {
          if (isPlatformBrowser(this.platformId) && response.token) {
            localStorage.setItem(this.tokenKey, JSON.stringify(response.token));
            this.userSubject.next(response.token);
          }
          return response;
        }),
        catchError((error) => {
          console.error('Login error:', error);
          return of(null); // Return null in case of error to avoid breaking the observable chain
        })
      );
  }

  signUp(data: any): Observable<any> {
    return this.http
      .post<any>('https://4000-idx-shivamelectronicsbackendgit-1736444920605.cluster-a3grjzek65cxex762e4mwrzl46.cloudworkstations.dev/api/v1/users/signup', data)
      .pipe(
        map((response) => {
          if (isPlatformBrowser(this.platformId) && response.token) {
            localStorage.setItem(this.tokenKey, JSON.stringify(response.token));
            this.userSubject.next(response.token);
          }
          return response;
        }),
        catchError((error) => {
          console.error('Signup error:', error);
          return of(null);
        })
      );
  }

  isAuthenticated(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem(this.tokenKey);
    }
    return false; // Return false if not in browser
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.tokenKey);
    }
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
    });
  }
}
