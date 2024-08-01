import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';

export interface HomePostResponse {
  id: string;
  titleUz: string;
  titleEn: string;
  titleRu: string;
  titleUzRu: string;
  subtitleUz: string;
  subtitleEn: string;
  subtitleRu: string;
  subtitleUzRu: string;
  descriptionUz: string;
  descriptionEn: string;
  descriptionRu: string;
  descriptionUzRu: string;
  photo: string;
  createdBy: string;
  createdAt: string; // Consider using Date type if you plan to handle dates
  updatedBy: string;
  updatedAt: string; // Consider using Date type if you plan to handle dates
}

export interface CreateHomePostRequest {
  TitleUz: string;
  TitleEn: string;
  TitleRu: string;
  TitleUzRu: string;
  SubtitleUz: string;
  SubtitleEn: string;
  SubtitleRu: string;
  SubtitleUzRu: string;
  DescriptionUz: string;
  DescriptionEn: string;
  DescriptionRu: string;
  DescriptionUzRu: string;
  Photo: File; // Use File type for binary data
}

export interface UpdateHomePostRequest {
  Id: string;
  TitleUz: string;
  TitleEn: string;
  TitleRu: string;
  TitleUzRu: string;
  SubtitleUz: string;
  SubtitleEn: string;
  SubtitleRu: string;
  SubtitleUzRu: string;
  DescriptionUz: string;
  DescriptionEn: string;
  DescriptionRu: string;
  DescriptionUzRu: string;
  Photo: File; // Use File type for binary data
}

export interface DeleteHomePostRequest {
  Id: string;
}



@Injectable({
  providedIn: 'root'
})
export class HomepostService {

  private baseHomePostUrl: string;// = 'http://45.130.148.137:8080/api/HomePost';

  constructor(private http: HttpClient,
    private config: ConfigService
  ) {
    this.baseHomePostUrl = config.getBaseApiUrl() + '/HomePost';
  }

  getHomePost(id: string): Observable<HomePostResponse> {
    const params = new HttpParams().set('Id', id);
    return this.http.get<HomePostResponse>(`${this.baseHomePostUrl}`, { params });
  }

  createHomePost(data: CreateHomePostRequest): Observable<any> {
    const formData = new FormData();
    formData.append('TitleUz', data.TitleUz);
    formData.append('TitleEn', data.TitleEn);
    formData.append('TitleRu', data.TitleRu);
    formData.append('TitleUzRu', data.TitleUzRu);
    formData.append('SubtitleUz', data.SubtitleUz);
    formData.append('SubitleEn', data.SubtitleEn);
    formData.append('SubtitleRu', data.SubtitleRu);
    formData.append('SubtitleUzRu', data.SubtitleUzRu);
    formData.append('DescriptionUz', data.DescriptionUz);
    formData.append('DescriptionEn', data.DescriptionEn);
    formData.append('DescriptionRu', data.DescriptionRu);
    formData.append('DescriptionUzRu', data.DescriptionUzRu);
    formData.append('Photo', data.Photo);

    return this.http.post(`${this.baseHomePostUrl}`, formData);
  }

  updateHomePost(data: UpdateHomePostRequest): Observable<HomePostResponse> {
    console.log("DATAAAA", data);

    const updateFormData = new FormData();
    updateFormData.append('Id', data.Id);
    updateFormData.append('TitleUz', data.TitleUz);
    updateFormData.append('TitleEn', data.TitleEn);
    updateFormData.append('TitleRu', data.TitleRu);
    updateFormData.append('TitleUzRu', data.TitleUzRu);
    updateFormData.append('SubtitleUz', data.SubtitleUz);
    updateFormData.append('SubitleEn', data.SubtitleEn);
    updateFormData.append('SubtitleRu', data.SubtitleRu);
    updateFormData.append('SubtitleUzRu', data.SubtitleUzRu);
    updateFormData.append('DescriptionUz', data.DescriptionUz);
    updateFormData.append('DescriptionEn', data.DescriptionEn);
    updateFormData.append('DescriptionRu', data.DescriptionRu);
    updateFormData.append('DescriptionUzRu', data.DescriptionUzRu);

    if (data.Photo) {
        updateFormData.append('Photo', data.Photo);
    } else {
        console.warn('No photo provided');
    }
    updateFormData.forEach((x) => {
      console.log(x.toString());
    })

    // Log FormData content
    // for (let [key, value] of updateFormData) {
    //     console.log(key, value);
    // }

    return this.http.put<HomePostResponse>(`${this.baseHomePostUrl}`, updateFormData);
}


  deleteHomePost(command: DeleteHomePostRequest): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.delete(`${this.baseHomePostUrl}`, { headers, body: command });
  }

  getAllHomePosts(): Observable<any> {
    return this.http.get(`${this.baseHomePostUrl}/all`);
  }
}
