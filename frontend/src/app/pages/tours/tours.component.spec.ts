import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';

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
  featured: true,
  categorySlug: 'cultural',
  prices: [{ name: 'General', currency: 'PEN', adult: 119, child: 85 }],
  images: [],
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
});
