import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AdminApiService } from '../../features/admin/data-access/admin-api.service';
import { TourImagesService } from '../../features/admin/data-access/tour-images.service';
import { AdminComponent } from './admin.component';
import { buildTourDraft } from '../../features/admin/domain/tour-draft';

const images = { upload: vi.fn() };
const api = {
  access: signal('allowed'),
  userId: signal(''),
  initialize: vi.fn(),
  list: vi.fn(),
  create: vi.fn(),
  getTour: vi.fn(),
  updateTour: vi.fn(),
  archiveTour: vi.fn(),
};
describe('admin tour form', () => {
  beforeEach(async () => {
    api.access.set('allowed');
    Object.defineProperty(URL, 'createObjectURL', {
      configurable: true,
      writable: true,
      value: vi.fn(() => 'blob:tour-preview'),
    });
    Object.defineProperty(URL, 'revokeObjectURL', {
      configurable: true,
      writable: true,
      value: vi.fn(),
    });
    images.upload.mockResolvedValue('https://example.test/uploaded.webp');
    vi.clearAllMocks();
    Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
      configurable: true,
      writable: true,
      value: vi.fn(),
    });
    Object.defineProperty(HTMLDialogElement.prototype, 'close', {
      configurable: true,
      writable: true,
      value: vi.fn(),
    });
    api.list.mockResolvedValue([]);
    api.create.mockResolvedValue(undefined);
    await TestBed.configureTestingModule({
      imports: [AdminComponent],
      providers: [
        provideRouter([]),
        { provide: AdminApiService, useValue: api },
        { provide: TourImagesService, useValue: images },
      ],
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
    expect(root.querySelector('label.image-picker-button[for="image"]')?.textContent).toContain('Seleccionar imagen');
    expect(root.querySelector<HTMLInputElement>('#image')?.type).toBe('file');
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
      alt: 'Cusco',
      'day-0': 'Cusco',
      'activity-0-0': 'Visita a Cusco',
    };
    for (const [id, value] of Object.entries(fields)) {
      const input = root.querySelector<HTMLInputElement | HTMLTextAreaElement>('#' + id);
      if (input) {
        input.value = value;
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }
    const fileInput = root.querySelector<HTMLInputElement>('#image')!;
    const image = new File(['image'], 'cusco.webp', { type: 'image/webp' });
    Object.defineProperty(fileInput, 'files', { value: [image], configurable: true });
    fileInput.dispatchEvent(new Event('change', { bubbles: true }));
    fixture.detectChanges();
    expect(root.querySelector('.image-preview img')?.getAttribute('src')).toBe('blob:tour-preview');
    expect(images.upload).not.toHaveBeenCalled();
    api.create.mockRejectedValue(new Error('No se guardó el tour.'));
    root
      .querySelector('form')
      ?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await fixture.whenStable();
    fixture.detectChanges();
    await vi.waitFor(() => expect(api.create).toHaveBeenCalled());
    expect(images.upload).toHaveBeenCalledTimes(1);
    expect(api.create.mock.calls[0][0].images[0].url).toBe('https://example.test/uploaded.webp');
    expect(root.querySelector<HTMLInputElement>('#title')?.value).toBe('Tour nuevo');
    expect(root.textContent).toContain('No se guardó el tour.');
    root
      .querySelector('form')
      ?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await fixture.whenStable();
    expect(images.upload).toHaveBeenCalledTimes(1);
  });

  it('loads an existing tour for editing and patches only the changed title', async () => {
    const original = {
      ...buildTourDraft({
        title: 'Tour existente',
        slug: 'tour-existente',
        code: 'KQ-001',
        subtitle: '',
        shortDescription: 'Resumen',
        description: 'Descripción',
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
        includes: 'Guía',
        excludes: '',
        requirements: '',
        recommendations: '',
        itinerary: [{ title: 'Visita', activities: [{ title: 'Visita', time: '', description: '', duration: 0 }] }],
      }),
      id: 'tour-id',
      updatedAt: '2026-11-01T00:00:00',
      deletedAt: null,
    };
    api.list.mockResolvedValue([
      {
        id: original.id,
        title: original.title,
        slug: original.slug,
        code: original.code,
        active: true,
        updatedAt: original.updatedAt,
        deletedAt: null,
      },
    ]);
    api.getTour.mockResolvedValue(original);
    api.updateTour.mockResolvedValue(undefined);
    const fixture = TestBed.createComponent(AdminComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    await vi.waitFor(() => {
      fixture.detectChanges();
      expect(root.querySelector('.tour-list li h3')).not.toBeNull();
    });
    Array.from(root.querySelectorAll('button'))
      .find((button) => button.textContent?.trim() === 'Editar')
      ?.click();
    await fixture.whenStable();
    fixture.detectChanges();
    await vi.waitFor(() => {
      fixture.detectChanges();
      expect(root.querySelector('#title')).not.toBeNull();
    });
    const title = root.querySelector<HTMLInputElement>('#title');
    expect(title?.value).toBe('Tour existente');
    if (title) {
      title.value = 'Tour actualizado';
      title.dispatchEvent(new Event('input', { bubbles: true }));
    }
    root
      .querySelector('form')
      ?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await fixture.whenStable();
    fixture.detectChanges();
    expect(api.updateTour).toHaveBeenCalledWith('tour-id', original.updatedAt, {
      title: 'Tour actualizado',
    });
    expect(api.create).not.toHaveBeenCalled();
    expect(images.upload).not.toHaveBeenCalled();
  });
  it('edits structured activities and keeps their details when removing the preceding activity', async () => {
    const fixture = TestBed.createComponent(AdminComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    Array.from(root.querySelectorAll('button')).find((button) => button.textContent?.includes('+ Nuevo tour'))?.click();
    fixture.detectChanges();
    const click = (text: string) => {
      Array.from(root.querySelectorAll('button')).find((button) => button.textContent?.trim() === text)?.click();
      fixture.detectChanges();
    };
    click('+ Agregar actividad al día 1');
    for (const [id, value] of Object.entries({ 'activity-0-1': 'Caminata', 'time-0-1': '08:30', 'activity-description-0-1': 'Detalle de la caminata' })) {
      const input = root.querySelector<HTMLInputElement | HTMLTextAreaElement>('#' + id)!;
      input.value = value;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
    root.querySelector<HTMLButtonElement>('[aria-label="Quitar actividad 1 del día 1"]')!.click();
    fixture.detectChanges();
    expect(root.querySelector<HTMLInputElement>('#activity-0-0')?.value).toBe('Caminata');
    expect(root.querySelector<HTMLInputElement>('#time-0-0')?.value).toBe('08:30');
    expect(root.querySelector<HTMLTextAreaElement>('#activity-description-0-0')?.value).toBe('Detalle de la caminata');
    click('+ Agregar día');
    expect(root.querySelector('#day-1')).not.toBeNull();
    click('Quitar día 2');
    expect(root.querySelector('#day-1')).toBeNull();
    expect(api.create).not.toHaveBeenCalled();
  });
  it('asks for confirmation before moving a tour to eliminated records', async () => {
    api.list.mockResolvedValue([
      {
        id: 'tour-id',
        title: 'Tour prueba',
        slug: 'tour',
        code: 'KQ-001',
        active: true,
        updatedAt: 'now',
        deletedAt: null,
      },
    ]);
    const fixture = TestBed.createComponent(AdminComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    await vi.waitFor(() => {
      fixture.detectChanges();
      expect(root.querySelector('.tour-list li h3')).not.toBeNull();
    });
    Array.from(root.querySelectorAll('button'))
      .find((button) => button.textContent?.trim() === 'Eliminar')
      ?.click();
    fixture.detectChanges();
    expect(root.querySelector('dialog')).not.toBeNull();
    expect(api.archiveTour).not.toHaveBeenCalled();
    Array.from(root.querySelectorAll('dialog button'))
      .find((button) => button.textContent?.trim() === 'Cancelar')
      ?.dispatchEvent(new Event('click', { bubbles: true }));
    fixture.detectChanges();
    expect(api.archiveTour).not.toHaveBeenCalled();
    expect(root.querySelector('dialog')).toBeNull();
  });
});
