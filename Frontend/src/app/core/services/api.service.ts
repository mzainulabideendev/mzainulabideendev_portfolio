import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly baseUrl = environment.apiBaseUrl;

  constructor(protected http: HttpClient) {}

  protected url(endpoint: string): string {
    return `${this.baseUrl}/${endpoint}`;
  }
}
