import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AdminTour } from '../data-access/admin-api.service';
import { ReservationsApiService } from '../data-access/reservations-api.service';
import {
  Reservation,
  ReservationStatus,
  RESERVATION_STATUSES,
  RESERVATION_PAGE_SIZE,
  reservationStatusLabel,
  travelDateLabel,
} from '../domain/reservation.model';
import { AdminConfirmComponent } from './admin-confirm.component';

const soles = new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' });
@Component({
  selector: 'app-admin-reservations',
  imports: [ReactiveFormsModule, AdminConfirmComponent],
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReservationsComponent implements OnInit {
  readonly tours = input.required<AdminTour[]>();
  readonly dirtyChanged = output<boolean>();
  private readonly api = inject(ReservationsApiService);
  private readonly fb = inject(FormBuilder);
  protected readonly rows = signal<Reservation[]>([]);
  protected readonly total = signal(0);
  protected readonly page = signal(0);
  protected readonly deleted = signal(false);
  protected readonly loading = signal(false);
  protected readonly busy = signal(false);
  protected readonly error = signal('');
  protected readonly message = signal('');
  protected readonly view = signal<'list' | 'form' | 'detail'>('list');
  protected readonly selected = signal<Reservation | null>(null);
  protected readonly confirmation = signal<
    { kind: 'delete'; reservation: Reservation } | { kind: 'discard' } | null
  >(null);
  protected readonly statuses = RESERVATION_STATUSES;
  protected readonly pageSize = RESERVATION_PAGE_SIZE;
  protected readonly statusLabel = reservationStatusLabel;
  protected readonly dateLabel = travelDateLabel;
  protected readonly money = (amount: number) => soles.format(amount);
  protected readonly search = this.fb.nonNullable.group({ name: [''], status: [''] });
  protected readonly form = this.fb.nonNullable.group(
    {
      tourId: ['', Validators.required],
      customerName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(150),
          Validators.pattern(/\S/),
        ],
      ],
      customerPhone: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(40),
          Validators.pattern(/\S/),
        ],
      ],
      customerEmail: ['', [Validators.email, Validators.maxLength(254)]],
      travelDate: ['', Validators.required],
      passengers: [
        1,
        [Validators.required, Validators.min(1), Validators.max(100), Validators.pattern(/^\d+$/)],
      ],
      totalAmount: [0, [Validators.required, Validators.min(0), Validators.max(99999999.99)]],
      paidAmount: [0, [Validators.required, Validators.min(0), Validators.max(99999999.99)]],
      status: this.fb.nonNullable.control<ReservationStatus>('PENDING'),
      notes: ['', Validators.maxLength(4000)],
    },
    {
      validators: (control: AbstractControl) => {
        const total: unknown = control.get('totalAmount')?.value;
        const paid: unknown = control.get('paidAmount')?.value;
        return typeof total === 'number' && typeof paid === 'number' && paid > total
          ? { overpaid: true }
          : null;
      },
    },
  );
  constructor() {
    this.form.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.dirtyChanged.emit(this.form.dirty));
  }
  async ngOnInit(): Promise<void> {
    await this.load();
  }
  protected async load(): Promise<void> {
    if (this.loading()) return;
    this.loading.set(true);
    this.error.set('');
    try {
      const filter = this.search.getRawValue();
      const result = await this.api.list({ page: this.page(), ...filter, deleted: this.deleted() });
      this.rows.set(result.items);
      this.total.set(result.total);
    } catch (error) {
      this.error.set(this.describe(error));
    } finally {
      this.loading.set(false);
    }
  }
  protected async searchRows(): Promise<void> {
    this.page.set(0);
    await this.load();
  }
  protected async switchDeleted(): Promise<void> {
    this.deleted.update((value) => !value);
    this.page.set(0);
    this.message.set('');
    await this.load();
  }
  protected async navigate(offset: number): Promise<void> {
    this.page.update((value) => Math.max(0, value + offset));
    await this.load();
  }
  protected openNew(): void {
    this.form.reset();
    this.selected.set(null);
    this.view.set('form');
    this.error.set('');
    this.message.set('');
    this.dirtyChanged.emit(false);
  }
  protected show(reservation: Reservation): void {
    this.selected.set(reservation);
    this.view.set('detail');
    this.error.set('');
  }
  protected edit(reservation: Reservation): void {
    this.selected.set(reservation);
    this.form.reset({
      tourId: reservation.tourId,
      customerName: reservation.customerName,
      customerPhone: reservation.customerPhone,
      customerEmail: reservation.customerEmail ?? '',
      travelDate: reservation.travelDate,
      passengers: reservation.passengers,
      totalAmount: reservation.totalAmount,
      paidAmount: reservation.paidAmount,
      status: reservation.status,
      notes: reservation.notes,
    });
    this.view.set('form');
    this.error.set('');
    this.message.set('');
    this.dirtyChanged.emit(false);
  }
  protected unavailableTour(): boolean {
    const selected = this.selected();
    return !!selected && !this.tours().some((tour) => tour.id === selected.tourId);
  }
  protected close(): void {
    if (this.view() === 'form' && this.form.dirty) {
      this.error.set('');
      this.confirmation.set({ kind: 'discard' });
      return;
    }
    this.closeForm();
  }
  private closeForm(): void {
    this.view.set('list');
    this.form.reset();
    this.selected.set(null);
    this.dirtyChanged.emit(false);
    this.error.set('');
  }
  protected invalid(name: string): boolean {
    const field = this.form.get(name);
    return !!field?.touched && !!field.invalid;
  }
  protected async save(): Promise<void> {
    if (this.busy()) return;
    this.form.markAllAsTouched();
    this.error.set('');
    if (this.form.invalid) {
      this.error.set('Revisa los campos señalados. El monto abonado no puede superar el total.');
      return;
    }
    this.busy.set(true);
    try {
      const selected = this.selected();
      const value = this.form.getRawValue();
      if (selected) await this.api.update(selected, value);
      else await this.api.create(value);
      this.closeForm();
      this.message.set(selected ? 'Reserva actualizada.' : 'Reserva registrada.');
      this.page.set(0);
      await this.load();
    } catch (error) {
      this.error.set(this.describe(error));
    } finally {
      this.busy.set(false);
    }
  }
  protected requestDelete(reservation: Reservation): void {
    this.error.set('');
    this.confirmation.set({ kind: 'delete', reservation });
  }
  protected confirmationTitle(): string {
    return this.confirmation()?.kind === 'delete'
      ? '¿Eliminar esta reserva?'
      : '¿Descartar los cambios?';
  }
  protected confirmationMessage(): string {
    const action = this.confirmation();
    return action?.kind === 'delete'
      ? `La reserva ${action.reservation.code} se moverá a eliminadas. Podrás restaurarla después.`
      : 'Los cambios que aún no has guardado se perderán.';
  }
  protected async confirm(): Promise<void> {
    const action = this.confirmation();
    if (!action || this.busy()) return;
    if (action.kind === 'discard') {
      this.confirmation.set(null);
      this.closeForm();
      return;
    }
    this.busy.set(true);
    this.error.set('');
    try {
      await this.api.archive(action.reservation);
      this.confirmation.set(null);
      this.closeForm();
      this.message.set('Reserva movida a eliminadas.');
      this.page.set(0);
      await this.load();
    } catch (error) {
      this.error.set(this.describe(error));
    } finally {
      this.busy.set(false);
    }
  }
  protected async restore(reservation: Reservation): Promise<void> {
    if (this.busy()) return;
    this.busy.set(true);
    this.error.set('');
    try {
      await this.api.restore(reservation);
      this.view.set('list');
      this.message.set('Reserva restaurada.');
      this.page.set(0);
      await this.load();
    } catch (error) {
      this.error.set(this.describe(error));
    } finally {
      this.busy.set(false);
    }
  }
  private describe(error: unknown): string {
    return error instanceof Error
      ? error.message
      : 'No se completó la operación. Inténtalo de nuevo.';
  }
}
