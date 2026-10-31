import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';

import { Tour, TourSummary } from '../domain/tour.model';
import { STATIC_CATALOG_URL, SUPABASE_CATALOG, TOURS_API_URL } from './tours.config';

const SUMMARY_FIELDS = 'slug,code,title,subtitle,shortDescription,durationHours,durationDays,difficulty,groupType,serviceType,operationType,featured,categorySlug,prices,images';
const DETAIL_FIELDS = SUMMARY_FIELDS + ',description,recommendedFor,itineraryDays,includes,excludes,faqs,recommendations,requirements,seo,destinations';

@Injectable({ providedIn: 'root' })
export class ToursApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(TOURS_API_URL);
  private readonly supabase = inject(SUPABASE_CATALOG);
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
    if (this.supabase) {
      return this.http.get<TourSummary[]>(`${this.supabase.url}/rest/v1/Tour`, {
        headers: { apikey: this.supabase.publishableKey },
        params: new HttpParams()
          .set('select', SUMMARY_FIELDS)
          .set('active', 'eq.true')
          .set('order', 'featured.desc,title.asc'),
      });
    }
    return this.staticCatalog ?? this.tours;
  }

  findOne(slug: string): Observable<Tour> {
    if (this.supabase) {
      return this.http.get<Tour[]>(`${this.supabase.url}/rest/v1/Tour`, {
        headers: { apikey: this.supabase.publishableKey },
        params: new HttpParams()
          .set('select', DETAIL_FIELDS)
          .set('active', 'eq.true')
          .set('slug', `eq.${slug}`)
          .set('limit', '1'),
      }).pipe(map((tours) => {
        const tour = tours[0];
        if (!tour) throw new HttpErrorResponse({ status: 404, statusText: 'Tour not found' });
        return tour;
      }));
    }
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
