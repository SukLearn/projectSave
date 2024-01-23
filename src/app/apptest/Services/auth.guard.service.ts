import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { JwtService } from './jwt.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const token = localStorage.getItem('authToken');
    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    try {
      const decodedToken = this.jwtService.decodeToken(token);

      const userId =
        decodedToken[
          'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
        ];
      if (route.url[0].path === 'admin' && userId === '1') {
        console.log('Allowed to access admin');
        return true;
      } else if (userId === '1') {
        this.router.navigate(['/admin']);
        return false;
      } else if (route.url[0].path === 'dashboard' && userId === '2') {
        console.log('Allowed to access dashboard');
        return true;
      } else if (userId === '2') {
        this.router.navigate(['/dashboard']);
        return false;
      } else {
        this.router.navigate(['/home']);
        return false;
      }
    } catch (error) {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
