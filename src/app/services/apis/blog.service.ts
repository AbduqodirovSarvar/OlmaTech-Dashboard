import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';

export interface BlogPostResponse {
  id: string;
  titleUz: string;
  titleEn: string;
  titleRu: string;
  titleUzRu: string;
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

export interface CreateBlogPostRequest {
  TitleUz: string;
  TitleEn: string;
  TitleRu: string;
  TitleUzRu: string;
  DescriptionUz: string;
  DescriptionEn: string;
  DescriptionRu: string;
  DescriptionUzRu: string;
  Link: string;
  Photo: File;
}

export interface UpdateBlogPostRequest {
  Id: string;
  TitleUz?: string;
  TitleEn?: string;
  TitleRu?: string;
  TitleUzRu?: string;
  DescriptionUz?: string;
  DescriptionEn?: string;
  DescriptionRu?: string;
  DescriptionUzRu?: string;
  Link?: string;
  Photo?: File; // For the "binary" format
}

export interface DeleteBlogPostCommand {
  Id: string;
}

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private baseBlogPostUrl: string;

  constructor(private http: HttpClient,
    private config: ConfigService
  ) {
    this.baseBlogPostUrl = this.config.getBaseApiUrl() + '/BlogPost';
  }

   // Create Blog Post
   createBlogPost(data: CreateBlogPostRequest): Observable<BlogPostResponse> {
    const formData = new FormData();
    formData.append('TitleUz', data.TitleUz);
    formData.append('TitleEn', data.TitleEn);
    formData.append('TitleRu', data.TitleRu);
    formData.append('TitleUzRu', data.TitleUzRu);
    formData.append('DescriptionUz', data.DescriptionUz);
    formData.append('DescriptionEn', data.DescriptionEn);
    formData.append('DescriptionRu', data.DescriptionRu);
    formData.append('DescriptionUzRu', data.DescriptionUzRu);
    formData.append('Link', data.Link);
    formData.append('Photo', data.Photo);

    return this.http.post<BlogPostResponse>(`${this.baseBlogPostUrl}`, formData);
  }

  // Update Blog Post
  updateBlogPost(data: UpdateBlogPostRequest): Observable<BlogPostResponse> {
    const formData = new FormData();
    formData.append('Id', data.Id);
    formData.append('TitleUz', data.TitleUz || '');
    formData.append('TitleEn', data.TitleEn || '');
    formData.append('TitleRu', data.TitleRu || '');
    formData.append('TitleUzRu', data.TitleUzRu || '');
    formData.append('DescriptionUz', data.DescriptionUz || '');
    formData.append('DescriptionEn', data.DescriptionEn || '');
    formData.append('DescriptionRu', data.DescriptionRu || '');
    formData.append('DescriptionUzRu', data.DescriptionUzRu || '');
    formData.append('Link', data.Link || '');
    if (data.Photo) {
      formData.append('Photo', data.Photo);
    }

    return this.http.put<BlogPostResponse>(`${this.baseBlogPostUrl}`, formData);
  }

  // Delete Blog Post
  deleteBlogPost(command: DeleteBlogPostCommand): Observable<boolean> {
    return this.http.delete<boolean>(`${this.baseBlogPostUrl}`, { body: command });
  }

  // Get Blog Post by Id
  getBlogPostById(id: string): Observable<BlogPostResponse> {
    const params = new HttpParams().set('Id', id);
    return this.http.get<BlogPostResponse>(`${this.baseBlogPostUrl}`, { params });
  }

  // Get all Blog Posts with query parameters
  getAllBlogPosts(): Observable<BlogPostResponse[]> {
    return this.http.get<BlogPostResponse[]>(`${this.baseBlogPostUrl}/all`);
  }
}
