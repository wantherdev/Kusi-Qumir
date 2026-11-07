import { Injectable, inject } from '@angular/core';
import { AdminApiService } from './admin-api.service';
import {
  Reservation,
  ReservationInput,
  ReservationPage,
  ReservationQuery,
  RESERVATION_PAGE_SIZE,
  normalizeReservation,
} from '../domain/reservation.model';

@Injectable({ providedIn: 'root' })
export class ReservationsApiService {
  private readonly admin = inject(AdminApiService);
  async list(filter: ReservationQuery): Promise<ReservationPage> {
    const client = await this.admin.authorizedClient();
    let query = client
      .from('Reservation')
      .select('*', { count: 'exact' })
      .order('createdAt', { ascending: false })
      .order('id');
    query = filter.deleted ? query.not('deletedAt', 'is', null) : query.is('deletedAt', null);
    if (filter.name.trim())
      query = query.ilike('customerName', `%${filter.name.trim().replace(/[%_\\]/g, '\\$&')}%`);
    if (filter.status) query = query.eq('status', filter.status);
    const { data, error, count } = await query
      .range(filter.page * RESERVATION_PAGE_SIZE, (filter.page + 1) * RESERVATION_PAGE_SIZE - 1)
      .returns<Reservation[]>();
    if (error)
      throw new Error('No se cargaron las reservas. Revisa tu conexión y vuelve a intentarlo.');
    return { items: data ?? [], total: count ?? 0 };
  }
  async create(value: ReservationInput): Promise<void> {
    const input = normalizeReservation(value);
    const client = await this.admin.authorizedClient();
    const { error } = await client.from('Reservation').insert(input);
    if (error) this.fail(error.code);
  }
  async update(reservation: Reservation, value: ReservationInput): Promise<void> {
    await this.change(reservation, normalizeReservation(value));
  }
  async archive(reservation: Reservation): Promise<void> {
    await this.change(reservation, { deletedAt: new Date().toISOString() });
  }
  async restore(reservation: Reservation): Promise<void> {
    await this.change(reservation, { deletedAt: null });
  }
  private async change(
    reservation: Reservation,
    patch: Partial<ReservationInput> & { deletedAt?: string | null },
  ): Promise<void> {
    const client = await this.admin.authorizedClient();
    const { data, error } = await client
      .from('Reservation')
      .update(patch)
      .eq('id', reservation.id)
      .eq('updatedAt', reservation.updatedAt)
      .select('id')
      .maybeSingle();
    if (error) this.fail(error.code);
    if (!data)
      throw new Error(
        'La reserva cambió desde que la abriste. Actualiza el listado antes de editarla de nuevo.',
      );
  }
  private fail(code: string): never {
    if (code === '23503')
      throw new Error(
        'El tour ya no está disponible. Actualiza el listado y selecciona otro tour.',
      );
    if (code === '23514' || code === '22007' || code === '22008')
      throw new Error('Revisa la fecha, los pasajeros y los montos de la reserva.');
    throw new Error(
      'No se guardó la reserva. Revisa tu conexión y tus permisos; los datos introducidos se conservan.',
    );
  }
}
