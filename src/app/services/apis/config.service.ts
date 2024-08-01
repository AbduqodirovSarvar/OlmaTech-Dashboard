import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private baseApiUrl: string = 'http://45.130.148.137:8080/api';
  constructor() { }

  getBaseApiUrl(): string {
    return this.baseApiUrl;
  }
}
