import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AdminApiService } from './admin-api.service';
import { AdminPackage, PackagesApiService, normalizePackage } from './packages-api.service';
const record: AdminPackage = {
  id: 'package-id',
  title: 'Cusco',
  description: '',
  itinerary: ['city-tour-cusco', null],
  active: true,
  deletedAt: null,
  updatedAt: 'version-1',
};
describe('package editing and permissions', () => {
  const insert = vi.fn();
  const update = vi.fn();
  const result = vi.fn();
  const eq = vi.fn();
  const owner = vi.fn();
  const requireOwner = vi.fn();
  const authorize = vi.fn();
  beforeEach(() => {
    vi.resetAllMocks();
    owner.mockReturnValue(false);
    const chain = { eq, select: () => chain, maybeSingle: result };
    eq.mockReturnValue(chain);
    update.mockReturnValue(chain);
    const client = { from: () => ({ insert, update }) };
    authorize.mockResolvedValue(client);
    requireOwner.mockRejectedValue(new Error('Administrador requerido'));
    insert.mockResolvedValue({ error: null });
    result.mockResolvedValue({ data: { id: record.id }, error: null });
    TestBed.configureTestingModule({
      providers: [
        {
          provide: AdminApiService,
          useValue: { authorizedClient: authorize, isOwner: owner, requireOwner },
        },
      ],
    });
  });
  it('preserves free days and validates length before writes', () => {
    expect(
      normalizePackage({
        title: ' Cusco ',
        description: ' Viaje ',
        itinerary: ['city-tour-cusco', null, ''],
      }),
    ).toEqual({ title: 'Cusco', description: 'Viaje', itinerary: ['city-tour-cusco', null, null] });
    expect(() => normalizePackage({ ...record, itinerary: [] })).toThrow('días');
  });
  it('saves editor changes as draft with a concurrency check', async () => {
    await TestBed.inject(PackagesApiService).save(record, record);
    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({ active: false, itinerary: ['city-tour-cusco', null] }),
    );
    expect(eq).toHaveBeenCalledWith('updatedAt', 'version-1');
  });
  it('blocks publication and deletion by editors before writes', async () => {
    const api = TestBed.inject(PackagesApiService);
    await expect(api.visibility({ ...record, active: false })).rejects.toThrow('publicar');
    await expect(api.archive(record)).rejects.toThrow('Administrador');
    expect(update).not.toHaveBeenCalled();
  });
  it('reports concurrent changes without reporting success', async () => {
    result.mockResolvedValue({ data: null, error: null });
    await expect(TestBed.inject(PackagesApiService).save(record, record)).rejects.toThrow('cambió');
  });
});
