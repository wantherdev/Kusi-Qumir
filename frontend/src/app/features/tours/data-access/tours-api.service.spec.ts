import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

import { STATIC_CATALOG_URL, SUPABASE_CATALOG, TOURS_API_URL } from './tours.config';
import { ToursApiService } from './tours-api.service';

describe('ToursApiService', () => {
  afterEach(() => TestBed.inject(HttpTestingController).verify());

  it('loads the public catalog from the own API', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: TOURS_API_URL, useValue: '/api/v1/tours' },
      ],
    });
    const response = firstValueFrom(TestBed.inject(ToursApiService).findAll());
    const request = TestBed.inject(HttpTestingController).expectOne('/api/v1/tours');

    expect(request.request.method).toBe('GET');
    request.flush([{ slug: 'city-tour-cusco', title: 'Recorrido por la ciudad de Cusco' }]);
    await expect(response).resolves.toEqual([
      expect.objectContaining({
        slug: 'city-tour-cusco',
        title: 'Recorrido por la ciudad de Cusco',
      }),
    ]);
  });

  it('uses one static snapshot for the catalog and details without requesting the API', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: TOURS_API_URL, useValue: '/api/v1/tours' },
        { provide: STATIC_CATALOG_URL, useValue: 'assets/catalog/tours.json' },
      ],
    });
    const api = TestBed.inject(ToursApiService);
    const http = TestBed.inject(HttpTestingController);
    const all = firstValueFrom(api.findAll());
    const detail = firstValueFrom(api.findOne('city-tour-cusco'));
    const tour = { slug: 'city-tour-cusco', title: 'Cusco' };
    http.expectOne('assets/catalog/tours.json').flush([tour]);
    await expect(all).resolves.toEqual([tour]);
    await expect(detail).resolves.toEqual(tour);
    http.expectNone('/api/v1/tours');
    const missing = firstValueFrom(api.findOne('missing'));
    await expect(missing).rejects.toMatchObject({ status: 404 });
  });
});

describe('ToursApiService with Supabase', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: TOURS_API_URL, useValue: '/api/v1/tours' },
        { provide: SUPABASE_CATALOG, useValue: {
          url: 'https://catalog.example.test', publishableKey: 'sb_publishable_test',
        } },
      ],
    });
  });

  afterEach(() => TestBed.inject(HttpTestingController).verify());

  it('reads active tours with a publishable key and fetches fresh data on each load', async () => {
    const api = TestBed.inject(ToursApiService);
    const http = TestBed.inject(HttpTestingController);
    for (const title of ['Original', 'Updated']) {
      const response = firstValueFrom(api.findAll());
      const request = http.expectOne((req) => req.url === 'https://catalog.example.test/rest/v1/Tour');
      expect(request.request.method).toBe('GET');
      expect(request.request.headers.get('apikey')).toBe('sb_publishable_test');
      expect(request.request.headers.has('Authorization')).toBe(false);
      expect(request.request.params.get('active')).toBe('eq.true');
      expect(request.request.params.get('order')).toBe('featured.desc,title.asc');
      expect(request.request.params.get('select')).not.toContain('*');
      request.flush([{ slug: 'city-tour-cusco', title }]);
      await expect(response).resolves.toEqual([{ slug: 'city-tour-cusco', title }]);
    }
    http.expectNone('/api/v1/tours');
  });

  it('fetches tour details by slug and maps missing or inactive tours to 404', async () => {
    const api = TestBed.inject(ToursApiService);
    const http = TestBed.inject(HttpTestingController);
    const response = firstValueFrom(api.findOne('city-tour-cusco'));
    const request = http.expectOne((req) => req.params.get('slug') === 'eq.city-tour-cusco');
    expect(request.request.params.get('active')).toBe('eq.true');
    expect(request.request.params.get('select')).toContain('itineraryDays');
    request.flush([{ slug: 'city-tour-cusco', title: 'Cusco' }]);
    await expect(response).resolves.toEqual({ slug: 'city-tour-cusco', title: 'Cusco' });
    const missing = firstValueFrom(api.findOne('inactive-tour'));
    http.expectOne((req) => req.params.get('slug') === 'eq.inactive-tour').flush([]);
    await expect(missing).rejects.toMatchObject({ status: 404 });
  });

  it('propagates an outage and allows a subsequent retry without stale fallback data', async () => {
    const api = TestBed.inject(ToursApiService);
    const http = TestBed.inject(HttpTestingController);
    const failed = firstValueFrom(api.findAll());
    http.expectOne((req) => req.url === 'https://catalog.example.test/rest/v1/Tour')
      .flush('Unavailable', { status: 503, statusText: 'Unavailable' });
    await expect(failed).rejects.toMatchObject({ status: 503 });
    const retry = firstValueFrom(api.findAll());
    http.expectOne((req) => req.url === 'https://catalog.example.test/rest/v1/Tour').flush([]);
    await expect(retry).resolves.toEqual([]);
  });
});
