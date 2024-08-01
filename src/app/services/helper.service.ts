import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

function urlValidator(control: AbstractControl): { [key: string]: boolean } | null {
  const urlPattern = /^(https?:\/\/[^\s$.?#].[^\s]*)$/i;
  return urlPattern.test(control.value) ? null : { invalidUrl: true };
}

function phoneValidator(control: AbstractControl): { [key: string]: boolean } | null {
  const phonePattern = /^[+]?[0-9]{10,15}$/;
  return phonePattern.test(control.value) ? null : { invalidPhone: true };
}

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  private languageKey: string = "language_code";
  private accessTokenKey: string = "access_token_olma_tech";
  private jsonUrl : string = `../../assets/i18n`;

  constructor(
    private router: Router,
    private http: HttpClient
  ) { }

  getJsonData(languageCode: string): Observable<any> {
    return this.http.get<any>(`${this.jsonUrl}/${languageCode}.json`);
  }

  setLaguage(language?: string | null): string{
    localStorage.setItem(this.languageKey, language ?? 'Ru');
    window.location.reload();
    return language ?? 'Ru';
  }

  getLanguageCode(): string {
    return localStorage.getItem(this.languageKey) ?? "Ru";
  }

  setAccessToken(accessToken: string): void {
    localStorage.setItem(this.accessTokenKey, accessToken);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.accessTokenKey);
  }

  removeAccessToken(): void {
    localStorage.removeItem(this.accessTokenKey);
  }

  redirectToDashboard(): void {
    this.router.navigate(['/home']);
  }

  redirectToLoginPage(): void{
    this.router.navigate(['/auth/sign-in']);
  }

  redirectToResetPassword(email: string): void{

    this.router.navigate(['/auth/request-reset-password'], { queryParams: { email } });
  }
}
