import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, map } from 'rxjs';
import { environment } from '@env/environment';
import { Project } from '../models';

@Injectable({ providedIn: 'root' })
export class ProjectsService {
  private readonly baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.baseUrl}/Projects`).pipe(
      catchError(() => of([]))
    );
  }

  create(payload: Project): Observable<Project | null> {
    return this.http.post<Project>(`${this.baseUrl}/Projects`, payload).pipe(
      catchError(() => of(null))
    );
  }

  update(id: number, payload: Project): Observable<Project | null> {
    return this.http.put<Project>(`${this.baseUrl}/Projects/${id}`, payload).pipe(
      catchError(() => of(null))
    );
  }

  delete(id: number): Observable<boolean> {
    return this.http.delete<void>(`${this.baseUrl}/Projects/${id}`).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }
}
