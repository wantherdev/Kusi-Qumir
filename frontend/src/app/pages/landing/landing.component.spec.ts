import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';

import { ToursApiService } from '../../features/tours/data-access/tours-api.service';
import { TourSummary } from '../../features/tours/domain/tour.model';
import { LandingComponent } from './landing.component';

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

const catalog: TourSummary[] = [
  tour,
  { ...tour, slug: 'valle-sagrado', code: 'VSI-002', title: 'Valle VIP' },
  {
    ...tour,
    slug: 'machu-picchu-full-day',
    code: 'MPF-004',
    title: 'Machu Picchu',
    operationType: 'TERCERO',
  },
  { ...tour, slug: 'montana-colores', code: 'M7C-006', title: 'Montaña de 7 Colores' },
  {
    ...tour,
    slug: 'laguna-humantay',
    code: 'LHU-005',
    title: 'Laguna Humantay',
    featured: false,
  },
  {
    ...tour,
    slug: 'maras-moray',
    code: 'MYM-003',
    title: 'Maras y Moray',
    operationType: 'TERCERO',
    featured: false,
  },
];

describe('LandingComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingComponent],
      providers: [
        provideRouter([]),
        { provide: ToursApiService, useValue: { findAll: () => of(catalog) } },
      ],
    }).compileComponents();
  });

  it('renders the main value proposition', () => {
    const fixture = TestBed.createComponent(LandingComponent);
    fixture.detectChanges();

    const heading = fixture.nativeElement.querySelector('h1') as HTMLHeadingElement;
    expect(heading.textContent).toContain('Cusco auténtico');
    expect(fixture.nativeElement.textContent).toContain('Canal exclusivamente digital');
    expect(fixture.nativeElement.textContent).toContain('Anexo II');
    expect(fixture.nativeElement.textContent).toContain('Experiencias Kusi Q’umir');
    expect(fixture.nativeElement.textContent).toContain('Rutas por coordinar');
    expect(fixture.nativeElement.textContent).toContain('Recorrido por la ciudad de Cusco');
    expect(fixture.nativeElement.textContent).toContain('S/ 119');
  });

  it('shows only four featured tours and links to the complete catalog', () => {
    const fixture = TestBed.createComponent(LandingComponent);
    fixture.detectChanges();

    const content = fixture.nativeElement.textContent as string;
    const cardContent = [...fixture.nativeElement.querySelectorAll('app-tour-card')]
      .map((card) => card.textContent)
      .join(' ');
    expect(fixture.nativeElement.querySelectorAll('app-tour-card')).toHaveLength(4);
    expect(fixture.nativeElement.querySelector('.tour-card__number')?.textContent).toContain('01');
    expect(cardContent).toContain('Valle VIP');
    expect(cardContent).toContain('Laguna Humantay');
    expect(cardContent).not.toContain('Machu Picchu');
    expect(cardContent).not.toContain('Maras y Moray');
    expect(fixture.nativeElement.querySelector('a[href="/tours"]')).toBeTruthy();
  });

  it('offers the confirmed contact channels without collecting data', () => {
    const fixture = TestBed.createComponent(LandingComponent);
    fixture.detectChanges();

    const content = fixture.nativeElement.textContent as string;
    expect(content).toContain('908 990 666');
    expect(content).toContain('kusiqumir@gmail.com');
    expect(fixture.nativeElement.querySelector('form')).toBeNull();
    expect(fixture.nativeElement.querySelector('a[href="https://wa.me/51908990666"]')).toBeTruthy();
  });

  it('closes the mobile menu with Escape', () => {
    const fixture = TestBed.createComponent(LandingComponent);
    fixture.detectChanges();

    const toggle = fixture.nativeElement.querySelector('.menu-toggle') as HTMLButtonElement;
    toggle.click();
    fixture.detectChanges();
    expect(toggle.getAttribute('aria-expanded')).toBe('true');

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    fixture.detectChanges();

    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(document.body.classList.contains('menu-open')).toBe(false);
    expect(document.activeElement).toBe(toggle);
  });

  it('restores body scrolling when the page is destroyed', () => {
    const fixture = TestBed.createComponent(LandingComponent);
    fixture.detectChanges();

    (fixture.nativeElement.querySelector('.menu-toggle') as HTMLButtonElement).click();
    expect(document.body.classList.contains('menu-open')).toBe(true);

    fixture.destroy();

    expect(document.body.classList.contains('menu-open')).toBe(false);
  });
});

describe('LandingComponent catalog recovery', () => {
  it('retries the API without reloading the complete page', async () => {
    const findAll = vi
      .fn()
      .mockReturnValueOnce(throwError(() => new Error('offline')))
      .mockReturnValueOnce(of(catalog));

    await TestBed.configureTestingModule({
      imports: [LandingComponent],
      providers: [provideRouter([]), { provide: ToursApiService, useValue: { findAll } }],
    }).compileComponents();

    const fixture = TestBed.createComponent(LandingComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.catalog-state--error')).toBeTruthy();

    (fixture.nativeElement.querySelector('.catalog-state button') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(findAll).toHaveBeenCalledTimes(2);
    expect(fixture.nativeElement.querySelectorAll('app-tour-card')).toHaveLength(4);
  });

  it('derives catalog counts from the loaded data', async () => {
    await TestBed.configureTestingModule({
      imports: [LandingComponent],
      providers: [provideRouter([]), { provide: ToursApiService, useValue: { findAll: () => of(catalog) } }],
    }).compileComponents();

    const fixture = TestBed.createComponent(LandingComponent);
    fixture.detectChanges();

    const content = fixture.nativeElement.textContent as string;
    expect(content).toContain('Explora 6 tours vigentes');
    expect(content).toContain('6 tours en el catálogo');
    expect(content).toContain('4 rutas');
    expect(content).toContain('2 rutas');
  });

  it('shows a clear empty state when the catalog has no tours', async () => {
    await TestBed.configureTestingModule({
      imports: [LandingComponent],
      providers: [provideRouter([]), { provide: ToursApiService, useValue: { findAll: () => of([]) } }],
    }).compileComponents();

    const fixture = TestBed.createComponent(LandingComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('app-tour-card')).toHaveLength(0);
    expect(fixture.nativeElement.textContent).toContain('No hay tours publicados');
  });
});
