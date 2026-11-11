import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, map } from 'rxjs';
import { environment } from '@env/environment';
import { ContactMessage } from '../models';

@Injectable({ providedIn: 'root' })
export class ContactService {
  private readonly baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  send(data: ContactMessage): Observable<boolean> {
    return this.http.post(`${this.baseUrl}/Contact`, data).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  getAll(): Observable<ContactMessage[]> {
    return this.http.get<ContactMessage[]>(`${this.baseUrl}/Contact`).pipe(
      catchError(() => of([]))
    );
  }

  getById(id: number): Observable<ContactMessage | null> {
    return this.http.get<ContactMessage>(`${this.baseUrl}/Contact/${id}`).pipe(
      catchError(() => of(null))
    );
  }

  markRead(id: number): Observable<ContactMessage | null> {
    return this.http.put<ContactMessage>(`${this.baseUrl}/Contact/${id}/read`, {}).pipe(
      catchError(() => of(null))
    );
  }

  delete(id: number): Observable<boolean> {
    return this.http.delete<void>(`${this.baseUrl}/Contact/${id}`).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }
}
