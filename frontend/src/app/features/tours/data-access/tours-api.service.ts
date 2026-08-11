import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';

import { Tour, TourSummary } from '../domain/tour.model';
import { TOURS_API_URL } from './tours.config';

@Injectable({ providedIn: 'root' })
export class ToursApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(TOURS_API_URL);
  private readonly tours = this.http
    .get<TourSummary[]>(this.apiUrl)
    .pipe(shareReplay({ bufferSize: 1, refCount: false }));

  findAll(): Observable<TourSummary[]> {
    return this.tours;
  }

  findOne(slug: string): Observable<Tour> {
    return this.http.get<Tour>(`${this.apiUrl}/${encodeURIComponent(slug)}`);
  }
}
