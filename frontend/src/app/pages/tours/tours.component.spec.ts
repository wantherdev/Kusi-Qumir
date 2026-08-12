import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NEVER, of, throwError } from 'rxjs';

import { ToursApiService } from '../../features/tours/data-access/tours-api.service';
import { TourSummary } from '../../features/tours/domain/tour.model';
import { ToursComponent } from './tours.component';

const tour: TourSummary = {
  slug: 'city-tour-cusco',
  code: 'CTC-001',
  title: 'Recorrido por la ciudad de Cusco',
  subtitle: 'Descubre Cusco',
  shortDescription: 'Recorre los principales atractivos de Cusco.',
  durationHours: 5,
  durationDays: 1,
  difficulty: 'Facil',
  groupType: 'Compartido',
  serviceType: 'MedioDia',
  operationType: 'PROPIO',
  featured: true,
  categorySlug: 'cultural',
  prices: [{ name: 'General', currency: 'PEN', adult: 119, child: 85 }],
  images: [],
};

const natureTour: TourSummary = {
  ...tour,
  slug: 'laguna-humantay',
  code: 'LHU-005',
  title: 'Laguna Humantay',
  shortDescription: 'Caminata hacia una laguna de alta montaña.',
  difficulty: 'Moderada',
  categorySlug: 'naturaleza',
  featured: false,
};

describe('ToursComponent', () => {
  it('renders tours returned by the own API without enabling sales', async () => {
    await TestBed.configureTestingModule({
      imports: [ToursComponent],
      providers: [
        provideRouter([]),
        { provide: ToursApiService, useValue: { findAll: () => of([tour]) } },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(ToursComponent);
    fixture.detectChanges();
    const content = fixture.nativeElement.textContent as string;

    expect(content).toContain('Recorrido por la ciudad de Cusco');
    expect(content).toContain('Fácil');
    expect(content).toContain('Tour propio');
    expect(content).toContain('S/ 119');
    expect(content).toContain('reservas y pagos desactivados');
    expect(fixture.nativeElement.querySelector('a[href="/tours/city-tour-cusco"]')).toBeTruthy();
  });

  it('lets the user retry after a catalog connection error', async () => {
    const findAll = vi
      .fn()
      .mockReturnValueOnce(throwError(() => new Error('offline')))
      .mockReturnValueOnce(of([tour]));

    await TestBed.configureTestingModule({
      imports: [ToursComponent],
      providers: [provideRouter([]), { provide: ToursApiService, useValue: { findAll } }],
    }).compileComponents();

    const fixture = TestBed.createComponent(ToursComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="alert"]')).toBeTruthy();

    (fixture.nativeElement.querySelector('.state-card button') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(findAll).toHaveBeenCalledTimes(2);
    expect(fixture.nativeElement.textContent).toContain('Recorrido por la ciudad de Cusco');
  });

  it('filters the catalog by search and restores all results', async () => {
    await TestBed.configureTestingModule({
      imports: [ToursComponent],
      providers: [
        provideRouter([]),
        { provide: ToursApiService, useValue: { findAll: () => of([tour, natureTour]) } },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(ToursComponent);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('#tour-search') as HTMLInputElement;
    const categoryButtons = [
      ...(fixture.nativeElement.querySelectorAll(
        '.category-filter button',
      ) as NodeListOf<HTMLElement>),
    ];
    const natureButton = categoryButtons.find((button) =>
      button.textContent?.includes('Naturaleza'),
    );
    const allButton = categoryButtons.find((button) => button.textContent?.includes('Todas'));

    natureButton?.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('app-tour-card')).toHaveLength(1);
    expect(fixture.nativeElement.textContent).toContain('Laguna Humantay');

    allButton?.click();
    fixture.detectChanges();
    input.value = 'facil';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('app-tour-card')).toHaveLength(1);
    expect(fixture.nativeElement.textContent).toContain('Recorrido por la ciudad de Cusco');

    input.value = 'humantay';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('app-tour-card')).toHaveLength(1);
    expect(fixture.nativeElement.textContent).toContain('Mostrando 1 de 2 tours');

    input.value = 'ruta inexistente';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('No encontramos una ruta con esos filtros');

    (fixture.nativeElement.querySelector('.state-card--empty button') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('app-tour-card')).toHaveLength(2);
    expect(input.value).toBe('');
  });

  it('keeps the card layout stable while the catalog is loading', async () => {
    await TestBed.configureTestingModule({
      imports: [ToursComponent],
      providers: [
        provideRouter([]),
        { provide: ToursApiService, useValue: { findAll: () => NEVER } },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(ToursComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('app-tour-card-skeleton')).toHaveLength(6);
    expect(fixture.nativeElement.querySelector('[role="status"]')).toBeTruthy();
  });

  it('shows a clear empty state when the catalog has no tours', async () => {
    await TestBed.configureTestingModule({
      imports: [ToursComponent],
      providers: [
        provideRouter([]),
        { provide: ToursApiService, useValue: { findAll: () => of([]) } },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(ToursComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('app-tour-card')).toHaveLength(0);
    expect(fixture.nativeElement.textContent).toContain('El catálogo está vacío');
  });
});
