import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';

export interface ServiceResponse {
  id: string; // UUID of the service
  nameUz: string;
  nameEn: string;
  nameRu: string;
  nameUzRu: string;
  descriptionUz: string;
  descriptionEn: string;
  descriptionRu: string;
  descriptionUzRu: string;
  createdBy: string; // UUID of the user who created the service
  createdAt: string; // ISO 8601 format date string
  updatedBy: string; // UUID of the user who last updated the service
  updatedAt: string; // ISO 8601 format date string
}

export interface CreateServiceRequest{
  nameUz: string;
  nameEn: string;
  nameRu: string;
  nameUzRu: string;
  descriptionUz: string;
  descriptionEn: string;
  descriptionRu: string;
  descriptionUzRu: string;
}

export interface UpdateServiceRequest {
  id: string; // UUID of the service to be updated
  nameUz?: string;
  nameEn?: string;
  nameRu?: string;
  nameUzRu?: string;
  descriptionUz?: string;
  descriptionEn?: string;
  descriptionRu?: string;
  descriptionUzRu?: string;
}

export interface DeleteServiceRequest {
  id: string; // UUID of the service to be deleted
}

export interface GetServiceRequest {
  Id: string; // UUID of the service
}


@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  private baseServiceUrl: string;// = 'http://45.130.148.137:8080/api/Service';

  constructor(private http: HttpClient,
    private config: ConfigService
  ) {
    this.baseServiceUrl = config.getBaseApiUrl() + '/Service';
  }

  getService(id: string): Observable<ServiceResponse> {
    const params = new HttpParams().set('Id', id);

    return this.http.get<ServiceResponse>(this.baseServiceUrl, { params });
  }

  createService(service: CreateServiceRequest): Observable<ServiceResponse> {
    return this.http.post<ServiceResponse>(this.baseServiceUrl, service);
  }

  updateService(service: UpdateServiceRequest): Observable<ServiceResponse> {
    return this.http.put<ServiceResponse>(this.baseServiceUrl, service);
  }

  deleteService(deleteCommand: DeleteServiceRequest): Observable<boolean> {
    return this.http.request<boolean>('DELETE', this.baseServiceUrl, {
      body: deleteCommand
    });
  }

  getAllServices(): Observable<ServiceResponse[]> {
    return this.http.get<ServiceResponse[]>(`${this.baseServiceUrl}/all`);
  }


}
