import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';

export interface ContactResponse {
  name: number;
  link: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
  id: string;
}

export interface CreateContactRequest {
  name: number;
  link: string;
}

export interface UpdateContactRequest {
  id: string;
  name: number;
  link: string;
}

export interface DeleteContactRequest {
  id: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private baseContactUrl: string;// = 'http://45.130.148.137:8080/api/Contact';

  constructor(private http: HttpClient,
    private config: ConfigService
  ) {
    this.baseContactUrl = this.config.getBaseApiUrl() + '/Contact';
  }

  getContactById(id: string): Observable<ContactResponse> {
    const params = new HttpParams().set('Id', id);
    return this.http.get<ContactResponse>(`${this.baseContactUrl}`, { params });
  }

  createContact(contact: CreateContactRequest): Observable<ContactResponse> {
    return this.http.post<ContactResponse>(`${this.baseContactUrl}`, contact);
  }

  updateContact(contact: UpdateContactRequest): Observable<ContactResponse> {
    return this.http.put<ContactResponse>(`${this.baseContactUrl}`, contact);
  }

  deleteContact(contact: DeleteContactRequest): Observable<boolean> {
    return this.http.delete<boolean>(`${this.baseContactUrl}`, { body: contact });
  }

  getAllContacts(): Observable<ContactResponse[]> {
    return this.http.get<ContactResponse[]>(`${this.baseContactUrl}/all`);
  }
}
