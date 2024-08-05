import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private baseApiUrl: string = 'https://test.api.olmatech.uz:4443/api';
  constructor() { }

  getBaseApiUrl(): string {
    return this.baseApiUrl;
  }
}
