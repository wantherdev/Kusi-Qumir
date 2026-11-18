import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';
import { AdminApiService } from './admin-api.service';
import { TeamApiService } from './team-api.service';
describe('team API boundary', () => {
  it('does not invoke user administration when owner authorization fails', async () => {
    const invoke = vi.fn();
    const requireOwner = vi.fn().mockRejectedValue(new Error('Administrador requerido'));
    TestBed.configureTestingModule({
      providers: [{ provide: AdminApiService, useValue: { requireOwner, userId: () => '' } }],
    });
    const api = TestBed.inject(TeamApiService);
    await expect(api.list()).rejects.toThrow('Administrador');
    expect(invoke).not.toHaveBeenCalled();
    expect(requireOwner).toHaveBeenCalledOnce();
  });
  it('refuses malformed responses and protects the owner from deletion', async () => {
    const invoke = vi
      .fn()
      .mockResolvedValue({ data: { users: [{ id: 'x', role: 'invalid' }] }, error: null });
    TestBed.configureTestingModule({
      providers: [
        {
          provide: AdminApiService,
          useValue: {
            requireOwner: async () => ({ functions: { invoke } }),
            userId: () => 'owner',
          },
        },
      ],
    });
    const api = TestBed.inject(TeamApiService);
    await expect(api.list()).rejects.toThrow('interpretar');
    await expect(api.remove({ id: 'owner', role: 'owner' })).rejects.toThrow('protegida');
    expect(invoke).toHaveBeenCalledOnce();
  });
});
