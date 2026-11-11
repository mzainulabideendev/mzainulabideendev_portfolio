import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { GithubRepo } from '@core/models';

@Injectable({ providedIn: 'root' })
export class GithubService {
  private readonly apiBase = 'https://api.github.com';
  private readonly username = 'ZainulabdeenOfficial';

  constructor(private http: HttpClient) {}

  getRepositories(): Observable<GithubRepo[]> {
    const url = `${this.apiBase}/users/${this.username}/repos?per_page=100&type=owner&sort=updated`;
    return this.http.get<GithubRepo[]>(url).pipe(
      map(repos =>
        repos
          .filter(repo => !repo.fork)
          .sort((a, b) => +new Date(b.updated_at) - +new Date(a.updated_at))
      ),
      catchError(() => of([]))
    );
  }

  getRecentPublicCommitTotal(days = 365): Observable<number> {
    const url = `${this.apiBase}/search/commits?q=author:${this.username}&per_page=1`;
    const headers = {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28'
    };

    return this.http.get<{ total_count: number }>(url, { headers }).pipe(
      map(response => response.total_count ?? 0),
      catchError(() => this.getRecentPublicCommitTotalFromEvents(days))
    );
  }

  private getRecentPublicCommitTotalFromEvents(days: number): Observable<number> {
    const url = `${this.apiBase}/users/${this.username}/events/public?per_page=100`;
    const cutoff = new Date();
    cutoff.setHours(0, 0, 0, 0);
    cutoff.setDate(cutoff.getDate() - (days - 1));

    return this.http.get<Array<{ type: string; created_at: string; payload?: { commits?: unknown[] } }>>(url).pipe(
      map(events =>
        events
          .filter(event => event.type === 'PushEvent' && new Date(event.created_at) >= cutoff)
          .reduce((sum, event) => sum + (event.payload?.commits?.length ?? 0), 0)
      ),
      catchError(() => of(0))
    );
  }
}
