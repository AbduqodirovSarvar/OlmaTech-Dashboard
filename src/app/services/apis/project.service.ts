import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';

export interface ProjectResponse {
  id: string;
  nameUz: string;
  nameEn: string;
  nameRu: string;
  nameUzRu: string;
  descriptionUz: string;
  descriptionEn: string;
  descriptionRu: string;
  descriptionUzRu: string;
  link: string;
  photo: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

export interface CreateProjectRequest {
  NameUz: string;
  NameEn: string;
  NameRu: string;
  NameUzRu: string;
  DescriptionUz: string;
  DescriptionEn: string;
  DescriptionRu: string;
  DescriptionUzRu: string;
  Link: string;
  Photo: File; // File type for photo
}

export interface UpdateProjectRequest {
  Id: string; // UUID of the project
  NameUz?: string;
  NameEn?: string;
  NameRu?: string;
  NameUzRu?: string;
  DescriptionUz?: string;
  DescriptionEn?: string;
  DescriptionRu?: string;
  DescriptionUzRu?: string;
  Link?: string;
  Photo?: File; // Optional file for photo
}

export interface DeleteProjectRequest{
  id: string;
}


@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private baseProjectUrl: string;
  constructor(private http: HttpClient,
    private config: ConfigService
  ) {
    this.baseProjectUrl = this.config.getBaseApiUrl() + '/Project';
  }

  getProjectById(id: string): Observable<ProjectResponse> {
    const params = new HttpParams().set('Id', id);
    return this.http.get<ProjectResponse>(`${this.baseProjectUrl}`, { params });
  }

  createProject(request: CreateProjectRequest): Observable<any> {
    const formData = new FormData();

    formData.append('NameUz', request.NameUz);
    formData.append('NameEn', request.NameEn);
    formData.append('NameRu', request.NameRu);
    formData.append('NameUzRu', request.NameUzRu);
    formData.append('DescriptionUz', request.DescriptionUz);
    formData.append('DescriptionEn', request.DescriptionEn);
    formData.append('DescriptionRu', request.DescriptionRu);
    formData.append('DescriptionUzRu', request.DescriptionUzRu);
    formData.append('Link', request.Link);

    if (request.Photo) {
      formData.append('Photo', request.Photo, request.Photo.name);
    }

    return this.http.post(this.baseProjectUrl, formData);
  }

  updateProject(request: UpdateProjectRequest): Observable<any> {
    const formData = new FormData();

    formData.append('Id', request.Id);

    if (request.NameUz) formData.append('NameUz', request.NameUz);
    if (request.NameEn) formData.append('NameEn', request.NameEn);
    if (request.NameRu) formData.append('NameRu', request.NameRu);
    if (request.NameUzRu) formData.append('NameUzRu', request.NameUzRu);
    if (request.DescriptionUz) formData.append('DescriptionUz', request.DescriptionUz);
    if (request.DescriptionEn) formData.append('DescriptionEn', request.DescriptionEn);
    if (request.DescriptionRu) formData.append('DescriptionRu', request.DescriptionRu);
    if (request.DescriptionUzRu) formData.append('DescriptionUzRu', request.DescriptionUzRu);
    if (request.Link) formData.append('Link', request.Link);

    if (request.Photo) {
      formData.append('Photo', request.Photo, request.Photo.name);
    }

    return this.http.put(this.baseProjectUrl, formData);
  }

  deleteProject(command: DeleteProjectRequest): Observable<void> {
    return this.http.delete<void>(`${this.baseProjectUrl}`, { body: command });
  }

  getAllProjects(): Observable<ProjectResponse[]> {
    return this.http.get<ProjectResponse[]>(`${this.baseProjectUrl}/all`);
  }
}
