import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';

import { Tour, TourSummary } from '../domain/tour.model';
import { STATIC_CATALOG_URL, TOURS_API_URL } from './tours.config';

@Injectable({ providedIn: 'root' })
export class ToursApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(TOURS_API_URL);
  private readonly staticCatalogUrl = inject(STATIC_CATALOG_URL);
  private readonly staticCatalog = this.staticCatalogUrl
    ? this.http
        .get<Tour[]>(this.staticCatalogUrl)
        .pipe(shareReplay({ bufferSize: 1, refCount: false }))
    : null;
  private readonly tours = this.http
    .get<TourSummary[]>(this.apiUrl)
    .pipe(shareReplay({ bufferSize: 1, refCount: false }));

  findAll(): Observable<TourSummary[]> {
    return this.staticCatalog ?? this.tours;
  }

  findOne(slug: string): Observable<Tour> {
    if (this.staticCatalog) {
      return this.staticCatalog.pipe(
        map((tours) => {
          const tour = tours.find((item) => item.slug === slug);
          if (!tour) throw new HttpErrorResponse({ status: 404, statusText: 'Tour not found' });
          return tour;
        }),
      );
    }
    return this.http.get<Tour>(`${this.apiUrl}/${encodeURIComponent(slug)}`);
  }
}
