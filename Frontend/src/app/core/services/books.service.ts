import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, map } from 'rxjs';
import { environment } from '@env/environment';
import { Book } from '../models';

@Injectable({ providedIn: 'root' })
export class BooksService {
  private readonly baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.baseUrl}/Books`).pipe(
      catchError(() => of([]))
    );
  }

  create(payload: Book): Observable<Book | null> {
    return this.http.post<Book>(`${this.baseUrl}/Books`, payload).pipe(
      catchError(() => of(null))
    );
  }

  update(id: number, payload: Book): Observable<Book | null> {
    return this.http.put<Book>(`${this.baseUrl}/Books/${id}`, payload).pipe(
      catchError(() => of(null))
    );
  }

  delete(id: number): Observable<boolean> {
    return this.http.delete<void>(`${this.baseUrl}/Books/${id}`).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }
}
