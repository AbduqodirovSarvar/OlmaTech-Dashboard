import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { ErrorService } from '../error.service';

export interface EnumResponse {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class BaseApiService {
  private baseApiUrl: string = 'http://45.130.148.137:8080/api/Common';

  constructor(
    private http: HttpClient,
    private errorService: ErrorService
  ) { }

  getEnums(): Observable<EnumResponse[]> {
    return this.http.get<EnumResponse[]>(`${this.baseApiUrl}/enums`).pipe(
      catchError(error => {
        return this.errorService.handleError(error);
      })
    );
  }

  getGenders(): Observable<EnumResponse[]> {
    return this.http.get<EnumResponse[]>(`${this.baseApiUrl}/genders`).pipe(
      catchError(error => {
        return this.errorService.handleError(error);
      })
    );
  }

  getCommunications(): Observable<EnumResponse[]> {
    return this.http.get<EnumResponse[]>(`${this.baseApiUrl}/communications`).pipe(
      catchError(error => {
        return this.errorService.handleError(error);
      })
    );
  }

  getUserRoles(): Observable<EnumResponse[]> {
    return this.http.get<EnumResponse[]>(`${this.baseApiUrl}/user-roles`).pipe(
      catchError(error => {
        return this.errorService.handleError(error);
      })
    );
  }

  getPhoto(photoName: string | null): string {
    return `http://45.130.148.137:8080/api/File/${photoName}`;
  }
}
