import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';

export interface ClientResponse {
  id: string;
  positionUz: string;
  positionEn: string;
  positionRu: string;
  positionUzRu: string;
  commentUz: string;
  commentEn: string;
  commentRu: string;
  commentUzRu: string;
  firstname: string;
  firstnameRu: string;
  lastname: string;
  lastnameRu: string;
  phone: string;
  photo: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

export interface CreateClientRequest {
  Firstname: string;
  FirstnameRu: string;
  Lastname: string;
  LastnameRu: string;
  Phone: string;
  Photo?: File; // Optional because it's binary
  PositionUz: string;
  PositionEn: string;
  PositionRu: string;
  PositionUzRu: string;
  CommentUz: string;
  CommentEn: string;
  CommentRu: string;
  CommentUzRu: string;
}

export interface UpdateClientRequest {
  Id: string;
  Firstname?: string;
  FirstnameRu?: string;
  Lastname?: string;
  LastnameRu?: string;
  Phone?: string;
  Photo?: File; // Optional because it's binary
  PositionUz?: string;
  PositionEn?: string;
  PositionRu?: string;
  PositionUzRu?: string;
  CommentUz?: string;
  CommentEn?: string;
  CommentRu?: string;
  CommentUzRu?: string;
}

export interface DeleteClientRequest {
  Id: string; // UUID format
}


@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private baseClientUrl: string;

  constructor(private http: HttpClient,
    private config: ConfigService
  ) {
    this.baseClientUrl = this.config.getBaseApiUrl() + '/Client';
  }

  getClientById(id: string): Observable<ClientResponse> {
    const params = new HttpParams().set('Id', id);

    return this.http.get<ClientResponse>(this.baseClientUrl, { params });
  }

  createClient(request: CreateClientRequest): Observable<ClientResponse> {
    const formData = new FormData();

    formData.append('Firstname', request.Firstname);
    formData.append('FirstnameRu', request.FirstnameRu);
    formData.append('Lastname', request.Lastname);
    formData.append('LastnameRu', request.LastnameRu);
    formData.append('Phone', request.Phone);
    if (request.Photo) {
      formData.append('Photo', request.Photo, request.Photo.name); // Pass the file name
    }
    formData.append('PositionUz', request.PositionUz);
    formData.append('PositionEn', request.PositionEn);
    formData.append('PositionRu', request.PositionRu);
    formData.append('PositionUzRu', request.PositionUzRu);
    formData.append('CommentUz', request.CommentUz);
    formData.append('CommentEn', request.CommentEn);
    formData.append('CommentRu', request.CommentRu);
    formData.append('CommentUzRu', request.CommentUzRu);

    return this.http.post<ClientResponse>(`${this.baseClientUrl}`, formData);
  }

  updateClient(request: UpdateClientRequest): Observable<ClientResponse> {
    const formData = new FormData();

    if (request.Id) {
      formData.append('Id', request.Id);
    }
    if (request.Firstname) {
      formData.append('Firstname', request.Firstname);
    }
    if (request.FirstnameRu) {
      formData.append('FirstnameRu', request.FirstnameRu);
    }
    if (request.Lastname) {
      formData.append('Lastname', request.Lastname);
    }
    if (request.LastnameRu) {
      formData.append('LastnameRu', request.LastnameRu);
    }
    if (request.Phone) {
      formData.append('Phone', request.Phone);
    }
    if (request.Photo) {
      formData.append('Photo', request.Photo, request.Photo.name); // Pass the file name
    }
    if (request.PositionUz) {
      formData.append('PositionUz', request.PositionUz);
    }
    if (request.PositionEn) {
      formData.append('PositionEn', request.PositionEn);
    }
    if (request.PositionRu) {
      formData.append('PositionRu', request.PositionRu);
    }
    if (request.PositionUzRu) {
      formData.append('PositionUzRu', request.PositionUzRu);
    }
    if (request.CommentUz) {
      formData.append('CommentUz', request.CommentUz);
    }
    if (request.CommentEn) {
      formData.append('CommentEn', request.CommentEn);
    }
    if (request.CommentRu) {
      formData.append('CommentRu', request.CommentRu);
    }
    if (request.CommentUzRu) {
      formData.append('CommentUzRu', request.CommentUzRu);
    }

    return this.http.put<ClientResponse>(`${this.baseClientUrl}`, formData);
  }

  deleteClient(request: DeleteClientRequest): Observable<boolean> {
    return this.http.delete<boolean>(`${this.baseClientUrl}/${request.Id}`);
  }

  getAllClients(): Observable<ClientResponse[]> {
    return this.http.get<ClientResponse[]>(`${this.baseClientUrl}/all`);
  }
}
