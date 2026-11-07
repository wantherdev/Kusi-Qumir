import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ReservationsApiService } from '../data-access/reservations-api.service';
import { Reservation } from '../domain/reservation.model';
import { ReservationsComponent } from './reservations.component';
const reservation: Reservation = {
  id: 'reservation-id',
  code: 'KQ-R-TEST',
  tourId: 'tour-id',
  tourTitle: 'Tour de prueba',
  customerName: 'Cliente de prueba',
  customerPhone: '000000000',
  customerEmail: null,
  travelDate: '2026-12-01',
  passengers: 2,
  totalAmount: 200,
  paidAmount: 50,
  status: 'PENDING',
  notes: 'Observación',
  currency: 'PEN',
  createdBy: null,
  createdAt: '2026-11-01T00:00:00Z',
  updatedAt: '2026-11-01T00:00:00Z',
  deletedAt: null,
};
const api = { list: vi.fn(), create: vi.fn(), update: vi.fn(), archive: vi.fn(), restore: vi.fn() };
describe('manual reservations UI', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    api.list.mockResolvedValue({ items: [reservation], total: 1 });
    api.create.mockResolvedValue(undefined);
    api.update.mockResolvedValue(undefined);
    Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
      configurable: true,
      writable: true,
      value: vi.fn(),
    });
    Object.defineProperty(HTMLDialogElement.prototype, 'close', {
      configurable: true,
      writable: true,
      value: vi.fn(),
    });
    await TestBed.configureTestingModule({
      imports: [ReservationsComponent],
      providers: [{ provide: ReservationsApiService, useValue: api }],
    }).compileComponents();
  });
  async function setup() {
    const fixture = TestBed.createComponent(ReservationsComponent);
    fixture.componentRef.setInput('tours', [
      {
        id: 'tour-id',
        title: 'Tour de prueba',
        slug: 'tour',
        code: 'KQ-001',
        active: true,
        updatedAt: 'now',
        deletedAt: null,
      },
    ]);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    return fixture;
  }
  function click(root: HTMLElement, label: string) {
    Array.from(root.querySelectorAll('button'))
      .find((button) => button.textContent?.trim() === label)
      ?.click();
  }
  function fill(root: HTMLElement, id: string, value: string) {
    const field = root.querySelector<HTMLInputElement | HTMLSelectElement>('#' + id);
    if (field) {
      field.value = value;
      field.dispatchEvent(
        new Event(field.tagName === 'SELECT' ? 'change' : 'input', { bubbles: true }),
      );
    }
  }
  it('shows reservation details, date and manually recorded balance', async () => {
    const fixture = await setup();
    const root: HTMLElement = fixture.nativeElement;
    click(root, 'Ver');
    fixture.detectChanges();
    expect(root.textContent).toContain('01/12/2026');
    expect(root.textContent).toContain('000000000');
    expect(root.textContent).toContain('Observación');
    expect(root.querySelector('dl')).not.toBeNull();
  });
  it('requires valid form fields and blocks an overpayment', async () => {
    const fixture = await setup();
    const root: HTMLElement = fixture.nativeElement;
    click(root, '+ Nueva reserva');
    fixture.detectChanges();
    const values = {
      'reservation-name': 'Cliente prueba',
      'reservation-phone': '000000000',
      'reservation-tour': 'tour-id',
      'reservation-date': '2026-12-01',
      'reservation-total': '200',
      'reservation-paid': '201',
    };
    for (const [id, value] of Object.entries(values)) fill(root, id, value);
    root
      .querySelector('form')
      ?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();
    await fixture.whenStable();
    expect(api.create).not.toHaveBeenCalled();
    expect(root.textContent).toContain('no puede superar');
  });
  it('saves a valid new reservation and returns to the list', async () => {
    const fixture = await setup();
    const root: HTMLElement = fixture.nativeElement;
    click(root, '+ Nueva reserva');
    fixture.detectChanges();
    for (const [id, value] of Object.entries({
      'reservation-name': 'Cliente prueba',
      'reservation-phone': '000000000',
      'reservation-tour': 'tour-id',
      'reservation-date': '2026-12-01',
      'reservation-total': '200',
      'reservation-paid': '50',
    }))
      fill(root, id, value);
    root
      .querySelector('form')
      ?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await fixture.whenStable();
    fixture.detectChanges();
    expect(api.create).toHaveBeenCalledWith(
      expect.objectContaining({ passengers: 1, totalAmount: 200, paidAmount: 50 }),
    );
    expect(root.textContent).toContain('Reserva registrada.');
  });
  it('retains customer data after a failed edit', async () => {
    const fixture = await setup();
    const root: HTMLElement = fixture.nativeElement;
    click(root, 'Editar');
    fixture.detectChanges();
    fill(root, 'reservation-name', 'Cliente modificado');
    api.update.mockRejectedValue(new Error('La reserva cambió.'));
    root
      .querySelector('form')
      ?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await fixture.whenStable();
    fixture.detectChanges();
    expect(api.update).toHaveBeenCalledWith(
      reservation,
      expect.objectContaining({ customerName: 'Cliente modificado' }),
    );
    expect(root.querySelector<HTMLInputElement>('#reservation-name')?.value).toBe(
      'Cliente modificado',
    );
    expect(root.textContent).toContain('La reserva cambió.');
  });
  it('does not eliminate a reservation before confirmation and allows cancelling', async () => {
    const fixture = await setup();
    const root: HTMLElement = fixture.nativeElement;
    click(root, 'Eliminar');
    fixture.detectChanges();
    expect(root.querySelector('dialog')).not.toBeNull();
    expect(api.archive).not.toHaveBeenCalled();
    click(root, 'Cancelar');
    fixture.detectChanges();
    expect(root.querySelector('dialog')).toBeNull();
    expect(api.archive).not.toHaveBeenCalled();
  });
});
