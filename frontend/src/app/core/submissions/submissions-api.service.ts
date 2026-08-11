import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

import { SUBMISSIONS_API_URL, SUBMISSIONS_ENABLED } from './submissions.config';
import { ClaimRequest, ContactRequest, SubmissionReceipt } from './submissions.models';

export class SubmissionsDisabledError extends Error {
  constructor() {
    super('La recepción de formularios todavía no está habilitada.');
    this.name = 'SubmissionsDisabledError';
  }
}

@Injectable({ providedIn: 'root' })
export class SubmissionsApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(SUBMISSIONS_API_URL);

  readonly enabled = inject(SUBMISSIONS_ENABLED);

  createContactRequest(payload: ContactRequest): Observable<SubmissionReceipt> {
    return this.post('contact-requests', payload);
  }

  createClaim(payload: ClaimRequest): Observable<SubmissionReceipt> {
    return this.post('claims', payload);
  }

  private post(
    resource: 'contact-requests' | 'claims',
    payload: ContactRequest | ClaimRequest,
  ): Observable<SubmissionReceipt> {
    if (!this.enabled) {
      return throwError(() => new SubmissionsDisabledError());
    }

    return this.http.post<SubmissionReceipt>(`${this.apiUrl}/${resource}`, payload);
  }
}
