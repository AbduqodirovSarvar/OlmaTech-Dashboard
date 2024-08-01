import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServiceResponse } from './services.service';
import { ConfigService } from './config.service';

export interface TeamResponse {
  id: string;
  positionUz: string;
  positionEn: string;
  positionRu: string;
  positionUzRu: string;
  telegram?: string;
  instagram?: string | null;
  twitter?: string | null;
  email?: string | null;
  firstname: string;
  firstnameRu: string;
  lastname: string;
  lastnameRu: string;
  phone: string;
  photo: string;
  createdBy: string;
  createdAt: string; // ISO date string
  updatedBy: string;
  updatedAt: string; // ISO date string
}

export interface CreateTeamRequest {
  Firstname: string;
  FirstnameRu?: string;
  Lastname: string;
  LastnameRu?: string;
  Phone?: string;
  Photo?: File;  // Use File type for binary data
  PositionUz?: string;
  PositionEn?: string;
  PositionRu?: string;
  PositionUzRu?: string;
  Telegram?: string;
  Instagram?: string;
  Twitter?: string;
  Email?: string;
}

export interface UpdateTeamRequest {
  Id: string;  // Required field
  Firstname?: string;
  FirstnameRu?: string;
  Lastname?: string;
  LastnameRu?: string;
  Phone?: string;
  Photo?: File;  // Use File type for binary data
  PositionUz?: string;
  PositionEn?: string;
  PositionRu?: string;
  PositionUzRu?: string;
  Telegram?: string;
  Instagram?: string;
  Twitter?: string;
  Email?: string;
}

export interface DeleteTeamRequest {
  Id: string;
}

export interface GetTeamRequest {
  Id: string;
}

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private baseTeamUrl: string;// = 'http://45.130.148.137:8080/api/Team';

  constructor(private http: HttpClient,
    private config: ConfigService
  ) {
    this.baseTeamUrl = this.config.getBaseApiUrl() + '/Team';
  }

  getTeamMember(memberId: string): Observable<TeamResponse> {
    const params = new HttpParams().set('Id', memberId);
    return this.http.get<TeamResponse>(this.baseTeamUrl, { params });
  }

  createTeamMember(data: CreateTeamRequest): Observable<TeamResponse> {
    const formData = new FormData();
    formData.append('Firstname', data.Firstname);
    if (data.FirstnameRu) formData.append('FirstnameRu', data.FirstnameRu);
    formData.append('Lastname', data.Lastname);
    if (data.LastnameRu) formData.append('LastnameRu', data.LastnameRu);
    if (data.Phone) formData.append('Phone', data.Phone);
    if (data.Photo) formData.append('Photo', data.Photo, data.Photo.name); // Ensure file name is included
    if (data.PositionUz) formData.append('PositionUz', data.PositionUz);
    if (data.PositionEn) formData.append('PositionEn', data.PositionEn);
    if (data.PositionRu) formData.append('PositionRu', data.PositionRu);
    if (data.PositionUzRu) formData.append('PositionUzRu', data.PositionUzRu);
    if (data.Telegram) formData.append('Telegram', data.Telegram);
    if (data.Instagram) formData.append('Instagram', data.Instagram);
    if (data.Twitter) formData.append('Twitter', data.Twitter);
    if (data.Email) formData.append('Email', data.Email);

    return this.http.post<TeamResponse>(this.baseTeamUrl, formData);
  }

  updateTeamMember(data: UpdateTeamRequest): Observable<TeamResponse> {
    const formData = new FormData();
    formData.append('Id', data.Id);
    if (data.Firstname) formData.append('Firstname', data.Firstname);
    if (data.FirstnameRu) formData.append('FirstnameRu', data.FirstnameRu);
    if (data.Lastname) formData.append('Lastname', data.Lastname);
    if (data.LastnameRu) formData.append('LastnameRu', data.LastnameRu);
    if (data.Phone) formData.append('Phone', data.Phone);
    if (data.Photo) formData.append('Photo', data.Photo);
    if (data.PositionUz) formData.append('PositionUz', data.PositionUz);
    if (data.PositionEn) formData.append('PositionEn', data.PositionEn);
    if (data.PositionRu) formData.append('PositionRu', data.PositionRu);
    if (data.PositionUzRu) formData.append('PositionUzRu', data.PositionUzRu);
    if (data.Telegram) formData.append('Telegram', data.Telegram);
    if (data.Instagram) formData.append('Instagram', data.Instagram);
    if (data.Twitter) formData.append('Twitter', data.Twitter);
    if (data.Email) formData.append('Email', data.Email);

    return this.http.put<TeamResponse>(this.baseTeamUrl, formData);
  }

  deleteTeamMember(request: DeleteTeamRequest): Observable<boolean> {
    return this.http.request<boolean>('DELETE', this.baseTeamUrl, {
      body: request,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  getAllTeamMembers(): Observable<TeamResponse[]> {
    return this.http.get<TeamResponse[]>(`${this.baseTeamUrl}/all`);
  }
}
