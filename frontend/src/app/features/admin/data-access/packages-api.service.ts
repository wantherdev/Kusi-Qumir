import { Injectable, inject } from '@angular/core';
import { AdminApiService } from './admin-api.service';

export interface PackageInput {
  title: string;
  description: string;
  itinerary: (string | null)[];
}
export interface AdminPackage extends PackageInput {
  id: string;
  active: boolean;
  updatedAt: string;
  deletedAt: string | null;
}
export function normalizePackage(value: PackageInput): PackageInput {
  const title = value.title.trim();
  const description = value.description.trim();
  if (
    title.length < 2 ||
    title.length > 100 ||
    description.length > 400 ||
    value.itinerary.length < 1 ||
    value.itinerary.length > 30
  ) {
    throw new Error('Revisa el nombre, la descripción y los días del paquete (entre 1 y 30).');
  }
  return { title, description, itinerary: value.itinerary.map((day) => day?.trim() || null) };
}
@Injectable({ providedIn: 'root' })
export class PackagesApiService {
  private readonly admin = inject(AdminApiService);
  async list(deleted = false): Promise<AdminPackage[]> {
    const client = await this.admin.authorizedClient();
    let query = client.from('TourPackage').select('*').order('title');
    query = deleted ? query.not('deletedAt', 'is', null) : query.is('deletedAt', null);
    const { data, error } = await query.returns<AdminPackage[]>();
    if (error)
      throw new Error('No se cargaron los paquetes. Revisa tu conexión y vuelve a intentarlo.');
    return data ?? [];
  }
  async save(value: PackageInput, current: AdminPackage | null): Promise<void> {
    const input = normalizePackage(value);
    const client = await this.admin.authorizedClient();
    if (current)
      await this.change(current, this.admin.isOwner() ? input : { ...input, active: false });
    else {
      const { error } = await client.from('TourPackage').insert({ ...input, active: false });
      if (error)
        throw new Error('No se creó el paquete. Revisa tus permisos y vuelve a intentarlo.');
    }
  }
  async visibility(current: AdminPackage): Promise<void> {
    await this.admin.authorizedClient();
    if (!current.active && !this.admin.isOwner())
      throw new Error('Solo el administrador total puede publicar.');
    await this.change(current, { active: !current.active });
  }
  async archive(current: AdminPackage): Promise<void> {
    await this.admin.requireOwner();
    await this.change(current, { active: false, deletedAt: new Date().toISOString() });
  }
  async restore(current: AdminPackage): Promise<void> {
    await this.admin.requireOwner();
    await this.change(current, { active: false, deletedAt: null });
  }
  private async change(current: AdminPackage, patch: Partial<AdminPackage>): Promise<void> {
    const client = await this.admin.authorizedClient();
    const { data, error } = await client
      .from('TourPackage')
      .update(patch)
      .eq('id', current.id)
      .eq('updatedAt', current.updatedAt)
      .select('id')
      .maybeSingle();
    if (error) throw new Error('No se guardaron los cambios. Revisa la conexión y tus permisos.');
    if (!data)
      throw new Error(
        'El paquete cambió desde que lo abriste. Actualiza el listado antes de continuar.',
      );
  }
}
