import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TeamApiService } from '../data-access/team-api.service';
import { TeamComponent } from './team.component';
const api = { list: vi.fn(), create: vi.fn(), remove: vi.fn() };
describe('team management UI', () => {
  beforeEach(async () => {
    vi.resetAllMocks();
    api.list.mockResolvedValue([
      { id: 'owner', email: 'owner@example.test', role: 'owner' },
      { id: 'editor', email: 'editor@example.test', role: 'editor' },
    ]);
    await TestBed.configureTestingModule({
      imports: [TeamComponent],
      providers: [{ provide: TeamApiService, useValue: api }],
    }).compileComponents();
  });
  async function setup() {
    const fixture = TestBed.createComponent(TeamComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    return fixture;
  }
  it('protects the owner account and only offers deletion for editors', async () => {
    const fixture = await setup();
    const root: HTMLElement = fixture.nativeElement;
    expect(root.textContent).toContain('Cuenta protegida');
    expect(root.querySelectorAll('[aria-label^="Eliminar usuario"]')).toHaveLength(1);
    expect(root.querySelector('[aria-label="Eliminar usuario owner@example.test"]')).toBeNull();
  });
  it('clears the password and retains email on a rejected creation', async () => {
    const fixture = await setup();
    const root: HTMLElement = fixture.nativeElement;
    Array.from(root.querySelectorAll('button'))
      .find((b) => b.textContent?.includes('+ Nuevo usuario'))!
      .click();
    fixture.detectChanges();
    for (const [id, value] of Object.entries({
      'team-email': 'new@example.test',
      'team-password': 'Testing123!',
    })) {
      const input = root.querySelector<HTMLInputElement>('#' + id)!;
      input.value = value;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
    api.create.mockRejectedValue(new Error('Correo ya registrado'));
    root
      .querySelector('form')!
      .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await fixture.whenStable();
    fixture.detectChanges();
    expect(root.querySelector<HTMLInputElement>('#team-password')?.value).toBe('');
    expect(root.querySelector<HTMLInputElement>('#team-email')?.value).toBe('new@example.test');
    expect(root.textContent).toContain('Correo ya registrado');
  });
});
