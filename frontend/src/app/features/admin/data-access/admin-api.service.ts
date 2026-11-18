import { isPlatformBrowser } from '@angular/common';
import { Injectable, InjectionToken, PLATFORM_ID, inject, signal, computed } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CATALOG } from '../../tours/data-access/tours.config';
import { Tour } from '../../tours/domain/tour.model';

export type AdminAccess =
  'loading' | 'unconfigured' | 'signed-out' | 'forbidden' | 'allowed' | 'error';
export type AdminTour = Pick<Tour, 'title' | 'slug' | 'code'> & {
  id: string;
  active: boolean;
  updatedAt: string;
  deletedAt: string | null;
};
export type TourRecord = Tour & {
  id: string;
  active: boolean;
  updatedAt: string;
  deletedAt: string | null;
};
export type NewTour = Tour & { active: false };

export const ADMIN_CLIENT_FACTORY = new InjectionToken<typeof createClient>(
  'ADMIN_CLIENT_FACTORY',
  { providedIn: 'root', factory: () => createClient },
);

@Injectable({ providedIn: 'root' })
export class AdminApiService {
  private readonly config = inject(SUPABASE_CATALOG);
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly clientFactory = inject(ADMIN_CLIENT_FACTORY);
  private client: SupabaseClient | null = null;
  readonly access = signal<AdminAccess>('loading');
  readonly userId = signal('');
  readonly userEmail = signal('');
  readonly role = signal<'owner' | 'editor' | null>(null);
  readonly isOwner = computed(() => this.access() === 'allowed' && this.role() === 'owner');

  private getClient(): SupabaseClient {
    if (!this.browser || !this.config) throw new Error('Panel no configurado.');
    if (!this.client) {
      this.client = this.clientFactory(this.config.url, this.config.publishableKey, {
        auth: {
          storage: sessionStorage,
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: false,
        },
      });
      this.client.auth.onAuthStateChange((event) => {
        if (event === 'SIGNED_OUT') {
          this.access.set('signed-out');
          this.userId.set('');
          this.role.set(null);
          this.userEmail.set('');
        }
      });
    }
    return this.client;
  }

  async initialize(): Promise<void> {
    if (!this.browser || !this.config) {
      this.access.set('unconfigured');
      return;
    }
    this.access.set('loading');
    try {
      const client = this.getClient();
      const { data: session } = await client.auth.getSession();
      if (!session.session) {
        this.access.set('signed-out');
        return;
      }
      await this.authorize();
    } catch {
      this.access.set('error');
    }
  }

  async signIn(email: string, password: string): Promise<void> {
    const { error } = await this.getClient().auth.signInWithPassword({ email, password });
    if (error)
      throw new Error(
        'No se pudo iniciar sesión. Revisa tu correo y contraseña, o inténtalo de nuevo.',
      );
    await this.authorize();
  }

  private async authorize(): Promise<void> {
    const client = this.getClient();
    const { data, error } = await client.auth.getUser();
    if (error || !data.user) {
      this.access.set('signed-out');
      throw new Error('No se pudo verificar la sesión. Vuelve a ingresar.');
    }
    this.userId.set(data.user.id);
    this.userEmail.set(data.user.email ?? '');
    const membership = await client
      .from('TourAdministrator')
      .select('user_id,role')
      .eq('user_id', data.user.id)
      .maybeSingle();
    if (membership.error) {
      this.access.set('error');
      throw new Error('No se pudieron verificar tus permisos. Inténtalo de nuevo.');
    }
    const role: unknown = membership.data?.role;
    this.role.set(role === 'owner' || role === 'editor' ? role : null);
    this.access.set(this.role() ? 'allowed' : 'forbidden');
  }

  async signOut(): Promise<void> {
    const { error } = await this.getClient().auth.signOut({ scope: 'local' });
    if (error) throw new Error('No se pudo cerrar la sesión. Inténtalo de nuevo.');
    this.access.set('signed-out');
    this.userId.set('');
    this.role.set(null);
    this.userEmail.set('');
  }

  async list(deleted = false): Promise<AdminTour[]> {
    await this.authorize();
    if (this.access() !== 'allowed')
      throw new Error('Tu usuario no tiene permiso de administrador.');
    let query = this.getClient()
      .from('Tour')
      .select('id,title,slug,code,active,updatedAt,deletedAt')
      .order('createdAt', { ascending: false });
    query = deleted ? query.not('deletedAt', 'is', null) : query.is('deletedAt', null);
    const { data, error } = await query;
    if (error) throw new Error('No se cargaron los tours. Reintenta la consulta.');
    return data ?? [];
  }

  async create(tour: NewTour): Promise<void> {
    await this.authorize();
    if (this.access() !== 'allowed')
      throw new Error('Tu usuario no tiene permiso de administrador.');
    const { error } = await this.getClient()
      .from('Tour')
      .insert({
        ...tour,
        id: crypto.randomUUID(),
        active: false,
        updatedAt: new Date().toISOString(),
      });
    if (error?.code === '23505')
      throw new Error(
        'Ya existe un tour con esa URL o código. Cambia esos campos y vuelve a guardar.',
      );
    if (error)
      throw new Error(
        'No se guardó el tour. Verifica la conexión y tus permisos; tus datos siguen en el formulario.',
      );
  }

  async authorizedClient(): Promise<SupabaseClient> {
    await this.authorize();
    if (this.access() !== 'allowed')
      throw new Error('Tu usuario no tiene permiso de administrador.');
    return this.getClient();
  }

  async getTour(id: string): Promise<TourRecord> {
    const client = await this.authorizedClient();
    const { data, error } = await client
      .from('Tour')
      .select('*')
      .eq('id', id)
      .is('deletedAt', null)
      .single<TourRecord>();
    if (error || !data)
      throw new Error('No se pudo abrir el tour. Actualiza el listado e inténtalo de nuevo.');
    return data;
  }

  async updateTour(id: string, expectedUpdatedAt: string, patch: Partial<Tour>): Promise<void> {
    await this.authorizedClient();
    await this.changeTour(
      id,
      expectedUpdatedAt,
      this.isOwner() ? patch : { ...patch, active: false },
    );
  }

  async setVisibility(id: string, active: boolean, expectedUpdatedAt: string): Promise<void> {
    await this.authorizedClient();
    if (active && !this.isOwner()) throw new Error('Solo el administrador total puede publicar.');
    await this.changeTour(id, expectedUpdatedAt, { active });
  }

  async archiveTour(tour: AdminTour): Promise<void> {
    await this.requireOwner();
    await this.changeTour(tour.id, tour.updatedAt, {
      deletedAt: new Date().toISOString(),
      active: false,
    });
  }

  async restoreTour(tour: AdminTour): Promise<void> {
    await this.requireOwner();
    await this.changeTour(tour.id, tour.updatedAt, { deletedAt: null, active: false });
  }

  async requireOwner(): Promise<SupabaseClient> {
    const client = await this.authorizedClient();
    if (!this.isOwner()) throw new Error('Esta acción requiere un administrador total.');
    return client;
  }

  private async changeTour(
    id: string,
    expectedUpdatedAt: string,
    patch: Partial<Tour> & { active?: boolean; deletedAt?: string | null },
  ): Promise<void> {
    const client = await this.authorizedClient();
    const { data, error } = await client
      .from('Tour')
      .update({ ...patch, updatedAt: new Date().toISOString() })
      .eq('id', id)
      .eq('updatedAt', expectedUpdatedAt)
      .select('id')
      .maybeSingle();
    if (error?.code === '23505')
      throw new Error('Ya existe un tour con esa URL o código. Usa valores únicos.');
    if (error) throw new Error('No se guardaron los cambios. Revisa la conexión y tus permisos.');
    if (!data)
      throw new Error(
        'El tour cambió desde que lo abriste. Vuelve al listado, actualiza y revisa la versión más reciente.',
      );
  }
}
