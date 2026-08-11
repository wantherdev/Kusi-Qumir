import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

import { TOURS_API_URL } from './tours.config';
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
    request.flush([{ slug: 'city-tour-cusco', title: 'City Tour Cusco' }]);
    await expect(response).resolves.toEqual([
      expect.objectContaining({ slug: 'city-tour-cusco', title: 'City Tour Cusco' }),
    ]);
  });
});
