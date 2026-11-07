import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AdminApiService } from './admin-api.service';
import { ReservationsApiService } from './reservations-api.service';
import { Reservation } from '../domain/reservation.model';
const input = {
  tourId: 'tour-id',
  customerName: 'Cliente prueba',
  customerPhone: '000000000',
  customerEmail: null,
  travelDate: '2026-12-01',
  passengers: 2,
  totalAmount: 200,
  paidAmount: 50,
  status: 'PENDING' as const,
  notes: '',
};
const record: Reservation = {
  ...input,
  id: 'reservation-id',
  code: 'KQ-R-TEST',
  tourTitle: 'Tour prueba',
  currency: 'PEN',
  createdBy: null,
  createdAt: '2026-11-01T00:00:00Z',
  updatedAt: '2026-11-01T00:00:00Z',
  deletedAt: null,
};
describe('private reservations access', () => {
  const result = vi.fn();
  const insert = vi.fn();
  const update = vi.fn();
  const eq = vi.fn();
  const select = vi.fn();
  const from = vi.fn();
  const authorizedClient = vi.fn();
  beforeEach(() => {
    vi.resetAllMocks();
    const chain = { eq, select, maybeSingle: result };
    eq.mockReturnValue(chain);
    select.mockReturnValue(chain);
    update.mockReturnValue(chain);
    from.mockReturnValue({ insert, update });
    authorizedClient.mockResolvedValue({ from });
    insert.mockResolvedValue({ error: null });
    result.mockResolvedValue({ data: { id: 'reservation-id' }, error: null });
    TestBed.configureTestingModule({
      providers: [{ provide: AdminApiService, useValue: { authorizedClient } }],
    });
  });
  it('does not query reservation data if administrator authorization fails', async () => {
    authorizedClient.mockRejectedValue(new Error('Sin permiso'));
    await expect(TestBed.inject(ReservationsApiService).create(input)).rejects.toThrow('permiso');
    expect(from).not.toHaveBeenCalled();
  });
  it('archives with an optimistic version check instead of issuing DELETE', async () => {
    await TestBed.inject(ReservationsApiService).archive(record);
    expect(update).toHaveBeenCalledWith({ deletedAt: expect.any(String) });
    expect(eq).toHaveBeenCalledWith('updatedAt', record.updatedAt);
    expect(eq).toHaveBeenCalledWith('id', record.id);
  });
  it('reports concurrent edits without silently claiming success', async () => {
    result.mockResolvedValue({ data: null, error: null });
    await expect(TestBed.inject(ReservationsApiService).update(record, input)).rejects.toThrow(
      'cambió',
    );
  });
  it('rejects invalid amounts before calling the database', async () => {
    await expect(
      TestBed.inject(ReservationsApiService).create({ ...input, paidAmount: 500 }),
    ).rejects.toThrow('abono');
    expect(from).not.toHaveBeenCalled();
  });
});
