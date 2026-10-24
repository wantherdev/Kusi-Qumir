import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

import { STATIC_CATALOG_URL, TOURS_API_URL } from './tours.config';
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
