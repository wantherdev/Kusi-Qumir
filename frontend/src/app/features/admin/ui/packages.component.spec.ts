import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PackagesApiService } from '../data-access/packages-api.service';
import { PackagesComponent } from './packages.component';
const api = { list: vi.fn(), save: vi.fn(), visibility: vi.fn(), archive: vi.fn() };
const row = {
  id: 'p',
  title: 'Cusco clásico',
  description: 'Dos días',
  itinerary: ['city-tour-cusco', null],
  active: true,
  updatedAt: 'v',
  deletedAt: null,
};
describe('package editor UI', () => {
  beforeEach(async () => {
    vi.resetAllMocks();
    api.list.mockResolvedValue([row]);
    await TestBed.configureTestingModule({
      imports: [PackagesComponent],
      providers: [{ provide: PackagesApiService, useValue: api }],
    }).compileComponents();
  });
  async function setup() {
    const fixture = TestBed.createComponent(PackagesComponent);
    fixture.componentRef.setInput('tours', [
      { id: 't', slug: 'city-tour-cusco', title: 'City Tour' },
    ]);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    return fixture;
  }
  it('shows the package module and hides owner actions from editors', async () => {
    const fixture = await setup();
    const root: HTMLElement = fixture.nativeElement;
    expect(root.textContent).toContain('Cusco clásico');
    expect(root.textContent).toContain('Día libre');
    expect(root.textContent).not.toContain('Eliminar');
    expect(root.textContent).not.toContain('Usuarios');
    expect(root.textContent).toContain('Pasar a borrador');
  });
  it('retains free days and form input after a save error', async () => {
    const fixture = await setup();
    const root: HTMLElement = fixture.nativeElement;
    Array.from(root.querySelectorAll('button'))
      .find((b) => b.textContent?.trim() === 'Editar')!
      .click();
    fixture.detectChanges();
    expect(root.querySelector<HTMLSelectElement>('#package-day-1')?.value).toBe('');
    const title = root.querySelector<HTMLInputElement>('#package-title')!;
    title.value = 'Nuevo recorrido';
    title.dispatchEvent(new Event('input', { bubbles: true }));
    api.save.mockRejectedValue(new Error('Sin conexión'));
    root
      .querySelector('form')!
      .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await fixture.whenStable();
    fixture.detectChanges();
    expect(api.save).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Nuevo recorrido', itinerary: ['city-tour-cusco', null] }),
      row,
    );
    expect(root.querySelector<HTMLInputElement>('#package-title')?.value).toBe('Nuevo recorrido');
    expect(root.textContent).toContain('Sin conexión');
  });
});
