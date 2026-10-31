import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AdminApiService } from '../../features/admin/data-access/admin-api.service';
import { AdminComponent } from './admin.component';

const api = {
  access: signal('allowed'),
  userId: signal(''),
  initialize: vi.fn(),
  list: vi.fn(),
  create: vi.fn(),
};
describe('admin tour form', () => {
  beforeEach(async () => {
    api.access.set('allowed');
    vi.clearAllMocks();
    api.list.mockResolvedValue([]);
    api.create.mockResolvedValue(undefined);
    await TestBed.configureTestingModule({
      imports: [AdminComponent],
      providers: [provideRouter([]), { provide: AdminApiService, useValue: api }],
    }).compileComponents();
  });
  it('opens a usable creation form and does not submit an invalid tour', async () => {
    const fixture = TestBed.createComponent(AdminComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    const create = Array.from(root.querySelectorAll('button')).find((button) =>
      button.textContent?.includes('+ Nuevo tour'),
    );
    create?.click();
    fixture.detectChanges();
    expect(root.querySelector('input#title')).not.toBeNull();
    const form = root.querySelector('form');
    form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();
    expect(api.create).not.toHaveBeenCalled();
    expect(root.querySelector('#title-error')?.textContent).toContain('nombre');
  });
  it('keeps the form populated after a recoverable save error', async () => {
    const fixture = TestBed.createComponent(AdminComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    Array.from(root.querySelectorAll('button'))
      .find((button) => button.textContent?.includes('+ Nuevo tour'))
      ?.click();
    fixture.detectChanges();
    const fields: Record<string, string> = {
      title: 'Tour nuevo',
      code: 'KQ-011',
      summary: 'Resumen',
      description: 'Descripción',
      adult: '100',
      image: '/assets/images/cusco.webp',
      alt: 'Cusco',
      'day-0': 'Visita a Cusco',
    };
    for (const [id, value] of Object.entries(fields)) {
      const input = root.querySelector<HTMLInputElement | HTMLTextAreaElement>('#' + id);
      if (input) {
        input.value = value;
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }
    api.create.mockRejectedValue(new Error('No se guardó el tour.'));
    root
      .querySelector('form')
      ?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await fixture.whenStable();
    fixture.detectChanges();
    expect(api.create).toHaveBeenCalled();
    expect(root.querySelector<HTMLInputElement>('#title')?.value).toBe('Tour nuevo');
    expect(root.textContent).toContain('No se guardó el tour.');
  });
});
