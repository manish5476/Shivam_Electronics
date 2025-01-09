import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object // Inject platform ID
  ) {}

  canActivate(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      // Check if running in browser
      const token = localStorage.getItem('authToken'); // Only access localStorage in the browser
      console.log('AuthGuard Check - Token Present:', !!token);
    }

    if (this.authService.isAuthenticated()) {
      console.log('User authenticated, allowing access');
      return true;
    } else {
      console.log('User not authenticated, redirecting to login');
      this.router.navigate(['/login']);
      return false;
    }
  }
}
