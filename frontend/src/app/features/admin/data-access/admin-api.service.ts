import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CATALOG } from '../../tours/data-access/tours.config';
import { Tour } from '../../tours/domain/tour.model';

export type AdminAccess =
  'loading' | 'unconfigured' | 'signed-out' | 'forbidden' | 'allowed' | 'error';
export type AdminTour = Pick<Tour, 'title' | 'slug' | 'code'> & { id: string; active: boolean };
export type NewTour = Tour & { active: false };

@Injectable({ providedIn: 'root' })
export class AdminApiService {
  private readonly config = inject(SUPABASE_CATALOG);
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  private client: SupabaseClient | null = null;
  readonly access = signal<AdminAccess>('loading');
  readonly userId = signal('');

  private getClient(): SupabaseClient {
    if (!this.browser || !this.config) throw new Error('Panel no configurado.');
    if (!this.client) {
      this.client = createClient(this.config.url, this.config.publishableKey, {
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
    const membership = await client
      .from('TourAdministrator')
      .select('user_id')
      .eq('user_id', data.user.id)
      .maybeSingle();
    if (membership.error) {
      this.access.set('error');
      throw new Error('No se pudieron verificar tus permisos. Inténtalo de nuevo.');
    }
    this.access.set(membership.data ? 'allowed' : 'forbidden');
  }

  async signOut(): Promise<void> {
    const { error } = await this.getClient().auth.signOut({ scope: 'local' });
    if (error) throw new Error('No se pudo cerrar la sesión. Inténtalo de nuevo.');
    this.access.set('signed-out');
    this.userId.set('');
  }

  async list(): Promise<AdminTour[]> {
    await this.authorize();
    if (this.access() !== 'allowed')
      throw new Error('Tu usuario no tiene permiso de administrador.');
    const { data, error } = await this.getClient()
      .from('Tour')
      .select('id,title,slug,code,active')
      .order('createdAt', { ascending: false });
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

  async setVisibility(id: string, active: boolean): Promise<void> {
    await this.authorize();
    if (this.access() !== 'allowed')
      throw new Error('Tu usuario no tiene permiso de administrador.');
    const { data, error } = await this.getClient()
      .from('Tour')
      .update({ active, updatedAt: new Date().toISOString() })
      .eq('id', id)
      .select('id')
      .single();
    if (error || !data)
      throw new Error('No se cambió la visibilidad. Revisa tus permisos y vuelve a intentarlo.');
  }
}
