import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private baseApiUrl: string = 'http://192.168.60.45:8080/api';
  constructor() { }

  getBaseApiUrl(): string {
    return this.baseApiUrl;
  }
}
