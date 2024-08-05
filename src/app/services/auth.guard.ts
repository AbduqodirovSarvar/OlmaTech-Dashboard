import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { HelperService } from './helper.service';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {

  constructor(private helperService: HelperService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const accessToken = this.helperService.getAccessToken();
    if (accessToken && !this.isTokenExpired(accessToken)) {
      return true;
    } else {
      this.helperService.redirectToLoginPage();
      return false;
    }
  }

  private isTokenExpired(token: string): boolean {
    if (!token) return true;

    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiry = payload.exp;
    const now = Math.floor((new Date).getTime() / 1000);

    return now >= expiry;
  }
}
