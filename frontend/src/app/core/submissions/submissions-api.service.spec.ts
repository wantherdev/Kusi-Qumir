import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

import { SUBMISSIONS_API_URL, SUBMISSIONS_ENABLED } from './submissions.config';
import { ContactRequest } from './submissions.models';
import { SubmissionsApiService, SubmissionsDisabledError } from './submissions-api.service';

const contactRequest: ContactRequest = {
  name: 'Persona de prueba',
  email: 'persona@example.com',
  privacyAccepted: true,
};

describe('SubmissionsApiService', () => {
  afterEach(() => TestBed.inject(HttpTestingController).verify());

  it('does not send data while submissions are disabled', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: SUBMISSIONS_API_URL, useValue: '/api/v1/submissions' },
        { provide: SUBMISSIONS_ENABLED, useValue: false },
      ],
    });

    await expect(
      firstValueFrom(TestBed.inject(SubmissionsApiService).createContactRequest(contactRequest)),
    ).rejects.toBeInstanceOf(SubmissionsDisabledError);
  });

  it('posts the exact contact contract when explicitly enabled', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: SUBMISSIONS_API_URL, useValue: '/api/v1/submissions' },
        { provide: SUBMISSIONS_ENABLED, useValue: true },
      ],
    });
    const http = TestBed.inject(HttpTestingController);
    const responsePromise = firstValueFrom(
      TestBed.inject(SubmissionsApiService).createContactRequest(contactRequest),
    );

    const request = http.expectOne('/api/v1/submissions/contact-requests');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(contactRequest);
    request.flush({ trackingCode: 'KQ-CON-2026-ABCDEF123456', receivedAt: '2026-08-10T00:00:00Z' });

    await expect(responsePromise).resolves.toEqual({
      trackingCode: 'KQ-CON-2026-ABCDEF123456',
      receivedAt: '2026-08-10T00:00:00Z',
    });
  });
});
