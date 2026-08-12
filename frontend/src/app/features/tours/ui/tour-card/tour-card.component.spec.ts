import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { TourSummary } from '../../domain/tour.model';
import { TourCardComponent } from './tour-card.component';

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
  images: [{ url: '/assets/images/tours/city-tour-cusco.webp', alt: 'Cusco ilustrado', featured: true, sortOrder: 0 }],
};

describe('TourCardComponent', () => {
  it('renders the tour content with contextual details and price', async () => {
    await TestBed.configureTestingModule({
      imports: [TourCardComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(TourCardComponent);
    fixture.componentRef.setInput('tour', tour);
    fixture.componentRef.setInput('sequence', 1);
    fixture.detectChanges();

    const content = fixture.nativeElement.textContent as string;
    expect(content).toContain('Recorrido por la ciudad de Cusco');
    expect(content).toContain('Tour propio');
    expect(content).toContain('Fácil');
    expect(content).toContain('Desde');
    expect(content).toContain('S/ 119');
    expect(content).toContain('Destacado');

    const link = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(link.getAttribute('href')).toBe('/tours/city-tour-cusco');
    expect(link.getAttribute('aria-label')).toBe('Ver detalles de Recorrido por la ciudad de Cusco');

    const image = fixture.nativeElement.querySelector('img') as HTMLImageElement;
    expect(image.getAttribute('alt')).toBe('Cusco ilustrado');
  });

  it('pads the sequence number for display', async () => {
    await TestBed.configureTestingModule({
      imports: [TourCardComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(TourCardComponent);
    fixture.componentRef.setInput('tour', tour);
    fixture.componentRef.setInput('sequence', 9);
    fixture.detectChanges();

    const number = fixture.nativeElement.querySelector('.tour-card__number') as HTMLElement;
    expect(number.textContent).toBe('09');
    expect(number.getAttribute('aria-hidden')).toBe('true');
  });

  it('omits the sequence number and badge when not provided', async () => {
    await TestBed.configureTestingModule({
      imports: [TourCardComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(TourCardComponent);
    fixture.componentRef.setInput('tour', { ...tour, featured: false });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.tour-card__number')).toBeNull();
    expect(fixture.nativeElement.textContent).not.toContain('Destacado');
  });
});
