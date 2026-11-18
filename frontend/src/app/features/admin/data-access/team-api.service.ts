import { Injectable, inject } from '@angular/core';
import { FunctionsHttpError } from '@supabase/supabase-js';
import { AdminApiService } from './admin-api.service';
export interface TeamUser {
  id: string;
  email?: string;
  role: 'owner' | 'editor';
}
function isTeamUser(value: unknown): value is TeamUser {
  if (!value || typeof value !== 'object') return false;
  return (
    'id' in value &&
    typeof value.id === 'string' &&
    'role' in value &&
    (value.role === 'owner' || value.role === 'editor') &&
    (!('email' in value) || value.email === undefined || typeof value.email === 'string')
  );
}
@Injectable({ providedIn: 'root' })
export class TeamApiService {
  private readonly admin = inject(AdminApiService);
  async list(start = 0): Promise<TeamUser[]> {
    const data = await this.invoke({ action: 'list', start });
    if (
      !data ||
      typeof data !== 'object' ||
      !('users' in data) ||
      !Array.isArray(data.users) ||
      !data.users.every(isTeamUser)
    )
      throw new Error('No se pudo interpretar el listado de usuarios.');
    return data.users;
  }
  async create(email: string, password: string): Promise<void> {
    await this.invoke({
      action: 'create',
      email: email.trim().toLowerCase(),
      password,
      role: 'editor',
    });
  }
  async remove(user: TeamUser): Promise<void> {
    if (user.role === 'owner' || user.id === this.admin.userId())
      throw new Error('La cuenta propietaria está protegida.');
    await this.invoke({ action: 'delete', user_id: user.id });
  }
  private async invoke(body: Record<string, unknown>): Promise<unknown> {
    const client = await this.admin.requireOwner();
    const { data, error } = await client.functions.invoke<unknown>('manage-team', { body });
    if (error instanceof FunctionsHttpError) {
      const response: unknown = await error.context.json().catch(() => null);
      if (
        response &&
        typeof response === 'object' &&
        'error' in response &&
        typeof response.error === 'string'
      )
        throw new Error(response.error);
    }
    if (error)
      throw new Error(
        'No se completó la gestión de usuarios. Revisa tu sesión y vuelve a intentarlo.',
      );
    return data;
  }
}
