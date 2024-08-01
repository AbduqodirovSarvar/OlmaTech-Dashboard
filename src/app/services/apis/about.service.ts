import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';

export interface CreateAboutRequest {
  AddressUz: string;
  AddressEn: string;
  AddressRu: string;
  AddressUzRu: string;
  TitleUz: string;
  TitleEn: string;
  TitleRu: string;
  TitleUzRu: string;
  DescriptionUz: string;
  DescriptionEn: string;
  DescriptionRu: string;
  DescriptionUzRu: string;
  DescriptionFooterUz: string;
  DescriptionFooterEn: string;
  DescriptionFooterRu: string;
  DescriptionFooterUzRu: string;
  Experience: number;
  Photo: File;
}

export interface UpdateAboutRequest {
  Id: string;
  AddressUz?: string;
  AddressEn?: string;
  AddressRu?: string;
  AddressUzRu?: string;
  TitleUz?: string;
  TitleEn?: string;
  TitleRu?: string;
  TitleUzRu?: string;
  DescriptionUz?: string;
  DescriptionEn?: string;
  DescriptionRu?: string;
  DescriptionUzRu?: string;
  DescriptionFooterUz?: string;
  DescriptionFooterEn?: string;
  DescriptionFooterRu?: string;
  DescriptionFooterUzRu?: string;
  Experience?: number;
  Photo?: File;
}

export interface DeleteAboutRequest {
  Id: string;
}

export interface AboutResponse {
  id: string;
  addressUz: string;
  addressEn: string;
  addressRu: string;
  addressUzRu: string;
  titleUz: string;
  titleEn: string;
  titleRu: string;
  titleUzRu: string;
  descriptionUz: string;
  descriptionEn: string;
  descriptionRu: string;
  descriptionUzRu: string;
  descriptionFooterUz: string;
  descriptionFooterEn: string;
  descriptionFooterRu: string;
  descriptionFooterUzRu: string;
  experience: number;
  photo: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})

export class AboutService {
  private baseAboutUrl: string;// = 'http://45.130.148.137:8080/api/About';

  constructor(private http: HttpClient,
    private config: ConfigService
  ) {
    this.baseAboutUrl = config.getBaseApiUrl() + '/About';
   }

  getAbout(id: string): Observable<AboutResponse> {
    const params = new HttpParams().set('Id', id);
    return this.http.get<AboutResponse>(this.baseAboutUrl, { params });
  }

  createAbout(data: CreateAboutRequest): Observable<AboutResponse> {
    const formData = new FormData();
    formData.append('AddressUz', data.AddressUz);
    formData.append('AddressEn', data.AddressEn);
    formData.append('AddressRu', data.AddressRu);
    formData.append('AddressUzRu', data.AddressUzRu);
    formData.append('TitleUz', data.TitleUz);
    formData.append('TitleEn', data.TitleEn);
    formData.append('TitleRu', data.TitleRu);
    formData.append('TitleUzRu', data.TitleUzRu);
    formData.append('DescriptionUz', data.DescriptionUz);
    formData.append('DescriptionEn', data.DescriptionEn);
    formData.append('DescriptionRu', data.DescriptionRu);
    formData.append('DescriptionUzRu', data.DescriptionUzRu);
    formData.append('DescriptionFooterUz', data.DescriptionFooterUz);
    formData.append('DescriptionFooterEn', data.DescriptionFooterEn);
    formData.append('DescriptionFooterRu', data.DescriptionFooterRu);
    formData.append('DescriptionFooterUzRu', data.DescriptionFooterUzRu);
    formData.append('Experience', data.Experience.toString());
    formData.append('Photo', data.Photo);

    return this.http.post<AboutResponse>(`${this.baseAboutUrl}`, formData);
  }

  updateAbout(data: UpdateAboutRequest): Observable<AboutResponse> {
    const formData = new FormData();
    formData.append('Id', data.Id);
    formData.append('AddressUz', data.AddressUz || '');
    formData.append('AddressEn', data.AddressEn || '');
    formData.append('AddressRu', data.AddressRu || '');
    formData.append('AddressUzRu', data.AddressUzRu || '');
    formData.append('TitleUz', data.TitleUz || '');
    formData.append('TitleEn', data.TitleEn || '');
    formData.append('TitleRu', data.TitleRu || '');
    formData.append('TitleUzRu', data.TitleUzRu || '');
    formData.append('DescriptionUz', data.DescriptionUz || '');
    formData.append('DescriptionEn', data.DescriptionEn || '');
    formData.append('DescriptionRu', data.DescriptionRu || '');
    formData.append('DescriptionUzRu', data.DescriptionUzRu || '');
    formData.append('DescriptionFooterUz', data.DescriptionFooterUz || '');
    formData.append('DescriptionFooterEn', data.DescriptionFooterEn || '');
    formData.append('DescriptionFooterRu', data.DescriptionFooterRu || '');
    formData.append('DescriptionFooterUzRu', data.DescriptionFooterUzRu || '');
    formData.append('Experience', data.Experience?.toString() || '');
    if (data.Photo) {
      formData.append('Photo', data.Photo);
    }

    return this.http.put<AboutResponse>(`${this.baseAboutUrl}`, formData);
  }

  // Delete About
  deleteAbout(command: DeleteAboutRequest): Observable<any> {
    return this.http.delete(`${this.baseAboutUrl}`, { body: command });
  }

  // Get all About
  getAllAbout(): Observable<AboutResponse[]> {
    return this.http.get<AboutResponse[]>(`${this.baseAboutUrl}/all`);
  }
}
