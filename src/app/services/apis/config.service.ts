import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private baseApiUrl: string = 'https://api.olmatech.uz:88/api';
  constructor() { }

  getBaseApiUrl(): string {
    return this.baseApiUrl;
  }
}
