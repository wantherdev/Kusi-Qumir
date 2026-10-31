import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SUPABASE_CATALOG } from '../../tours/data-access/tours.config';
import { AdminApiService } from './admin-api.service';
import { buildTourDraft } from '../domain/tour-draft';

const sdk = vi.hoisted(() => {
  const membership = vi.fn();
  const insert = vi.fn();
  const from = vi.fn(() => ({
    select: () => ({ eq: () => ({ maybeSingle: membership }) }),
    insert,
  }));
  return {
    membership,
    insert,
    from,
    getSession: vi.fn(),
    getUser: vi.fn(),
    signInWithPassword: vi.fn(),
    onAuthStateChange: vi.fn(),
    signOut: vi.fn(),
  };
});
vi.mock('@supabase/supabase-js', () => ({ createClient: () => ({ auth: sdk, from: sdk.from }) }));
const draft = buildTourDraft({
  title: 'Tour',
  slug: 'tour',
  code: 'KQ-011',
  subtitle: '',
  shortDescription: 'Resumen',
  description: 'Detalle',
  durationHours: 8,
  difficulty: 'Facil',
  groupType: 'Compartido',
  serviceType: 'DiaCompleto',
  operationType: 'PROPIO',
  categorySlug: 'cultural',
  featured: false,
  adult: 100,
  child: null,
  imageUrl: '/assets/images/cusco.webp',
  imageAlt: 'Cusco',
  includes: '',
  excludes: '',
  requirements: '',
  recommendations: '',
  itinerary: ['Visita'],
});

describe('admin authorization boundary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [
        {
          provide: SUPABASE_CATALOG,
          useValue: { url: 'https://example.supabase.co', publishableKey: 'sb_publishable_test' },
        },
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    });
    sdk.getUser.mockResolvedValue({ data: { user: { id: 'user-id' } }, error: null });
    sdk.membership.mockResolvedValue({ data: null, error: null });
    sdk.insert.mockResolvedValue({ error: null });
  });
  it('does not insert for an authenticated account without administrator membership', async () => {
    const api = TestBed.inject(AdminApiService);
    await expect(api.create(draft)).rejects.toThrow('permiso');
    expect(api.access()).toBe('forbidden');
    expect(sdk.insert).not.toHaveBeenCalled();
  });
  it('fails closed when membership verification is unavailable', async () => {
    sdk.membership.mockResolvedValue({ data: null, error: { message: 'network error' } });
    const api = TestBed.inject(AdminApiService);
    await expect(api.create(draft)).rejects.toThrow('permisos');
    expect(api.access()).toBe('error');
    expect(sdk.insert).not.toHaveBeenCalled();
  });
  it('inserts a draft for an authorized member and explains duplicate slug/code errors', async () => {
    sdk.membership.mockResolvedValue({ data: { user_id: 'user-id' }, error: null });
    const api = TestBed.inject(AdminApiService);
    await api.create(draft);
    expect(sdk.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        active: false,
        slug: 'tour',
        id: expect.any(String),
        updatedAt: expect.any(String),
      }),
    );
    sdk.insert.mockResolvedValue({ error: { code: '23505' } });
    await expect(api.create(draft)).rejects.toThrow('URL o código');
  });
  it('does not create a browser auth client during server rendering', async () => {
    TestBed.overrideProvider(PLATFORM_ID, { useValue: 'server' });
    const api = TestBed.inject(AdminApiService);
    await api.initialize();
    expect(api.access()).toBe('unconfigured');
    expect(sdk.onAuthStateChange).not.toHaveBeenCalled();
  });
});
