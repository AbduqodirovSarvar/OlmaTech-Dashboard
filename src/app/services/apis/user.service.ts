import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ErrorService } from '../error.service';
import { ConfigService } from './config.service';

export interface UserResponse {
  id: string;
  email: string;
  userrole: number;
  gender: number;
  passwordHash: string;
  firstname: string;
  firstnameRu: string;
  lastname: string;
  lastnameRu: string;
  phone: string;
  photo: string | null;
  createdBy: string;
  createdAt: string; // ISO date string
  updatedBy: string;
  updatedAt: string; // ISO date string
}


export interface UpdateUserRequest {
  Id: string;
  Firstname?: string;
  FirstnameRu?: string;
  Lastname?: string;
  LastnameRu?: string;
  Phone?: string;
  Photo?: File;
  Email?: string;
  Userrole?: number;
  Gender?: number;
  Password?: string;
  OldPassword?: string;
}

export interface CreateUserRequest {
  Firstname: string;
  FirstnameRu?: string;
  Lastname: string;
  LastnameRu?: string;
  Phone?: string;
  Photo?: File;
  Email: string;
  Userrole: number;
  Gender: number;
  Password: string;
}

export interface GetUserParams {
  Id: string;
}

export interface GetAllUsersParams {
  Role?: number;
  Gender?: number;
}

export interface DeleteUserRequest {
  Id: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl: string;// = 'http://45.130.148.137:8080/api/User';

  constructor(
    private http: HttpClient,
    private errorService: ErrorService,
    private config: ConfigService
  ) {
    this.apiUrl = this.config.getBaseApiUrl() + '/User';
  }

  getUser(userId: string): Observable<UserResponse> {
    const httpParams = new HttpParams().set('Id', userId);
    return this.http.get<UserResponse>(`${this.apiUrl}`, { params: httpParams })
      .pipe(
        catchError(error => {
          return this.errorService.handleError(error);
        })
      );
  }

  getMe(): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.apiUrl}/me`)
     .pipe(
        catchError(error => {
          return this.errorService.handleError(error);
        })
      );
  }

  createUser(user: CreateUserRequest): Observable<UserResponse> {
    const formData = new FormData();
    formData.append('Firstname', user.Firstname);
    if (user.FirstnameRu) formData.append('FirstnameRu', user.FirstnameRu);
    formData.append('Lastname', user.Lastname);
    if (user.LastnameRu) formData.append('LastnameRu', user.LastnameRu);
    if (user.Phone) formData.append('Phone', user.Phone);
    if (user.Photo) formData.append('Photo', user.Photo, user.Photo.name);
    formData.append('Email', user.Email);
    formData.append('Userrole', user.Userrole.toString());
    formData.append('Gender', user.Gender.toString());
    formData.append('Password', user.Password);

    return this.http.post<UserResponse>(`${this.apiUrl}`, formData)
      .pipe(
        catchError(error => {
          return this.errorService.handleError(error);
        })
      );
  }

  updateUser(user: UpdateUserRequest): Observable<UserResponse> {
    const formData = new FormData();
    formData.append('Id', user.Id);
    if (user.Firstname) formData.append('Firstname', user.Firstname);
    if (user.FirstnameRu) formData.append('FirstnameRu', user.FirstnameRu);
    if (user.Lastname) formData.append('Lastname', user.Lastname);
    if (user.LastnameRu) formData.append('LastnameRu', user.LastnameRu);
    if (user.Phone) formData.append('Phone', user.Phone);
    if (user.Photo) formData.append('Photo', user.Photo, user.Photo.name);
    if (user.Email) formData.append('Email', user.Email);
    if (user.Userrole !== undefined) formData.append('Userrole', user.Userrole.toString());
    if (user.Gender !== undefined) formData.append('Gender', user.Gender.toString());
    if (user.Password) formData.append('Password', user.Password);
    if (user.OldPassword) formData.append('OldPassword', user.OldPassword);

    return this.http.put<any>(`${this.apiUrl}`, formData)
      .pipe(
        catchError(error => {
          return this.errorService.handleError(error);
        })
      );
  }

  deleteUser(command: DeleteUserRequest): Observable<boolean> {
    return this.http.request<boolean>('delete', `${this.apiUrl}`, { body: command })
      .pipe(
        catchError(error => {
          return this.errorService.handleError(error);
        })
      );
  }

  getAllUsers(params?: GetAllUsersParams): Observable<UserResponse[]> {
    let httpParams = new HttpParams();
    if (params?.Role !== undefined) {
      httpParams = httpParams.set('Role', params.Role.toString());
    }
    if (params?.Gender !== undefined) {
      httpParams = httpParams.set('Gender', params.Gender.toString());
    }
    return this.http.get<UserResponse[]>(`${this.apiUrl}/all`, { params: httpParams })
      .pipe(
        catchError(error => {
          return this.errorService.handleError(error);
        })
      );
  }
}
