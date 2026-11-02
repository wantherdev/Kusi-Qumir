import { describe, expect, it } from 'vitest';
import { normalizeReservation, ReservationInput, travelDateLabel } from './reservation.model';
export const reservationInput: ReservationInput = {
  tourId: 'tour-id',
  customerName: ' Cliente prueba ',
  customerPhone: ' 000000000 ',
  customerEmail: '',
  travelDate: '2026-12-01',
  passengers: 2,
  totalAmount: 200,
  paidAmount: 50,
  status: 'PENDING',
  notes: ' Nota ',
};
describe('reservation input', () => {
  it('normalizes contact fields and keeps dates without timezone conversion', () => {
    expect(normalizeReservation(reservationInput)).toMatchObject({
      customerName: 'Cliente prueba',
      customerPhone: '000000000',
      customerEmail: null,
      travelDate: '2026-12-01',
      notes: 'Nota',
    });
    expect(travelDateLabel('2026-12-01')).toBe('01/12/2026');
  });
  it('rejects overpayments, invalid calendar dates, fractional passengers and excessive precision', () => {
    for (const patch of [
      { paidAmount: 201 },
      { travelDate: '2026-02-30' },
      { passengers: 1.5 },
      { totalAmount: 100.001 },
      { paidAmount: -1 },
    ])
      expect(() => normalizeReservation({ ...reservationInput, ...patch })).toThrow();
  });
  it('accepts unpaid and cancelled reservations without assuming a payment was processed', () => {
    expect(
      normalizeReservation({
        ...reservationInput,
        totalAmount: 0,
        paidAmount: 0,
        status: 'CANCELLED',
      }),
    ).toMatchObject({ totalAmount: 0, paidAmount: 0, status: 'CANCELLED' });
  });
});
