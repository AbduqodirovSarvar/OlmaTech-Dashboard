import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { UserResponse, UserService } from './user.service';
import { ConfigService } from './config.service';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ResetPasswordRequest {
  email: string;
  password: string;
  confirmPassword: string;
  confirmationCode: string;
}

export interface LoginResponse {
  accessToken: string;
  user: UserResponse;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseAuthUrl: string;// = 'http://45.130.148.137:8080/api/Auth';
  public userBehavior: BehaviorSubject<UserResponse | null> = new BehaviorSubject<UserResponse | null>(null);

  constructor(private http: HttpClient,
    private config: ConfigService
  ) {
    this.baseAuthUrl = this.config.getBaseApiUrl() + '/Auth';
   }

  login(loginRequest: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseAuthUrl}/sign-in`, loginRequest).pipe(
      tap((response: LoginResponse) => {
        this.userBehavior.next(response.user);
      })
    );
  }

  resetPassword(resetPasswordRequest: ResetPasswordRequest): Observable<boolean> {
    return this.http.post<boolean>(`${this.baseAuthUrl}/reset-password`, resetPasswordRequest);
  }

  askConfirmationCode(email: string): Observable<any> {
    let params = new HttpParams().set('Email', email);
    return this.http.get<boolean>(`${this.baseAuthUrl}/ask-confirmation-code-for-reset-password`, { params });
  }
}
