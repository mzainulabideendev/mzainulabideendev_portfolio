import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { Blog, DevToArticleResponse } from '@core/models';

@Injectable({ providedIn: 'root' })
export class BlogsService {
  private readonly apiUrl = 'https://dev.to/api/articles?username=zainulabdeenofficial';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Blog[]> {
    return this.http.get<DevToArticleResponse[]>(this.apiUrl).pipe(
      map(articles =>
        articles.map(article => ({
          id: article.id,
          title: article.title,
          coverImageUrl: article.cover_image,
          url: article.url,
          tag: article.tag_list[0] ?? 'General'
        }))
      ),
      catchError(() => of([]))
    );
  }
}
