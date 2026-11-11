import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, map } from 'rxjs';
import { environment } from '@env/environment';
import { Picture } from '../models';

@Injectable({ providedIn: 'root' })
export class PicturesService {
  private readonly baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getAll(category?: string): Observable<Picture[]> {
    const params = category ? `?category=${encodeURIComponent(category)}` : '';
    return this.http.get<Picture[]>(`${this.baseUrl}/Pictures${params}`).pipe(
      catchError(() => of([]))
    );
  }

  create(payload: Picture): Observable<Picture | null> {
    return this.http.post<Picture>(`${this.baseUrl}/Pictures`, payload).pipe(
      catchError(() => of(null))
    );
  }

  update(id: number, payload: Picture): Observable<Picture | null> {
    return this.http.put<Picture>(`${this.baseUrl}/Pictures/${id}`, payload).pipe(
      catchError(() => of(null))
    );
  }

  delete(id: number): Observable<boolean> {
    return this.http.delete<void>(`${this.baseUrl}/Pictures/${id}`).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }
}
